import React, { useState, useMemo } from 'react';
import { WorkOrder, UserRole, Employee, WorkOrderStatus } from './types';
import { mockWorkOrders, mockEmployees } from './data/mockData';
import Dashboard from './components/Dashboard';
import WorkOrderDetail from './components/WorkOrderDetail';
import RoleSwitcher from './components/RoleSwitcher';

const App: React.FC = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(mockWorkOrders);
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.TEAM_LEAD);

  // Simulate the currently logged-in employee. For the demo, we'll use the second one (李静).
  const currentUser: Employee = mockEmployees[1]; 

  const handleSelectOrder = (order: WorkOrder) => {
    setSelectedOrder(order);
  };

  const handleGoBack = () => {
    setSelectedOrder(null);
  };

  const handleUpdateOrder = (updatedOrder: WorkOrder) => {
    setWorkOrders(prevOrders =>
      prevOrders.map(o => o.id === updatedOrder.id ? updatedOrder : o)
    );
  };

  const handleAssignOrder = (orderId: string, assignedEmployees: Employee[]) => {
      const orderToUpdate = workOrders.find(o => o.id === orderId);
      if (!orderToUpdate) return;

      const updatedOrder: WorkOrder = {
          ...orderToUpdate,
          assignedTo: assignedEmployees,
          // If assigned, status becomes 'In Progress', if unassigned, it's 'Pending'
          status: assignedEmployees.length > 0 ? WorkOrderStatus.IN_PROGRESS : WorkOrderStatus.PENDING,
      };
      handleUpdateOrder(updatedOrder);
  };

  const visibleWorkOrders = useMemo(() => {
    if (userRole === UserRole.TEAM_LEAD) {
      return workOrders;
    }
    // Employee view: show orders assigned to them
    return workOrders.filter(order =>
      order.assignedTo.some(employee => employee.id === currentUser.id)
    );
  }, [workOrders, userRole, currentUser.id]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <main className="pb-24">
        {selectedOrder ? (
          <WorkOrderDetail
            order={selectedOrder}
            onGoBack={handleGoBack}
            onUpdateOrder={handleUpdateOrder}
          />
        ) : (
          <Dashboard
            workOrders={visibleWorkOrders}
            onSelectOrder={handleSelectOrder}
            userRole={userRole}
            currentUser={currentUser}
            allEmployees={mockEmployees}
            onAssign={handleAssignOrder}
          />
        )}
      </main>
      <RoleSwitcher currentRole={userRole} onRoleChange={setUserRole} />
    </div>
  );
};

export default App;
