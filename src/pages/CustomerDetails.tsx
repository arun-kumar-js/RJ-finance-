import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAppSelector } from '../redux/hooks';
import PasswordPromptModal from '../components/PasswordPromptModal';

const STATUS_COLORS: any = {
  active: '#10B981',
  closed: '#64748B',
  overdue: '#EF4444',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1.5px solid #6366F1',
  borderRadius: '10px',
  padding: '8px 12px',
  fontSize: '14px',
  color: '#1E293B',
  backgroundColor: '#F8F7FF',
  outline: 'none',
  boxSizing: 'border-box',
  marginTop: '4px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 'bold',
  color: '#94A3B8',
  textTransform: 'uppercase',
  marginBottom: '2px',
  display: 'block',
};

const CustomerDetails = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState<any>(null);
  const [loans, setLoans] = useState<any[]>([]);
  const [emis, setEmis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAppSelector(state => state.auth);
  const navigate = useNavigate();
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  // Edit state
  const [editMode, setEditMode] = useState(false);
  const [lines, setLines] = useState<any[]>([]);
  const [form, setForm] = useState<any>({});

  const canEdit = user?.role === 'admin' || user?.role === 'superadmin' || user?.role === 'finance';

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [custRes, linesRes] = await Promise.all([
        API.get(`/customers/${id}`),
        API.get('/lines'),
      ]);
      const cust = custRes.data;
      setCustomer(cust);
      setLines(linesRes.data || []);
      setForm({
        customerName: cust.customerName || '',
        guardianName: cust.guardianName || '',
        phone: cust.phone || '',
        street: cust.street || '',
        village: cust.village || '',
        occupation: cust.occupation || '',
        aadharNumber: cust.aadharNumber || '',
        bondNumber: cust.bondNumber || '',
        photoUrl: cust.photoUrl || '',
        lineId: cust.lineId?._id || '',
        status: cust.status || 'active',
      });

      const loansRes = await API.get('/loans', { params: { customerId: id } });
      const fetchedLoans = Array.isArray(loansRes.data) ? loansRes.data : (loansRes.data.loans || []);
      setLoans(fetchedLoans);

      if (fetchedLoans.length > 0) {
        const activeLoan = fetchedLoans.find((l: any) => l.status === 'active') || fetchedLoans[0];
        try {
          const emiRes = await API.get(`/loans/${activeLoan._id}/emis`);
          setEmis(emiRes.data);
        } catch {}
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.customerName.trim() || !form.phone.trim()) {
      alert('Customer name and phone are required.');
      return;
    }
    setSaving(true);
    try {
      await API.put(`/customers/${id}`, form);
      alert('Customer updated successfully!');
      setEditMode(false);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update customer');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      customerName: customer.customerName || '',
      guardianName: customer.guardianName || '',
      phone: customer.phone || '',
      street: customer.street || '',
      village: customer.village || '',
      occupation: customer.occupation || '',
      aadharNumber: customer.aadharNumber || '',
      bondNumber: customer.bondNumber || '',
      photoUrl: customer.photoUrl || '',
      lineId: customer.lineId?._id || '',
      status: customer.status || 'active',
    });
    setEditMode(false);
  };

  const handleDeleteClick = () => {
    if (!window.confirm('Are you sure you want to delete this customer? All associated loans and collections will be deleted.')) return;
    setPasswordModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setPasswordModalOpen(false);
    try {
      setLoading(true);
      await API.delete(`/customers/${id}`);
      alert('Customer deleted successfully!');
      navigate('/customers');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error deleting customer');
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '20px', color: 'var(--text-muted)' }}>Loading...</div>;
  if (!customer) return <div style={{ padding: '20px', color: 'var(--danger)' }}>Customer not found</div>;

  const activeOrLatestLoan = loans.find(l => l.status === 'active') || loans[0];

  return (
    <div className="animate-fade-in" style={{ padding: '0 20px', maxWidth: '800px', margin: '0 auto', paddingBottom: '40px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', marginTop: '20px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ width: '36px', height: '36px', backgroundColor: '#F1F5F9', color: '#1E293B', borderRadius: '18px', border: 'none', fontSize: '24px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '4px' }}
        >‹</button>
        <h1 style={{ color: '#1E293B', fontSize: '24px', fontWeight: 'bold', margin: 0, flex: 1 }}>Customer Details</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          {canEdit && !editMode && (
            <button
              onClick={() => setEditMode(true)}
              style={{ width: '36px', height: '36px', borderRadius: '18px', backgroundColor: 'rgba(99,102,241,0.12)', border: 'none', fontSize: '18px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              title="Edit Customer"
            >✏️</button>
          )}
          {(user?.role === 'admin' || user?.role === 'superadmin') && !editMode && (
            <button
              onClick={handleDeleteClick}
              style={{ width: '36px', height: '36px', borderRadius: '18px', backgroundColor: 'rgba(239,68,68,0.1)', border: 'none', color: '#EF4444', fontSize: '18px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              title="Delete Customer"
            >🗑️</button>
          )}
        </div>
      </div>

      {/* Edit Banner */}
      {editMode && (
        <div style={{ backgroundColor: '#6366F1', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#FFF', fontWeight: '700', fontSize: '14px' }}>✏️ Edit Mode — update the fields below and save</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleCancel}
              style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFF', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
            >Cancel</button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#10B981', color: '#FFF', fontWeight: '800', cursor: 'pointer', fontSize: '13px', opacity: saving ? 0.7 : 1 }}
            >{saving ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </div>
      )}

      {/* Profile Card */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: editMode ? '2px solid #6366F1' : '1px solid var(--border)' }}>

        {/* Avatar + Name Row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '24px' }}>
          <img
            src={(editMode ? form.photoUrl : customer.photoUrl) || `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.customerName)}&background=E2E8F0&color=64748B&size=80`}
            alt={customer.customerName}
            style={{ width: '80px', height: '80px', borderRadius: '40px', objectFit: 'cover', border: '3px solid #EAB308', flexShrink: 0 }}
            onError={(e) => { (e.target as any).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.customerName)}&background=E2E8F0&color=64748B&size=80`; }}
          />
          <div style={{ flex: 1 }}>
            {editMode ? (
              <>
                <label style={labelStyle}>Customer Name *</label>
                <input style={inputStyle} value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})} placeholder="Customer Name" />
                <label style={{...labelStyle, marginTop: '10px'}}>Guardian Name (C/O)</label>
                <input style={inputStyle} value={form.guardianName} onChange={e => setForm({...form, guardianName: e.target.value})} placeholder="Guardian Name" />
              </>
            ) : (
              <>
                <h2 style={{ color: '#1E293B', margin: '0 0 6px 0', fontSize: '22px', fontWeight: 'bold' }}>{customer.customerName}</h2>
                {customer.guardianName && <p style={{ color: '#64748B', margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>C/O {customer.guardianName}</p>}
              </>
            )}

            {/* Status */}
            {editMode ? (
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                {['active', 'closed', 'overdue'].map(s => (
                  <button
                    key={s}
                    onClick={() => setForm({...form, status: s})}
                    style={{
                      padding: '5px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                      fontWeight: '800', fontSize: '11px',
                      backgroundColor: form.status === s ? STATUS_COLORS[s] : '#E2E8F0',
                      color: form.status === s ? '#FFF' : '#64748B',
                    }}
                  >{s.toUpperCase()}</button>
                ))}
              </div>
            ) : (
              <span style={{ backgroundColor: STATUS_COLORS[customer.status] || '#64748B', color: 'white', fontWeight: 'bold', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', display: 'inline-block', marginTop: '8px' }}>
                {customer.status?.toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Photo URL when editing */}
        {editMode && (
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Photo URL</label>
            <input style={inputStyle} value={form.photoUrl} onChange={e => setForm({...form, photoUrl: e.target.value})} placeholder="https://..." />
          </div>
        )}

        {/* Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          {/* Phone */}
          <div>
            <label style={labelStyle}>Phone Number *</label>
            {editMode
              ? <input style={inputStyle} value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="Phone" type="tel" />
              : <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#334155' }}>📞 {customer.phone}</p>}
          </div>

          {/* Aadhar */}
          <div>
            <label style={labelStyle}>Aadhar Number</label>
            {editMode
              ? <input style={inputStyle} value={form.aadharNumber} onChange={e => setForm({...form, aadharNumber: e.target.value})} placeholder="Aadhar Number" />
              : <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#334155' }}>💳 {customer.aadharNumber || 'N/A'}</p>}
          </div>

          {/* Bond Number */}
          <div>
            <label style={labelStyle}>Bond Number</label>
            {editMode
              ? <input style={inputStyle} value={form.bondNumber} onChange={e => setForm({...form, bondNumber: e.target.value})} placeholder="Bond Number" />
              : <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#334155' }}>🔖 {customer.bondNumber || 'N/A'}</p>}
          </div>

          {/* Occupation */}
          <div>
            <label style={labelStyle}>Occupation</label>
            {editMode
              ? <input style={inputStyle} value={form.occupation} onChange={e => setForm({...form, occupation: e.target.value})} placeholder="Occupation" />
              : <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#334155' }}>💼 {customer.occupation || 'N/A'}</p>}
          </div>

          {/* Cash Source (read-only) */}
          {!editMode && (
            <div>
              <label style={labelStyle}>Cash Source</label>
              {activeOrLatestLoan?.cashSource ? (
                <span style={{
                  backgroundColor: activeOrLatestLoan.cashSource === 'in_hand_cash' ? '#DCFCE7' : '#E0F2FE',
                  color: activeOrLatestLoan.cashSource === 'in_hand_cash' ? '#15803D' : '#0369A1',
                  fontWeight: 'bold', padding: '4px 8px', borderRadius: '8px', fontSize: '13px', display: 'inline-block', marginTop: '2px'
                }}>
                  💵 {activeOrLatestLoan.cashSource === 'in_hand_cash' ? 'In Hand Cash' : 'Collection Cash'}
                </span>
              ) : <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#64748B' }}>N/A</p>}
            </div>
          )}
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '16px 0' }} />

        {/* Address */}
        <label style={labelStyle}>Address</label>
        {editMode ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '4px' }}>
            <div>
              <label style={{...labelStyle, color: '#B0BAC8'}}>Street</label>
              <input style={inputStyle} value={form.street} onChange={e => setForm({...form, street: e.target.value})} placeholder="Street" />
            </div>
            <div>
              <label style={{...labelStyle, color: '#B0BAC8'}}>Village / Area</label>
              <input style={inputStyle} value={form.village} onChange={e => setForm({...form, village: e.target.value})} placeholder="Village / Area" />
            </div>
          </div>
        ) : (
          <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#334155' }}>
            📍 {customer.street || customer.village
              ? `${customer.street || ''}${customer.street && customer.village ? ', ' : ''}${customer.village || ''}`
              : (customer.lineId?.lineName || 'N/A')}
          </p>
        )}

        <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '16px 0' }} />

        {/* Line */}
        <label style={labelStyle}>Line</label>
        {editMode ? (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
            {lines.map(line => (
              <button
                key={line._id}
                onClick={() => setForm({...form, lineId: line._id})}
                style={{
                  padding: '8px 16px', borderRadius: '10px', cursor: 'pointer',
                  border: `1.5px solid ${form.lineId === line._id ? '#6366F1' : '#E2E8F0'}`,
                  backgroundColor: form.lineId === line._id ? '#6366F1' : '#F8FAFC',
                  color: form.lineId === line._id ? '#FFF' : '#475569',
                  fontWeight: '700', fontSize: '13px',
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                }}
              >
                <span>{line.lineName}</span>
                {line.description && <span style={{ fontSize: '10px', opacity: 0.75, marginTop: '2px' }}>{line.description}</span>}
              </button>
            ))}
          </div>
        ) : (
          <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#334155' }}>
            🗺️ {customer.lineId?.lineName} {customer.lineId?.description ? `- ${customer.lineId.description}` : ''}
          </p>
        )}
      </div>

      {/* Loans Section */}
      <div style={{ marginTop: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1E293B', margin: 0 }}>Loans</h2>
          {user?.role !== 'collector' && (
            <button
              onClick={() => navigate(`/add-loan/${customer._id}`)}
              style={{ backgroundColor: '#10B981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
            >+ Create Loan</button>
          )}
        </div>

        {loans.length === 0 ? (
          <div style={{ padding: '32px', backgroundColor: 'white', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}>
            <p style={{ color: '#94A3B8', fontSize: '15px', fontWeight: '600', margin: 0 }}>No active or closed loans found.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {loans.map(loan => (
              <div
                key={loan._id}
                onClick={() => navigate(`/loans/${loan._id}`)}
                style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid var(--border)', borderLeft: '4px solid #6366F1' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#1E293B' }}>
                    {loan.bondNumber || 'No Bond'} - ₹{loan.loanAmount.toLocaleString('en-IN')}
                  </h3>
                  <span style={{ backgroundColor: STATUS_COLORS[loan.status] || '#64748B', color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '12px' }}>
                    {loan.status?.toUpperCase()}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                  {loan.cashSource && (
                    <p style={{ margin: 0, fontSize: '14px', color: '#10B981', fontWeight: 'bold' }}>
                      💵 Cash Source: {loan.cashSource === 'in_hand_cash' ? 'In Hand Cash' : 'Collection Cash'}
                    </p>
                  )}
                  {(customer.street || customer.village) && (
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748B', fontWeight: '600' }}>
                      📍 {customer.street || ''}{customer.street && customer.village ? ', ' : ''}{customer.village || ''}
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <p style={{ margin: 0, fontSize: '14px', color: '#64748B', fontWeight: '500' }}>Interest: {loan.interestRate}%</p>
                  <p style={{ margin: 0, fontSize: '14px', color: '#64748B', fontWeight: '500' }}>EMI: ₹{loan.emiAmount}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <p style={{ margin: 0, fontSize: '14px', color: '#64748B', fontWeight: '500' }}>Paid: ₹{loan.totalPaid}</p>
                  <p style={{ margin: 0, fontSize: '14px', color: '#EF4444', fontWeight: 'bold' }}>Pending: ₹{loan.totalPending}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <PasswordPromptModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        onSuccess={handleConfirmDelete}
        title="Delete Customer"
      />
    </div>
  );
};

export default CustomerDetails;
