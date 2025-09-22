
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Customer, Task, VisitHistory, Product, AppSettings, AppToast } from '../types';

// LOCAL STORAGE HOOK
function useLocalStorage<T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

// APP CONTEXT
interface AppContextType {
  customers: Customer[];
  tasks: Task[];
  visitHistory: VisitHistory[];
  products: Product[];
  settings: AppSettings;
  toasts: AppToast[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  updateCustomer: (customer: Customer) => void;
  getCustomerById: (id: string) => Customer | undefined;
  getVisitHistoryForCustomer: (customerId: string) => VisitHistory[];
  addTask: (task: Omit<Task, 'id' | 'isComplete'>) => void;
  updateTask: (task: Task) => void;
  getTaskById: (id: string) => Task | undefined;
  deleteTask: (taskId: string) => void;
  toggleTaskComplete: (taskId: string) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  addProduct: (product: Product) => void;
  removeProduct: (product: Product) => void;
  deleteAllData: () => void;
  addToast: (message: string, type?: 'success' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [customers, setCustomers] = useLocalStorage<Customer[]>('customers', []);
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [visitHistory, setVisitHistory] = useLocalStorage<VisitHistory[]>('visitHistory', []);
  const [products, setProducts] = useLocalStorage<Product[]>('products', ['Product A', 'Product B']);
  const [settings, setSettings] = useLocalStorage<AppSettings>('settings', { userName: 'Salesperson', defaultReminderTime: '09:00' });
  const [toasts, setToasts] = useState<AppToast[]>([]);

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => setToasts(toasts => toasts.slice(1)), 3000);
      return () => clearTimeout(timer);
    }
  }, [toasts]);
  
  const addToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToasts(prev => [...prev, { id: Date.now(), message, type }]);
  };
  
  const addVisitHistoryEntry = (customer: Customer) => {
    const newHistory: VisitHistory = {
      id: `vh_${Date.now()}`,
      customerId: customer.id,
      visitDate: new Date().toISOString(),
      remark: customer.remark,
      customerName: customer.customerName,
      mobileNumber: customer.mobileNumber,
    };
    setVisitHistory(prev => [newHistory, ...prev]);
  };

  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: `cust_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setCustomers(prev => [newCustomer, ...prev]);
    addVisitHistoryEntry(newCustomer);
    console.log(`Notification scheduled for ${newCustomer.customerName} on ${newCustomer.nextVisitDate} at ${newCustomer.nextVisitTime}`);
  };

  const updateCustomer = (updatedCustomer: Customer) => {
    setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
    addVisitHistoryEntry(updatedCustomer);
    console.log(`Notification updated for ${updatedCustomer.customerName} on ${updatedCustomer.nextVisitDate} at ${updatedCustomer.nextVisitTime}`);
  };

  const getCustomerById = (id: string) => customers.find(c => c.id === id);

  const getVisitHistoryForCustomer = (customerId: string) => visitHistory.filter(vh => vh.customerId === customerId);

  const addTask = (taskData: Omit<Task, 'id' | 'isComplete'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task_${Date.now()}`,
      isComplete: false,
    };
    setTasks(prev => [newTask, ...prev]);
    if (taskData.setReminder) {
      console.log(`Reminder set for task "${taskData.taskTitle}" on ${new Date(taskData.dateTime).toLocaleString()}`);
    }
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };
  
  const getTaskById = (id: string) => tasks.find(t => t.id === id);

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  }

  const toggleTaskComplete = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isComplete: !t.isComplete } : t));
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({...prev, ...newSettings}));
  };

  const addProduct = (product: Product) => {
    if (!products.includes(product) && product.trim() !== '') {
      setProducts(prev => [...prev, product.trim()]);
    }
  };

  const removeProduct = (productToRemove: Product) => {
    setProducts(prev => prev.filter(p => p !== productToRemove));
  };

  const deleteAllData = () => {
    setCustomers([]);
    setTasks([]);
    setVisitHistory([]);
  };

  const value = {
    customers, tasks, visitHistory, products, settings, toasts,
    addCustomer, updateCustomer, getCustomerById, getVisitHistoryForCustomer,
    addTask, updateTask, getTaskById, deleteTask, toggleTaskComplete,
    updateSettings, addProduct, removeProduct, deleteAllData, addToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
