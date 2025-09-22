
import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import Layout from '../components/Layout';
import { Card, Button, Input, Modal } from '../components/ui';
import { Product } from '../types';
import { TrashIcon, XIcon } from '../components/Icons';

const SettingsScreen = () => {
    const { settings, updateSettings, products, addProduct, removeProduct, deleteAllData, customers, addToast } = useAppContext();
    const [newProduct, setNewProduct] = useState('');
    const [isPrivacyModalOpen, setPrivacyModalOpen] = useState(false);
    const [isTermsModalOpen, setTermsModalOpen] = useState(false);

    const handleSaveSettings = (key: keyof typeof settings, value: string) => {
        updateSettings({ [key]: value });
    };

    const handleAddProduct = (e: React.FormEvent) => {
        e.preventDefault();
        if (newProduct.trim()) {
            addProduct(newProduct);
            setNewProduct('');
            addToast('Product added!');
        }
    };
    
    const handleExportAll = () => {
        if (customers.length === 0) {
            addToast("No data to export.", "error");
            return;
        }
        const headers = Object.keys(customers[0]);
        const csvContent = [
          headers.join(','),
          ...customers.map(row => headers.map(header => JSON.stringify(row[header as keyof typeof row])).join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', `sales_dairy_all_customers_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        addToast("Data exported successfully!");
    };
    
    const handleDeleteAllData = () => {
        if (window.confirm("Are you sure you want to delete all customers, tasks, and visit history? This action cannot be undone.")) {
            deleteAllData();
            addToast("All data has been deleted.", "success");
        }
    };

    return (
        <Layout title="Settings">
            <div className="space-y-6">
                <SettingsSection title="Profile">
                    <label className="block mb-1 text-sm font-medium text-text-secondary">User Name</label>
                    <Input value={settings.userName} onBlur={(e) => handleSaveSettings('userName', e.target.value)} onChange={(e) => updateSettings({ userName: e.target.value })} />
                </SettingsSection>

                <SettingsSection title="Manage Products">
                    <form onSubmit={handleAddProduct} className="flex gap-2 mb-3">
                        <Input value={newProduct} onChange={(e) => setNewProduct(e.target.value)} placeholder="New product name" />
                        <Button type="submit" className="w-auto px-4">Add</Button>
                    </form>
                    <ul className="space-y-2">
                        {products.map(p => (
                            <li key={p} className="flex justify-between items-center bg-tertiary p-2 rounded">
                                <span>{p}</span>
                                <button onClick={() => removeProduct(p)} className="text-red-400 hover:text-red-300"><TrashIcon /></button>
                            </li>
                        ))}
                    </ul>
                </SettingsSection>

                <SettingsSection title="Data Management">
                    <div className="space-y-2">
                        <Button onClick={handleExportAll} variant="secondary">Export All to Excel (CSV)</Button>
                        <Button onClick={handleDeleteAllData} variant="danger">Delete All Data</Button>
                    </div>
                </SettingsSection>
                
                <SettingsSection title="Legal">
                    <div className="space-y-2 text-center">
                        <p onClick={() => setPrivacyModalOpen(true)} className="text-accent hover:underline cursor-pointer">Privacy Policy</p>
                        <p onClick={() => setTermsModalOpen(true)} className="text-accent hover:underline cursor-pointer">Terms & Conditions</p>
                        <a href="mailto:gsenterprise1116@gmail.com" className="text-accent hover:underline">Contact Us: gsenterprise1116@gmail.com</a>
                        <p className="text-text-secondary text-sm pt-2">App Version: 1.0.0</p>
                    </div>
                </SettingsSection>
            </div>
            
            <Modal isOpen={isPrivacyModalOpen} onClose={() => setPrivacyModalOpen(false)} title="Privacy Policy">
                <p className="text-text-secondary">This app stores all your data locally on your device. No data is sent to any server. We do not collect, share, or use any of your personal information. Your privacy is paramount.</p>
            </Modal>
             <Modal isOpen={isTermsModalOpen} onClose={() => setTermsModalOpen(false)} title="Terms & Conditions">
                <p className="text-text-secondary">By using this app, you agree that you are responsible for your own data. The developer is not liable for any data loss. Please back up your data regularly using the export feature.</p>
            </Modal>
        </Layout>
    );
};

const SettingsSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <Card>
        <h2 className="text-xl font-bold mb-3 text-accent">{title}</h2>
        {children}
    </Card>
);

export default SettingsScreen;
