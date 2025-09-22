
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAppContext } from '../hooks/useAppContext';
import { Card, Button } from '../components/ui';
import { PlusIcon } from '../components/Icons';

const HomeScreen = () => {
  const navigate = useNavigate();
  const { customers } = useAppContext();

  const today = new Date().toISOString().split('T')[0];
  const todayVisits = customers.filter(c => c.nextVisitDate === today);

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':');
    const h = parseInt(hour, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHour = h % 12 || 12;
    return `${formattedHour}:${minute} ${ampm}`;
  };

  return (
    <Layout title="Sales Dairy">
      <div className="space-y-6">
        <Card>
          <p className="text-lg text-text-secondary">Today's Visits</p>
          <p className="text-4xl font-bold text-accent">{todayVisits.length}</p>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Button onClick={() => navigate('/customer/add')}>
            <PlusIcon />
            New Visit
          </Button>
          <Button onClick={() => navigate('/task/add')}>
            <PlusIcon />
            New Task
          </Button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">Today's Schedule</h2>
          {todayVisits.length > 0 ? (
            <div className="space-y-3">
              {todayVisits
                .sort((a,b) => a.nextVisitTime.localeCompare(b.nextVisitTime))
                .map(visit => (
                  <Card key={visit.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-text-primary">{visit.customerName}</p>
                      <p className="text-sm text-text-secondary">{visit.remark.substring(0, 40)}...</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-accent">{formatTime(visit.nextVisitTime)}</p>
                    </div>
                  </Card>
                ))}
            </div>
          ) : (
            <Card className="text-center text-text-secondary">
              No visits scheduled for today.
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HomeScreen;
