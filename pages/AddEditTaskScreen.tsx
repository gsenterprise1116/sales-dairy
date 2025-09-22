import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAppContext } from '../hooks/useAppContext';
import { Button, Input, Select, TextArea } from '../components/ui';
import { Task, TaskPriority } from '../types';

const AddEditTaskScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addTask, updateTask, getTaskById, addToast } = useAppContext();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState<Omit<Task, 'id' | 'isComplete'>>({
    taskTitle: '',
    description: '',
    dateTime: '',
    priority: 'Medium',
    setReminder: true,
  });

  useEffect(() => {
    if (isEditMode && id) {
      const task = getTaskById(id);
      if (task) {
        setFormData({
            ...task,
            dateTime: task.dateTime ? new Date(task.dateTime).toISOString().slice(0, 16) : ''
        });
      } else {
        addToast('Task not found', 'error');
        navigate('/tasks');
      }
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditMode, navigate]);
  
  // FIX: Replaced handleChange to correctly handle type checking for checkbox inputs.
  // The previous implementation had a type narrowing issue with destructuring.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    const name = target.name;

    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
        setFormData(prev => ({ ...prev, [name]: target.checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: target.value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.taskTitle) {
      addToast('Task Title is required.', 'error');
      return;
    }
    
    const taskData = { ...formData, dateTime: new Date(formData.dateTime).toISOString() };

    if (isEditMode && id) {
      const existingTask = getTaskById(id)!;
      updateTask({ ...existingTask, ...taskData });
      addToast('Task updated!');
    } else {
      addTask(taskData);
      addToast('Task saved!');
    }
    navigate('/tasks');
  };

  return (
    <Layout title={isEditMode ? "Edit Task" : "Add New Task"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-text-secondary">Task Title *</label>
          <Input name="taskTitle" value={formData.taskTitle} onChange={handleChange} required />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-text-secondary">Description</label>
          <TextArea name="description" value={formData.description} onChange={handleChange} rows={4} />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-text-secondary">Date & Time</label>
          <Input type="datetime-local" name="dateTime" value={formData.dateTime} onChange={handleChange} />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-text-secondary">Priority</label>
          <Select name="priority" value={formData.priority} onChange={handleChange}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </Select>
        </div>
        <div className="flex items-center justify-between bg-tertiary p-3 rounded-lg">
          <label htmlFor="setReminder" className="font-medium text-text-primary">Set Reminder</label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" id="setReminder" name="setReminder" checked={formData.setReminder} onChange={handleChange} className="sr-only peer" />
            <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-accent peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
          </label>
        </div>
        <div className="pt-4">
          <Button type="submit">{isEditMode ? "Update Task" : "Save Task"}</Button>
        </div>
      </form>
    </Layout>
  );
};

export default AddEditTaskScreen;
