import React from 'react';
import { UserRole } from '../types';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentRole, onRoleChange }) => {
  return (
    <div className="bg-gray-800 p-2 rounded-lg flex items-center justify-center space-x-2 fixed bottom-4 right-4 z-50 shadow-lg border border-gray-700">
      <span className="text-sm font-semibold text-gray-300 mr-2">视图切换:</span>
      <button
        onClick={() => onRoleChange(UserRole.TEAM_LEAD)}
        className={`px-3 py-1 text-sm rounded-md transition-colors ${currentRole === UserRole.TEAM_LEAD ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
      >
        {UserRole.TEAM_LEAD}
      </button>
      <button
        onClick={() => onRoleChange(UserRole.EMPLOYEE)}
        className={`px-3 py-1 text-sm rounded-md transition-colors ${currentRole === UserRole.EMPLOYEE ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
      >
        {UserRole.EMPLOYEE}
      </button>
    </div>
  );
};

export default RoleSwitcher;
