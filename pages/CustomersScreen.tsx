import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAppContext } from '../hooks/useAppContext';
import { Card, FAB, Input, Button, Modal } from '../components/ui';
import { SearchIcon, FilterIcon, ExportIcon, PlusIcon } from '../components/Icons';
import { Customer, CustomerType, Product } from '../types';

const CustomerItem = ({ customer }: { customer: Customer }) => {
  const navigate = useNavigate();
  return (
    <Card className="mb-3 cursor-pointer hover:bg-tertiary transition-colors" onClick={() => navigate(`/customer/detail/${customer.id}`)}>
      <div className="flex justify-between items-center">
        <div>
          <p className="font-bold text-text-primary">{customer.customerName}</p>
          <p className="text-sm text-text-secondary">{customer.mobileNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-text-secondary">Next Visit</p>
          <p className="font-semibold text-accent">{customer.nextVisitDate}</p>
        </div>
      </div>
    </Card>
  );
};

const FilterScreen = ({ isOpen, onClose, onApply, products }: { isOpen: boolean; onClose: () => void; onApply: (filters: any) => void; products: Product[] }) => {
    const [customerType, setCustomerType] = useState<CustomerType[]>([]);
    const [product, setProduct] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const handleApply = () => {
        onApply({ customerType, product, dateFrom, dateTo });
        onClose();
    };

    const handleReset = () => {
        setCustomerType([]);
        setProduct('');
        setDateFrom('');
        setDateTo('');
        onApply({ customerType: [], product: '', dateFrom: '', dateTo: ''});
    };
    
    const handleTypeToggle = (type: CustomerType) => {
        setCustomerType(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Filter Customers">
            <div className="space-y-4">
                <div>
                    <label className="block mb-2 text-sm font-medium text-text-secondary">Customer Type</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2"><input type="checkbox" checked={customerType.includes('ETB')} onChange={() => handleTypeToggle('ETB')} className="w-4 h-4 text-accent bg-tertiary border-slate-600 rounded focus:ring-accent"/> ETB</label>
                        <label className="flex items-center gap-2"><input type="checkbox" checked={customerType.includes('NTB')} onChange={() => handleTypeToggle('NTB')} className="w-4 h-4 text-accent bg-tertiary border-slate-600 rounded focus:ring-accent"/> NTB</label>
                    </div>
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-text-secondary">Product</label>
                    <select value={product} onChange={e => setProduct(e.target.value)} className="w-full bg-tertiary p-3 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-accent">
                        <option value="">All Products</option>
                        {products.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-text-secondary">Date Range</label>
                    <div className="flex gap-2">
                        <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} placeholder="From"/>
                        <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} placeholder="To"/>
                    </div>
                </div>
                <div className="flex flex-col gap-2 pt-4">
                    <Button onClick={handleApply}>Apply Filter</Button>
                    <Button onClick={handleReset} variant="secondary">Reset</Button>
                </div>
            </div>
        </Modal>
    )
}


const CustomersScreen = () => {
  const navigate = useNavigate();
  const { customers, products } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ customerType: [], product: '', dateFrom: '', dateTo: '' });

  const exportToCsv = (data: Customer[]) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => JSON.stringify(row[header as keyof Customer])).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) {
      URL.revokeObjectURL(link.href);
    }
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `customers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const filteredCustomers = useMemo(() => {
    return customers
      .filter(customer => {
        const lowerSearch = searchTerm.toLowerCase();
        return (
          customer.customerName.toLowerCase().includes(lowerSearch) ||
          customer.mobileNumber.includes(lowerSearch)
        );
      })
      .filter(customer => {
        if (filters.customerType.length > 0 && !filters.customerType.includes(customer.customerType)) return false;
        if (filters.product && customer.product !== filters.product) return false;
        if (filters.dateFrom && customer.nextVisitDate < filters.dateFrom) return false;
        if (filters.dateTo && customer.nextVisitDate > filters.dateTo) return false;
        return true;
      });
  }, [customers, searchTerm, filters]);

  return (
    <Layout title="Customers">
      <div className="space-y-4">
        <div className="relative">
          <Input 
            type="text" 
            placeholder="Search by name or number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
        </div>
        <div className="flex gap-2">
            <Button onClick={() => setFilterOpen(true)} variant="secondary" className="w-1/2"><FilterIcon/> Filter</Button>
            <Button onClick={() => exportToCsv(filteredCustomers)} variant="secondary" className="w-1/2"><ExportIcon/> Export</Button>
        </div>
        
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map(customer => <CustomerItem key={customer.id} customer={customer} />)
        ) : (
          <Card className="text-center text-text-secondary">No customers found.</Card>
        )}
      </div>
      <FAB onClick={() => navigate('/customer/add')} aria-label="Add new customer">
        <PlusIcon />
        <span>New Customer</span>
      </FAB>
      <FilterScreen isOpen={isFilterOpen} onClose={() => setFilterOpen(false)} onApply={setFilters} products={products} />
    </Layout>
  );
};

export default CustomersScreen;