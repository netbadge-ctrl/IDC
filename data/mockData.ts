
import { WorkOrder, Employee, WorkOrderStatus, WorkOrderType } from '../types';

export const mockEmployees: Employee[] = [
  { id: 'emp-001', name: '张伟' },
  { id: 'emp-002', name: '李静' },
  { id: 'emp-003', name: '王磊' },
  { id: 'emp-004', name: '刘芳' },
];

export const mockWorkOrders: WorkOrder[] = [
  {
    id: 'WO-20240701-001',
    title: 'A03-R22-U05 服务器内存升级',
    type: WorkOrderType.SERVER_RECONFIG,
    status: WorkOrderStatus.PENDING,
    devices: [{
      model: 'Dell PowerEdge R740',
      sn: 'SN9ABCDEF123',
      location: {
        module: 'A03',
        rack: 'R22',
        u: 5,
      },
    }],
    assignedTo: [],
    currentConfig: {
      cpus: ['2 x Intel Xeon Gold 6248R'],
      memory: ['128GB (8 x 16GB) DDR4'],
      disks: ['2 x 480GB SSD SATA', '4 x 1.2TB SAS 10K'],
      nics: ['2 x 10GbE SFP+', '2 x 1GbE RJ45'],
    },
    requiredConfig: {
      cpus: ['2 x Intel Xeon Gold 6248R'],
      memory: ['256GB (16 x 16GB) DDR4'],
      disks: ['2 x 480GB SSD SATA', '4 x 1.2TB SAS 10K'],
      nics: ['2 x 10GbE SFP+', '2 x 1GbE RJ45'],
    },
    requiredParts: [
      {
        part: { id: 'MEM-DDR4-16G', type: '内存', model: '16GB DDR4 2933MHz', location: 'B-05-3' },
        quantity: 8,
      },
    ],
  },
  {
    id: 'WO-20240701-002',
    title: 'C11-R09-U12 交换机故障排查',
    type: WorkOrderType.SWITCH_FAULT,
    status: WorkOrderStatus.IN_PROGRESS,
    devices: [{
      model: 'Cisco Nexus 93180YC-EX',
      sn: 'SNX9ZYXWV456',
      location: {
        module: 'C11',
        rack: 'R09',
        u: 12,
      },
    }],
    assignedTo: [mockEmployees[0], mockEmployees[2]],
    currentConfig: { cpus: [], memory: [], disks: [], nics: [] },
    requiredConfig: { cpus: [], memory: [], disks: [], nics: [] },
    requiredParts: [],
  },
  {
    id: 'WO-20240630-005',
    title: 'B07-R15-U20-22 新服务器上架',
    type: WorkOrderType.SERVER_RACKING,
    status: WorkOrderStatus.COMPLETED,
    devices: [{
      model: 'HPE ProLiant DL380 Gen10',
      sn: 'SNHP7GHIJKL789',
      location: {
        module: 'B07',
        rack: 'R15',
        u: 20,
      },
    }],
    assignedTo: [mockEmployees[1]],
    currentConfig: { cpus: [], memory: [], disks: [], nics: [] },
    requiredConfig: {
        cpus: ['2 x Intel Xeon Silver 4210'],
        memory: ['64GB (4 x 16GB) DDR4'],
        disks: ['2 x 960GB SSD NVMe'],
        nics: ['4 x 10GbE SFP+'],
    },
    requiredParts: [],
  },
];
