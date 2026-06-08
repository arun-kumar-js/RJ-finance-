import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAppSelector } from '../redux/hooks';

const CustomerDetails = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState<any>(null);
  const [loans, setLoans] = useState<any[]>([]);
  const [emis, setEmis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAppSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const custRes = await API.get(`/customers/${id}`);
      setCustomer(custRes.data);

      const loansRes = await API.get('/loans', { params: { customerId: id } });
      const fetchedLoans = Array.isArray(loansRes.data) ? loansRes.data : (loansRes.data.loans || []);
      setLoans(fetchedLoans);

      if (fetchedLoans.length > 0) {
        const activeLoan = fetchedLoans.find((l: any) => l.status === 'active') || fetchedLoans[0];
        const emiRes = await API.get(`/loans/${activeLoan._id}/emis`);
        setEmis(emiRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCollect = async (emi: any) => {
    if (!window.confirm(`Collect ₹${emi.amount} for installment ${emi.installmentNumber}?`)) return;
    
    try {
      const activeLoan = loans.find(l => l.status === 'active') || loans[0];
      await API.post('/collections', {
        customerId: customer._id,
        loanId: activeLoan._id,
        emiScheduleId: emi._id,
        collectorId: user?.id || user?._id,
        receiptBookNumber: 'AUTO',
        receiptNumber: (Date.now() % 100000000).toString(),
        amount: emi.amount,
        collectionDate: new Date().toISOString()
      });
      alert('Collection successful!');
      fetchData(); // refresh
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Error collecting EMI');
    }
  };

  if (loading) return <div style={{ padding: '20px', color: 'var(--text-muted)' }}>Loading...</div>;
  if (!customer) return <div style={{ padding: '20px', color: 'var(--danger)' }}>Customer not found</div>;

  const activeLoan = loans.find(l => l.status === 'active');
  const nextEmi = emis.find(e => e.status !== 'Paid');
  
  const STATUS_COLORS: any = {
    active: '#10B981',
    closed: '#64748B',
    overdue: '#EF4444'
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0 20px', maxWidth: '800px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', marginTop: '20px' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ width: '36px', height: '36px', backgroundColor: '#F1F5F9', color: '#1E293B', borderRadius: '18px', border: 'none', fontSize: '24px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '4px' }}
        >
          ‹
        </button>
        <h1 style={{ color: '#1E293B', fontSize: '24px', fontWeight: 'bold', margin: 0, flex: 1 }}>Customer Details</h1>
      </div>

      {/* Profile Card */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}>
        
        {/* Profile Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
          {customer.photoUrl && customer.photoUrl.startsWith('http') ? (
            <img 
              src={customer.photoUrl} 
              alt={customer.customerName}
              style={{ width: '80px', height: '80px', borderRadius: '40px', objectFit: 'cover', border: '3px solid #EAB308' }}
              onError={(e) => {
                (e.target as any).style.display = 'none';
                (e.target as any).nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div style={{ display: (!customer.photoUrl || !customer.photoUrl.startsWith('http')) ? 'flex' : 'none', width: '80px', height: '80px', borderRadius: '40px', backgroundColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center', fontSize: '36px', fontWeight: 'bold', color: '#64748B', border: '3px solid #EAB308', flexShrink: 0 }}>
            {customer.customerName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ color: '#1E293B', margin: '0 0 8px 0', fontSize: '24px', fontWeight: 'bold' }}>{customer.customerName}</h2>
            {customer.guardianName && <p style={{ color: '#64748B', margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>C/O {customer.guardianName}</p>}
            <span style={{ backgroundColor: STATUS_COLORS[customer.status] || '#64748B', color: 'white', fontWeight: 'bold', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', display: 'inline-block' }}>
              {customer.status?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' }}>
          <div>
            <p style={{ margin: '0 0 4px 0', fontSize: '11px', fontWeight: 'bold', color: '#94A3B8', textTransform: 'uppercase' }}>Phone Number</p>
            <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#334155' }}>📞 {customer.phone}</p>
          </div>
          <div>
            <p style={{ margin: '0 0 4px 0', fontSize: '11px', fontWeight: 'bold', color: '#94A3B8', textTransform: 'uppercase' }}>Aadhar Number</p>
            <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#334155' }}>💳 {customer.aadharNumber || 'N/A'}</p>
          </div>
          <div>
            <p style={{ margin: '0 0 4px 0', fontSize: '11px', fontWeight: 'bold', color: '#94A3B8', textTransform: 'uppercase' }}>Bond Number</p>
            <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#334155' }}>🔖 {customer.bondNumber || 'N/A'}</p>
          </div>
          <div>
            <p style={{ margin: '0 0 4px 0', fontSize: '11px', fontWeight: 'bold', color: '#94A3B8', textTransform: 'uppercase' }}>Occupation</p>
            <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#334155' }}>💼 {customer.occupation || 'N/A'}</p>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '16px 0' }} />
        
        <p style={{ margin: '0 0 4px 0', fontSize: '11px', fontWeight: 'bold', color: '#94A3B8', textTransform: 'uppercase' }}>Address</p>
        <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#334155' }}>📍 {customer.street}, {customer.village}</p>

        <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '16px 0' }} />

        <p style={{ margin: '0 0 4px 0', fontSize: '11px', fontWeight: 'bold', color: '#94A3B8', textTransform: 'uppercase' }}>Line</p>
        <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#334155' }}>🗺️ {customer.lineId?.lineName} {customer.lineId?.description ? `- ${customer.lineId.description}` : ''}</p>
      </div>

      {/* Loans Section */}
      <div style={{ marginTop: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1E293B', margin: 0 }}>Loans</h2>
          {user?.role !== 'collector' && (
            <button 
              onClick={() => navigate(`/add-loan/${customer._id}`)} 
              style={{ backgroundColor: '#10B981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
            >
              + Create Loan
            </button>
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
                    #{loan.loanNumber} - ₹{loan.loanAmount.toLocaleString('en-IN')}
                  </h3>
                  <span style={{ backgroundColor: STATUS_COLORS[loan.status] || '#64748B', color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '12px' }}>
                    {loan.status?.toUpperCase()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <p style={{ margin: 0, fontSize: '14px', color: '#64748B', fontWeight: '500' }}>Interest: {loan.interestRate}%</p>
                  <p style={{ margin: 0, fontSize: '14px', color: '#64748B', fontWeight: '500' }}>EMI: ₹{loan.emiAmount}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ margin: 0, fontSize: '14px', color: '#64748B', fontWeight: '500' }}>Paid: ₹{loan.totalPaid}</p>
                  <p style={{ margin: 0, fontSize: '14px', color: '#EF4444', fontWeight: 'bold' }}>Pending: ₹{loan.totalPending}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default CustomerDetails;
