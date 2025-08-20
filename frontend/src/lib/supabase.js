import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});


// Database table names
export const TABLES = {
  USERS: 'users',
  REPORTS: 'reports',
  TASKS: 'tasks',
  ZONES: 'zones',
  REWARDS: 'rewards',
  NOTIFICATIONS: 'notifications',
  LEADERBOARD: 'leaderboard'
};

// Storage bucket names
export const BUCKETS = {
  REPORT_IMAGES: 'report-images',
  PROFILE_IMAGES: 'profile-images',
  CLEANUP_IMAGES: 'cleanup-images'
};

// Zone/Area definitions for garbage collection
export const ZONES = {
  'zone-1': {
    id: 'zone-1',
    name: 'Sector 14-15 (Gurugram)',
    bounds: {
      north: 28.4595,
      south: 28.4495,
      east: 77.0466,
      west: 77.0366
    },
    ragpickers: []
  },
  'zone-2': {
    id: 'zone-2',
    name: 'Cyber Hub Area',
    bounds: {
      north: 28.4950,
      south: 28.4850,
      east: 77.0900,
      west: 77.0800
    },
    ragpickers: []
  },
  'zone-3': {
    id: 'zone-3',
    name: 'Golf Course Road',
    bounds: {
      north: 28.4700,
      south: 28.4600,
      east: 77.0700,
      west: 77.0600
    },
    ragpickers: []
  },
  'zone-4': {
    id: 'zone-4',
    name: 'Sohna Road',
    bounds: {
      north: 28.4300,
      south: 28.4200,
      east: 77.0500,
      west: 77.0400
    },
    ragpickers: []
  }
};

// Helper function to determine zone from coordinates
export const getZoneFromCoordinates = (lat, lng) => {
  for (const [zoneId, zone] of Object.entries(ZONES)) {
    if (
      lat <= zone.bounds.north &&
      lat >= zone.bounds.south &&
      lng <= zone.bounds.east &&
      lng >= zone.bounds.west
    ) {
      return zoneId;
    }
  }
  return 'zone-1'; // Default zone
};

// Real-time subscriptions
export const subscribeToReports = (zoneId, callback) => {
  return supabase
    .channel(`reports-${zoneId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: TABLES.REPORTS,
        filter: `zone_id=eq.${zoneId}`
      },
      callback
    )
    .subscribe();
};

export const subscribeToTasks = (ragpickerId, callback) => {
  return supabase
    .channel(`tasks-${ragpickerId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: TABLES.TASKS,
        filter: `assigned_to=eq.${ragpickerId}`
      },
      callback
    )
    .subscribe();
};

// File upload helpers
export const uploadImage = async (bucket, fileName, file) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);
  
  if (error) throw error;
  return data;
};

export const getImageUrl = (bucket, fileName) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);
  return data.publicUrl;
};
