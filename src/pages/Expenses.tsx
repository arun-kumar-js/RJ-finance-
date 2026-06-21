import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAppSelector } from '../redux/hooks';

const Expenses = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  const canAdd = isAdmin || user?.role === 'finance';

  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await API.get('/expenses');
      setExpenses(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount || !form.description) return alert('Amount and Description are required');
    
    try {
      setSubmitting(true);
      if (editingExpenseId) {
        await API.put(`/expenses/${editingExpenseId}`, form);
      } else {
        await API.post('/expenses', form);
      }
      setShowModal(false);
      setEditingExpenseId(null);
      setForm({ amount: '', description: '', date: new Date().toISOString().split('T')[0] });
      fetchExpenses();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error saving expense');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (exp: any) => {
    setEditingExpenseId(exp._id);
    setForm({
      amount: exp.amount.toString(),
      description: exp.description,
      date: new Date(exp.date).toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const handleAddClick = () => {
    setEditingExpenseId(null);
    setForm({ amount: '', description: '', date: new Date().toISOString().split('T')[0] });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingExpenseId(null);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={() => navigate(-1)} className="btn-primary" style={{ background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border)' }}>
          ← Back
        </button>
        {canAdd && (
          <button onClick={handleAddClick} className="btn-primary" style={{ background: '#10B981', border: 'none' }}>
            + Add Expense
          </button>
        )}
      </div>

      <h1 style={{ color: 'var(--primary)', marginBottom: '32px', fontSize: '32px' }}>Office Expenses</h1>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading expenses...</p>
      ) : expenses.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No expenses recorded yet.</p>
      ) : (
        <div style={{ background: 'var(--bg-card)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: 'var(--text-main)' }}>
            <thead style={{ background: 'var(--bg-header)', color: 'white' }}>
              <tr>
                <th style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>Date</th>
                <th style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>Description</th>
                <th style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>Amount</th>
                <th style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>Added By</th>
                {isAdmin && <th style={{ padding: '16px', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp: any) => (
                <tr key={exp._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px', color: 'var(--text-main)' }}>
                    <div>{new Date(exp.date).toLocaleDateString()}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Entered: {exp.createdAt ? new Date(exp.createdAt).toLocaleString() : 'N/A'}
                    </div>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{exp.description}</td>
                  <td style={{ padding: '16px', color: '#EF4444', fontWeight: 'bold' }}>₹{exp.amount?.toLocaleString()}</td>
                  <td style={{ padding: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>{exp.createdBy?.name || 'Unknown'}</td>
                  {isAdmin && (
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleEditClick(exp)} 
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
                        title="Edit Expense"
                      >
                        ✏️
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Expense Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '32px', position: 'relative' }}>
            <button onClick={handleCloseModal} style={{ position: 'absolute', top: '16px', right: '20px', background: 'transparent', border: 'none', color: '#64748B', fontSize: '28px', fontWeight: 'bold', cursor: 'pointer' }}>×</button>
            <h2 style={{ margin: '0 0 24px 0', color: '#1E293B', fontSize: '24px', fontWeight: 'bold' }}>
              {editingExpenseId ? 'Edit Office Expense' : 'Add Office Expense'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="input-label">Date</label>
                <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="input-field" required />
              </div>
              
              <div className="input-group">
                <label className="input-label">Amount (₹)</label>
                <input type="number" placeholder="e.g. 500" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="input-field" required />
              </div>
              
              <div className="input-group">
                <label className="input-label">Description</label>
                <textarea rows={3} placeholder="e.g. Stationary, Tea, Internet Bill" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-field" required></textarea>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', background: '#10B981', border: 'none', marginTop: '16px' }} disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Expense'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
