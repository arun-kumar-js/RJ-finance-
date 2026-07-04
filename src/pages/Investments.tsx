import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAppSelector } from '../redux/hooks';

const Investments = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingInvestmentId, setEditingInvestmentId] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const res = await API.get('/investments');
      setInvestments(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount) return alert('Amount is required');
    
    try {
      setSubmitting(true);
      if (editingInvestmentId) {
        await API.put(`/investments/${editingInvestmentId}`, form);
      } else {
        await API.post('/investments', form);
      }
      setShowModal(false);
      setEditingInvestmentId(null);
      setForm({ amount: '', description: '', date: new Date().toISOString().split('T')[0] });
      fetchInvestments();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error saving investment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (inv: any) => {
    setEditingInvestmentId(inv._id);
    setForm({
      amount: inv.amount.toString(),
      description: inv.description,
      date: new Date(inv.date).toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const handleAddClick = () => {
    setEditingInvestmentId(null);
    setForm({ amount: '', description: '', date: new Date().toISOString().split('T')[0] });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingInvestmentId(null);
  };

  if (!isAdmin) {
    return <div style={{ padding: '20px' }}>Access Denied</div>;
  }

  return (
    <div className="animate-fade-in" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={() => navigate(-1)} className="btn-primary" style={{ background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border)' }}>
          ← Back
        </button>
        <button onClick={handleAddClick} className="btn-primary" style={{ background: '#3B82F6', border: 'none' }}>
          + Add In-Hand Cash
        </button>
      </div>

      <h1 style={{ color: 'var(--primary)', marginBottom: '32px', fontSize: '32px' }}>In-Hand Cash (Investments)</h1>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading records...</p>
      ) : investments.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No in-hand cash added yet.</p>
      ) : (
        <div style={{ background: 'var(--bg-card)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: 'var(--text-main)' }}>
            <thead style={{ background: 'var(--bg-header)', color: 'white' }}>
              <tr>
                <th style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>Date</th>
                <th style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>Description</th>
                <th style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>Amount</th>
                <th style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>Added By</th>
                <th style={{ padding: '16px', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {investments.map((inv: any) => (
                <tr key={inv._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px', color: 'var(--text-main)' }}>
                    <div>{new Date(inv.date).toLocaleDateString()}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Entered: {inv.createdAt ? new Date(inv.createdAt).toLocaleString() : 'N/A'}
                    </div>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{inv.description}</td>
                  <td style={{ padding: '16px', color: '#3B82F6', fontWeight: 'bold' }}>₹{inv.amount?.toLocaleString()}</td>
                  <td style={{ padding: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>{inv.createdBy?.name || 'Unknown'}</td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button 
                      onClick={() => handleEditClick(inv)} 
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
                      title="Edit Investment"
                    >
                      ✏️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Investment Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '32px', position: 'relative' }}>
            <button onClick={handleCloseModal} style={{ position: 'absolute', top: '16px', right: '20px', background: 'transparent', border: 'none', color: '#64748B', fontSize: '28px', fontWeight: 'bold', cursor: 'pointer' }}>×</button>
            <h2 style={{ margin: '0 0 24px 0', color: '#1E293B', fontSize: '24px', fontWeight: 'bold' }}>
              {editingInvestmentId ? 'Edit In-Hand Cash' : 'Add In-Hand Cash'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="input-label">Date</label>
                <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="input-field" required />
              </div>
              
              <div className="input-group">
                <label className="input-label">Amount (₹)</label>
                <input type="number" placeholder="e.g. 50000" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="input-field" required />
              </div>
              
              <div className="input-group">
                <label className="input-label">Description (Optional)</label>
                <textarea rows={3} placeholder="e.g. Added by Super Admin" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-field"></textarea>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', background: '#3B82F6', border: 'none', marginTop: '16px' }} disabled={submitting}>
                {submitting ? 'Saving...' : 'Save In-Hand Cash'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Investments;
