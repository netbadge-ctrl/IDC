
import React, { useState, useEffect } from 'react';
import { WorkOrder, Employee } from '../types';

interface AssignmentModalProps {
  order: WorkOrder;
  allEmployees: Employee[];
  onSave: (orderId: string, assignedEmployees: Employee[]) => void;
  onClose: () => void;
}

const AssignmentModal: React.FC<AssignmentModalProps> = ({ order, allEmployees, onSave, onClose }) => {
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSelectedEmployeeIds(new Set(order.assignedTo.map(e => e.id)));
  }, [order]);

  const handleCheckboxChange = (employeeId: string) => {
    const newSelection = new Set(selectedEmployeeIds);
    if (newSelection.has(employeeId)) {
      newSelection.delete(employeeId);
    } else {
      newSelection.add(employeeId);
    }
    setSelectedEmployeeIds(newSelection);
  };

  const handleSave = () => {
    const assignedEmployees = allEmployees.filter(e => selectedEmployeeIds.has(e.id));
    onSave(order.id, assignedEmployees);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-5 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">分配工单</h2>
          <p className="text-sm text-gray-400 truncate">{order.title}</p>
        </div>
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          <h3 className="font-semibold text-gray-300 mb-3">选择员工</h3>
          <div className="space-y-3">
            {allEmployees.map(employee => (
              <label key={employee.id} className="flex items-center p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded bg-gray-900 border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800"
                  checked={selectedEmployeeIds.has(employee.id)}
                  onChange={() => handleCheckboxChange(employee.id)}
                />
                <span className="ml-3 text-gray-200">{employee.name}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="p-5 flex justify-end space-x-3 bg-gray-800 border-t border-gray-700 rounded-b-lg">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-600 text-gray-200 hover:bg-gray-500 font-semibold">
            取消
          </button>
          <button onClick={handleSave} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 font-semibold">
            保存分配
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentModal;
