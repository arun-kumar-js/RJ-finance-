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
      setLoans(loansRes.data.loans || []);

      if (loansRes.data.loans?.length > 0) {
        const activeLoan = loansRes.data.loans.find((l: any) => l.status === 'active') || loansRes.data.loans[0];
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

  return (
    <div className="animate-fade-in" style={{ padding: '20px' }}>
      <button onClick={() => navigate(-1)} className="btn-primary" style={{ marginBottom: '20px', background: 'var(--bg-card)', color: 'white', border: '1px solid var(--border)' }}>
        ← Back
      </button>

      <div className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '24px' }}>
        <img 
          src={customer.photoUrl || 'https://via.placeholder.com/100'} 
          alt={customer.customerName}
          style={{ width: '100px', height: '100px', borderRadius: '50px', objectFit: 'cover', border: '3px solid var(--primary)' }}
        />
        <div>
          <h1 style={{ color: 'var(--primary)', margin: '0 0 8px 0' }}>{customer.customerName}</h1>
          <p style={{ color: 'var(--text-muted)', margin: '0 0 4px 0' }}>📞 {customer.phone}</p>
          <p style={{ color: 'var(--text-muted)', margin: '0 0 4px 0' }}>📍 {customer.address}</p>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Line: {customer.lineId?.lineName || 'N/A'}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ color: 'var(--text-main)', marginBottom: '16px' }}>Loan Information</h2>
          {activeLoan ? (
            <div>
              <p style={{ margin: '8px 0', color: 'var(--text-muted)' }}>Loan Amount: <strong style={{ color: 'var(--text-main)' }}>₹{activeLoan.loanAmount}</strong></p>
              <p style={{ margin: '8px 0', color: 'var(--text-muted)' }}>Total Pending: <strong style={{ color: 'var(--danger)' }}>₹{activeLoan.totalPending}</strong></p>
              <p style={{ margin: '8px 0', color: 'var(--text-muted)' }}>EMI Amount: <strong style={{ color: 'var(--text-main)' }}>₹{activeLoan.emiAmount}</strong></p>
              <p style={{ margin: '8px 0', color: 'var(--text-muted)' }}>Progress: <strong style={{ color: 'var(--success)' }}>{activeLoan.paidInstallments} / {activeLoan.totalInstallments}</strong> paid</p>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>No active loan found.</p>
              {user?.role !== 'collector' && (
                <button onClick={() => navigate(`/add-loan/${customer._id}`)} className="btn-primary">
                  Create New Loan
                </button>
              )}
            </div>
          )}
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ color: 'var(--text-main)', marginBottom: '16px' }}>Upcoming EMI</h2>
          {nextEmi ? (
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ color: 'var(--primary)', fontSize: '48px', margin: '20px 0' }}>₹{nextEmi.amount}</h1>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Installment {nextEmi.installmentNumber}</p>
              <button 
                onClick={() => handleCollect(nextEmi)}
                className="btn-primary" 
                style={{ width: '100%', fontSize: '18px', padding: '16px' }}
              >
                Collect EMI
              </button>
            </div>
          ) : activeLoan ? (
            <p style={{ color: 'var(--success)', textAlign: 'center', marginTop: '40px' }}>All EMIs Paid! 🎉</p>
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '40px' }}>N/A</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
