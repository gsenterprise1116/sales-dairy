
export type CustomerType = 'ETB' | 'NTB';
export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface Customer {
  id: string;
  customerName: string;
  mobileNumber: string;
  referenceBy: string;
  product: string;
  customerType: CustomerType;
  remark: string;
  nextVisitDate: string; // YYYY-MM-DD
  nextVisitTime: string; // HH:mm
  createdAt: string; // ISO string
}

export interface VisitHistory {
  id: string;
  customerId: string;
  visitDate: string; // ISO string
  remark: string;
  customerName: string;
  mobileNumber: string;
}

export interface Task {
  id: string;
  taskTitle: string;
  description: string;
  dateTime: string; // ISO string
  priority: TaskPriority;
  isComplete: boolean;
  setReminder: boolean;
}

export type Product = string;

export interface AppSettings {
  userName: string;
  defaultReminderTime: string; // HH:mm
}

export interface AppToast {
  id: number;
  message: string;
  type: 'success' | 'error';
}
