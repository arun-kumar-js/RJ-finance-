import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { loginUser } from '../redux/slices/authSlice';
import { useTranslation } from '../hooks/useTranslation';
import { setLanguage } from '../redux/slices/languageSlice';

const Login = () => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { loading, error } = useAppSelector((state) => state.auth);
  const { language } = useAppSelector((state) => state.language);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile || !password) return;
    
    const resultAction = await dispatch(loginUser({ mobile, password }));
    if (loginUser.fulfilled.match(resultAction)) {
      const { token, user } = resultAction.payload;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100vw', margin: '-32px' }}>
      <div className="glass-panel animate-fade-in" style={{ padding: '40px', width: '100%', maxWidth: '400px', position: 'relative' }}>
        
        <button 
          type="button"
          onClick={() => dispatch(setLanguage(language === 'en' ? 'ta' : 'en'))}
          style={{ 
            position: 'absolute', 
            top: '20px', 
            right: '20px', 
            background: 'var(--primary)', 
            color: 'white', 
            border: 'none', 
            padding: '4px 10px', 
            borderRadius: '12px', 
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          {language === 'en' ? 'தமிழ்' : 'EN'}
        </button>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ color: 'var(--primary)', fontSize: '32px', marginBottom: '8px' }}>RJ Finance</h1>
          <p style={{ color: 'var(--text-muted)' }}>{t('loginTitle')}</p>
        </div>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label className="input-label">Mobile Number</label>
            <input 
              type="tel" 
              className="input-field" 
              value={mobile}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                if (val.length <= 10) setMobile(val);
              }}
              placeholder="Enter mobile number"
              maxLength={10}
            />
          </div>

          <div className="input-group">
            <label className="input-label">{t('password')}</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                type={showPassword ? 'text' : 'password'}
                className="input-field" 
                style={{ flex: 1, paddingRight: '40px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
