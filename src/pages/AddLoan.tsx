import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

const AddLoan = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    loanAmount: '',
    interestRate: '',
    emiAmount: '',
    totalInstallments: '24',
    startDate: new Date().toISOString().split('T')[0],
    emiStartDate: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Optional: Auto-calculate EMI if amount and installments are provided
  const handleCalculateEmi = () => {
    const p = parseFloat(form.loanAmount);
    const r = parseFloat(form.interestRate || '0');
    const n = parseInt(form.totalInstallments);
    if (!p || !n) return;
    
    const totalAmount = p + (p * r / 100);
    const emi = Math.ceil(totalAmount / n);
    setForm(prev => ({ ...prev, emiAmount: emi.toString() }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.loanAmount || !form.emiAmount || !form.totalInstallments) {
      return alert('Please fill required fields (Amount, EMI, Installments)');
    }

    try {
      setLoading(true);
      await API.post('/loans', {
        ...form,
        customerId,
        loanAmount: Number(form.loanAmount),
        interestRate: Number(form.interestRate || 0),
        emiAmount: Number(form.emiAmount),
        totalInstallments: Number(form.totalInstallments)
      });
      alert('Loan added successfully!');
      navigate(`/customer/${customerId}`);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Error adding loan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} className="btn-primary" style={{ marginBottom: '20px', background: 'var(--bg-card)', color: 'white', border: '1px solid var(--border)' }}>
        ← Back
      </button>

      <h1 style={{ color: 'var(--primary)', marginBottom: '32px', fontSize: '32px' }}>Create New Loan</h1>
      
      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '32px' }}>
        
        <div className="input-group">
          <label className="input-label">Loan Amount (₹) *</label>
          <input name="loanAmount" type="number" value={form.loanAmount} onChange={handleChange} onBlur={handleCalculateEmi} className="input-field" placeholder="e.g. 10000" required />
        </div>

        <div className="input-group">
          <label className="input-label">Interest Rate (%)</label>
          <input name="interestRate" type="number" value={form.interestRate} onChange={handleChange} onBlur={handleCalculateEmi} className="input-field" placeholder="e.g. 10" />
        </div>

        <div className="input-group">
          <label className="input-label">Total Installments (Days) *</label>
          <input name="totalInstallments" type="number" value={form.totalInstallments} onChange={handleChange} onBlur={handleCalculateEmi} className="input-field" placeholder="e.g. 100" required />
        </div>

        <div className="input-group">
          <label className="input-label">Daily EMI Amount (₹) *</label>
          <input name="emiAmount" type="number" value={form.emiAmount} onChange={handleChange} className="input-field" placeholder="e.g. 110" required />
          <small style={{ color: 'var(--text-muted)' }}>Auto-calculated if you click outside after entering amount & installments</small>
        </div>

        <div className="input-group">
          <label className="input-label">Disbursement Date *</label>
          <input name="startDate" type="date" value={form.startDate} onChange={handleChange} className="input-field" required />
        </div>

        <div className="input-group">
          <label className="input-label">First EMI Date *</label>
          <input name="emiStartDate" type="date" value={form.emiStartDate} onChange={handleChange} className="input-field" required />
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '20px' }} disabled={loading}>
          {loading ? 'Creating...' : 'Create Loan'}
        </button>

      </form>
    </div>
  );
};

export default AddLoan;
