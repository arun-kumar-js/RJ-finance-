import React, { useEffect, useState } from 'react';
import { getUsers, createUser, deleteUser } from '../services/adminService';
import { useNavigate } from 'react-router-dom';

const Financiers = () => {
  const [financiers, setFinanciers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', password: '', role: 'finance' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      setFinanciers(res.filter((u: any) => u.role === 'finance'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!form.name || !form.phone || !form.password) {
      alert('Name, phone, and password are required');
      return;
    }
    try {
      await createUser({
        name: form.name,
        mobile: form.phone,
        password: form.password,
        role: 'finance',
        assignedLines: []
      });
      setModalVisible(false);
      setForm({ name: '', phone: '', password: '', role: 'finance' });
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create financier');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this Financier?')) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0 20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1 style={{ color: '#EAB308', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Financiers</h1>
        <button 
          onClick={() => setModalVisible(true)} 
          style={{ width: '36px', height: '36px', backgroundColor: '#EAB308', color: '#000', borderRadius: '18px', border: 'none', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          +
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}><p style={{ color: 'var(--text-muted)' }}>Loading financiers...</p></div>
      ) : financiers.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '16px', fontWeight: '600' }}>No Financiers found.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '40px' }}>
          {financiers.map((f) => (
            <div 
              key={f._id} 
              style={{ 
                backgroundColor: 'white', 
                borderRadius: '16px', 
                padding: '16px', 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                border: '1px solid #EAB308'
              }}
            >
              <div>
                <h3 style={{ color: '#1E293B', fontSize: '16px', margin: '0 0 4px 0', fontWeight: 'bold' }}>{f.name}</h3>
                <p style={{ color: '#64748B', fontSize: '13px', margin: '0 0 8px 0' }}>📞 {f.phone || f.mobile}</p>
                <span style={{ backgroundColor: '#FEF9C3', color: '#CA8A04', fontSize: '10px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '12px' }}>
                  FINANCIER
                </span>
              </div>
              
              <button 
                onClick={() => handleDelete(f._id)}
                style={{ width: '40px', height: '40px', backgroundColor: '#FEF2F2', borderRadius: '20px', border: 'none', fontSize: '16px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal Overlay */}
      {modalVisible && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '24px', width: '100%', maxWidth: '400px', border: '1px solid #EAB308' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1E293B', margin: '0 0 20px 0' }}>Add New Financier</h2>
            
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#64748B', marginBottom: '6px', display: 'block' }}>Name *</label>
            <input className="input-field" style={{ width: '100%', marginBottom: '16px' }} placeholder="e.g. John Doe" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#64748B', marginBottom: '6px', display: 'block' }}>Phone *</label>
            <input className="input-field" style={{ width: '100%', marginBottom: '16px' }} placeholder="10 digits" maxLength={10} value={form.phone} onChange={e => setForm({...form, phone: e.target.value.replace(/[^0-9]/g, '')})} />
            
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#64748B', marginBottom: '6px', display: 'block' }}>Password *</label>
            <input className="input-field" style={{ width: '100%', marginBottom: '20px' }} type="password" placeholder="Minimum 6 characters" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setModalVisible(false)} style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', padding: '12px 20px' }}>Cancel</button>
              <button onClick={handleCreate} style={{ backgroundColor: '#EAB308', border: 'none', color: '#000', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', padding: '12px 24px', borderRadius: '12px' }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Financiers;
