import React from 'react';
import { Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const DemoModeBanner = () => {
  const { demoMode } = useAuth();

  if (!demoMode) return null;

  return (
    <div className="mb-4 border border-blue-200 bg-blue-50 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-blue-800 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span>
              <strong>Demo Mode:</strong> You're viewing CleanSight with sample data. 
              To get full functionality with real-time sync, set up Supabase.
            </span>
            <div className="flex gap-2 text-sm">
              <span>Demo Login:</span>
              <code className="text-xs bg-blue-100 px-1 rounded">citizen@demo.com</code>
              <code className="text-xs bg-blue-100 px-1 rounded">demo123</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoModeBanner;
