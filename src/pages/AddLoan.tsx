import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

const AddLoan = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [balances, setBalances] = useState({ inHandCash: 0, collectionCash: 0 });
  const [form, setForm] = useState({
    loanAmount: '5000',
    interestRate: '',
    emiAmount: '250',
    totalInstallments: '25',
    startDate: new Date().toISOString().split('T')[0],
    emiStartDate: new Date().toISOString().split('T')[0],
    bondNumber: '',
    cashSource: ''
  });

  useEffect(() => {
    fetchBalances();
  }, []);

  const fetchBalances = async () => {
    try {
      const res = await API.get('/dashboard');
      if (res.data?.cards) {
        setBalances({
          inHandCash: Math.max(0, res.data.cards.inHandCash || 0),
          collectionCash: Math.max(0, res.data.cards.collectionCash || 0)
        });
        // We do not auto-select anymore, forcing the user to explicitly choose to avoid state sync issues
      }
    } catch (err) {
      console.error('Failed to fetch balances', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setForm(prev => {
      const newForm = { ...prev, [name]: name === 'bondNumber' ? value.toUpperCase() : value };
      
      // Auto-calculate EMI if loan amount changes
      if (name === 'loanAmount') {
        const amount = Number(value);
        if (!isNaN(amount) && amount > 0) {
          newForm.emiAmount = ((amount / 10000) * 500).toString();
        }
      }
      return newForm;
    });
  };

  // Optional: Auto-calculate EMI if amount and installments are provided
  const handleCalculateEmi = () => {
    // Keep this function around to avoid compilation errors on unchanged inputs,
    // though the main EMI calculation is now in handleChange for loanAmount.
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.loanAmount || !form.emiAmount || !form.totalInstallments || !form.cashSource) {
      return alert('Please fill required fields (Amount, EMI, Installments, Cash Source)');
    }

    const requestedAmount = Number(form.loanAmount);
    const selectedBalance = form.cashSource === 'in_hand_cash' ? balances.inHandCash : balances.collectionCash;

    if (requestedAmount > selectedBalance) {
      return alert(`Insufficient funds in ${form.cashSource === 'in_hand_cash' ? 'In-Hand Cash' : 'Collection Cash'}. Available: ₹${selectedBalance.toLocaleString()}`);
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
      <button onClick={() => navigate(-1)} className="btn-primary" style={{ marginBottom: '20px', background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border)' }}>
        ← Back
      </button>

      <h1 style={{ color: 'var(--primary)', marginBottom: '32px', fontSize: '32px' }}>Create New Loan</h1>
      
      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '32px' }}>
        
        <div className="input-group">
          <label className="input-label">Loan Amount (₹) *</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              name="loanAmount"
              type="number"
              value={form.loanAmount}
              onChange={handleChange}
              placeholder="Enter loan amount"
              className="input-field"
              style={{ flex: 1 }}
              required
              min="1"
            />
            <select
              value={['5000', '10000', '15000', '20000', '25000', '30000', '35000', '40000', '45000', '50000'].includes(form.loanAmount) ? form.loanAmount : ''}
              onChange={(e) => {
                if (e.target.value) {
                  handleChange({
                    target: { name: 'loanAmount', value: e.target.value }
                  } as any);
                }
              }}
              className="input-field"
              style={{ width: '160px' }}
            >
              <option value="">Presets...</option>
              <option value="5000">₹5,000</option>
              <option value="10000">₹10,000</option>
              <option value="15000">₹15,000</option>
              <option value="20000">₹20,000</option>
              <option value="25000">₹25,000</option>
              <option value="30000">₹30,000</option>
              <option value="35000">₹35,000</option>
              <option value="40000">₹40,000</option>
              <option value="45000">₹45,000</option>
              <option value="50000">₹50,000</option>
            </select>
          </div>
        </div>

        {/* Removed interest rate as it's no longer used for this fixed plan */}

        <div className="input-group">
          <label className="input-label">Total Installments (Weeks) *</label>
          <input name="totalInstallments" type="number" value={form.totalInstallments} className="input-field" disabled style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-muted)' }} />
        </div>

        <div className="input-group">
          <label className="input-label">Weekly EMI Amount (₹) *</label>
          <input name="emiAmount" type="number" value={form.emiAmount} className="input-field" disabled style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-muted)' }} />
         
        </div>

        <div className="input-group">
          <label className="input-label">Disbursement Date *</label>
          <input name="startDate" type="date" value={form.startDate} onChange={handleChange} className="input-field" required />
        </div>

        <div className="input-group">
          <label className="input-label">First EMI Date *</label>
          <input name="emiStartDate" type="date" value={form.emiStartDate} onChange={handleChange} className="input-field" required />
        </div>

        <div className="input-group">
          <label className="input-label">Bond Number</label>
          <input name="bondNumber" value={form.bondNumber} onChange={handleChange} className="input-field" placeholder="Enter bond number" style={{ textTransform: 'uppercase' }} />
        </div>

        {balances.inHandCash > 0 || balances.collectionCash > 0 ? (
          <div className="input-group">
            <label className="input-label">Cash Source *</label>
            <select name="cashSource" value={form.cashSource} onChange={handleChange} className="input-field" required>
              <option value="" disabled>Select Cash Source</option>
              {balances.inHandCash > 0 && <option value="in_hand_cash">In Hand Cash (₹{balances.inHandCash.toLocaleString()})</option>}
              {balances.collectionCash > 0 && <option value="collection_cash">Collection Cash (₹{balances.collectionCash.toLocaleString()})</option>}
            </select>
          </div>
        ) : (
          <div className="input-group">
            <p style={{ color: '#EF4444', fontWeight: 'bold' }}>No cash available in any source to disburse loans.</p>
          </div>
        )}

        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '20px' }} disabled={loading || (balances.inHandCash === 0 && balances.collectionCash === 0)}>
          {loading ? 'Creating...' : 'Create Loan'}
        </button>

      </form>
    </div>
  );
};

export default AddLoan;
