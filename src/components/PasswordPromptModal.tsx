import React, { useState } from 'react';
import API from '../services/api';
import { useTranslation } from '../hooks/useTranslation';

interface Props {
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
  title?: string;
}

const PasswordPromptModal: React.FC<Props> = ({ isOpen, onSuccess, onClose, title }) => {
  const { t, language } = useTranslation();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError(language === 'ta' ? 'கடவுச்சொல்லை உள்ளிடவும்' : 'Password required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await API.post('/auth/verify-password', { password });
      setPassword('');
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Incorrect password');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000,
      padding: '20px',
    }}>
      <div className="glass-panel animate-scale-up" style={{
        backgroundColor: 'white',
        borderRadius: '24px',
        padding: '32px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: '1px solid var(--border)',
      }}>
        <h3 style={{
          marginTop: 0,
          color: '#EF4444',
          fontSize: '20px',
          fontWeight: 'bold',
          marginBottom: '12px',
          textAlign: 'center',
        }}>
          {title || (language === 'ta' ? 'அட்மின் கடவுச்சொல்' : 'Admin Password Required')}
        </h3>
        <p style={{
          color: '#64748B',
          fontSize: '14px',
          textAlign: 'center',
          lineHeight: '1.5',
          marginBottom: '24px',
        }}>
          {language === 'ta' ? 'இந்த செயலை செய்ய அட்மின் கடவுச்சொல்லை உள்ளிடவும்' : 'Enter admin password to authorize this action'}
        </p>

        <form onSubmit={handleVerify}>
          <input
            type="password"
            placeholder={language === 'ta' ? 'கடவுச்சொல்' : 'Password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: error ? '2px solid #EF4444' : '1px solid #CBD5E1',
              backgroundColor: error ? '#FEF2F2' : '#F8FAFC',
              fontSize: '16px',
              color: '#1E293B',
              marginBottom: '8px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {error && (
            <p style={{ color: '#EF4444', fontSize: '13px', fontWeight: '600', margin: '0 0 16px 0', textAlign: 'left' }}>
              ⚠️ {error}
            </p>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: '#F1F5F9',
                color: '#64748B',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '15px',
              }}
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: '#EF4444',
                color: 'white',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '15px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {loading ? '...' : (language === 'ta' ? 'உறுதி செய்' : 'Verify')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordPromptModal;
