import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const AddCustomer = () => {
  const navigate = useNavigate();
  const [lines, setLines] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: '',
    guardianName: '',
    phone: '',
    aadharNumber: '',
    occupation: '',
    street: '',
    village: '',
    lineId: ''
  });

  useEffect(() => {
    fetchLines();
  }, []);

  const fetchLines = async () => {
    try {
      const res = await API.get('/lines');
      setLines(res.data || []);
      if (res.data?.length > 0) setForm(prev => ({ ...prev, lineId: res.data[0]._id }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'aadharNumber') {
      setForm({ ...form, [name]: value.replace(/[^0-9]/g, '').slice(0, 12) });
    } else if (name === 'phone') {
      setForm({ ...form, [name]: value.replace(/[^0-9]/g, '').slice(0, 10) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName || !form.phone || !form.lineId) {
      return alert('Please fill required fields (Name, Phone, Line)');
    }

    try {
      setLoading(true);
      await API.post('/customers', form);
      alert('Customer added successfully!');
      navigate('/customers');
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Error adding customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} className="btn-primary" style={{ marginBottom: '20px', background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border)' }}>
        ← Back
      </button>

      <h1 style={{ color: 'var(--primary)', marginBottom: '32px', fontSize: '32px' }}>Add Customer</h1>
      
      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '32px' }}>
        
        <div className="input-group">
          <label className="input-label">Customer Name *</label>
          <input name="customerName" value={form.customerName} onChange={handleChange} className="input-field" placeholder="Enter customer name" required />
        </div>

        <div className="input-group">
          <label className="input-label">Husband / Parent Name</label>
          <input name="guardianName" value={form.guardianName} onChange={handleChange} className="input-field" placeholder="Enter guardian name" />
        </div>

        <div className="input-group">
          <label className="input-label">Phone *</label>
          <input name="phone" value={form.phone} onChange={handleChange} className="input-field" placeholder="10-digit mobile number" maxLength={10} required />
        </div>

        <div className="input-group">
          <label className="input-label">Aadhar Number</label>
          <input name="aadharNumber" value={form.aadharNumber} onChange={handleChange} className="input-field" placeholder="12-digit Aadhar" maxLength={12} pattern="\d{12}" title="Please enter exactly 12 digits" />
        </div>

        <div className="input-group">
          <label className="input-label">Occupation</label>
          <input name="occupation" value={form.occupation} onChange={handleChange} className="input-field" placeholder="Enter occupation" />
        </div>

        <div className="input-group">
          <label className="input-label">Street / Area</label>
          <input name="street" value={form.street} onChange={handleChange} className="input-field" placeholder="Street name or area" />
        </div>

        <div className="input-group">
          <label className="input-label">Village / Town</label>
          <input name="village" value={form.village} onChange={handleChange} className="input-field" placeholder="Village or town" />
        </div>

        <div className="input-group">
          <label className="input-label">Assign Line *</label>
          <select name="lineId" value={form.lineId} onChange={handleChange} className="input-field" required>
            <option value="">Select a Line</option>
            {lines.map(line => (
              <option key={line._id} value={line._id}>{line.lineName} - {line.description}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '20px' }} disabled={loading}>
          {loading ? 'Saving...' : 'Save Customer'}
        </button>

      </form>
    </div>
  );
};

export default AddCustomer;
