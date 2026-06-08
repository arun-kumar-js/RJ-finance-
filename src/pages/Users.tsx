import React, { useEffect, useState } from 'react';
import { getUsers, createUser, deleteUser } from '../services/adminService';
import { getLines } from '../services/lineService';
import { useNavigate } from 'react-router-dom';

const Users = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [lines, setLines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', password: '', role: 'collector', assignedLines: [] as string[] });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [uRes, lRes] = await Promise.all([getUsers(), getLines()]);
      setUsers(uRes);
      setLines(lRes);
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
        role: form.role,
        assignedLines: form.assignedLines
      });
      setModalVisible(false);
      setForm({ name: '', phone: '', password: '', role: 'collector', assignedLines: [] });
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this User?')) return;
    try {
      await deleteUser(id);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const toggleLine = (lineId: string) => {
    setForm(prev => {
      const isSelected = prev.assignedLines.includes(lineId);
      return {
        ...prev,
        assignedLines: isSelected 
          ? prev.assignedLines.filter(id => id !== lineId)
          : [...prev.assignedLines, lineId]
      };
    });
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0 20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1 style={{ color: '#1E293B', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Collectors / Users</h1>
        <button 
          onClick={() => setModalVisible(true)} 
          style={{ width: '36px', height: '36px', backgroundColor: '#6366F1', color: 'white', borderRadius: '18px', border: 'none', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          +
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}><p style={{ color: 'var(--text-muted)' }}>Loading users...</p></div>
      ) : users.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '16px', fontWeight: '600' }}>No Users found.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '40px' }}>
          {users.map((u) => {
            const assignedLineNames = u.assignedLines?.map((lId: any) => {
              const lineObj = lines.find(line => line._id === lId || line._id === lId?._id);
              return lineObj ? `${lineObj.lineName}` : '';
            }).filter(Boolean).join(', ');

            return (
              <div 
                key={u._id} 
                style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '16px', 
                  padding: '16px', 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  border: '1px solid var(--border)'
                }}
              >
                <div>
                  <h3 style={{ color: '#1E293B', fontSize: '16px', margin: '0 0 4px 0', fontWeight: 'bold' }}>{u.name}</h3>
                  <p style={{ color: '#64748B', fontSize: '13px', margin: '0 0 4px 0' }}>📞 {u.phone || u.mobile}</p>
                  {assignedLineNames && (
                    <p style={{ color: '#6366F1', fontSize: '12px', margin: '0 0 8px 0', fontWeight: '600' }}>📍 {assignedLineNames}</p>
                  )}
                  <span style={{ 
                    backgroundColor: u.role === 'admin' ? '#FEF2F2' : '#EEF2FF', 
                    color: u.role === 'admin' ? '#EF4444' : '#6366F1', 
                    fontSize: '10px', 
                    fontWeight: 'bold', 
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    textTransform: 'uppercase' 
                  }}>
                    {u.role}
                  </span>
                </div>
                
                <button 
                  onClick={() => handleDelete(u._id)}
                  style={{ width: '40px', height: '40px', backgroundColor: '#FEF2F2', borderRadius: '20px', border: 'none', fontSize: '16px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                  🗑️
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Overlay */}
      {modalVisible && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '24px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1E293B', margin: '0 0 20px 0' }}>Add New Collector</h2>
            
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#64748B', marginBottom: '6px', display: 'block' }}>Name *</label>
            <input className="input-field" style={{ width: '100%', marginBottom: '16px' }} placeholder="e.g. John Doe" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#64748B', marginBottom: '6px', display: 'block' }}>Phone *</label>
            <input className="input-field" style={{ width: '100%', marginBottom: '16px' }} placeholder="10 digits" maxLength={10} value={form.phone} onChange={e => setForm({...form, phone: e.target.value.replace(/[^0-9]/g, '')})} />
            
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#64748B', marginBottom: '6px', display: 'block' }}>Password *</label>
            <input className="input-field" style={{ width: '100%', marginBottom: '20px' }} type="password" placeholder="Minimum 6 characters" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#64748B', marginBottom: '10px', display: 'block' }}>Assign Lines</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
              {lines.map(line => {
                const isSelected = form.assignedLines.includes(line._id);
                return (
                  <button 
                    key={line._id}
                    onClick={() => toggleLine(line._id)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${isSelected ? '#6366F1' : '#E2E8F0'}`,
                      backgroundColor: isSelected ? '#EEF2FF' : 'white',
                      color: isSelected ? '#6366F1' : '#64748B',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    {line.lineName}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setModalVisible(false)} style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', padding: '12px 20px' }}>Cancel</button>
              <button onClick={handleCreate} style={{ backgroundColor: '#6366F1', border: 'none', color: '#FFF', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', padding: '12px 24px', borderRadius: '12px' }}>Save Collector</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
