import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const Loans = () => {
  const [loans, setLoans] = useState<any[]>([]);
  const [filteredLoans, setFilteredLoans] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLoans();
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredLoans(loans);
    } else {
      const lower = search.toLowerCase();
      setFilteredLoans(loans.filter(l => 
        l.customerId?.customerName?.toLowerCase().includes(lower) ||
        l.customerId?.phone?.includes(lower) ||
        l.loanNumber?.toString().includes(lower)
      ));
    }
  }, [search, loans]);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const res = await API.get('/loans');
      setLoans(res.data || []);
      setFilteredLoans(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'active') return '#10B981';
    if (status === 'closed') return '#64748B';
    if (status === 'overdue') return '#EF4444';
    return '#6366F1';
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0 20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1 style={{ color: '#1E293B', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>All Loans</h1>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <input 
          type="text" 
          placeholder="🔍 Search name or mobile..." 
          className="input-field"
          style={{ width: '100%', maxWidth: '100%', backgroundColor: '#F8FAFC' }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}><p style={{ color: 'var(--text-muted)' }}>Loading loans...</p></div>
      ) : filteredLoans.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '16px', fontWeight: '600' }}>No Data</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '40px' }}>
          {filteredLoans.map((item) => {
            const custName = item.customerId?.customerName || 'Unknown';
            const totalPending = (item.emiAmount * item.totalInstallments) - (item.totalPaid || 0);

            return (
              <div 
                key={item._id} 
                onClick={() => navigate(`/loans/${item._id}`)}
                style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '16px', 
                  padding: '16px', 
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  border: '1px solid var(--border)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <h3 style={{ color: '#1E293B', fontSize: '16px', margin: '0 0 4px 0', fontWeight: 'bold' }}>
                      #{item.loanNumber} - {custName}
                    </h3>
                    <p style={{ color: '#64748B', fontSize: '13px', margin: '0 0 2px 0' }}>📞 {item.customerId?.phone || 'N/A'}</p>
                    {item.customerId?.lineId && (
                      <p style={{ color: '#6366F1', fontSize: '13px', margin: '0', fontWeight: '600' }}>
                        🔖 {item.customerId.lineId.lineName}
                      </p>
                    )}
                  </div>
                  <span style={{ 
                    backgroundColor: getStatusColor(item.status), 
                    color: 'white', 
                    fontSize: '10px', 
                    fontWeight: 'bold', 
                    padding: '4px 8px', 
                    borderRadius: '12px',
                    textTransform: 'uppercase'
                  }}>
                    {item.status}
                  </span>
                </div>

                <p style={{ color: '#6366F1', fontSize: '12px', fontWeight: '600', marginBottom: '12px' }}>{item.loanType}</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E2E8F0', paddingTop: '12px' }}>
                  <div>
                    <p style={{ color: '#64748B', fontSize: '12px', margin: '0 0 4px 0' }}>Loan Amount</p>
                    <p style={{ color: '#1E293B', fontSize: '15px', fontWeight: 'bold', margin: 0 }}>₹{item.loanAmount?.toLocaleString()}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: '#64748B', fontSize: '12px', margin: '0 0 4px 0' }}>Total Pending</p>
                    <p style={{ color: '#EF4444', fontSize: '15px', fontWeight: 'bold', margin: 0 }}>₹{totalPending?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Loans;
