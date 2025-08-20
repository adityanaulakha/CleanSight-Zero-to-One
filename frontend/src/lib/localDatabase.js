// Local Storage Database Service (replaces Supabase for development)
const LOCAL_STORAGE_KEYS = {
  USERS: 'cleansight_users',
  REPORTS: 'cleansight_reports',
  TASKS: 'cleansight_tasks',
  REWARDS: 'cleansight_rewards',
  REDEMPTIONS: 'cleansight_redemptions',
  COMMUNITY_POSTS: 'cleansight_community_posts',
  POST_REACTIONS: 'cleansight_post_reactions',
  POST_COMMENTS: 'cleansight_post_comments',
  AUTH_USER: 'cleansight_auth_user',
  WORKERS: 'cleansight_workers'
};

// Helper functions
const getFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error reading from localStorage key ${key}:`, error);
    return null;
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage key ${key}:`, error);
  }
};

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// User Management
export const userService = {
  async signUp(email, password, userData) {
    const users = getFromStorage(LOCAL_STORAGE_KEYS.USERS) || [];
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: generateId(),
      email,
      password, // In a real app, this should be hashed
      // Personal information
      firstName: userData.firstName,
      lastName: userData.lastName,
      full_name: `${userData.firstName} ${userData.lastName}`,
      phoneNumber: userData.phoneNumber,
      role: userData.role,
      profileImage: userData.profileImage,
      // Location fields
      state: userData.state,
      city: userData.city,
      zone: userData.zone,
      address: userData.address,
      fullLocation: userData.fullLocation,
      // Role-specific fields
      experienceLevel: userData.experienceLevel,
      specialization: userData.specialization,
      institutionType: userData.institutionType,
      institutionName: userData.institutionName,
      institutionDescription: userData.institutionDescription,
      // Stats
      total_points: 0,
      total_earnings: 0,
      total_weight: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    users.push(newUser);
    saveToStorage(LOCAL_STORAGE_KEYS.USERS, users);
    
    // Set as current user
    saveToStorage(LOCAL_STORAGE_KEYS.AUTH_USER, newUser);
    
    return { user: newUser };
  },

  async signIn(email, password) {
    const users = getFromStorage(LOCAL_STORAGE_KEYS.USERS) || [];
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Check password (for demo accounts, password is 'demo123')
    if (user.password && user.password !== password) {
      throw new Error('Invalid credentials');
    }

    // Set as current user
    saveToStorage(LOCAL_STORAGE_KEYS.AUTH_USER, user);
    
    return { user };
  },

  async signOut() {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_USER);
  },

  async getCurrentUser() {
    return getFromStorage(LOCAL_STORAGE_KEYS.AUTH_USER);
  },

  async updateProfile(userId, updates) {
    const users = getFromStorage(LOCAL_STORAGE_KEYS.USERS) || [];
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };

    saveToStorage(LOCAL_STORAGE_KEYS.USERS, users);
    
    // Update current user if it's the same
    const currentUser = getFromStorage(LOCAL_STORAGE_KEYS.AUTH_USER);
    if (currentUser && currentUser.id === userId) {
      saveToStorage(LOCAL_STORAGE_KEYS.AUTH_USER, users[userIndex]);
    }
    
    return users[userIndex];
  },

  async updateProfilePicture(userId, profileImage) {
    const users = getFromStorage(LOCAL_STORAGE_KEYS.USERS) || [];
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    users[userIndex] = {
      ...users[userIndex],
      profileImage,
      updated_at: new Date().toISOString()
    };

    saveToStorage(LOCAL_STORAGE_KEYS.USERS, users);
    
    // Update current user if it's the same
    const currentUser = getFromStorage(LOCAL_STORAGE_KEYS.AUTH_USER);
    if (currentUser && currentUser.id === userId) {
      const updatedUser = { ...currentUser, profileImage };
      saveToStorage(LOCAL_STORAGE_KEYS.AUTH_USER, updatedUser);
    }
    
    return users[userIndex];
  },

  async getAllUsers() {
    return getFromStorage(LOCAL_STORAGE_KEYS.USERS) || [];
  },

  async getUserById(userId) {
    const users = getFromStorage(LOCAL_STORAGE_KEYS.USERS) || [];
    return users.find(user => user.id === userId) || null;
  },

  async updateUserSettings(userId, settings) {
    const users = getFromStorage(LOCAL_STORAGE_KEYS.USERS) || [];
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Deep merge settings
    const currentSettings = users[userIndex].settings || {};
    const mergedSettings = {
      notifications: { ...currentSettings.notifications, ...settings.notifications },
      privacy: { ...currentSettings.privacy, ...settings.privacy },
      location: { ...currentSettings.location, ...settings.location },
      display: { ...currentSettings.display, ...settings.display }
    };

    users[userIndex] = {
      ...users[userIndex],
      settings: mergedSettings,
      updated_at: new Date().toISOString()
    };

    saveToStorage(LOCAL_STORAGE_KEYS.USERS, users);
    
    // Update current user if it's the same
    const currentUser = getFromStorage(LOCAL_STORAGE_KEYS.AUTH_USER);
    if (currentUser && currentUser.id === userId) {
      const updatedUser = { ...users[userIndex] };
      saveToStorage(LOCAL_STORAGE_KEYS.AUTH_USER, updatedUser);
    }
    
    return users[userIndex];
  },

  async changePassword(userId, currentPassword, newPassword) {
    const users = getFromStorage(LOCAL_STORAGE_KEYS.USERS) || [];
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const user = users[userIndex];
    
    // In a real app, you'd hash and verify passwords properly
    // For demo purposes, we'll just check if current password matches
    if (user.password && user.password !== currentPassword) {
      throw new Error('Current password is incorrect');
    }

    users[userIndex] = {
      ...user,
      password: newPassword,
      password_changed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    saveToStorage(LOCAL_STORAGE_KEYS.USERS, users);
    
    return { success: true, message: 'Password changed successfully' };
  },

  async toggleTwoFactor(userId, enabled) {
    const users = getFromStorage(LOCAL_STORAGE_KEYS.USERS) || [];
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    users[userIndex] = {
      ...users[userIndex],
      two_factor_enabled: enabled,
      two_factor_setup_at: enabled ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    };

    saveToStorage(LOCAL_STORAGE_KEYS.USERS, users);
    
    // Update current user if it's the same
    const currentUser = getFromStorage(LOCAL_STORAGE_KEYS.AUTH_USER);
    if (currentUser && currentUser.id === userId) {
      const updatedUser = { ...users[userIndex] };
      saveToStorage(LOCAL_STORAGE_KEYS.AUTH_USER, updatedUser);
    }
    
    return users[userIndex];
  },

  async getUsersByRole(role) {
    const users = getFromStorage(LOCAL_STORAGE_KEYS.USERS) || [];
    return users.filter(user => user.role === role);
  },

  async getAllUsers() {
    const users = getFromStorage(LOCAL_STORAGE_KEYS.USERS) || [];
    return users;
  }
};

