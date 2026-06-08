import React, { useEffect, useState } from 'react';
import { getLines, createLine, deleteLine } from '../services/lineService';
import { useNavigate } from 'react-router-dom';

const Lines = () => {
  const [lines, setLines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ lineName: '', description: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchLines();
  }, []);

  const fetchLines = async () => {
    try {
      setLoading(true);
      const res = await getLines();
      setLines(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!form.lineName) {
      alert('Line name is required');
      return;
    }
    try {
      await createLine(form);
      setModalVisible(false);
      setForm({ lineName: '', description: '' });
      fetchLines();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create line');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this Line?')) return;
    try {
      await deleteLine(id);
      fetchLines();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0 20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1 style={{ color: '#1E293B', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Lines</h1>
        <button 
          onClick={() => setModalVisible(true)} 
          style={{ width: '36px', height: '36px', backgroundColor: '#6366F1', color: 'white', borderRadius: '18px', border: 'none', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          +
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}><p style={{ color: 'var(--text-muted)' }}>Loading lines...</p></div>
      ) : lines.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '16px', fontWeight: '600' }}>No Lines found.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '40px' }}>
          {lines.map((l) => (
            <div 
              key={l._id} 
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
                <h3 style={{ color: '#1E293B', fontSize: '16px', margin: '0 0 4px 0', fontWeight: 'bold' }}>{l.lineName}</h3>
                {l.description && <p style={{ color: '#64748B', fontSize: '13px', margin: '0 0 8px 0' }}>{l.description}</p>}
                <span style={{ backgroundColor: '#EEF2FF', color: '#6366F1', fontSize: '10px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '12px', textTransform: 'uppercase' }}>
                  {l.status}
                </span>
              </div>
              
              <button 
                onClick={() => handleDelete(l._id)}
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
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '24px', width: '100%', maxWidth: '400px', border: '1px solid #6366F1' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1E293B', margin: '0 0 20px 0' }}>Add New Line</h2>
            
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#64748B', marginBottom: '6px', display: 'block' }}>Line Name *</label>
            <input className="input-field" style={{ width: '100%', marginBottom: '16px' }} placeholder="e.g. North Street Line" value={form.lineName} onChange={e => setForm({...form, lineName: e.target.value})} />
            
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#64748B', marginBottom: '6px', display: 'block' }}>Description</label>
            <input className="input-field" style={{ width: '100%', marginBottom: '20px' }} placeholder="Optional description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setModalVisible(false)} style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', padding: '12px 20px' }}>Cancel</button>
              <button onClick={handleCreate} style={{ backgroundColor: '#6366F1', border: 'none', color: '#FFF', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', padding: '12px 24px', borderRadius: '12px' }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lines;
