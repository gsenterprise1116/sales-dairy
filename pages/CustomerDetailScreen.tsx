
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAppContext } from '../hooks/useAppContext';
import { Card, Button } from '../components/ui';
import { EditIcon, CallIcon, PlusIcon } from '../components/Icons';

const CustomerDetailScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCustomerById, getVisitHistoryForCustomer } = useAppContext();
  const [activeTab, setActiveTab] = useState<'info' | 'history'>('info');

  const customer = useMemo(() => id ? getCustomerById(id) : undefined, [id, getCustomerById]);
  const history = useMemo(() => id ? getVisitHistoryForCustomer(id) : [], [id, getVisitHistoryForCustomer]);

  if (!customer) {
    return <Layout title="Not Found"><Card>Customer not found.</Card></Layout>;
  }

  return (
    <Layout title="Customer Details">
      <div className="space-y-4">
        <Card>
          <h2 className="text-2xl font-bold text-accent">{customer.customerName}</h2>
          <p className="text-text-secondary">{customer.mobileNumber}</p>
        </Card>

        <div className="flex justify-around bg-secondary rounded-lg p-1">
          <button onClick={() => setActiveTab('info')} className={`w-full py-2 rounded ${activeTab === 'info' ? 'bg-accent text-primary font-semibold' : 'text-text-secondary'}`}>Info</button>
          <button onClick={() => setActiveTab('history')} className={`w-full py-2 rounded ${activeTab === 'history' ? 'bg-accent text-primary font-semibold' : 'text-text-secondary'}`}>History</button>
        </div>

        {activeTab === 'info' && (
          <Card className="space-y-3">
            <InfoRow label="Product" value={customer.product} />
            <InfoRow label="Customer Type" value={customer.customerType} />
            <InfoRow label="Reference" value={customer.referenceBy} />
            <InfoRow label="Next Visit" value={`${customer.nextVisitDate} at ${customer.nextVisitTime}`} />
            <InfoRow label="Last Remark" value={customer.remark} />
          </Card>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            {history.length > 0 ? history.map(visit => (
              <Card key={visit.id}>
                <p className="font-semibold">{new Date(visit.visitDate).toLocaleString()}</p>
                <p className="text-text-secondary mt-1">{visit.remark}</p>
              </Card>
            )) : <Card className="text-center text-text-secondary">No visit history.</Card>}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Button onClick={() => navigate(`/customer/edit/${customer.id}`)} variant="secondary"><EditIcon/> Edit</Button>
          <a href={`tel:${customer.mobileNumber}`} className="w-full text-center py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2 bg-green-600 text-white hover:bg-green-500">
            <CallIcon/> Call
          </a>
        </div>
        <Button onClick={() => navigate(`/customer/edit/${customer.id}`)}>
          <PlusIcon/> Log New Visit
        </Button>
      </div>
    </Layout>
  );
};

const InfoRow = ({ label, value }: { label: string, value?: string }) => (
  <div>
    <p className="text-sm text-text-secondary">{label}</p>
    <p className="font-semibold text-text-primary">{value || '-'}</p>
  </div>
);

export default CustomerDetailScreen;
