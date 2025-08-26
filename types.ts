
export enum WorkOrderStatus {
  PENDING = '待分配',
  IN_PROGRESS = '进行中',
  COMPLETED = '已完成',
  ERROR = '异常',
}

export enum WorkOrderType {
  SERVER_RECONFIG = '服务器改配',
  SERVER_RACKING = '服务器上架',
  SWITCH_FAULT = '交换机故障',
}

export interface Employee {
  id: string;
  name: string;
}

export interface Part {
  id: string;
  type: string;
  model: string;
  location: string; // Storage box number
}

export interface ServerConfig {
  cpus: string[];
  memory: string[];
  disks: string[];
  nics: string[];
}

export interface Device {
  model: string;
  sn: string;
  location: {
    module: string;
    rack: string;
    u: number;
  };
}

export interface WorkOrder {
  id: string;
  title: string;
  type: WorkOrderType;
  status: WorkOrderStatus;
  devices: Device[];
  assignedTo: Employee[];
  currentConfig: ServerConfig;
  requiredConfig: ServerConfig;
  requiredParts: {
    part: Part;
    quantity: number;
  }[];
}

export enum UserRole {
    TEAM_LEAD = '组长',
    EMPLOYEE = '员工',
}
