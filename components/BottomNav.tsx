
import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, CustomersIcon, TasksIcon, SettingsIcon, NotificationsIcon } from './Icons';

const navItems = [
  { path: '/home', label: 'Home', icon: <HomeIcon /> },
  { path: '/customers', label: 'Customers', icon: <CustomersIcon /> },
  { path: '/tasks', label: 'To-Do', icon: <TasksIcon /> },
  { path: '/notifications', label: 'Schedule', icon: <NotificationsIcon /> },
  { path: '/settings', label: 'Settings', icon: <SettingsIcon /> },
];

const BottomNav = () => {
  const activeLinkClass = 'text-accent';
  const inactiveLinkClass = 'text-text-secondary hover:text-accent';

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-secondary border-t border-tertiary shadow-lg z-20">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex flex-col items-center justify-center space-y-1 transition-colors duration-200 ${isActive ? activeLinkClass : inactiveLinkClass}`
            }
          >
            {item.icon}
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
