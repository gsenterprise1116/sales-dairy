
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './hooks/useAppContext';

import HomeScreen from './pages/HomeScreen';
import CustomersScreen from './pages/CustomersScreen';
import AddEditCustomerScreen from './pages/AddEditCustomerScreen';
import CustomerDetailScreen from './pages/CustomerDetailScreen';
import TodoListScreen from './pages/TodoListScreen';
import AddEditTaskScreen from './pages/AddEditTaskScreen';
import SettingsScreen from './pages/SettingsScreen';
import NotificationsScreen from './pages/NotificationsScreen';

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <div className="max-w-md mx-auto h-screen flex flex-col">
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<HomeScreen />} />
            <Route path="/customers" element={<CustomersScreen />} />
            <Route path="/customer/add" element={<AddEditCustomerScreen />} />
            <Route path="/customer/edit/:id" element={<AddEditCustomerScreen />} />
            <Route path="/customer/detail/:id" element={<CustomerDetailScreen />} />
            <Route path="/tasks" element={<TodoListScreen />} />
            <Route path="/task/add" element={<AddEditTaskScreen />} />
            <Route path="/task/edit/:id" element={<AddEditTaskScreen />} />
            <Route path="/notifications" element={<NotificationsScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
          </Routes>
        </div>
      </HashRouter>
    </AppProvider>
  );
}

export default App;
