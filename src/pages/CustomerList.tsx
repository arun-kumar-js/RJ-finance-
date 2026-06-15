import React, { useEffect, useState } from 'react';
import { getCustomers } from '../services/customerService';
import { getLines } from '../services/lineService';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';

const CustomerList = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);

  const [lines, setLines] = useState<any[]>([]);
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  useEffect(() => {
    fetchLines();
  }, []);

  const fetchLines = async () => {
    try {
      const data = await getLines();
      setLines(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers({ search });
      setCustomers(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const canAdd = user?.role !== 'collector';

  const filteredCustomers = customers.filter(c => {
    if (!selectedLineId) return true;
    return c.lineId?._id === selectedLineId;
  });

  return (
    <div className="animate-fade-in" style={{ padding: '0 20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => navigate(-1)} 
            style={{ width: '36px', height: '36px', backgroundColor: '#F1F5F9', color: '#1E293B', borderRadius: '18px', border: 'none', fontSize: '24px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '4px' }}
          >
            ‹
          </button>
          <h1 style={{ color: '#1E293B', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Customers</h1>
        </div>
        {canAdd && (
          <button 
            onClick={() => navigate('/add-customer')} 
            style={{ width: '36px', height: '36px', backgroundColor: '#6366F1', color: 'white', borderRadius: '18px', border: 'none', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            +
          </button>
        )}
      </div>

      <div style={{ marginBottom: '24px' }}>
        <input 
          type="text" 
          placeholder="🔍 Search name, mobile, or loan ID..." 
          className="input-field"
          style={{ width: '100%', maxWidth: '100%', backgroundColor: '#F8FAFC' }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {lines.length > 0 && (
        <div style={{ display: 'flex', overflowX: 'auto', gap: '10px', paddingBottom: '16px', marginBottom: '8px', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          <button
            onClick={() => setSelectedLineId(null)}
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              border: selectedLineId === null ? 'none' : '1px solid #E2E8F0',
              backgroundColor: selectedLineId === null ? '#6366F1' : '#F1F5F9',
              color: selectedLineId === null ? 'white' : '#475569',
              fontWeight: 'bold',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            All Lines
          </button>
          {lines.map(line => (
            <button
              key={line._id}
              onClick={() => setSelectedLineId(line._id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '10px 16px',
                borderRadius: '12px',
                border: selectedLineId === line._id ? 'none' : '1px solid #E2E8F0',
                backgroundColor: selectedLineId === line._id ? '#6366F1' : '#F1F5F9',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                textAlign: 'left'
              }}
            >
              <span style={{ color: selectedLineId === line._id ? 'white' : '#475569', fontWeight: 'bold', fontSize: '14px' }}>{line.lineName}</span>
              {line.description && <span style={{ color: selectedLineId === line._id ? 'rgba(255,255,255,0.8)' : '#64748B', fontSize: '11px', marginTop: '2px' }}>{line.description}</span>}
            </button>
          ))}
        </div>
      )}
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}><p style={{ color: 'var(--text-muted)' }}>Loading customers...</p></div>
      ) : customers.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <span style={{ fontSize: '60px', marginBottom: '16px', display: 'block' }}>👥</span>
          <p style={{ color: 'var(--text-muted)', fontSize: '16px', fontWeight: '600' }}>No customers found.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '40px' }}>
          {filteredCustomers.map((c) => (
            <div 
              key={c._id} 
              onClick={() => navigate(`/customer/${c._id}`)}
              style={{ 
                backgroundColor: 'white', 
                borderRadius: '16px', 
                padding: '16px', 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                border: '1px solid var(--border)'
              }}
            >
              <img 
                src={c.photoUrl || 'https://via.placeholder.com/56'} 
                alt={c.customerName}
                style={{ width: '56px', height: '56px', borderRadius: '28px', objectFit: 'cover', backgroundColor: '#E2E8F0', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
              />
              
              <div style={{ flex: 1, marginLeft: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ color: '#1E293B', fontSize: '16px', margin: '0 0 4px 0', fontWeight: 'bold' }}>{c.customerName}</h3>
                  {c.loans?.length > 0 && (
                    <span style={{ backgroundColor: '#10B981', color: 'white', fontSize: '10px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '10px' }}>
                      ACTIVE
                    </span>
                  )}
                </div>
                <p style={{ color: '#64748B', fontSize: '13px', margin: '0 0 2px 0' }}>📞 {c.phone}</p>
                <p style={{ color: '#6366F1', fontSize: '13px', margin: '0 0 6px 0', fontWeight: '600' }}>📍 {c.lineId?.lineName || 'Unassigned'}</p>
                {c.createdBy?.name && (
                  <p style={{ color: '#64748B', fontSize: '11px', margin: '0 0 6px 0', fontStyle: 'italic' }}>👤 Added by: {c.createdBy.name}</p>
                )}
                
                {c.loans?.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span style={{ backgroundColor: '#EEF2FF', color: '#6366F1', padding: '4px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold' }}>
                      💳 Loan #{c.loans[0].loanNumber}
                    </span>
                  </div>
                )}
              </div>

              <span style={{ color: '#94A3B8', fontSize: '24px', marginLeft: '12px' }}>›</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerList;
