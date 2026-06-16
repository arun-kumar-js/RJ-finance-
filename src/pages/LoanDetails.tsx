import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLoan, getEmiSchedule, deleteLoan, closeLoan } from '../services/loanService';
import { collectEmi } from '../services/financeService';
import { useAppSelector } from '../redux/hooks';
import PasswordPromptModal from '../components/PasswordPromptModal';

const LoanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);

  const [loan, setLoan] = useState<any>(null);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [collecting, setCollecting] = useState(false);
  const [challanNumber, setChallanNumber] = useState('');
  
  const [closeModalVisible, setCloseModalVisible] = useState(false);
  const [closeAmount, setCloseAmount] = useState('');
  const [closeChallan, setCloseChallan] = useState('');

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordAction, setPasswordAction] = useState<'delete' | 'close' | null>(null);

  useEffect(() => {
    fetchLoan();
  }, [id]);

  const fetchLoan = async () => {
    try {
      setLoading(true);
      const loanData = await getLoan(id!);
      setLoan(loanData);

      const emiData = await getEmiSchedule(id!);
      setSchedule(emiData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCollect = async (emi: any) => {
    if (!challanNumber.trim()) {
      alert("Challan Number is required!");
      return;
    }

    if (!window.confirm(`Collect EMI ₹${emi.amount} for Installment ${emi.installmentNumber}?`)) return;

    try {
      setCollecting(true);
      await collectEmi({
        customerId: loan.customerId._id || loan.customerId,
        loanId: loan._id,
        emiScheduleId: emi._id,
        receiptBookNumber: 'CHALLAN',
        receiptNumber: challanNumber.trim(),
        amount: emi.amount,
        collectionDate: new Date().toISOString()
      });
      setChallanNumber('');
      fetchLoan();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || 'Failed to collect EMI');
    } finally {
      setCollecting(false);
    }
  };

  const handleDeleteClick = () => {
    if (!window.confirm('Are you sure you want to delete this loan?')) return;
    setPasswordAction('delete');
    setPasswordModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setPasswordModalOpen(false);
    try {
      await deleteLoan(id!);
      navigate(-1);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete loan');
    }
  };

  const handleCloseClick = () => {
    setCloseAmount('');
    setCloseChallan('');
    setCloseModalVisible(true);
  };

  const handleCloseConfirmClick = () => {
    setPasswordAction('close');
    setPasswordModalOpen(true);
  };

  const handleConfirmClose = async () => {
    setPasswordModalOpen(false);
    try {
      setCloseModalVisible(false);
      await closeLoan(id!, closeAmount.trim(), closeChallan.trim());
      fetchLoan();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to close loan');
    }
  };

  if (loading || !loan) {
    return <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading Loan Details...</div>;
  }

  const nextPendingEmi = schedule.find(s => s.status.toLowerCase() === 'pending');
  const totalPaid = loan.totalPaid || 0;
  const remaining = (loan.emiAmount * loan.totalInstallments) - totalPaid;

  const getBadgeColor = (status: string) => {
    if (status.toLowerCase() === 'paid') return '#10B981';
    if (status.toLowerCase() === 'pending') return '#F59E0B';
    return '#64748B';
  };

  return (
    <div className="animate-fade-in" style={{ backgroundColor: '#F1F5F9', minHeight: '100vh', paddingBottom: '40px' }}>
      {/* Top Blue Header Section */}
      <div style={{ backgroundColor: '#1E3A5F', padding: '24px', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px', color: 'white', position: 'relative' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', position: 'relative' }}>
          <button onClick={() => navigate(-1)} style={{ position: 'absolute', left: 0, background: 'none', border: 'none', color: 'white', fontSize: '28px', cursor: 'pointer' }}>‹</button>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Loan Details #{loan.loanNumber}</h1>
          {(user?.role === 'admin' || user?.role === 'superadmin') && (
            <div style={{ position: 'absolute', right: 0, display: 'flex', gap: '8px' }}>
              {loan.status !== 'closed' && (
                <button onClick={handleCloseClick} style={{ padding: '4px 12px', borderRadius: '18px', backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Close
                </button>
              )}
              <button onClick={handleDeleteClick} style={{ width: '36px', height: '36px', borderRadius: '18px', backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', fontSize: '18px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                🗑️
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <span style={{ color: '#CBD5E1', fontSize: '14px', fontWeight: '600' }}>Loan Amount (₹)</span>
          <span style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>₹{loan.loanAmount?.toLocaleString()}</span>
        </div>
        
        {loan.bondNumber && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ color: '#CBD5E1', fontSize: '14px', fontWeight: '600' }}>Bond Number</span>
            <span style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>🔖 {loan.bondNumber}</span>
          </div>
        )}

        {loan.cashSource && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ color: '#CBD5E1', fontSize: '14px', fontWeight: '600' }}>Cash Source</span>
            <span style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>
              💵 {loan.cashSource === 'in_hand_cash' ? 'In Hand Cash' : 'Collection Cash'}
            </span>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <span style={{ color: '#CBD5E1', fontSize: '14px', fontWeight: '600' }}>Total Paid</span>
          <span style={{ color: '#10B981', fontSize: '16px', fontWeight: 'bold' }}>₹{totalPaid?.toLocaleString()}</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: loan.status === 'closed' ? '#F59E0B' : '#CBD5E1', fontSize: '14px', fontWeight: '600' }}>
            {loan.status === 'closed' ? 'Discount Price' : 'Remaining'}
          </span>
          <span style={{ color: loan.status === 'closed' ? '#F59E0B' : '#EF4444', fontSize: '16px', fontWeight: 'bold' }}>
            ₹{remaining?.toLocaleString()}
          </span>
        </div>
      </div>

      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1E293B', marginBottom: '16px' }}>EMI Schedule</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {(loan.status === 'closed' ? schedule.filter(e => e.status === 'Paid') : schedule).map((emi) => (
            <div key={emi._id} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ color: '#1E293B', fontSize: '15px', fontWeight: 'bold' }}>Installment {emi.installmentNumber}</span>
                <span style={{ backgroundColor: getBadgeColor(emi.status), color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  {emi.status}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#64748B', fontSize: '13px' }}>Due Date: {new Date(emi.dueDate).toLocaleDateString('en-GB')}</span>
                <span style={{ color: '#1E293B', fontSize: '16px', fontWeight: 'bold' }}>₹{emi.amount}</span>
              </div>

              {emi.paidDate && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10B981', fontSize: '13px', fontWeight: 'bold', marginTop: '8px' }}>
                  <span>Paid Date: {new Date(emi.paidDate).toLocaleDateString('en-GB')}</span>
                  {emi.challanNumber && <span>Challan No: {emi.challanNumber}</span>}
                </div>
              )}

              {emi._id === nextPendingEmi?._id && (
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <input
                    type="text"
                    placeholder="Challan No"
                    value={challanNumber}
                    onChange={(e) => setChallanNumber(e.target.value.toUpperCase())}
                    style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '15px' }}
                  />
                  <button 
                    onClick={() => handleCollect(emi)}
                    disabled={collecting}
                    style={{ flex: 1, backgroundColor: '#F59E0B', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontSize: '15px', fontWeight: 'bold', cursor: collecting ? 'not-allowed' : 'pointer', opacity: collecting ? 0.7 : 1 }}
                  >
                    {collecting ? 'Collecting...' : 'Collected'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {closeModalVisible && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', width: '100%', maxWidth: '400px' }}>
            <h3 style={{ marginTop: 0, color: '#1E3A5F', fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>Force Close Loan</h3>
            <p style={{ color: '#64748B', fontSize: '14px', textAlign: 'center', marginBottom: '20px' }}>Enter amount collected and challan to close (optional).</p>
            
            <input 
              type="number" 
              placeholder="Amount (₹)" 
              value={closeAmount}
              onChange={e => setCloseAmount(e.target.value)}
              style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '16px', boxSizing: 'border-box' }}
            />
            
            <input 
              type="text" 
              placeholder="Challan Number" 
              value={closeChallan}
              onChange={e => setCloseChallan(e.target.value.toUpperCase())}
              style={{ width: '100%', padding: '12px', marginBottom: '24px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '16px', boxSizing: 'border-box', textTransform: 'uppercase' }}
            />
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setCloseModalVisible(false)}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: '#F1F5F9', color: '#1E293B', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleCloseConfirmClick}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: '#1E3A5F', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Confirm Close
              </button>
            </div>
          </div>
        </div>
      )}

      <PasswordPromptModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        onSuccess={passwordAction === 'delete' ? handleConfirmDelete : handleConfirmClose}
        title={passwordAction === 'delete' ? 'Delete Loan' : 'Close Loan'}
      />

    </div>
  );
};

export default LoanDetails;
