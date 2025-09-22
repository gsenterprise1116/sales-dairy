
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAppContext } from '../hooks/useAppContext';
import { Button, Input, Select, TextArea } from '../components/ui';
import { Customer, CustomerType } from '../types';

const AddEditCustomerScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addCustomer, updateCustomer, getCustomerById, products, addToast } = useAppContext();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<Omit<Customer, 'id' | 'createdAt'>>({
    customerName: '',
    mobileNumber: '',
    referenceBy: '',
    product: products[0] || '',
    customerType: 'ETB',
    remark: '',
    nextVisitDate: '',
    nextVisitTime: '',
  });

  useEffect(() => {
    if (isEditMode && id) {
      const customer = getCustomerById(id);
      if (customer) {
        setFormData(customer);
      } else {
        addToast('Customer not found', 'error');
        navigate('/customers');
      }
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditMode, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({...prev, customerType: e.target.value as CustomerType}));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.mobileNumber) {
      addToast('Customer Name and Mobile Number are required.', 'error');
      return;
    }

    if (isEditMode && id) {
      updateCustomer({ ...formData, id, createdAt: getCustomerById(id)!.createdAt });
      addToast('Visit updated successfully!');
    } else {
      addCustomer(formData);
      addToast('Visit saved successfully!');
    }
    navigate(-1);
  };

  return (
    <Layout title={isEditMode ? "Edit Visit" : "Add New Visit"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-text-secondary">Customer Name *</label>
          <Input name="customerName" value={formData.customerName} onChange={handleChange} required />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-text-secondary">Mobile Number *</label>
          <Input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-text-secondary">Reference By</label>
          <Input name="referenceBy" value={formData.referenceBy} onChange={handleChange} />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-text-secondary">Product</label>
          <Select name="product" value={formData.product} onChange={handleChange}>
            {products.map(p => <option key={p} value={p}>{p}</option>)}
          </Select>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-text-secondary">Customer Type</label>
          <div className="flex gap-4 p-3 bg-tertiary rounded-lg">
            <label className="flex items-center gap-2"><input type="radio" name="customerType" value="ETB" checked={formData.customerType === 'ETB'} onChange={handleRadioChange} className="w-4 h-4 text-accent bg-gray-700 border-gray-600 focus:ring-accent" /> ETB</label>
            <label className="flex items-center gap-2"><input type="radio" name="customerType" value="NTB" checked={formData.customerType === 'NTB'} onChange={handleRadioChange} className="w-4 h-4 text-accent bg-gray-700 border-gray-600 focus:ring-accent"/> NTB</label>
          </div>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-text-secondary">Remark</label>
          <TextArea name="remark" value={formData.remark} onChange={handleChange} rows={3} />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-text-secondary">Next Visit</label>
          <div className="flex gap-2">
            <Input type="date" name="nextVisitDate" value={formData.nextVisitDate} onChange={handleChange} />
            <Input type="time" name="nextVisitTime" value={formData.nextVisitTime} onChange={handleChange} />
          </div>
        </div>
        <div className="pt-4">
          <Button type="submit">{isEditMode ? "Update Visit" : "Save Visit"}</Button>
        </div>
      </form>
    </Layout>
  );
};

export default AddEditCustomerScreen;
