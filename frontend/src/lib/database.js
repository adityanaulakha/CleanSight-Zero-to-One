import { supabase, TABLES, BUCKETS, getZoneFromCoordinates } from './supabase.js';

// User Management
export const userService = {
  async signUp(email, password, userData) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.fullName,
          role: userData.role,
          city: userData.city,
          address: userData.address,
          phone: userData.phone,
          organization: userData.organization,
          specialization: userData.specialization,
          experience: userData.experience
        }
      }
    });

    if (error) throw error;
    return data;
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    
    if (user) {
      // Get additional user profile data
      const { data: profile, error: profileError } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      return {
        ...user,
        ...profile
      };
    }
    
    return null;
  },

  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .upsert([
        {
          id: userId,
          ...updates,
          updated_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;
    return data[0];
  }
};

// Report Management
export const reportService = {
  async createReport(reportData, imageFile) {
    const user = await userService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    let imageUrl = null;
    
    // Upload image if provided
    if (imageFile) {
      const fileName = `${Date.now()}-${imageFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKETS.REPORT_IMAGES)
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(BUCKETS.REPORT_IMAGES)
        .getPublicUrl(fileName);
      
      imageUrl = publicUrl;
    }

    // Determine zone based on location
    const zoneId = getZoneFromCoordinates(reportData.latitude, reportData.longitude);

    // Create report
    const { data, error } = await supabase
      .from(TABLES.REPORTS)
      .insert([
        {
          title: reportData.title,
          description: reportData.description,
          category: reportData.category,
          severity: reportData.severity,
          latitude: reportData.latitude,
          longitude: reportData.longitude,
          address: reportData.address,
          image_url: imageUrl,
          reported_by: user.id,
          zone_id: zoneId,
          status: 'pending',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // Create notification for ragpickers in the zone
    await this.notifyRagpickersInZone(zoneId, data.id);

    return data;
  },

  async getReportsByZone(zoneId, status = null) {
    let query = supabase
      .from(TABLES.REPORTS)
      .select(`
        *,
        reporter:reported_by(full_name, email),
        assigned_ragpicker:assigned_to(full_name, email, phone)
      `)
      .eq('zone_id', zoneId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getReportsByUser(userId) {
    const { data, error } = await supabase
      .from(TABLES.REPORTS)
      .select(`
        *,
        assigned_ragpicker:assigned_to(full_name, phone)
      `)
      .eq('reported_by', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async notifyRagpickersInZone(zoneId, reportId) {
    // Get ragpickers in this zone
    const { data: ragpickers, error } = await supabase
      .from(TABLES.USERS)
      .select('id')
      .eq('role', 'ragpicker')
      .eq('zone_id', zoneId);

    if (error) throw error;

    // Create notifications for each ragpicker
    const notifications = ragpickers.map(ragpicker => ({
      user_id: ragpicker.id,
      title: 'New Waste Report Available',
      message: 'A new waste report has been submitted in your area',
      type: 'new_report',
      report_id: reportId,
      read: false,
      created_at: new Date().toISOString()
    }));

    if (notifications.length > 0) {
      const { error: notificationError } = await supabase
        .from(TABLES.NOTIFICATIONS)
        .insert(notifications);

      if (notificationError) throw notificationError;
    }
  }
};

// Task Management (for ragpickers)
export const taskService = {
  async assignTask(reportId, ragpickerId) {
    const { data, error } = await supabase
      .from(TABLES.REPORTS)
      .update({
        assigned_to: ragpickerId,
        status: 'assigned',
        assigned_at: new Date().toISOString()
      })
      .eq('id', reportId)
      .select()
      .single();

    if (error) throw error;

    // Create task entry
    const { data: task, error: taskError } = await supabase
      .from(TABLES.TASKS)
      .insert([
        {
          report_id: reportId,
          assigned_to: ragpickerId,
          status: 'assigned',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (taskError) throw taskError;

    return { report: data, task };
  },

  async startTask(taskId, ragpickerId) {
    const { data, error } = await supabase
      .from(TABLES.TASKS)
      .update({
        status: 'in_progress',
        started_at: new Date().toISOString()
      })
      .eq('id', taskId)
      .eq('assigned_to', ragpickerId)
      .select()
      .single();

    if (error) throw error;

    // Update report status
    await supabase
      .from(TABLES.REPORTS)
      .update({ status: 'in_progress' })
      .eq('id', data.report_id);

    return data;
  },

  async completeTask(taskId, ragpickerId, completionData, cleanupImageFile) {
    let cleanupImageUrl = null;

    // Upload cleanup image
    if (cleanupImageFile) {
      const fileName = `cleanup-${taskId}-${Date.now()}.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKETS.CLEANUP_IMAGES)
        .upload(fileName, cleanupImageFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(BUCKETS.CLEANUP_IMAGES)
        .getPublicUrl(fileName);
      
      cleanupImageUrl = publicUrl;
    }

    // Complete task
    const { data, error } = await supabase
      .from(TABLES.TASKS)
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        cleanup_image_url: cleanupImageUrl,
        weight_collected: completionData.weight,
        notes: completionData.notes
      })
      .eq('id', taskId)
      .eq('assigned_to', ragpickerId)
      .select()
      .single();

    if (error) throw error;

    // Update report status
    await supabase
      .from(TABLES.REPORTS)
      .update({
        status: 'completed',
        cleanup_image_url: cleanupImageUrl,
        completed_at: new Date().toISOString()
      })
      .eq('id', data.report_id);

    // Calculate and award points/rewards
    await this.calculateRewards(data.report_id, ragpickerId, completionData.weight);

    return data;
  },

  async getTasksByRagpicker(ragpickerId, status = null) {
    let query = supabase
      .from(TABLES.TASKS)
      .select(`
        *,
        report:report_id(
          title,
          description,
          category,
          severity,
          latitude,
          longitude,
          address,
          image_url,
          reporter:reported_by(full_name, phone)
        )
      `)
      .eq('assigned_to', ragpickerId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async calculateRewards(reportId, ragpickerId, weight) {
    // Get report details for reward calculation
    const { data: report } = await supabase
      .from(TABLES.REPORTS)
      .select('category, severity')
      .eq('id', reportId)
      .single();

    // Calculate points based on category and weight
    const basePoints = {
      'plastic': 10,
      'organic': 5,
      'metal': 15,
      'glass': 8,
      'e-waste': 25,
      'hazardous': 30,
      'other': 5
    };

    const severityMultiplier = {
      'low': 1,
      'medium': 1.5,
      'high': 2,
      'critical': 3
    };

    const points = Math.floor(
      (basePoints[report.category] || 5) * 
      weight * 
      (severityMultiplier[report.severity] || 1)
    );

    // Calculate earnings (₹2 per kg base rate)
    const baseRate = 2;
    const earnings = Math.floor(weight * baseRate * (severityMultiplier[report.severity] || 1));

    // Award rewards to ragpicker
    const { error: rewardError } = await supabase
      .from(TABLES.REWARDS)
      .insert([
        {
          user_id: ragpickerId,
          report_id: reportId,
          points: points,
          earnings: earnings,
          weight: weight,
          type: 'cleanup_completion',
          created_at: new Date().toISOString()
        }
      ]);

    if (rewardError) throw rewardError;

    // Award points to citizen who reported
    const citizenPoints = Math.floor(points * 0.3); // 30% of ragpicker points
    const { data: citizenReport } = await supabase
      .from(TABLES.REPORTS)
      .select('reported_by')
      .eq('id', reportId)
      .single();

    await supabase
      .from(TABLES.REWARDS)
      .insert([
        {
          user_id: citizenReport.reported_by,
          report_id: reportId,
          points: citizenPoints,
          earnings: 0,
          weight: weight,
          type: 'report_completion',
          created_at: new Date().toISOString()
        }
      ]);

    // Update user totals
    await this.updateUserTotals(ragpickerId, points, earnings);
    await this.updateUserTotals(citizenReport.reported_by, citizenPoints, 0);
  },

  async updateUserTotals(userId, points, earnings) {
    const { data: currentUser } = await supabase
      .from(TABLES.USERS)
      .select('total_points, total_earnings')
      .eq('id', userId)
      .single();

    await supabase
      .from(TABLES.USERS)
      .update({
        total_points: (currentUser?.total_points || 0) + points,
        total_earnings: (currentUser?.total_earnings || 0) + earnings
      })
      .eq('id', userId);
  }
};

// Leaderboard and Stats
export const leaderboardService = {
  async getLeaderboard(type = 'citizens', timeframe = 'month') {
    const startDate = new Date();
    if (timeframe === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (timeframe === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (timeframe === 'year') {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    let query = supabase
      .from(TABLES.REWARDS)
      .select(`
        user_id,
        users!inner(full_name, role),
        points,
        earnings
      `)
      .gte('created_at', startDate.toISOString());

    if (type === 'citizens') {
      query = query.eq('users.role', 'citizen');
    } else if (type === 'ragpickers') {
      query = query.eq('users.role', 'ragpicker');
    }

    const { data, error } = await query;
    if (error) throw error;

    // Aggregate by user
    const userTotals = {};
    data.forEach(reward => {
      if (!userTotals[reward.user_id]) {
        userTotals[reward.user_id] = {
          user_id: reward.user_id,
          full_name: reward.users.full_name,
          role: reward.users.role,
          total_points: 0,
          total_earnings: 0
        };
      }
      userTotals[reward.user_id].total_points += reward.points;
      userTotals[reward.user_id].total_earnings += reward.earnings;
    });

    // Convert to array and sort by points
    return Object.values(userTotals)
      .sort((a, b) => b.total_points - a.total_points)
      .slice(0, 10);
  },

  async getUserStats(userId) {
    const { data: rewards, error } = await supabase
      .from(TABLES.REWARDS)
      .select('points, earnings, weight, created_at')
      .eq('user_id', userId);

    if (error) throw error;

    const total_points = rewards.reduce((sum, r) => sum + r.points, 0);
    const total_earnings = rewards.reduce((sum, r) => sum + r.earnings, 0);
    const total_weight = rewards.reduce((sum, r) => sum + r.weight, 0);

    return {
      total_points,
      total_earnings,
      total_weight,
      total_activities: rewards.length
    };
  }
};