// Report Management
export const reportService = {
  async createReport(reportData, imageFile) {
    const currentUser = getFromStorage(LOCAL_STORAGE_KEYS.AUTH_USER);
    if (!currentUser) throw new Error('User not authenticated');

    const reports = getFromStorage(LOCAL_STORAGE_KEYS.REPORTS) || [];
    const tasks = getFromStorage(LOCAL_STORAGE_KEYS.TASKS) || [];
    
    // Simulate image upload (in real app, you'd upload to cloud storage)
    let imageUrl = null;
    if (imageFile) {
      imageUrl = URL.createObjectURL(imageFile); // Creates a local blob URL
    }

    const newReport = {
      id: generateId(),
      title: reportData.title,
      description: reportData.description,
      severity: reportData.severity,
      latitude: reportData.latitude,
      longitude: reportData.longitude,
      address: reportData.address,
      landmark: reportData.landmark || null,
      image_url: imageUrl,
      reported_by: currentUser.id,
      // Add citizen's zone information for real-time matching
      reporter_zone: currentUser.zone,
      reporter_state: currentUser.state,
      reporter_city: currentUser.city,
      reporter_fullLocation: currentUser.fullLocation,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    reports.push(newReport);
    saveToStorage(LOCAL_STORAGE_KEYS.REPORTS, reports);

    // Automatically create an available task for ragpickers in the area
    await this.createAvailableTask(newReport);

    return newReport;
  },

  // New method to create available tasks for ragpickers with enhanced zone matching
  async createAvailableTask(report) {
    const tasks = getFromStorage(LOCAL_STORAGE_KEYS.TASKS) || [];
    
    // Get the citizen who reported to extract location info
    const currentUser = getFromStorage(LOCAL_STORAGE_KEYS.AUTH_USER);
    const users = getFromStorage(LOCAL_STORAGE_KEYS.USERS) || [];
    
    // Get reporter details for accurate zone information
    const reporter = users.find(u => u.id === report.reported_by) || currentUser;
    
    // Calculate realistic reward based on severity (fixed amounts)
    const rewardAmounts = {
      'low': 25,        // ₹25 for small cleanup tasks
      'medium': 50,     // ₹50 for medium cleanup tasks  
      'high': 100,      // ₹100 for large cleanup tasks
      'critical': 150   // ₹150 for urgent/critical cleanup
    };
    
    const estimatedPayment = rewardAmounts[report.severity] || 50;
    
    // Estimate cleanup time based on severity
    const estimatedTime = report.severity === 'high' ? '45-60 min' : 
                         report.severity === 'medium' ? '30-45 min' : '15-30 min';

    const availableTask = {
      id: generateId(),
      report_id: report.id,
      title: report.title,
      description: report.description || `Garbage cleanup needed at ${report.address}`,
      severity: report.severity,
      priority: report.severity, // Use severity as priority
      latitude: report.latitude,
      longitude: report.longitude,
      address: report.address,
      landmark: report.landmark,
      // Enhanced location zone info for precise zone-based assignment
      state: report.reporter_state || reporter?.state || currentUser?.state,
      city: report.reporter_city || reporter?.city || currentUser?.city,
      zone: report.reporter_zone || reporter?.zone || currentUser?.zone,
      fullLocation: report.reporter_fullLocation || reporter?.fullLocation || currentUser?.fullLocation,
      // Reporter information for tracking
      reported_by: report.reported_by,
      reporter_name: reporter?.full_name || 'Anonymous Citizen',
      estimatedPayment: `₹${estimatedPayment}`,
      estimatedTime: estimatedTime,
      status: 'available', // available, assigned, in_progress, completed
      assigned_to: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    tasks.push(availableTask);
    saveToStorage(LOCAL_STORAGE_KEYS.TASKS, tasks);
    
    // Log for debugging real-time zone matching
    console.log('🆕 New task created for zone:', availableTask.zone, 'by citizen:', availableTask.reporter_name);
    
    return availableTask;
  },

  async getReportsByUser(userId) {
    const reports = getFromStorage(LOCAL_STORAGE_KEYS.REPORTS) || [];
    return reports
      .filter(report => report.reported_by === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async getReportsByZone(zoneId, status = null) {
    const reports = getFromStorage(LOCAL_STORAGE_KEYS.REPORTS) || [];
    let filteredReports = reports;
    
    if (status) {
      filteredReports = filteredReports.filter(report => report.status === status);
    }
    
    return filteredReports.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async deleteReport(reportId, userId) {
    const reports = getFromStorage(LOCAL_STORAGE_KEYS.REPORTS) || [];
    const tasks = getFromStorage(LOCAL_STORAGE_KEYS.TASKS) || [];
    const rewards = getFromStorage(LOCAL_STORAGE_KEYS.REWARDS) || [];
    
    // Find the report
    const reportIndex = reports.findIndex(r => r.id === reportId);
    if (reportIndex === -1) {
      throw new Error('Report not found');
    }
    
    const report = reports[reportIndex];
    
    // Check if user owns this report
    if (report.reported_by !== userId) {
      throw new Error('You can only delete your own reports');
    }
    
    // Check if report can be deleted (only pending reports can be deleted)
    if (report.status !== 'pending') {
      throw new Error('Cannot delete reports that are already assigned or completed');
    }
    
    // Remove the report
    reports.splice(reportIndex, 1);
    
    // Remove any related available tasks
    const updatedTasks = tasks.filter(task => task.report_id !== reportId);
    
    // Remove any related rewards (though there shouldn't be any for pending reports)
    const updatedRewards = rewards.filter(reward => reward.report_id !== reportId);
    
    // Save updated data
    saveToStorage(LOCAL_STORAGE_KEYS.REPORTS, reports);
    saveToStorage(LOCAL_STORAGE_KEYS.TASKS, updatedTasks);
    saveToStorage(LOCAL_STORAGE_KEYS.REWARDS, updatedRewards);
    
    return true;
  },

  async assignReport(reportId, ragpickerId) {
    const reports = getFromStorage(LOCAL_STORAGE_KEYS.REPORTS) || [];
    const tasks = getFromStorage(LOCAL_STORAGE_KEYS.TASKS) || [];
    
    const reportIndex = reports.findIndex(r => r.id === reportId);
    if (reportIndex === -1) {
      throw new Error('Report not found');
    }
    
    // Update report status
    reports[reportIndex] = {
      ...reports[reportIndex],
      assigned_to: ragpickerId,
      status: 'assigned',
      assigned_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Create or update task
    const existingTaskIndex = tasks.findIndex(t => t.report_id === reportId);
    if (existingTaskIndex !== -1) {
      tasks[existingTaskIndex] = {
        ...tasks[existingTaskIndex],
        assigned_to: ragpickerId,
        status: 'assigned',
        assigned_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    } else {
      // Create new task if it doesn't exist
      const newTask = {
        id: generateId(),
        report_id: reportId,
        assigned_to: ragpickerId,
        status: 'assigned',
        created_at: new Date().toISOString(),
        assigned_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      tasks.push(newTask);
    }
    
    saveToStorage(LOCAL_STORAGE_KEYS.REPORTS, reports);
    saveToStorage(LOCAL_STORAGE_KEYS.TASKS, tasks);
    
    return reports[reportIndex];
  },

  async getAllReports() {
    const reports = getFromStorage(LOCAL_STORAGE_KEYS.REPORTS) || [];
    return reports;
  }
};

// Task Management
export const taskService = {
  async assignTask(reportId, ragpickerId) {
    const reports = getFromStorage(LOCAL_STORAGE_KEYS.REPORTS) || [];
    const tasks = getFromStorage(LOCAL_STORAGE_KEYS.TASKS) || [];
    
    const reportIndex = reports.findIndex(r => r.id === reportId);
    if (reportIndex === -1) throw new Error('Report not found');

    // Update report
    reports[reportIndex] = {
      ...reports[reportIndex],
      assigned_to: ragpickerId,
      status: 'assigned',
      assigned_at: new Date().toISOString()
    };

    // Create task
    const newTask = {
      id: generateId(),
      report_id: reportId,
      assigned_to: ragpickerId,
      status: 'assigned',
      created_at: new Date().toISOString()
    };

    tasks.push(newTask);
    
    saveToStorage(LOCAL_STORAGE_KEYS.REPORTS, reports);
    saveToStorage(LOCAL_STORAGE_KEYS.TASKS, tasks);

    return { report: reports[reportIndex], task: newTask };
  },

  // Get available tasks for ragpickers (filtered by zone)
  async getAvailableTasks(ragpickerZone = null) {
    const tasks = getFromStorage(LOCAL_STORAGE_KEYS.TASKS) || [];
    
    // Get only available (unassigned) tasks
    let availableTasks = tasks.filter(task => task.status === 'available' && !task.assigned_to);

    // If ragpicker zone is provided, filter by zone
    if (ragpickerZone) {
      availableTasks = availableTasks.filter(task => task.zone === ragpickerZone);
    }

    // Sort by priority (high -> medium -> low) and then by creation time
    return availableTasks.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      
      if (priorityDiff !== 0) return priorityDiff;
      
      return new Date(b.created_at) - new Date(a.created_at);
    });
  },

  // Assign an available task to a ragpicker
  async claimTask(taskId, ragpickerId) {
    const tasks = getFromStorage(LOCAL_STORAGE_KEYS.TASKS) || [];
    const reports = getFromStorage(LOCAL_STORAGE_KEYS.REPORTS) || [];
    
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) throw new Error('Task not found');
    
    const task = tasks[taskIndex];
    if (task.status !== 'available') throw new Error('Task is no longer available');

    // Update task
    tasks[taskIndex] = {
      ...task,
      assigned_to: ragpickerId,
      status: 'assigned',
      assigned_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Update related report
    const reportIndex = reports.findIndex(r => r.id === task.report_id);
    if (reportIndex !== -1) {
      reports[reportIndex] = {
        ...reports[reportIndex],
        assigned_to: ragpickerId,
        status: 'assigned',
        assigned_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      saveToStorage(LOCAL_STORAGE_KEYS.REPORTS, reports);
    }

    saveToStorage(LOCAL_STORAGE_KEYS.TASKS, tasks);
    return tasks[taskIndex];
  },

  // Calculate distance between two coordinates (Haversine formula)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadian(lat2 - lat1);
    const dLon = this.toRadian(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadian(lat1)) * Math.cos(this.toRadian(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  toRadian(degree) {
    return degree * (Math.PI / 180);
  },

  // Start a task (change status from assigned to in_progress)
  async startTask(taskId, ragpickerId) {
    const tasks = getFromStorage(LOCAL_STORAGE_KEYS.TASKS) || [];
    const reports = getFromStorage(LOCAL_STORAGE_KEYS.REPORTS) || [];
    
    const taskIndex = tasks.findIndex(t => t.id === taskId && t.assigned_to === ragpickerId);
    if (taskIndex === -1) throw new Error('Task not found or not assigned to this ragpicker');

    // Update task
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      status: 'in_progress',
      started_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Update related report
    const reportIndex = reports.findIndex(r => r.id === tasks[taskIndex].report_id);
    if (reportIndex !== -1) {
      reports[reportIndex] = {
        ...reports[reportIndex],
        status: 'in_progress',
        started_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      saveToStorage(LOCAL_STORAGE_KEYS.REPORTS, reports);
    }

    saveToStorage(LOCAL_STORAGE_KEYS.TASKS, tasks);
    return tasks[taskIndex];
  },

  async getTasksByRagpicker(ragpickerId, status = null) {
    const tasks = getFromStorage(LOCAL_STORAGE_KEYS.TASKS) || [];
    const reports = getFromStorage(LOCAL_STORAGE_KEYS.REPORTS) || [];
    
    let filteredTasks = tasks.filter(task => task.assigned_to === ragpickerId);
    
    if (status) {
      filteredTasks = filteredTasks.filter(task => task.status === status);
    }

    // Join with reports data
    return filteredTasks.map(task => {
      const report = reports.find(r => r.id === task.report_id);
      return {
        ...task,
        report: report || null
      };
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async completeTask(taskId, ragpickerId, completionData, cleanupImageFile) {
    const tasks = getFromStorage(LOCAL_STORAGE_KEYS.TASKS) || [];
    const reports = getFromStorage(LOCAL_STORAGE_KEYS.REPORTS) || [];
    const rewards = getFromStorage(LOCAL_STORAGE_KEYS.REWARDS) || [];

    const taskIndex = tasks.findIndex(t => t.id === taskId && t.assigned_to === ragpickerId);
    if (taskIndex === -1) throw new Error('Task not found');

    const task = tasks[taskIndex];
    const reportIndex = reports.findIndex(r => r.id === task.report_id);
    
    let cleanupImageUrl = null;
    if (cleanupImageFile) {
      cleanupImageUrl = URL.createObjectURL(cleanupImageFile);
    }

    // Update task
    tasks[taskIndex] = {
      ...task,
      status: 'completed',
      completed_at: new Date().toISOString(),
      cleanup_image_url: cleanupImageUrl,
      weight_collected: completionData.weight,
      notes: completionData.notes
    };

    // Update report
    if (reportIndex !== -1) {
      reports[reportIndex] = {
        ...reports[reportIndex],
        status: 'completed',
        cleanup_image_url: cleanupImageUrl,
        completed_at: new Date().toISOString()
      };
    }

    // Calculate rewards
    const basePoints = 50;
    const points = Math.floor(basePoints * (completionData.weight || 1));
    const earnings = Math.floor((completionData.weight || 1) * 10); // ₹10 per kg

    // Add reward for ragpicker
    const newReward = {
      id: generateId(),
      user_id: ragpickerId,
      report_id: task.report_id,
      points,
      earnings,
      weight: completionData.weight || 0,
      type: 'cleanup_completion',
      created_at: new Date().toISOString()
    };

    rewards.push(newReward);

    // Update user totals
    const users = getFromStorage(LOCAL_STORAGE_KEYS.USERS) || [];
    const ragpickerIndex = users.findIndex(u => u.id === ragpickerId);
    if (ragpickerIndex !== -1) {
      users[ragpickerIndex].total_points = (users[ragpickerIndex].total_points || 0) + points;
      users[ragpickerIndex].total_earnings = (users[ragpickerIndex].total_earnings || 0) + earnings;
      users[ragpickerIndex].total_weight = (users[ragpickerIndex].total_weight || 0) + (completionData.weight || 0);
    }

    // Reward citizen who reported
    if (reportIndex !== -1) {
      const citizenPoints = Math.floor(points * 0.3);
      const citizenReward = {
        id: generateId(),
        user_id: reports[reportIndex].reported_by,
        report_id: task.report_id,
        points: citizenPoints,
        earnings: 0,
        weight: completionData.weight || 0,
        type: 'report_completion',
        created_at: new Date().toISOString()
      };
      
      rewards.push(citizenReward);

      const citizenIndex = users.findIndex(u => u.id === reports[reportIndex].reported_by);
      if (citizenIndex !== -1) {
        users[citizenIndex].total_points = (users[citizenIndex].total_points || 0) + citizenPoints;
      }
    }

    // Save all updates
    saveToStorage(LOCAL_STORAGE_KEYS.TASKS, tasks);
    saveToStorage(LOCAL_STORAGE_KEYS.REPORTS, reports);
    saveToStorage(LOCAL_STORAGE_KEYS.REWARDS, rewards);
    saveToStorage(LOCAL_STORAGE_KEYS.USERS, users);

    return tasks[taskIndex];
  },

  async getTasksByReport(reportId) {
    const tasks = getFromStorage(LOCAL_STORAGE_KEYS.TASKS) || [];
    const reports = getFromStorage(LOCAL_STORAGE_KEYS.REPORTS) || [];
    
    // Find tasks related to this report
    const reportTasks = tasks.filter(task => task.report_id === reportId);
    
    // Add report information to each task
    return reportTasks.map(task => {
      const report = reports.find(r => r.id === reportId);
      return {
        ...task,
        report: report || null
      };
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  // Enhanced Real-time Stats Tracking
  async getRagpickerStats(ragpickerId) {
    const tasks = getFromStorage(LOCAL_STORAGE_KEYS.TASKS) || [];
    const users = getFromStorage(LOCAL_STORAGE_KEYS.USERS) || [];
    const rewards = getFromStorage(LOCAL_STORAGE_KEYS.REWARDS) || [];
    
    const user = users.find(u => u.id === ragpickerId);
    if (!user) throw new Error('Ragpicker not found');

    // Get all completed tasks by this ragpicker
    const completedTasks = tasks.filter(task => 
      task.assigned_to === ragpickerId && task.status === 'completed'
    );

    // Calculate total earnings from completed tasks
    const totalEarnings = completedTasks.reduce((total, task) => {
      return total + (task.earnings || 0);
    }, 0);

    // Calculate tasks completed
    const tasksCompleted = completedTasks.length;

    // Calculate average rating from completed tasks
    const ratingsArray = completedTasks
      .filter(task => task.citizen_rating)
      .map(task => task.citizen_rating);
    
    const averageRating = ratingsArray.length > 0 
      ? (ratingsArray.reduce((sum, rating) => sum + rating, 0) / ratingsArray.length).toFixed(1)
      : 4.5;

    // Calculate active hours this week
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentTasks = completedTasks.filter(task => 
      new Date(task.completed_at) > oneWeekAgo
    );

    // Estimate hours based on task completion times (assuming average 1.5 hour per task)
    const hoursThisWeek = Math.min(recentTasks.length * 1.5, 40); // Cap at 40 hours

    return {
      totalEarnings,
      tasksCompleted,
      averageRating: parseFloat(averageRating),
      hoursThisWeek: Math.round(hoursThisWeek)
    };
  },

  // Track work session start
  async startWorkSession(ragpickerId) {
    const sessions = getFromStorage('cleansight_work_sessions') || [];
    const activeSession = sessions.find(s => s.ragpicker_id === ragpickerId && !s.ended_at);
    
    if (activeSession) {
      return activeSession; // Already has active session
    }

    const newSession = {
      id: generateId(),
      ragpicker_id: ragpickerId,
      started_at: new Date().toISOString(),
      ended_at: null
    };

    sessions.push(newSession);
    saveToStorage('cleansight_work_sessions', sessions);
    return newSession;
  },

  // Track work session end
  async endWorkSession(ragpickerId) {
    const sessions = getFromStorage('cleansight_work_sessions') || [];
    const activeSessionIndex = sessions.findIndex(s => 
      s.ragpicker_id === ragpickerId && !s.ended_at
    );
    
    if (activeSessionIndex !== -1) {
      sessions[activeSessionIndex].ended_at = new Date().toISOString();
      saveToStorage('cleansight_work_sessions', sessions);
      return sessions[activeSessionIndex];
    }

    return null;
  },

  // Update user stats in real-time
  async updateRagpickerStats(ragpickerId) {
    const users = getFromStorage(LOCAL_STORAGE_KEYS.USERS) || [];
    const userIndex = users.findIndex(u => u.id === ragpickerId);
    
    if (userIndex === -1) throw new Error('User not found');

    const stats = await this.getRagpickerStats(ragpickerId);
    
    // Update user record with latest stats
    users[userIndex] = {
      ...users[userIndex],
      total_earnings: stats.totalEarnings,
      tasks_completed: stats.tasksCompleted,
      average_rating: stats.averageRating,
      hours_this_week: stats.hoursThisWeek,
      updated_at: new Date().toISOString()
    };

    saveToStorage(LOCAL_STORAGE_KEYS.USERS, users);
    return stats;
  },

  async assignTaskToWorker(taskId, workerId, kioskId) {
    const tasks = getFromStorage(LOCAL_STORAGE_KEYS.TASKS) || [];
    const workers = getFromStorage(LOCAL_STORAGE_KEYS.WORKERS) || [];
    
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    const worker = workers.find(w => w.id === workerId);
    
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    if (!worker || worker.kiosk_id !== kioskId) {
      throw new Error('Worker not found or not associated with this kiosk');
    }
    
    if (tasks[taskIndex].status !== 'available') {
      throw new Error('Task is not available for assignment');
    }
    
    // Update task
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      status: 'assigned',
      assigned_worker_id: workerId,
      assigned_worker_name: worker.name,
      assigned_at: new Date().toISOString(),
      ragpicker_id: workerId // Keep for backward compatibility
    };
    
    saveToStorage(LOCAL_STORAGE_KEYS.TASKS, tasks);
    
    // Update worker stats
    const workerIndex = workers.findIndex(w => w.id === workerId);
    if (workerIndex !== -1) {
      workers[workerIndex].last_active = new Date().toISOString();
      if (workers[workerIndex].status === 'active') {
        workers[workerIndex].status = 'busy';
      }
      saveToStorage(LOCAL_STORAGE_KEYS.WORKERS, workers);
    }
    
    return tasks[taskIndex];
  },

  async getTasksAssignedToWorker(workerId) {
    const tasks = getFromStorage(LOCAL_STORAGE_KEYS.TASKS) || [];
    return tasks.filter(task => 
      task.assigned_worker_id === workerId && 
      ['assigned', 'in_progress'].includes(task.status)
    );
  },

  async getAllTasks() {
    const tasks = getFromStorage(LOCAL_STORAGE_KEYS.TASKS) || [];
    return tasks;
  }
};

// Leaderboard and Stats
export const leaderboardService = {
  async getLeaderboard(type = 'citizens', timeframe = 'month') {
    const users = getFromStorage(LOCAL_STORAGE_KEYS.USERS) || [];
    const rewards = getFromStorage(LOCAL_STORAGE_KEYS.REWARDS) || [];

    let startDate = null;
    if (timeframe === 'week') {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
    } else if (timeframe === 'month') {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (timeframe === 'year') {
      startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
    }
    // For 'all' timeframe, startDate remains null (includes all data)

    // Filter rewards by timeframe if specified
    const filteredRewards = startDate 
      ? rewards.filter(reward => new Date(reward.created_at) >= startDate)
      : rewards;

    // Aggregate by user
    const userTotals = {};
    filteredRewards.forEach(reward => {
      const user = users.find(u => u.id === reward.user_id);
      if (!user) return;
      
      // Filter by user type if specified
      if (type === 'citizens' && user.role !== 'citizen') return;
      if (type === 'ragpickers' && user.role !== 'ragpicker') return;

      if (!userTotals[reward.user_id]) {
        userTotals[reward.user_id] = {
          user_id: reward.user_id,
          full_name: user.full_name,
          role: user.role,
          total_points: 0,
          total_earnings: 0,
          total_weight: 0
        };
      }
      userTotals[reward.user_id].total_points += reward.points;
      userTotals[reward.user_id].total_earnings += reward.earnings;
      userTotals[reward.user_id].total_weight += (reward.weight || 0);
    });

    // If no rewards in timeframe, include users with existing totals for 'all' timeframe
    if (timeframe === 'all') {
      users.forEach(user => {
        if (type === 'citizens' && user.role !== 'citizen') return;
        if (type === 'ragpickers' && user.role !== 'ragpicker') return;

        if (!userTotals[user.id] && (user.total_points > 0 || user.total_earnings > 0)) {
          userTotals[user.id] = {
            user_id: user.id,
            full_name: user.full_name,
            role: user.role,
            total_points: user.total_points || 0,
            total_earnings: user.total_earnings || 0,
            total_weight: user.total_weight || 0
          };
        }
      });
    }

    return Object.values(userTotals)
      .sort((a, b) => b.total_points - a.total_points)
      .slice(0, 20); // Show top 20 instead of 10
  },

  async getUserStats(userId) {
    const rewards = getFromStorage(LOCAL_STORAGE_KEYS.REWARDS) || [];
    const userRewards = rewards.filter(reward => reward.user_id === userId);

    const total_points = userRewards.reduce((sum, r) => sum + r.points, 0);
    const total_earnings = userRewards.reduce((sum, r) => sum + r.earnings, 0);
    const total_weight = userRewards.reduce((sum, r) => sum + (r.weight || 0), 0);

    return {
      total_points,
      total_earnings,
      total_weight,
      total_activities: userRewards.length
    };
  }
};

// Rewards and Badge Management
export const rewardsService = {
  // Get user's current stats and achievements
  async getUserRewardStats(userId) {
    const rewards = getFromStorage(LOCAL_STORAGE_KEYS.REWARDS) || [];
    const reports = getFromStorage(LOCAL_STORAGE_KEYS.REPORTS) || [];
    const redemptions = getFromStorage(LOCAL_STORAGE_KEYS.REDEMPTIONS) || [];
    
    const userRewards = rewards.filter(reward => reward.user_id === userId);
    const userReports = reports.filter(report => report.reported_by === userId);
    const userRedemptions = redemptions.filter(redemption => redemption.user_id === userId);

    const total_points = userRewards.reduce((sum, r) => sum + r.points, 0);
    const redeemed_points = userRedemptions.reduce((sum, r) => sum + r.points_used, 0);
    const available_points = total_points - redeemed_points;
    const total_earnings = userRewards.reduce((sum, r) => sum + r.earnings, 0);
    const total_weight = userRewards.reduce((sum, r) => sum + (r.weight || 0), 0);

    return {
      total_points,
      available_points,
      redeemed_points,
      total_earnings,
      total_weight,
      total_reports: userReports.length,
      completed_reports: userReports.filter(r => r.status === 'completed').length,
      total_activities: userRewards.length,
      redemptions: userRedemptions
    };
  },

  // Generate dynamic badges based on user activity
  async getUserBadges(userId) {
    const stats = await this.getUserRewardStats(userId);
    const reports = getFromStorage(LOCAL_STORAGE_KEYS.REPORTS) || [];
    const userReports = reports.filter(report => report.reported_by === userId);
    
    const badges = [
      {
        id: 'first_report',
        name: 'First Report',
        description: 'Submitted your first garbage report',
        icon: 'Star',
        color: 'from-blue-400 to-blue-600',
        pointsRequired: 0,
        earned: stats.total_reports >= 1,
        earnedDate: stats.total_reports >= 1 ? userReports[0]?.created_at : null,
        category: 'milestone'
      },
      {
        id: 'week_warrior',
        name: 'Week Warrior',
        description: '5 reports in a week',
        icon: 'Zap',
        color: 'from-green-400 to-green-600',
        pointsRequired: 100,
        earned: stats.total_points >= 100,
        earnedDate: stats.total_points >= 100 ? this.getAchievementDate(userId, 100) : null,
        category: 'activity'
      },
      {
        id: 'location_scout',
        name: 'Location Scout',
        description: 'Reports from 5 different areas',
        icon: 'Target',
        color: 'from-purple-400 to-purple-600',
        pointsRequired: 250,
        earned: stats.total_reports >= 5,
        earnedDate: stats.total_reports >= 5 ? userReports[4]?.created_at : null,
        category: 'exploration'
      },
      {
        id: 'eco_champion',
        name: 'Eco Champion',
        description: '500 points milestone',
        icon: 'Crown',
        color: 'from-yellow-400 to-yellow-600',
        pointsRequired: 500,
        earned: stats.total_points >= 500,
        earnedDate: stats.total_points >= 500 ? this.getAchievementDate(userId, 500) : null,
        category: 'milestone'
      },
      {
        id: 'community_hero',
        name: 'Community Hero',
        description: '10 completed reports',
        icon: 'Award',
        color: 'from-red-400 to-red-600',
        pointsRequired: 300,
        earned: stats.completed_reports >= 10,
        earnedDate: stats.completed_reports >= 10 ? userReports.filter(r => r.status === 'completed')[9]?.updated_at : null,
        category: 'community'
      },
      {
        id: 'clean_city_partner',
        name: 'Clean City Partner',
        description: '1000 points milestone',
        icon: 'Medal',
        color: 'from-indigo-400 to-indigo-600',
        pointsRequired: 1000,
        earned: stats.total_points >= 1000,
        earnedDate: stats.total_points >= 1000 ? this.getAchievementDate(userId, 1000) : null,
        category: 'partnership'
      },
      {
        id: 'waste_warrior',
        name: 'Waste Warrior',
        description: '20kg+ waste reported',
        icon: 'Weight',
        color: 'from-orange-400 to-orange-600',
        pointsRequired: 600,
        earned: stats.total_weight >= 20,
        earnedDate: stats.total_weight >= 20 ? this.getWeightAchievementDate(userId, 20) : null,
        category: 'impact'
      },
      {
        id: 'super_reporter',
        name: 'Super Reporter',
        description: '25 reports submitted',
        icon: 'TrendingUp',
        color: 'from-pink-400 to-pink-600',
        pointsRequired: 750,
        earned: stats.total_reports >= 25,
        earnedDate: stats.total_reports >= 25 ? userReports[24]?.created_at : null,
        category: 'activity'
      }
    ];

    return badges;
  },

  // Get achievement date when user reached certain points
  getAchievementDate(userId, pointsTarget) {
    const rewards = getFromStorage(LOCAL_STORAGE_KEYS.REWARDS) || [];
    const userRewards = rewards
      .filter(reward => reward.user_id === userId)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    let runningTotal = 0;
    for (const reward of userRewards) {
      runningTotal += reward.points;
      if (runningTotal >= pointsTarget) {
        return reward.created_at;
      }
    }
    return null;
  },

  // Get achievement date when user reached certain weight
  getWeightAchievementDate(userId, weightTarget) {
    const rewards = getFromStorage(LOCAL_STORAGE_KEYS.REWARDS) || [];
    const userRewards = rewards
      .filter(reward => reward.user_id === userId)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    let runningTotal = 0;
    for (const reward of userRewards) {
      runningTotal += (reward.weight || 0);
      if (runningTotal >= weightTarget) {
        return reward.created_at;
      }
    }
    return null;
  },

  // Get user level based on points
  async getUserLevel(userId) {
    const stats = await this.getUserRewardStats(userId);
    
    const levels = [
      {
        id: 'novice',
        name: 'Novice',
        pointsRequired: 0,
        rewards: ['Basic reporting access', 'Community forum access'],
        icon: 'Star',
        color: 'from-gray-400 to-gray-600'
      },
      {
        id: 'contributor',
        name: 'Contributor',
        pointsRequired: 100,
        rewards: ['Advanced reporting tools', 'Priority support'],
        icon: 'Zap',
        color: 'from-green-400 to-green-600'
      },
      {
        id: 'advocate',
        name: 'Advocate',
        pointsRequired: 500,
        rewards: ['Organize cleanup drives', 'Exclusive badges'],
        icon: 'Target',
        color: 'from-blue-400 to-blue-600'
      },
      {
        id: 'champion',
        name: 'Champion',
        pointsRequired: 1000,
        rewards: ['Municipality partnerships', 'VIP events'],
        icon: 'Crown',
        color: 'from-yellow-400 to-yellow-600'
      },
      {
        id: 'legend',
        name: 'Legend',
        pointsRequired: 2500,
        rewards: ['City recognition', 'Leadership opportunities'],
        icon: 'Trophy',
        color: 'from-purple-400 to-purple-600'
      }
    ];

    // Find current level
    let currentLevel = levels[0];
    let nextLevel = levels[1];
    
    for (let i = 0; i < levels.length; i++) {
      if (stats.total_points >= levels[i].pointsRequired) {
        currentLevel = levels[i];
        nextLevel = levels[i + 1] || null;
      } else {
        break;
      }
    }

    return {
      current: currentLevel,
      next: nextLevel,
      progress: nextLevel ? ((stats.total_points - currentLevel.pointsRequired) / (nextLevel.pointsRequired - currentLevel.pointsRequired)) * 100 : 100,
      all_levels: levels.map(level => ({
        ...level,
        current: level.id === currentLevel.id,
        completed: stats.total_points >= level.pointsRequired
      }))
    };
  },

  // Get available perks/rewards to redeem
  async getAvailablePerks(userId) {
    const stats = await this.getUserRewardStats(userId);
    
    const perks = [
      {
        id: 'eco_bottle',
        name: 'Eco-friendly Water Bottle',
        description: 'Reusable water bottle made from recycled materials',
        pointsCost: 200,
        icon: 'Gift',
        available: stats.available_points >= 200,
        category: 'merchandise',
        stock: 50
      },
      {
        id: 'community_pass',
        name: 'Community Meetup Pass',
        description: 'Free entry to next community cleanup event',
        pointsCost: 150,
        icon: 'Users',
        available: stats.available_points >= 150,
        category: 'events',
        stock: 20
      },
      {
        id: 'tree_planting',
        name: 'Tree Planting Kit',
        description: 'Saplings and planting supplies for urban gardening',
        pointsCost: 300,
        icon: 'Sparkles',
        available: stats.available_points >= 300,
        category: 'environment',
        stock: 30
      },
      {
        id: 'municipality_recognition',
        name: 'Municipality Recognition',
        description: 'Get featured in city newsletter',
        pointsCost: 500,
        icon: 'Award',
        available: stats.available_points >= 500 && stats.total_points >= 1000,
        category: 'recognition',
        stock: 10
      },
      {
        id: 'vip_event',
        name: 'VIP Cleanup Event',
        description: 'Exclusive access to special cleanup initiatives',
        pointsCost: 800,
        icon: 'Crown',
        available: stats.available_points >= 800 && stats.total_points >= 1500,
        category: 'exclusive',
        stock: 5
      },
      {
        id: 'leadership_workshop',
        name: 'Environmental Leadership Workshop',
        description: 'Attend exclusive workshop on environmental leadership',
        pointsCost: 1000,
        icon: 'Trophy',
        available: stats.available_points >= 1000 && stats.total_points >= 2000,
        category: 'education',
        stock: 15
      }
    ];

    return perks;
  },

  // Redeem a perk
  async redeemPerk(userId, perkId) {
    const stats = await this.getUserRewardStats(userId);
    const perks = await this.getAvailablePerks(userId);
    const perk = perks.find(p => p.id === perkId);
    
    if (!perk) {
      throw new Error('Perk not found');
    }
    
    if (!perk.available) {
      throw new Error('Insufficient points or requirements not met');
    }
    
    if (stats.available_points < perk.pointsCost) {
      throw new Error('Insufficient points');
    }

    // Record the redemption
    const redemptions = getFromStorage(LOCAL_STORAGE_KEYS.REDEMPTIONS) || [];
    const newRedemption = {
      id: generateId(),
      user_id: userId,
      perk_id: perkId,
      perk_name: perk.name,
      points_used: perk.pointsCost,
      status: 'pending', // pending, approved, fulfilled
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    redemptions.push(newRedemption);
    saveToStorage(LOCAL_STORAGE_KEYS.REDEMPTIONS, redemptions);

    return newRedemption;
  },

  // Get user's redemption history
  async getUserRedemptions(userId) {
    const redemptions = getFromStorage(LOCAL_STORAGE_KEYS.REDEMPTIONS) || [];
    return redemptions
      .filter(redemption => redemption.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
};

// Community Management
export const communityService = {
  // Get all posts with optional filtering
  async getPosts(filters = {}) {
    const posts = getFromStorage(LOCAL_STORAGE_KEYS.COMMUNITY_POSTS) || [];
    const users = getFromStorage(LOCAL_STORAGE_KEYS.USERS) || [];
    const reactions = getFromStorage(LOCAL_STORAGE_KEYS.POST_REACTIONS) || [];
    const comments = getFromStorage(LOCAL_STORAGE_KEYS.POST_COMMENTS) || [];
    
    let filteredPosts = posts;
    
    // Apply filters
    if (filters.type && filters.type !== 'all') {
      filteredPosts = filteredPosts.filter(post => post.type === filters.type);
    }
    
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filteredPosts = filteredPosts.filter(post => 
        post.content.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // Join with user data and reaction counts
    const postsWithData = filteredPosts.map(post => {
      const author = users.find(u => u.id === post.author_id);
      const postReactions = reactions.filter(r => r.post_id === post.id);
      const postComments = comments.filter(c => c.post_id === post.id);
      
      const likesCount = postReactions.filter(r => r.type === 'like').length;
      const clapsCount = postReactions.filter(r => r.type === 'clap').length;
      const commentsCount = postComments.length;
      const sharesCount = postReactions.filter(r => r.type === 'share').length;
      
      // Check if current user has reacted
      const currentUser = getFromStorage(LOCAL_STORAGE_KEYS.AUTH_USER);
      const userLiked = currentUser ? postReactions.some(r => r.user_id === currentUser.id && r.type === 'like') : false;
      const userClapped = currentUser ? postReactions.some(r => r.user_id === currentUser.id && r.type === 'clap') : false;
      const userSaved = currentUser ? postReactions.some(r => r.user_id === currentUser.id && r.type === 'save') : false;
      
      return {
        ...post,
        author: {
          id: author?.id || post.author_id,
          name: author?.full_name || 'Unknown User',
          role: this.getRoleDisplay(author?.role || 'citizen'),
          avatar: this.generateAvatar(author?.full_name || 'Unknown'),
          isVerified: author?.total_points >= 500 || false,
          points: author?.total_points || 0
        },
        likes: likesCount,
        claps: clapsCount,
        comments: commentsCount,
        shares: sharesCount,
        isLiked: userLiked,
        isClapped: userClapped,
        isSaved: userSaved,
        timestamp: this.getTimeAgo(post.created_at)
      };
    });
    
    return postsWithData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  // Create a new post
  async createPost(postData) {
    const currentUser = getFromStorage(LOCAL_STORAGE_KEYS.AUTH_USER);
    if (!currentUser) throw new Error('User not authenticated');
    
    const posts = getFromStorage(LOCAL_STORAGE_KEYS.COMMUNITY_POSTS) || [];
    
    const newPost = {
      id: generateId(),
      author_id: currentUser.id,
      content: postData.content,
      type: postData.type || 'announcement',
      location: postData.location || '',
      tags: Array.isArray(postData.tags) ? postData.tags : 
            (postData.tags ? postData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []),
      image_url: postData.image_url || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    posts.push(newPost);
    saveToStorage(LOCAL_STORAGE_KEYS.COMMUNITY_POSTS, posts);
    
    return newPost;
  },

  // React to a post (like, clap, save, share)
  async reactToPost(postId, reactionType, userId) {
    const reactions = getFromStorage(LOCAL_STORAGE_KEYS.POST_REACTIONS) || [];
    
    // Check if user already has this reaction
    const existingReactionIndex = reactions.findIndex(r => 
      r.post_id === postId && r.user_id === userId && r.type === reactionType
    );
    
    if (existingReactionIndex !== -1) {
      // Remove existing reaction (toggle off)
      reactions.splice(existingReactionIndex, 1);
    } else {
      // Add new reaction
      const newReaction = {
        id: generateId(),
        post_id: postId,
        user_id: userId,
        type: reactionType,
        created_at: new Date().toISOString()
      };
      reactions.push(newReaction);
    }
    
    saveToStorage(LOCAL_STORAGE_KEYS.POST_REACTIONS, reactions);
    return true;
  },

  // Get comments for a post
  async getPostComments(postId) {
    const comments = getFromStorage(LOCAL_STORAGE_KEYS.POST_COMMENTS) || [];
    const users = getFromStorage(LOCAL_STORAGE_KEYS.USERS) || [];
    
    const postComments = comments
      .filter(comment => comment.post_id === postId)
      .map(comment => {
        const author = users.find(u => u.id === comment.user_id);
        return {
          ...comment,
          author: {
            id: author?.id || comment.user_id,
            name: author?.full_name || 'Unknown User',
            avatar: this.generateAvatar(author?.full_name || 'Unknown'),
            points: author?.total_points || 0
          },
          timestamp: this.getTimeAgo(comment.created_at)
        };
      })
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    
    return postComments;
  },

  // Add a comment to a post
  async addComment(postId, content) {
    const currentUser = getFromStorage(LOCAL_STORAGE_KEYS.AUTH_USER);
    if (!currentUser) throw new Error('User not authenticated');
    
    const comments = getFromStorage(LOCAL_STORAGE_KEYS.POST_COMMENTS) || [];
    
    const newComment = {
      id: generateId(),
      post_id: postId,
      user_id: currentUser.id,
      content: content.trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    comments.push(newComment);
    saveToStorage(LOCAL_STORAGE_KEYS.POST_COMMENTS, comments);
    
    return newComment;
  },

  // Get community stats
  async getCommunityStats() {
    const users = getFromStorage(LOCAL_STORAGE_KEYS.USERS) || [];
    const posts = getFromStorage(LOCAL_STORAGE_KEYS.COMMUNITY_POSTS) || [];
    const reactions = getFromStorage(LOCAL_STORAGE_KEYS.POST_REACTIONS) || [];
    const reports = getFromStorage(LOCAL_STORAGE_KEYS.REPORTS) || [];
    
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const postsToday = posts.filter(post => 
      new Date(post.created_at) >= startOfDay
    ).length;
    
    const completedCleanups = reports.filter(report => report.status === 'completed').length;
    
    const engagementRate = posts.length > 0 ? 
      Math.round((reactions.length / (posts.length * users.length)) * 100) : 0;
    
    return {
      activeMembers: users.length,
      postsToday: postsToday,
      totalCleanups: completedCleanups,
      engagementRate: Math.min(engagementRate, 100)
    };
  },

  // Get post type counts
  async getPostTypeCounts() {
    const posts = getFromStorage(LOCAL_STORAGE_KEYS.COMMUNITY_POSTS) || [];
    
    const counts = {
      all: posts.length,
      cleanup: posts.filter(p => p.type === 'cleanup').length,
      success: posts.filter(p => p.type === 'success').length,
      announcement: posts.filter(p => p.type === 'announcement').length,
      event: posts.filter(p => p.type === 'event').length
    };
    
    return counts;
  },

  // Helper functions
  getRoleDisplay(role) {
    const roles = {
      'citizen': 'Community Member',
      'ragpicker': 'Environmental Worker',
      'admin': 'Community Moderator',
      'institution': 'Organization'
    };
    return roles[role] || 'Community Member';
  },

  generateAvatar(name) {
    // Generate a simple avatar URL based on name
    const encodedName = encodeURIComponent(name);
    return `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff&size=150&rounded=true`;
  },

  getTimeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w`;
    return `${Math.floor(diffInSeconds / 2592000)}mo`;
  }
};

// Initialize with some sample data for demo
export const initializeSampleData = () => {
  const users = getFromStorage(LOCAL_STORAGE_KEYS.USERS);
  if (!users || users.length === 0) {
    // Add sample users with location data
    const sampleUsers = [
      // Demo accounts matching Login page
      {
        id: 'demo-citizen',
        email: 'citizen@demo.com',
        password: 'demo123',
        full_name: 'Aditya',
        profileImage: 'https:d//images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        role: 'citizen',
        state: 'Maharashtra',
        city: 'Mumbai',
        zone: 'Zone 1 - South Mumbai',
        address: '123 Green Apartments, Nariman Point, Near Oval Maidan',
        fullLocation: '123 Green Apartments, Nariman Point, Near Oval Maidan, Zone 1 - South Mumbai, Mumbai, Maharashtra',
        phone: '+91 9876543210',
        total_points: 850,
        total_earnings: 0,
        total_weight: 12.5,
        created_at: new Date(Date.now() - 30*24*60*60*1000).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'demo-ragpicker',
        email: 'ragpicker@demo.com',
        password: 'demo123',
        full_name: 'Raj Collector',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        role: 'ragpicker',
        state: 'Maharashtra',
        city: 'Mumbai',
        zone: 'Zone 1 - South Mumbai',
        address: '456 Work Lane, Fort Area, Near CST Station',
        fullLocation: '456 Work Lane, Fort Area, Near CST Station, Zone 1 - South Mumbai, Mumbai, Maharashtra',
        phone: '+91 9876543211',
        total_points: 1250,
        total_earnings: 250,  // Sum of completed tasks (50+100+25+75)
        total_weight: 45.0,
        tasks_completed: 4,   // 4 completed tasks
        average_rating: 4.5,  // Average of ratings (5+4+5+4)/4
        hours_this_week: 8,   // Estimated hours based on recent tasks
        created_at: new Date(Date.now() - 25*24*60*60*1000).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'demo-institution',
        email: 'org@demo.com',
        password: 'demo123',
        full_name: 'Green Institution',
        profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
        role: 'institution',
        state: 'Maharashtra',
        city: 'Mumbai',
        zone: 'Zone 2 - Central Mumbai',
        address: '789 Eco Building, Bandra East, Near Bandstand',
        fullLocation: '789 Eco Building, Bandra East, Near Bandstand, Zone 2 - Central Mumbai, Mumbai, Maharashtra',
        phone: '+91 9876543212',
        total_points: 2500,
        total_earnings: 0,
        total_weight: 85.0,
        created_at: new Date(Date.now() - 20*24*60*60*1000).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'demo-admin',
        email: 'admin@demo.com',
        password: 'demo123',
        full_name: 'Admin User',
        profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
        role: 'admin',
        state: 'Maharashtra',
        city: 'Mumbai',
        zone: 'Zone 1 - South Mumbai',
        address: '1 Admin Tower, Lower Parel, Near Phoenix Mills',
        fullLocation: '1 Admin Tower, Lower Parel, Near Phoenix Mills, Zone 1 - South Mumbai, Mumbai, Maharashtra',
        phone: '+91 9876543213',
        total_points: 5000,
        total_earnings: 0,
        total_weight: 0,
        created_at: new Date(Date.now() - 50*24*60*60*1000).toISOString(),
        updated_at: new Date().toISOString()
      },
      // Additional test users
      {
        id: 'user1',
        email: 'citizen@test.com',
        password: 'demo123',
        full_name: 'Aditya',
        role: 'citizen',
        state: 'Maharashtra',
        city: 'Mumbai',
        zone: 'Zone 1 - South Mumbai',
        address: '123 Green Apartments, Nariman Point, Near Oval Maidan',
        fullLocation: '123 Green Apartments, Nariman Point, Near Oval Maidan, Zone 1 - South Mumbai, Mumbai, Maharashtra',
        phone: '+91 9876543210',
        total_points: 850,
        total_earnings: 0,
        total_weight: 12.5,
        created_at: new Date(Date.now() - 30*24*60*60*1000).toISOString(), // 30 days ago
        updated_at: new Date().toISOString()
      },
      {
        id: 'user2',
        email: 'ragpicker@test.com',
        password: 'demo123',
        full_name: 'Raj Collector',
        role: 'ragpicker',
        state: 'Maharashtra',
        city: 'Mumbai',
        zone: 'Zone 1 - South Mumbai',
        address: '456 Work Lane, Fort Area, Near CST Station',
        fullLocation: '456 Work Lane, Fort Area, Near CST Station, Zone 1 - South Mumbai, Mumbai, Maharashtra',
        phone: '+91 9876543211',
        total_points: 1250,
        total_earnings: 800,
        total_weight: 45.0,
        created_at: new Date(Date.now() - 25*24*60*60*1000).toISOString(), // 25 days ago
        updated_at: new Date().toISOString()
      },
      {
        id: 'user3',
        email: 'sarah.green@test.com',
        password: 'demo123',
        full_name: 'Sarah Green',
        role: 'citizen',
        state: 'Delhi',
        city: 'Delhi',
        zone: 'Zone 4 - South Delhi',
        address: '789 Eco Apartments, Hauz Khas Village, Near Metro Station',
        fullLocation: '789 Eco Apartments, Hauz Khas Village, Near Metro Station, Zone 4 - South Delhi, Delhi, Delhi',
        phone: '+91 9876543212',
        total_points: 1450,
        total_earnings: 0,
        total_weight: 18.2,
        created_at: new Date(Date.now() - 20*24*60*60*1000).toISOString(), // 20 days ago
        updated_at: new Date().toISOString()
      },
      {
        id: 'user4',
        email: 'mike.collector@test.com',
        full_name: 'Mike Rodriguez',
        role: 'ragpicker',
        state: 'Karnataka',
        city: 'Bangalore',
        zone: 'Zone 2 - Central Bangalore',
        address: '321 Service Road, MG Road, Near Brigade Road',
        fullLocation: '321 Service Road, MG Road, Near Brigade Road, Zone 2 - Central Bangalore, Bangalore, Karnataka',
        phone: '+91 9876543213',
        total_points: 2100,
        total_earnings: 1200,
        total_weight: 62.8,
        created_at: new Date(Date.now() - 35*24*60*60*1000).toISOString(), // 35 days ago
        updated_at: new Date().toISOString()
      },
      {
        id: 'user5',
        email: 'priya.activist@test.com',
        full_name: 'Priya Sharma',
        role: 'citizen',
        state: 'Gujarat',
        city: 'Ahmedabad',
        zone: 'Zone 3 - West Ahmedabad',
        address: '567 Clean Colony, Vastrapur, Near Lake Garden',
        fullLocation: '567 Clean Colony, Vastrapur, Near Lake Garden, Zone 3 - West Ahmedabad, Ahmedabad, Gujarat',
        phone: '+91 9876543214',
        total_points: 950,
        total_earnings: 0,
        total_weight: 15.7,
        created_at: new Date(Date.now() - 18*24*60*60*1000).toISOString(), // 18 days ago
        updated_at: new Date().toISOString()
      },
      {
        id: 'user6',
        email: 'david.eco@test.com',
        full_name: 'David Kumar',
        role: 'citizen',
        state: 'Tamil Nadu',
        city: 'Chennai',
        zone: 'Zone 5 - North Chennai',
        address: '890 Green Heights, T Nagar, Near Phoenix Mall',
        fullLocation: '890 Green Heights, T Nagar, Near Phoenix Mall, Zone 5 - North Chennai, Chennai, Tamil Nadu',
        phone: '+91 9876543215',
        total_points: 720,
        total_earnings: 0,
        total_weight: 9.3,
        created_at: new Date(Date.now() - 15*24*60*60*1000).toISOString(), // 15 days ago
        updated_at: new Date().toISOString()
      },
      {
        id: 'user7',
        email: 'rita.cleaner@test.com',
        full_name: 'Rita Patel',
        role: 'ragpicker',
        state: 'Rajasthan',
        city: 'Jaipur',
        zone: 'Zone 1 - Pink City',
        address: '234 Worker Colony, Jaipur Station Road, Near City Palace',
        fullLocation: '234 Worker Colony, Jaipur Station Road, Near City Palace, Zone 1 - Pink City, Jaipur, Rajasthan',
        phone: '+91 9876543216',
        total_points: 1680,
        total_earnings: 950,
        total_weight: 38.4,
        created_at: new Date(Date.now() - 22*24*60*60*1000).toISOString(), // 22 days ago
        updated_at: new Date().toISOString()
      },
      {
        id: 'user8',
        email: 'alex.environment@test.com',
        full_name: 'Alex Thompson',
        role: 'citizen',
        state: 'West Bengal',
        city: 'Kolkata',
        zone: 'Zone 2 - Central Kolkata',
        address: '456 Heritage Apartments, Park Street, Near Victoria Memorial',
        fullLocation: '456 Heritage Apartments, Park Street, Near Victoria Memorial, Zone 2 - Central Kolkata, Kolkata, West Bengal',
        phone: '+91 9876543217',
        total_points: 1120,
        total_earnings: 0,
        total_weight: 16.9,
        created_at: new Date(Date.now() - 12*24*60*60*1000).toISOString(), // 12 days ago
        updated_at: new Date().toISOString()
      },
      {
        id: 'user9',
        email: 'neha.waste@test.com',
        full_name: 'Neha Singh',
        role: 'ragpicker',
        state: 'Uttar Pradesh',
        city: 'Lucknow',
        zone: 'Zone 3 - Gomti Nagar',
        address: '678 Service Lane, Gomti Nagar Extension, Near Metro Station',
        fullLocation: '678 Service Lane, Gomti Nagar Extension, Near Metro Station, Zone 3 - Gomti Nagar, Lucknow, Uttar Pradesh',
        phone: '+91 9876543218',
        total_points: 890,
        total_earnings: 420,
        total_weight: 28.6,
        created_at: new Date(Date.now() - 28*24*60*60*1000).toISOString(), // 28 days ago
        updated_at: new Date().toISOString()
      },
      {
        id: 'user10',
        email: 'ravi.green@test.com',
        full_name: 'Ravi Gupta',
        role: 'citizen',
        state: 'Haryana',
        city: 'Gurugram',
        zone: 'Zone 4 - Cyber City',
        address: '999 Tech Tower, Cyber Hub, Near DLF Mall',
        fullLocation: '999 Tech Tower, Cyber Hub, Near DLF Mall, Zone 4 - Cyber City, Gurugram, Haryana',
        phone: '+91 9876543219',
        total_points: 580,
        total_earnings: 0,
        total_weight: 7.8,
        created_at: new Date(Date.now() - 8*24*60*60*1000).toISOString(), // 8 days ago
        updated_at: new Date().toISOString()
      },
      {
        id: 'user11',
        email: 'maya.collector@test.com',
        full_name: 'Maya Joshi',
        role: 'ragpicker',
        state: 'Maharashtra',
        city: 'Pune',
        zone: 'Zone 6 - Koregaon Park',
        address: '111 Clean Street, Koregaon Park, Near Osho Garden',
        fullLocation: '111 Clean Street, Koregaon Park, Near Osho Garden, Zone 6 - Koregaon Park, Pune, Maharashtra',
        phone: '+91 9876543220',
        total_points: 1850,
        total_earnings: 1100,
        total_weight: 52.3,
        created_at: new Date(Date.now() - 40*24*60*60*1000).toISOString(), // 40 days ago
        updated_at: new Date().toISOString()
      }
    ];
    saveToStorage(LOCAL_STORAGE_KEYS.USERS, sampleUsers);

    // Add sample reports
    const sampleReports = [
      {
        id: 'report1',
        title: 'Plastic bottles near park',
        description: 'Several plastic bottles scattered near the children\'s playground',
        category: 'plastic',
        severity: 'medium',
        latitude: 19.0760,
        longitude: 72.8777,
        address: 'Marine Drive, Mumbai',
        image_url: null,
        reported_by: 'user1',
        status: 'completed',
        created_at: new Date(Date.now() - 5*24*60*60*1000).toISOString(), // 5 days ago
        updated_at: new Date().toISOString()
      },
      {
        id: 'report2',
        title: 'Food waste in market area',
        description: 'Organic waste accumulating near vegetable market',
        category: 'organic',
        severity: 'high',
        latitude: 19.0830,
        longitude: 72.8258,
        address: 'Crawford Market, Mumbai',
        image_url: null,
        reported_by: 'user3',
        status: 'completed',
        created_at: new Date(Date.now() - 3*24*60*60*1000).toISOString(), // 3 days ago
        updated_at: new Date().toISOString()
      },
      {
        id: 'report3',
        title: 'Electronic waste dumping',
        description: 'Old electronic devices dumped near residential area',
        category: 'e-waste',
        severity: 'high',
        latitude: 12.9716,
        longitude: 77.5946,
        address: 'MG Road, Bangalore',
        image_url: null,
        reported_by: 'user5',
        status: 'completed',
        created_at: new Date(Date.now() - 7*24*60*60*1000).toISOString(), // 7 days ago
        updated_at: new Date().toISOString()
      }
    ];
    saveToStorage(LOCAL_STORAGE_KEYS.REPORTS, sampleReports);

    // Add sample completed tasks for demo ragpicker
    const sampleTasks = [
      {
        id: 'task1',
        report_id: 'report1',
        title: 'Plastic bottles near park',
        description: 'Several plastic bottles scattered near the children\'s playground',
        severity: 'medium',
        priority: 'medium',
        latitude: 19.0760,
        longitude: 72.8777,
        address: 'Marine Drive, Mumbai',
        zone: 'Zone 1 - South Mumbai',
        assigned_to: 'demo-ragpicker',
        status: 'completed',
        earnings: 50,
        citizen_rating: 5,
        estimated_payment: '₹50',
        estimatedTime: '30-45 min',
        cleanup_image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
        created_at: new Date(Date.now() - 5*24*60*60*1000).toISOString(),
        started_at: new Date(Date.now() - 5*24*60*60*1000).toISOString(),
        completed_at: new Date(Date.now() - 5*24*60*60*1000).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'task2',
        report_id: 'report2',
        title: 'Food waste in market area',
        description: 'Organic waste accumulating near vegetable market',
        severity: 'high',
        priority: 'high',
        latitude: 19.0830,
        longitude: 72.8258,
        address: 'Crawford Market, Mumbai',
        zone: 'Zone 1 - South Mumbai',
        assigned_to: 'demo-ragpicker',
        status: 'completed',
        earnings: 100,
        citizen_rating: 4,
        estimated_payment: '₹100',
        estimatedTime: '45-60 min',
        cleanup_image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=200&fit=crop',
        created_at: new Date(Date.now() - 12*24*60*60*1000).toISOString(),
        started_at: new Date(Date.now() - 12*24*60*60*1000).toISOString(),
        completed_at: new Date(Date.now() - 11*24*60*60*1000).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'task3',
        report_id: 'report3',
        title: 'Mixed waste at bus stop',
        description: 'Various types of waste collected at busy bus stop',
        severity: 'low',
        priority: 'low',
        latitude: 19.0896,
        longitude: 72.8656,
        address: 'Bandra Station, Mumbai',
        zone: 'Zone 1 - South Mumbai',
        assigned_to: 'demo-ragpicker',
        status: 'completed',
        earnings: 25,
        citizen_rating: 5,
        estimated_payment: '₹25',
        estimatedTime: '15-30 min',
        cleanup_image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=300&h=200&fit=crop',
        created_at: new Date(Date.now() - 18*24*60*60*1000).toISOString(),
        started_at: new Date(Date.now() - 18*24*60*60*1000).toISOString(),
        completed_at: new Date(Date.now() - 17*24*60*60*1000).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'task4',
        report_id: null,
        title: 'Street cleaning initiative',
        description: 'Weekly street cleaning in residential area',
        severity: 'medium',
        priority: 'medium',
        latitude: 19.0728,
        longitude: 72.8826,
        address: 'Colaba Causeway, Mumbai',
        zone: 'Zone 1 - South Mumbai',
        assigned_to: 'demo-ragpicker',
        status: 'completed',
        earnings: 75,
        citizen_rating: 4,
        estimated_payment: '₹75',
        estimatedTime: '45-60 min',
        cleanup_image_url: 'https://images.unsplash.com/photo-1503596476-1c12a8ba09a9?w=300&h=200&fit=crop',
        created_at: new Date(Date.now() - 3*24*60*60*1000).toISOString(),
        started_at: new Date(Date.now() - 3*24*60*60*1000).toISOString(),
        completed_at: new Date(Date.now() - 2*24*60*60*1000).toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    saveToStorage(LOCAL_STORAGE_KEYS.TASKS, sampleTasks);

    // Add sample rewards to create leaderboard data
    const sampleRewards = [
      // User1 (Aditya) rewards
      { id: 'reward1', user_id: 'user1', report_id: 'report1', points: 150, earnings: 0, weight: 2.5, type: 'report_completion', created_at: new Date(Date.now() - 5*24*60*60*1000).toISOString() },
      { id: 'reward2', user_id: 'user1', report_id: null, points: 200, earnings: 0, weight: 3.0, type: 'bonus_activity', created_at: new Date(Date.now() - 10*24*60*60*1000).toISOString() },
      { id: 'reward3', user_id: 'user1', report_id: null, points: 300, earnings: 0, weight: 4.5, type: 'weekly_bonus', created_at: new Date(Date.now() - 15*24*60*60*1000).toISOString() },
      { id: 'reward4', user_id: 'user1', report_id: null, points: 200, earnings: 0, weight: 2.5, type: 'cleanup_participation', created_at: new Date(Date.now() - 20*24*60*60*1000).toISOString() },

      // User2 (Raj Collector) rewards  
      { id: 'reward5', user_id: 'user2', report_id: 'report1', points: 300, earnings: 200, weight: 8.0, type: 'cleanup_completion', created_at: new Date(Date.now() - 4*24*60*60*1000).toISOString() },
      { id: 'reward6', user_id: 'user2', report_id: null, points: 450, earnings: 300, weight: 15.0, type: 'cleanup_completion', created_at: new Date(Date.now() - 12*24*60*60*1000).toISOString() },
      { id: 'reward7', user_id: 'user2', report_id: null, points: 350, earnings: 200, weight: 12.0, type: 'cleanup_completion', created_at: new Date(Date.now() - 18*24*60*60*1000).toISOString() },
      { id: 'reward8', user_id: 'user2', report_id: null, points: 150, earnings: 100, weight: 10.0, type: 'cleanup_completion', created_at: new Date(Date.now() - 24*24*60*60*1000).toISOString() },

      // User3 (Sarah Green) rewards
      { id: 'reward9', user_id: 'user3', report_id: 'report2', points: 200, earnings: 0, weight: 3.5, type: 'report_completion', created_at: new Date(Date.now() - 3*24*60*60*1000).toISOString() },
      { id: 'reward10', user_id: 'user3', report_id: null, points: 350, earnings: 0, weight: 5.2, type: 'community_event', created_at: new Date(Date.now() - 8*24*60*60*1000).toISOString() },
      { id: 'reward11', user_id: 'user3', report_id: null, points: 400, earnings: 0, weight: 6.0, type: 'eco_champion_bonus', created_at: new Date(Date.now() - 14*24*60*60*1000).toISOString() },
      { id: 'reward12', user_id: 'user3', report_id: null, points: 500, earnings: 0, weight: 3.5, type: 'monthly_achievement', created_at: new Date(Date.now() - 19*24*60*60*1000).toISOString() },

      // User4 (Mike Rodriguez) rewards
      { id: 'reward13', user_id: 'user4', report_id: null, points: 600, earnings: 350, weight: 18.5, type: 'cleanup_completion', created_at: new Date(Date.now() - 2*24*60*60*1000).toISOString() },
      { id: 'reward14', user_id: 'user4', report_id: null, points: 550, earnings: 300, weight: 16.8, type: 'cleanup_completion', created_at: new Date(Date.now() - 9*24*60*60*1000).toISOString() },
      { id: 'reward15', user_id: 'user4', report_id: null, points: 450, earnings: 250, weight: 14.2, type: 'cleanup_completion', created_at: new Date(Date.now() - 16*24*60*60*1000).toISOString() },
      { id: 'reward16', user_id: 'user4', report_id: null, points: 500, earnings: 300, weight: 13.3, type: 'cleanup_completion', created_at: new Date(Date.now() - 25*24*60*60*1000).toISOString() },

      // User5 (Priya Sharma) rewards
      { id: 'reward17', user_id: 'user5', report_id: 'report3', points: 180, earnings: 0, weight: 2.8, type: 'report_completion', created_at: new Date(Date.now() - 7*24*60*60*1000).toISOString() },
      { id: 'reward18', user_id: 'user5', report_id: null, points: 220, earnings: 0, weight: 4.2, type: 'awareness_campaign', created_at: new Date(Date.now() - 13*24*60*60*1000).toISOString() },
      { id: 'reward19', user_id: 'user5', report_id: null, points: 300, earnings: 0, weight: 5.5, type: 'community_leader', created_at: new Date(Date.now() - 17*24*60*60*1000).toISOString() },
      { id: 'reward20', user_id: 'user5', report_id: null, points: 250, earnings: 0, weight: 3.2, type: 'volunteer_work', created_at: new Date(Date.now() - 21*24*60*60*1000).toISOString() },

      // User6 (David Kumar) rewards
      { id: 'reward21', user_id: 'user6', report_id: null, points: 160, earnings: 0, weight: 2.1, type: 'first_report', created_at: new Date(Date.now() - 6*24*60*60*1000).toISOString() },
      { id: 'reward22', user_id: 'user6', report_id: null, points: 200, earnings: 0, weight: 3.4, type: 'regular_contributor', created_at: new Date(Date.now() - 11*24*60*60*1000).toISOString() },
      { id: 'reward23', user_id: 'user6', report_id: null, points: 180, earnings: 0, weight: 2.6, type: 'location_scout', created_at: new Date(Date.now() - 15*24*60*60*1000).toISOString() },
      { id: 'reward24', user_id: 'user6', report_id: null, points: 180, earnings: 0, weight: 1.2, type: 'photo_documentation', created_at: new Date(Date.now() - 14*24*60*60*1000).toISOString() },

      // User7 (Rita Patel) rewards
      { id: 'reward25', user_id: 'user7', report_id: null, points: 420, earnings: 240, weight: 12.1, type: 'cleanup_completion', created_at: new Date(Date.now() - 1*24*60*60*1000).toISOString() },
      { id: 'reward26', user_id: 'user7', report_id: null, points: 380, earnings: 220, weight: 10.8, type: 'cleanup_completion', created_at: new Date(Date.now() - 8*24*60*60*1000).toISOString() },
      { id: 'reward27', user_id: 'user7', report_id: null, points: 450, earnings: 250, weight: 8.5, type: 'cleanup_completion', created_at: new Date(Date.now() - 15*24*60*60*1000).toISOString() },
      { id: 'reward28', user_id: 'user7', report_id: null, points: 430, earnings: 240, weight: 7.0, type: 'cleanup_completion', created_at: new Date(Date.now() - 22*24*60*60*1000).toISOString() },

      // User8 (Alex Thompson) rewards
      { id: 'reward29', user_id: 'user8', report_id: null, points: 280, earnings: 0, weight: 4.2, type: 'environmental_advocacy', created_at: new Date(Date.now() - 4*24*60*60*1000).toISOString() },
      { id: 'reward30', user_id: 'user8', report_id: null, points: 320, earnings: 0, weight: 5.8, type: 'social_media_awareness', created_at: new Date(Date.now() - 9*24*60*60*1000).toISOString() },
      { id: 'reward31', user_id: 'user8', report_id: null, points: 260, earnings: 0, weight: 3.7, type: 'community_workshop', created_at: new Date(Date.now() - 12*24*60*60*1000).toISOString() },
      { id: 'reward32', user_id: 'user8', report_id: null, points: 260, earnings: 0, weight: 3.2, type: 'cleanup_organizing', created_at: new Date(Date.now() - 11*24*60*60*1000).toISOString() },

      // User9 (Neha Singh) rewards
      { id: 'reward33', user_id: 'user9', report_id: null, points: 220, earnings: 120, weight: 7.8, type: 'cleanup_completion', created_at: new Date(Date.now() - 5*24*60*60*1000).toISOString() },
      { id: 'reward34', user_id: 'user9', report_id: null, points: 300, earnings: 150, weight: 9.2, type: 'cleanup_completion', created_at: new Date(Date.now() - 12*24*60*60*1000).toISOString() },
      { id: 'reward35', user_id: 'user9', report_id: null, points: 200, earnings: 100, weight: 6.8, type: 'cleanup_completion', created_at: new Date(Date.now() - 19*24*60*60*1000).toISOString() },
      { id: 'reward36', user_id: 'user9', report_id: null, points: 170, earnings: 50, weight: 4.8, type: 'cleanup_completion', created_at: new Date(Date.now() - 26*24*60*60*1000).toISOString() },

      // User10 (Ravi Gupta) rewards
      { id: 'reward37', user_id: 'user10', report_id: null, points: 140, earnings: 0, weight: 1.8, type: 'first_time_reporter', created_at: new Date(Date.now() - 2*24*60*60*1000).toISOString() },
      { id: 'reward38', user_id: 'user10', report_id: null, points: 180, earnings: 0, weight: 2.5, type: 'app_feedback', created_at: new Date(Date.now() - 6*24*60*60*1000).toISOString() },
      { id: 'reward39', user_id: 'user10', report_id: null, points: 120, earnings: 0, weight: 1.9, type: 'survey_participation', created_at: new Date(Date.now() - 8*24*60*60*1000).toISOString() },
      { id: 'reward40', user_id: 'user10', report_id: null, points: 140, earnings: 0, weight: 1.6, type: 'referral_bonus', created_at: new Date(Date.now() - 7*24*60*60*1000).toISOString() },

      // User11 (Maya Joshi) rewards
      { id: 'reward41', user_id: 'user11', report_id: null, points: 520, earnings: 320, weight: 15.8, type: 'cleanup_completion', created_at: new Date(Date.now() - 1*24*60*60*1000).toISOString() },
      { id: 'reward42', user_id: 'user11', report_id: null, points: 480, earnings: 280, weight: 14.2, type: 'cleanup_completion', created_at: new Date(Date.now() - 7*24*60*60*1000).toISOString() },
      { id: 'reward43', user_id: 'user11', report_id: null, points: 450, earnings: 250, weight: 12.5, type: 'cleanup_completion', created_at: new Date(Date.now() - 14*24*60*60*1000).toISOString() },
      { id: 'reward44', user_id: 'user11', report_id: null, points: 400, earnings: 250, weight: 9.8, type: 'cleanup_completion', created_at: new Date(Date.now() - 21*24*60*60*1000).toISOString() }
    ];
    saveToStorage(LOCAL_STORAGE_KEYS.REWARDS, sampleRewards);

    // Add sample community posts
    const samplePosts = [
      {
        id: 'post1',
        author_id: 'user3',
        content: 'Just organized an incredible cleanup drive in Central Park! We collected 15 bags of waste and transformed the area completely. The energy and dedication from our community was absolutely amazing. Thank you to everyone who participated! 🌱✨',
        type: 'cleanup',
        location: 'Central Park, Delhi',
        tags: ['cleanup-drive', 'community', 'success'],
        image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
        created_at: new Date(Date.now() - 2*60*60*1000).toISOString(), // 2 hours ago
        updated_at: new Date(Date.now() - 2*60*60*1000).toISOString()
      },
      {
        id: 'post2',
        author_id: 'user4',
        content: 'Exciting partnership announcement! We\'ve joined forces with the city government to launch the most comprehensive recycling initiative our community has ever seen. Starting next month, specialized collection points will be available in every neighborhood. This is going to be a game-changer! 🎉',
        type: 'announcement',
        location: '',
        tags: ['recycling', 'partnership', 'announcement'],
        image_url: null,
        created_at: new Date(Date.now() - 5*60*60*1000).toISOString(), // 5 hours ago
        updated_at: new Date(Date.now() - 5*60*60*1000).toISOString()
      },
      {
        id: 'post3',
        author_id: 'user1',
        content: 'Success story time! Remember that garbage pile I reported near the public library last week? I walked by today and it\'s completely gone! The cleanup crew did an amazing job. This platform really works when we all participate and stay engaged.',
        type: 'success',
        location: 'Public Library, Mumbai',
        tags: ['success-story', 'reporting', 'community-action'],
        image_url: null,
        created_at: new Date(Date.now() - 1*24*60*60*1000).toISOString(), // 1 day ago
        updated_at: new Date(Date.now() - 1*24*60*60*1000).toISOString()
      },
      {
        id: 'post4',
        author_id: 'user5',
        content: 'Join us for our monthly community meeting this Saturday at 10 AM! We\'ll be discussing upcoming environmental projects, reviewing community feedback, and planning new initiatives. Your voice matters - let\'s build a cleaner, greener future together! 📅',
        type: 'event',
        location: 'Community Hall, Ahmedabad',
        tags: ['community-meeting', 'event', 'collaboration'],
        image_url: null,
        created_at: new Date(Date.now() - 2*24*60*60*1000).toISOString(), // 2 days ago
        updated_at: new Date(Date.now() - 2*24*60*60*1000).toISOString()
      },
      {
        id: 'post5',
        author_id: 'user8',
        content: 'Amazing results from last weekend\'s beach cleanup! Our team of 25 volunteers collected over 200kg of plastic waste from the coastline. Special thanks to Maya and her team for organizing such an impactful event. Together we\'re making a real difference! 🌊',
        type: 'cleanup',
        location: 'Juhu Beach, Mumbai',
        tags: ['beach-cleanup', 'plastic-waste', 'volunteers'],
        image_url: 'https://images.unsplash.com/photo-1542435503-956c469947f6?w=600&h=400&fit=crop',
        created_at: new Date(Date.now() - 3*24*60*60*1000).toISOString(), // 3 days ago
        updated_at: new Date(Date.now() - 3*24*60*60*1000).toISOString()
      },
      {
        id: 'post6',
        author_id: 'user11',
        content: 'Proud to share that our neighborhood has achieved a 90% waste segregation rate! It took months of community education and collaboration, but we did it. When everyone works together, incredible things happen. Ready for the next challenge! 💪',
        type: 'success',
        location: 'Koregaon Park, Pune',
        tags: ['waste-segregation', 'community-achievement', 'teamwork'],
        image_url: null,
        created_at: new Date(Date.now() - 4*24*60*60*1000).toISOString(), // 4 days ago
        updated_at: new Date(Date.now() - 4*24*60*60*1000).toISOString()
      },
      {
        id: 'post7',
        author_id: 'user6',
        content: 'New composting workshop happening next Thursday at 6 PM! Learn how to turn your kitchen waste into nutrient-rich compost for your plants. Bringing sustainability right to your home. Limited seats available, register now! 🌱',
        type: 'event',
        location: 'Green Community Center, Chennai',
        tags: ['composting', 'workshop', 'sustainability'],
        image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop',
        created_at: new Date(Date.now() - 6*24*60*60*1000).toISOString(), // 6 days ago
        updated_at: new Date(Date.now() - 6*24*60*60*1000).toISOString()
      },
      {
        id: 'post8',
        author_id: 'user7',
        content: 'Big announcement! Starting next month, we\'re introducing a plastic bottle buyback program. Every bottle you bring in gets you points and helps fund more community projects. Turn your recycling into community investment! ♻️',
        type: 'announcement',
        location: '',
        tags: ['plastic-buyback', 'recycling-program', 'community-funding'],
        image_url: null,
        created_at: new Date(Date.now() - 7*24*60*60*1000).toISOString(), // 7 days ago
        updated_at: new Date(Date.now() - 7*24*60*60*1000).toISOString()
      }
    ];
    saveToStorage(LOCAL_STORAGE_KEYS.COMMUNITY_POSTS, samplePosts);

    // Add sample reactions
    const sampleReactions = [
      // Post 1 reactions
      { id: 'reaction1', post_id: 'post1', user_id: 'user1', type: 'like', created_at: new Date(Date.now() - 1*60*60*1000).toISOString() },
      { id: 'reaction2', post_id: 'post1', user_id: 'user2', type: 'clap', created_at: new Date(Date.now() - 1*60*60*1000).toISOString() },
      { id: 'reaction3', post_id: 'post1', user_id: 'user4', type: 'like', created_at: new Date(Date.now() - 90*60*1000).toISOString() },
      { id: 'reaction4', post_id: 'post1', user_id: 'user5', type: 'like', created_at: new Date(Date.now() - 80*60*1000).toISOString() },
      { id: 'reaction5', post_id: 'post1', user_id: 'user6', type: 'clap', created_at: new Date(Date.now() - 70*60*1000).toISOString() },
      
      // Post 2 reactions
      { id: 'reaction6', post_id: 'post2', user_id: 'user1', type: 'clap', created_at: new Date(Date.now() - 4*60*60*1000).toISOString() },
      { id: 'reaction7', post_id: 'post2', user_id: 'user3', type: 'like', created_at: new Date(Date.now() - 4*60*60*1000).toISOString() },
      { id: 'reaction8', post_id: 'post2', user_id: 'user5', type: 'save', created_at: new Date(Date.now() - 3*60*60*1000).toISOString() },
      { id: 'reaction9', post_id: 'post2', user_id: 'user7', type: 'like', created_at: new Date(Date.now() - 3*60*60*1000).toISOString() },
      
      // Post 3 reactions
      { id: 'reaction10', post_id: 'post3', user_id: 'user2', type: 'like', created_at: new Date(Date.now() - 22*60*60*1000).toISOString() },
      { id: 'reaction11', post_id: 'post3', user_id: 'user4', type: 'clap', created_at: new Date(Date.now() - 21*60*60*1000).toISOString() },
      { id: 'reaction12', post_id: 'post3', user_id: 'user6', type: 'like', created_at: new Date(Date.now() - 20*60*60*1000).toISOString() },
      
      // Post 4 reactions
      { id: 'reaction13', post_id: 'post4', user_id: 'user1', type: 'like', created_at: new Date(Date.now() - 40*60*60*1000).toISOString() },
      { id: 'reaction14', post_id: 'post4', user_id: 'user3', type: 'save', created_at: new Date(Date.now() - 39*60*60*1000).toISOString() },
      { id: 'reaction15', post_id: 'post4', user_id: 'user8', type: 'clap', created_at: new Date(Date.now() - 38*60*60*1000).toISOString() },
      
      // Post 5 reactions
      { id: 'reaction16', post_id: 'post5', user_id: 'user1', type: 'like', created_at: new Date(Date.now() - 60*60*60*1000).toISOString() },
      { id: 'reaction17', post_id: 'post5', user_id: 'user3', type: 'like', created_at: new Date(Date.now() - 59*60*60*1000).toISOString() },
      { id: 'reaction18', post_id: 'post5', user_id: 'user11', type: 'clap', created_at: new Date(Date.now() - 58*60*60*1000).toISOString() },
      { id: 'reaction19', post_id: 'post5', user_id: 'user10', type: 'like', created_at: new Date(Date.now() - 57*60*60*1000).toISOString() }
    ];
    saveToStorage(LOCAL_STORAGE_KEYS.POST_REACTIONS, sampleReactions);

    // Add sample comments
    const sampleComments = [
      { id: 'comment1', post_id: 'post1', user_id: 'user1', content: 'Amazing work! Wish I could have been there to help.', created_at: new Date(Date.now() - 1*60*60*1000).toISOString() },
      { id: 'comment2', post_id: 'post1', user_id: 'user2', content: 'This is exactly the kind of community action we need more of! 👏', created_at: new Date(Date.now() - 90*60*1000).toISOString() },
      { id: 'comment3', post_id: 'post2', user_id: 'user1', content: 'Finally! This recycling program is exactly what our city needed.', created_at: new Date(Date.now() - 4*60*60*1000).toISOString() },
      { id: 'comment4', post_id: 'post3', user_id: 'user4', content: 'That\'s the power of community reporting! Great job on following up.', created_at: new Date(Date.now() - 20*60*60*1000).toISOString() },
      { id: 'comment5', post_id: 'post5', user_id: 'user3', content: '200kg is incredible! Thank you for organizing this beach cleanup.', created_at: new Date(Date.now() - 58*60*60*1000).toISOString() }
    ];
    saveToStorage(LOCAL_STORAGE_KEYS.POST_COMMENTS, sampleComments);
  }

  // Initialize workers
  workerService.initializeWorkers();
};

// Worker Management Service
export const workerService = {
  async getWorkersByKiosk(kioskId) {
    const workers = getFromStorage(LOCAL_STORAGE_KEYS.WORKERS) || [];
    return workers.filter(worker => worker.kiosk_id === kioskId && worker.status !== 'inactive');
  },

  async addWorker(kioskId, workerData) {
    const workers = getFromStorage(LOCAL_STORAGE_KEYS.WORKERS) || [];
    const newWorker = {
      id: generateId(),
      kiosk_id: kioskId,
      ...workerData,
      status: 'active',
      created_at: new Date().toISOString(),
      total_tasks: 0,
      total_earnings: 0,
      rating: 5.0
    };
    workers.push(newWorker);
    saveToStorage(LOCAL_STORAGE_KEYS.WORKERS, workers);
    return newWorker;
  },

  async updateWorker(workerId, updates) {
    const workers = getFromStorage(LOCAL_STORAGE_KEYS.WORKERS) || [];
    const workerIndex = workers.findIndex(w => w.id === workerId);
    if (workerIndex !== -1) {
      workers[workerIndex] = { ...workers[workerIndex], ...updates, updated_at: new Date().toISOString() };
      saveToStorage(LOCAL_STORAGE_KEYS.WORKERS, workers);
      return workers[workerIndex];
    }
    throw new Error('Worker not found');
  },

  async getWorkerStats(workerId) {
    const tasks = getFromStorage(LOCAL_STORAGE_KEYS.TASKS) || [];
    const workerTasks = tasks.filter(task => task.assigned_worker_id === workerId);
    
    const completedTasks = workerTasks.filter(task => task.status === 'completed');
    const totalEarnings = completedTasks.reduce((sum, task) => sum + (task.reward || 0), 0);
    
    return {
      total_tasks: completedTasks.length,
      total_earnings: totalEarnings,
      pending_tasks: workerTasks.filter(task => task.status === 'assigned').length,
      in_progress_tasks: workerTasks.filter(task => task.status === 'in_progress').length
    };
  },

  async initializeWorkers() {
    // Force re-initialization for testing - remove this in production
    const sampleWorkers = [
      {
        id: 'worker1',
        kiosk_id: 'demo-ragpicker', // Raj Collector's kiosk
        name: 'Ravi Kumar',
        phone: '+91 98765-43210',
        email: 'ravi.kumar@cleansight.com',
        avatar: null,
        specialization: 'Plastic Waste',
        zone: 'Zone 1 - South Mumbai',
        status: 'active',
        rating: 4.8,
        total_tasks: 24,
        total_earnings: 1200,
        created_at: new Date(Date.now() - 30*24*60*60*1000).toISOString(),
        last_active: new Date(Date.now() - 2*60*60*1000).toISOString()
      },
      {
        id: 'worker2',
        kiosk_id: 'demo-ragpicker',
        name: 'Priya Sharma',
        phone: '+91 87654-32109',
        email: 'priya.sharma@cleansight.com',
        avatar: null,
        specialization: 'Organic Waste',
        zone: 'Zone 1 - South Mumbai',
        status: 'active',
        rating: 4.9,
        total_tasks: 31,
        total_earnings: 1550,
        created_at: new Date(Date.now() - 45*24*60*60*1000).toISOString(),
        last_active: new Date(Date.now() - 1*60*60*1000).toISOString()
      },
      {
        id: 'worker3',
        kiosk_id: 'demo-ragpicker',
        name: 'Amit Singh',
        phone: '+91 76543-21098',
        email: 'amit.singh@cleansight.com',
        avatar: null,
        specialization: 'Electronic Waste',
        zone: 'Zone 1 - South Mumbai',
        status: 'active',
        rating: 4.7,
        total_tasks: 18,
        total_earnings: 900,
        created_at: new Date(Date.now() - 20*24*60*60*1000).toISOString(),
        last_active: new Date(Date.now() - 30*60*1000).toISOString()
      },
      {
        id: 'worker4',
        kiosk_id: 'demo-ragpicker',
        name: 'Sunita Devi',
        phone: '+91 65432-10987',
        email: 'sunita.devi@cleansight.com',
        avatar: null,
        specialization: 'Mixed Waste',
        zone: 'Zone 1 - South Mumbai',
        status: 'active',
        rating: 4.6,
        total_tasks: 15,
        total_earnings: 750,
        created_at: new Date(Date.now() - 15*24*60*60*1000).toISOString(),
        last_active: new Date(Date.now() - 4*60*60*1000).toISOString()
      },
      {
        id: 'worker5',
        kiosk_id: 'demo-ragpicker',
        name: 'Mohan Lal',
        phone: '+91 54321-09876',
        email: 'mohan.lal@cleansight.com',
        avatar: null,
        specialization: 'Construction Waste',
        zone: 'Zone 1 - South Mumbai',
        status: 'busy',
        rating: 4.5,
        total_tasks: 12,
        total_earnings: 600,
        created_at: new Date(Date.now() - 10*24*60*60*1000).toISOString(),
        last_active: new Date(Date.now() - 15*60*1000).toISOString()
      }
    ];
    saveToStorage(LOCAL_STORAGE_KEYS.WORKERS, sampleWorkers);
  }
};
