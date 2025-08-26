import React, { useState } from 'react';
import { WorkOrder, WorkOrderStatus, Employee, UserRole } from '../types';
import ServerIcon from './icons/ServerIcon';
import UserGroupIcon from './icons/UserGroupIcon';
import AssignmentModal from './AssignmentModal';

interface DashboardProps {
  workOrders: WorkOrder[];
  onSelectOrder: (order: WorkOrder) => void;
  userRole: UserRole;
  currentUser: Employee;
  allEmployees: Employee[];
  onAssign: (orderId: string, assignedEmployees: Employee[]) => void;
}

const getStatusClass = (status: WorkOrderStatus) => {
  switch (status) {
    case WorkOrderStatus.PENDING:
      return 'bg-yellow-500/20 text-yellow-300 border-yellow-500';
    case WorkOrderStatus.IN_PROGRESS:
      return 'bg-blue-500/20 text-blue-300 border-blue-500';
    case WorkOrderStatus.COMPLETED:
      return 'bg-green-500/20 text-green-300 border-green-500';
    case WorkOrderStatus.ERROR:
      return 'bg-red-500/20 text-red-300 border-red-500';
    default:
      return 'bg-gray-500/20 text-gray-300 border-gray-500';
  }
};

const AssignedTo: React.FC<{ employees: Employee[] }> = ({ employees }) => {
    if (employees.length === 0) {
        return <span className="text-sm text-gray-500">未分配</span>;
    }
    return (
        <div className="flex items-center space-x-2">
            <UserGroupIcon className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">{employees.map(e => e.name).join(', ')}</span>
        </div>
    );
};

const WorkOrderCard: React.FC<{ 
    order: WorkOrder; 
    onSelect: () => void;
    onAssignClick: () => void;
    userRole: UserRole;
}> = ({ order, onSelect, onAssignClick, userRole }) => {
    const mainDevice = order.devices[0];

    return (
        <div className="bg-gray-800 rounded-lg mb-3 shadow-lg border border-gray-700 flex flex-col justify-between">
            <div onClick={onSelect} className="cursor-pointer hover:bg-gray-700/50 -m-4 p-4 rounded-t-lg transition-colors">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-100 mb-2 w-2/3">{order.title}</h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full border ${getStatusClass(order.status)}`}>
                        {order.status}
                    </span>
                </div>
                <div className="flex items-center text-sm text-gray-400 mb-3">
                    <ServerIcon className="w-4 h-4 mr-2" />
                    <span>{order.type}</span>
                    {mainDevice && (
                        <>
                           <span className="mx-2">|</span>
                           <span className="truncate">{mainDevice.model}</span>
                           {order.devices.length > 1 && (
                            <span className="ml-2 text-xs bg-gray-600 text-gray-300 px-1.5 py-0.5 rounded-full">
                                +{order.devices.length - 1}
                            </span>
                           )}
                        </>
                    )}
                </div>
                 <AssignedTo employees={order.assignedTo} />
            </div>
            {userRole === UserRole.TEAM_LEAD && (
                <div className="border-t border-gray-700/60 mt-4 pt-3 flex justify-end">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onAssignClick(); }}
                        className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-4 rounded-md transition-colors"
                    >
                        {order.assignedTo.length > 0 ? '修改分配' : '分配工单'}
                    </button>
                </div>
            )}
        </div>
    );
};


const Dashboard: React.FC<DashboardProps> = ({ workOrders, onSelectOrder, userRole, currentUser, allEmployees, onAssign }) => {
  const [orderToAssign, setOrderToAssign] = useState<WorkOrder | null>(null);

  const handleAssignClick = (order: WorkOrder) => {
      setOrderToAssign(order);
  }

  const handleCloseModal = () => {
      setOrderToAssign(null);
  }

  const handleSaveAssignment = (orderId: string, assignedEmployees: Employee[]) => {
      onAssign(orderId, assignedEmployees);
      handleCloseModal();
  }

  const headerText = userRole === UserRole.TEAM_LEAD 
    ? "管理所有工单"
    : `你好, ${currentUser.name} - 你的任务`;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <header className="text-center my-6">
        <h1 className="text-3xl font-bold text-gray-100">IDC 运维工单系统</h1>
        <p className="text-gray-400">{headerText}</p>
      </header>
      <div>
        {workOrders.length > 0 ? workOrders.map(order => (
          <WorkOrderCard 
            key={order.id} 
            order={order} 
            userRole={userRole}
            onSelect={() => onSelectOrder(order)} 
            onAssignClick={() => handleAssignClick(order)}
          />
        )) : (
            <div className="text-center text-gray-500 mt-10 p-6 bg-gray-800/50 rounded-lg border border-dashed border-gray-700">
                <p>暂无工单</p>
            </div>
        )}
      </div>
      {orderToAssign && (
        <AssignmentModal 
            order={orderToAssign}
            allEmployees={allEmployees}
            onClose={handleCloseModal}
            onSave={handleSaveAssignment}
        />
      )}
    </div>
  );
};

export default Dashboard;
