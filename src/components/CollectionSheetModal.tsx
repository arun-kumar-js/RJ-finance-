import React, { useEffect, useState } from 'react';
import API from '../services/api';

interface CollectionSheetModalProps {
  lineId: string | null;
  lineName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const CollectionSheetModal: React.FC<CollectionSheetModalProps> = ({
  lineId,
  lineName,
  isOpen,
  onClose,
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && lineId) {
      fetchSheetData(lineId);
    } else {
      setData(null);
      setError(null);
    }
  }, [isOpen, lineId]);

  const fetchSheetData = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get(`/dashboard/line-collection-sheet?lineId=${id}`);
      setData(res.data);
    } catch (err: any) {
      console.error('Error loading collection sheet:', err);
      setError(err.response?.data?.message || 'Failed to load line collection sheet');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        padding: '16px',
      }}
    >
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-collection-sheet, #printable-collection-sheet * {
              visibility: visible;
            }
            #printable-collection-sheet {
              position: absolute;
              left: 0;
              top: 0;
              width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
              box-shadow: none !important;
            }
            .no-print {
              display: none !important;
            }
            @page {
              size: A4 landscape;
              margin: 6mm;
            }
          }
        `}
      </style>

      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          width: '98vw',
          maxWidth: '1300px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
        }}
      >
        {/* Top Modal Controls (Hidden in Print) */}
        <div
          className="no-print"
          style={{
            padding: '16px 24px',
            backgroundColor: '#0F172A',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #334155',
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📄</span> Line Collection Print Sheet — {lineName || data?.lineName || 'Line Report'}
            </h2>
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>
              Hard copy printout layout for collection agent
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => window.print()}
              disabled={loading || !data}
              style={{
                backgroundColor: '#10B981',
                color: 'white',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '13px',
                cursor: loading || !data ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              <span>🖨️</span> Print / PDF
            </button>
            <button
              onClick={() => window.print()}
              disabled={loading || !data}
              style={{
                backgroundColor: '#2563EB',
                color: 'white',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '13px',
                cursor: loading || !data ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              <span>📥</span> Save PDF
            </button>
            <button
              onClick={onClose}
              style={{
                backgroundColor: '#334155',
                color: '#CBD5E1',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            backgroundColor: '#F8FAFC',
          }}
        >
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748B' }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>⏳</div>
              <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Loading collection sheet for {lineName}...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#EF4444' }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>⚠️</div>
              <p style={{ fontSize: '16px', fontWeight: 'bold' }}>{error}</p>
              <button
                onClick={() => lineId && fetchSheetData(lineId)}
                style={{
                  marginTop: '12px',
                  backgroundColor: '#6366F1',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                Retry
              </button>
            </div>
          ) : data ? (
            <div
              id="printable-collection-sheet"
              style={{
                backgroundColor: '#FFFFFF',
                padding: '16px',
                borderRadius: '8px',
                color: '#0F172A',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                fontSize: '11px',
              }}
            >
              {/* Header Box */}
              <div
                style={{
                  border: '1.5px solid #E2E8F0',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginBottom: '14px',
                  backgroundColor: '#F8FAFC',
                }}
              >
                <div style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '0.5px', color: '#0F172A', marginBottom: '10px' }}>
                  🏢 RJ FINANCE — FIELD COLLECTION REPORT
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px 24px',
                    fontSize: '13px',
                    background: '#F1F5F9',
                    padding: '10px 16px',
                    borderRadius: '6px',
                  }}
                >
                  <div><strong>Line Name:</strong> {data.lineName}</div>
                  <div><strong>Collection Date / Week:</strong> {data.collectionDate} (Week {data.weekNumber})</div>
                  <div><strong>Agent / Collector:</strong> {data.collectorName}</div>
                  <div><strong>Total Active Accounts:</strong> {data.summary?.totalAccounts || 0} Accounts</div>
                </div>
              </div>

              {/* Data Table (13 Columns) */}
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  marginBottom: '16px',
                  fontSize: '11px',
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: '#F1F5F9', color: '#334155' }}>
                    <th style={{ border: '1px solid #E2E8F0', padding: '6px 4px', width: '32px', textAlign: 'center' }}>S.No</th>
                    <th style={{ border: '1px solid #E2E8F0', padding: '6px 4px', width: '75px', textAlign: 'center' }}>Bond<br />No</th>
                    <th style={{ border: '1px solid #E2E8F0', padding: '6px 6px', textAlign: 'left' }}>Customer<br />Name</th>
                    <th style={{ border: '1px solid #E2E8F0', padding: '6px 6px', textAlign: 'left' }}>Guardian<br />Name</th>
                    <th style={{ border: '1px solid #E2E8F0', padding: '6px 6px', textAlign: 'left' }}>Street /<br />Village</th>
                    <th style={{ border: '1px solid #E2E8F0', padding: '6px 4px', width: '85px', textAlign: 'center' }}>Phone<br />Number</th>
                    <th style={{ border: '1px solid #E2E8F0', padding: '6px 4px', width: '80px', textAlign: 'center' }}>Start Date<br /><span style={{ fontSize: '9px', fontWeight: 'normal' }}>(EMI Start)</span></th>
                    <th style={{ border: '1px solid #E2E8F0', padding: '6px 4px', width: '80px', textAlign: 'center' }}>End Date<br /><span style={{ fontSize: '9px', fontWeight: 'normal' }}>(Loan End)</span></th>
                    <th style={{ border: '1px solid #E2E8F0', padding: '6px 4px', width: '85px', textAlign: 'right' }}>Total Pending<br />(₹) <span style={{ fontSize: '9px', fontWeight: 'normal' }}>(Overall Bal)</span></th>
                    <th style={{ border: '1px solid #E2E8F0', padding: '6px 4px', width: '80px', textAlign: 'right' }}>Bending<br />EMI (₹)<br /><span style={{ fontSize: '9px', fontWeight: 'normal' }}>(Past Overdue)</span></th>
                    <th style={{ border: '1px solid #E2E8F0', padding: '6px 4px', width: '75px', textAlign: 'right' }}>Current<br />Week<br />EMI (₹)</th>
                    <th style={{ border: '1px solid #E2E8F0', padding: '6px 4px', width: '85px', textAlign: 'right' }}>Total<br />Due (₹)<br /><span style={{ fontSize: '9px', fontWeight: 'normal' }}>(Bending + Current)</span></th>
                    <th style={{ border: '1px solid #E2E8F0', padding: '6px 4px', width: '95px', textAlign: 'center' }}>Collected<br />Cash (₹)<br /><span style={{ fontSize: '9px', fontWeight: 'normal' }}>(Write by hand)</span></th>
                    <th style={{ border: '1px solid #E2E8F0', padding: '6px 4px', width: '110px', textAlign: 'center' }}>Remarks<br /><span style={{ fontSize: '9px', fontWeight: 'normal' }}>(Notes/Promise)</span></th>
                  </tr>
                </thead>
                <tbody>
                  {data.rows && data.rows.length > 0 ? (
                    data.rows.map((r: any, i: number) => (
                      <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#F8FAFC' }}>
                        <td style={{ border: '1px solid #E2E8F0', padding: '5px 4px', textAlign: 'center', fontWeight: 'bold' }}>{r.sNo}</td>
                        <td style={{ border: '1px solid #E2E8F0', padding: '5px 4px', textAlign: 'center', fontWeight: 'bold', fontFamily: 'monospace' }}>{r.bondNumber}</td>
                        <td style={{ border: '1px solid #E2E8F0', padding: '5px 6px', fontWeight: 'bold' }}>{r.customerName}</td>
                        <td style={{ border: '1px solid #E2E8F0', padding: '5px 6px' }}>{r.guardianName}</td>
                        <td style={{ border: '1px solid #E2E8F0', padding: '5px 6px' }}>{r.street}</td>
                        <td style={{ border: '1px solid #E2E8F0', padding: '5px 4px', textAlign: 'center', fontFamily: 'monospace' }}>{r.phone}</td>
                        <td style={{ border: '1px solid #E2E8F0', padding: '5px 4px', textAlign: 'center', fontSize: '10px', whiteSpace: 'nowrap' }}>{r.startDate}</td>
                        <td style={{ border: '1px solid #E2E8F0', padding: '5px 4px', textAlign: 'center', fontSize: '10px', whiteSpace: 'nowrap' }}>{r.endDate}</td>
                        <td style={{ border: '1px solid #E2E8F0', padding: '5px 4px', textAlign: 'right', fontWeight: 'bold' }}>₹{r.totalPending?.toLocaleString()}</td>
                        <td style={{ border: '1px solid #E2E8F0', padding: '5px 4px', textAlign: 'right', color: r.bendingEmi > 0 ? '#DC2626' : '#475569', fontWeight: r.bendingEmi > 0 ? 'bold' : 'normal' }}>
                          ₹{r.bendingEmi?.toLocaleString()}
                        </td>
                        <td style={{ border: '1px solid #E2E8F0', padding: '5px 4px', textAlign: 'right', fontWeight: '600' }}>₹{r.currentWeekEmi?.toLocaleString()}</td>
                        <td style={{ border: '1px solid #E2E8F0', padding: '5px 4px', textAlign: 'right', fontWeight: 'bold', backgroundColor: '#F1F5F9' }}>₹{r.totalDue?.toLocaleString()}</td>
                        <td style={{ border: '1px solid #E2E8F0', padding: '5px 6px', textAlign: 'center', color: '#64748B', fontSize: '11px' }}>
                          {r.collectedCash || '-'}
                        </td>
                        <td style={{ border: '1px solid #E2E8F0', padding: '5px 6px', color: '#64748B', fontSize: '11px' }}>
                          {r.remarks || '-'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={14} style={{ border: '1px solid #E2E8F0', padding: '24px', textAlign: 'center', color: '#64748B' }}>
                        No active loans found for this line.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Bottom Summary & Signatures */}
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', margin: '16px 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                💵 Bottom Summary & Signatures
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '14px', fontSize: '12px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F1F5F9', color: '#334155' }}>
                    <th style={{ border: '1px solid #E2E8F0', padding: '8px 12px', textAlign: 'left' }}>Summary Details</th>
                    <th style={{ border: '1px solid #E2E8F0', padding: '8px 12px', textAlign: 'center', width: '25%' }}>Expected Amount</th>
                    <th style={{ border: '1px solid #E2E8F0', padding: '8px 12px', textAlign: 'center', width: '35%' }}>Actual Collected (Cash in Hand)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ border: '1px solid #E2E8F0', padding: '8px 12px', fontWeight: 600 }}>Total Past Bending Due:</td>
                    <td style={{ border: '1px solid #E2E8F0', padding: '8px 12px', textAlign: 'center', fontWeight: 'bold', color: '#DC2626' }}>
                      ₹{data.summary?.totalPastBending?.toLocaleString()}
                    </td>
                    <td style={{ border: '1px solid #E2E8F0', padding: '8px 12px', textAlign: 'center', color: '#64748B' }}>—</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #E2E8F0', padding: '8px 12px', fontWeight: 600 }}>Total Current Week EMI Target:</td>
                    <td style={{ border: '1px solid #E2E8F0', padding: '8px 12px', textAlign: 'center', fontWeight: 'bold' }}>
                      ₹{data.summary?.totalCurrentWeekTarget?.toLocaleString()}
                    </td>
                    <td style={{ border: '1px solid #E2E8F0', padding: '8px 12px', textAlign: 'center', color: '#64748B' }}>—</td>
                  </tr>
                  <tr style={{ backgroundColor: '#F8FAFC' }}>
                    <td style={{ border: '1px solid #E2E8F0', padding: '8px 12px', fontWeight: 'bold' }}>Total Target Collection for this Line:</td>
                    <td style={{ border: '1px solid #E2E8F0', padding: '8px 12px', textAlign: 'center', fontWeight: 'bold', fontSize: '13px' }}>
                      ₹{data.summary?.totalTargetCollection?.toLocaleString()}
                    </td>
                    <td style={{ border: '1px solid #E2E8F0', padding: '8px 12px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 'bold' }}>₹</span>
                        <div style={{ width: '160px', height: '24px', background: '#E2E8F0', border: '1px solid #CBD5E1', borderRadius: '4px' }}></div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #E2E8F0', padding: '8px 12px', fontWeight: 600 }}>Total Pending Balance across Line:</td>
                    <td style={{ border: '1px solid #E2E8F0', padding: '8px 12px', textAlign: 'center', fontWeight: 'bold' }}>
                      ₹{data.summary?.totalOverallPending?.toLocaleString()}
                    </td>
                    <td style={{ border: '1px solid #E2E8F0', padding: '8px 12px', textAlign: 'center', color: '#64748B' }}>—</td>
                  </tr>
                </tbody>
              </table>

              {/* Signatures & Handover Details */}
              <div
                style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '16px 20px',
                  backgroundColor: '#FFFFFF',
                  marginTop: '10px',
                  pageBreakInside: 'avoid',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '13px', color: '#334155' }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    <strong>Agent Signature:</strong>
                    <span style={{ display: 'inline-block', minWidth: '220px', borderBottom: '1px solid #64748B', marginLeft: '6px', height: '16px' }}></span>
                  </div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    <strong>Manager / Cashier Signature:</strong>
                    <span style={{ display: 'inline-block', minWidth: '220px', borderBottom: '1px solid #64748B', marginLeft: '6px', height: '16px' }}></span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#334155' }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    <strong>Handover Date:</strong>
                    <span style={{ display: 'inline-block', minWidth: '220px', borderBottom: '1px solid #64748B', marginLeft: '6px', height: '16px' }}></span>
                  </div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    <strong>Total Physical Cash Counted: ₹</strong>
                    <span style={{ display: 'inline-block', minWidth: '220px', borderBottom: '1px solid #64748B', marginLeft: '6px', height: '16px' }}></span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CollectionSheetModal;
