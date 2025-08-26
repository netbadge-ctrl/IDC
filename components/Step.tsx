
import React, { useState } from 'react';
// FIX: Use default import for ChevronDownIcon as it's a default export.
import ChevronDownIcon from './icons/ChevronDownIcon';
// FIX: Use default import for CheckIcon as it's a default export.
import CheckIcon from './icons/CheckIcon';

interface StepProps {
  stepNumber: number;
  title: string;
  isCompleted: boolean;
  isLocked: boolean;
  children: React.ReactNode;
}

const Step: React.FC<StepProps> = ({ stepNumber, title, isCompleted, isLocked, children }) => {
  const [isOpen, setIsOpen] = useState(!isLocked && !isCompleted);

  const handleToggle = () => {
    if (!isLocked) {
      setIsOpen(!isOpen);
    }
  };

  const headerColor = isCompleted
    ? 'bg-green-800/50'
    : isLocked
    ? 'bg-gray-700/50'
    : 'bg-blue-800/50';

  const headerTextColor = isLocked ? 'text-gray-500' : 'text-gray-100';

  return (
    <div className="border border-gray-700 rounded-lg mb-3 overflow-hidden">
      <button
        onClick={handleToggle}
        disabled={isLocked}
        className={`w-full flex justify-between items-center p-4 text-left transition-colors ${headerColor} ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-gray-600/50'}`}
      >
        <div className="flex items-center">
          {isCompleted ? (
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mr-3">
              <CheckIcon className="w-4 h-4 text-white" />
            </div>
          ) : (
            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${isLocked ? 'bg-gray-600' : 'bg-blue-600'}`}>
              <span className="text-sm font-bold text-white">{stepNumber}</span>
            </div>
          )}
          <h3 className={`text-lg font-semibold ${headerTextColor}`}>{title}</h3>
        </div>
        {!isLocked && (
            <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>
      {isOpen && !isLocked && (
        <div className="p-4 bg-gray-800/50 border-t border-gray-700">
          {children}
        </div>
      )}
    </div>
  );
};

export default Step;
