
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAppContext } from '../hooks/useAppContext';
import { Card, Input } from '../components/ui';
import { Customer } from '../types';

const VisitItem = ({ visit }: { visit: Customer }) => {
    const navigate = useNavigate();
    const formatTime = (time: string) => {
        if (!time) return 'Anytime';
        const [hour, minute] = time.split(':');
        const h = parseInt(hour, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const formattedHour = h % 12 || 12;
        return `${formattedHour}:${minute} ${ampm}`;
    };

    return (
        <Card className="flex justify-between items-center cursor-pointer hover:bg-tertiary" onClick={() => navigate(`/customer/detail/${visit.id}`)}>
            <div>
                <p className="font-bold text-text-primary">{visit.customerName}</p>
                <p className="text-sm text-text-secondary">{visit.mobileNumber}</p>
            </div>
            <div className="text-right">
                <p className="font-semibold text-accent">{formatTime(visit.nextVisitTime)}</p>
            </div>
        </Card>
    )
}

const VisitListSection = ({ title, visits }: { title: string, visits: Customer[] }) => {
    if (visits.length === 0) return null;
    return (
        <div>
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            <div className="space-y-3">
                {visits.sort((a, b) => a.nextVisitTime.localeCompare(b.nextVisitTime)).map(visit =>
                    <VisitItem key={visit.id} visit={visit} />
                )}
            </div>
        </div>
    );
};


const NotificationsScreen = () => {
    const { customers } = useAppContext();
    const [selectedDate, setSelectedDate] = useState('');

    const upcomingVisits = useMemo(() => {
        return customers.filter(c => c.nextVisitDate && new Date(c.nextVisitDate) >= new Date(new Date().toDateString()));
    }, [customers]);

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const todayVisits = upcomingVisits.filter(v => v.nextVisitDate === todayStr);
    const tomorrowVisits = upcomingVisits.filter(v => v.nextVisitDate === tomorrowStr);
    const futureVisits = upcomingVisits.filter(v => v.nextVisitDate > tomorrowStr);
    
    const visitsForSelectedDate = useMemo(() => {
        if (!selectedDate) return [];
        return customers.filter(c => c.nextVisitDate === selectedDate);
    }, [customers, selectedDate]);


    return (
        <Layout title="Upcoming Schedule">
            <div className="space-y-6">
                <div>
                    <label className="block mb-1 text-sm font-medium text-text-secondary">Check Visits for a Specific Date</label>
                    <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                </div>

                {selectedDate && (
                    <VisitListSection title={`Visits for ${selectedDate}`} visits={visitsForSelectedDate} />
                )}
                {selectedDate && visitsForSelectedDate.length === 0 && (
                     <Card className="text-center text-text-secondary">No visits scheduled for {selectedDate}.</Card>
                )}
                
                <hr className={`my-4 border-tertiary ${!selectedDate ? 'hidden' : ''}`} />

                <VisitListSection title="Today" visits={todayVisits} />
                <VisitListSection title="Tomorrow" visits={tomorrowVisits} />
                <VisitListSection title="Upcoming" visits={futureVisits} />

                {upcomingVisits.length === 0 && !selectedDate && (
                    <Card className="text-center text-text-secondary">No upcoming visits scheduled.</Card>
                )}
            </div>
        </Layout>
    );
};

export default NotificationsScreen;
