import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAppContext } from '../hooks/useAppContext';
import { Card, FAB } from '../components/ui';
import { Task } from '../types';
import { EditIcon, TrashIcon, PlusIcon } from '../components/Icons';

const TaskItem = ({ task, onEdit, onDelete }: { task: Task, onEdit: (id: string) => void, onDelete: (id: string) => void }) => {
    const { toggleTaskComplete } = useAppContext();
    
    const priorityColors = {
        High: 'border-l-4 border-red-500',
        Medium: 'border-l-4 border-yellow-500',
        Low: 'border-l-4 border-sky-500',
    }

    return (
        <Card className={`flex items-center gap-4 ${priorityColors[task.priority]}`}>
            <input 
                type="checkbox" 
                checked={task.isComplete}
                onChange={() => toggleTaskComplete(task.id)}
                className="w-6 h-6 rounded-full text-accent bg-tertiary border-slate-600 focus:ring-accent flex-shrink-0"
            />
            <div className="flex-grow cursor-pointer" onClick={() => onEdit(task.id)}>
                <p className={`font-bold ${task.isComplete ? 'line-through text-text-secondary' : 'text-text-primary'}`}>{task.taskTitle}</p>
                <p className="text-sm text-text-secondary">{new Date(task.dateTime).toLocaleString()}</p>
            </div>
            <div className="flex gap-2">
                <button onClick={() => onEdit(task.id)} className="text-text-secondary hover:text-accent"><EditIcon /></button>
                <button onClick={() => onDelete(task.id)} className="text-text-secondary hover:text-red-500"><TrashIcon /></button>
            </div>
        </Card>
    )
}

const TaskListSection = ({ title, tasks, onEdit, onDelete }: { title: string, tasks: Task[], onEdit: (id: string) => void, onDelete: (id: string) => void }) => {
    if (tasks.length === 0) return null;
    return (
        <div>
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            <div className="space-y-3">
                {tasks.sort((a,b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()).map(task => 
                    <TaskItem key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
                )}
            </div>
        </div>
    );
};

const TodoListScreen = () => {
  const navigate = useNavigate();
  const { tasks, deleteTask, addToast } = useAppContext();

  const handleEdit = (id: string) => navigate(`/task/edit/${id}`);

  const handleDelete = (id: string) => {
      if (window.confirm("Are you sure you want to delete this task?")) {
          deleteTask(id);
          addToast("Task deleted", "success");
      }
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const pendingTasks = tasks.filter(t => !t.isComplete);
  const completedTasks = tasks.filter(t => t.isComplete);

  const overdueTasks = pendingTasks.filter(t => new Date(t.dateTime) < today);
  const todayTasks = pendingTasks.filter(t => {
      const taskDate = new Date(t.dateTime);
      taskDate.setHours(0,0,0,0);
      return taskDate.getTime() === today.getTime();
  });
  const upcomingTasks = pendingTasks.filter(t => {
      const taskDate = new Date(t.dateTime);
      taskDate.setHours(0,0,0,0);
      return taskDate > today;
  });

  return (
    <Layout title="To-Do List">
      <div className="space-y-6">
        {pendingTasks.length > 0 ? (
            <>
                <TaskListSection title="Overdue" tasks={overdueTasks} onEdit={handleEdit} onDelete={handleDelete} />
                <TaskListSection title="Today" tasks={todayTasks} onEdit={handleEdit} onDelete={handleDelete} />
                <TaskListSection title="Upcoming" tasks={upcomingTasks} onEdit={handleEdit} onDelete={handleDelete} />
            </>
        ) : (
            <Card className="text-center text-text-secondary">No pending tasks. Great job!</Card>
        )}

        {completedTasks.length > 0 && (
            <div>
                <h2 className="text-xl font-semibold mb-2">Completed</h2>
                <div className="space-y-3">
                    {completedTasks.sort((a,b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()).map(task => 
                         <TaskItem key={task.id} task={task} onEdit={handleEdit} onDelete={handleDelete} />
                    )}
                </div>
            </div>
        )}
      </div>
      <FAB onClick={() => navigate('/task/add')} aria-label="Add new task">
        <PlusIcon />
        <span>New Task</span>
      </FAB>
    </Layout>
  );
};

export default TodoListScreen;