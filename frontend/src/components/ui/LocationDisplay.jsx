import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

export const LocationDisplay = ({ user, className = "" }) => {
  if (!user || !user.zone) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <MapPin className="h-4 w-4 text-blue-600" />
      <div className="flex items-center gap-1 text-sm flex-wrap">
        <span className="text-gray-600">Zone:</span>
        <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
          {user.zone}
        </Badge>
        <span className="text-gray-500">•</span>
        <span className="text-gray-600">{user.city}, {user.state}</span>
      </div>
    </div>
  );
};

export default LocationDisplay;
