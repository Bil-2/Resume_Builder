import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, ChevronDown, Bell } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import Logo from '../Logo/Logo';

const Navbar = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`;

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(5,10,20,0.92)', backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      height: '64px', display: 'flex', alignItems: 'center',
    }}>
      <div style={{ width: '100%', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/dashboard" style={{ textDecoration: 'none', transition: 'opacity .2s' }}>
          <Logo size="md" showText={true} />
        </Link>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

          {/* Bell */}
          <button style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px', width: '36px', height: '36px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b',
            transition: 'all .2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
          >
            <Bell size={16} />
          </button>

          {/* User menu */}
          <div style={{ position: 'relative' }}>
            <button
              id="navbar-user-menu-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px', padding: '6px 12px 6px 8px', cursor: 'pointer',
                transition: 'all .2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
            >
              <div style={{
                width: '30px', height: '30px', borderRadius: '50%',
                background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: '700', color: '#fff', flexShrink: 0,
              }}>
                {initials}
              </div>
              <span style={{ fontSize: '13px', fontWeight: '500', color: '#cbd5e1', display: 'none' }}
                className="sm-show">
                {user?.firstName} {user?.lastName}
              </span>
              <ChevronDown size={14} style={{ color: '#64748b', transition: 'transform .2s', transform: showUserMenu ? 'rotate(180deg)' : 'none' }} />
            </button>

            {showUserMenu && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setShowUserMenu(false)} />
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                  width: '200px', background: '#0d1627',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.6)', zIndex: 20, overflow: 'hidden',
                  padding: '6px',
                }}>
                  {/* User info */}
                  <div style={{ padding: '10px 12px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '6px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#e2e8f0' }}>{user?.firstName} {user?.lastName}</div>
                    <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>{user?.email}</div>
                  </div>

                  {[
                    { to: '/profile', icon: User, label: 'Profile' },
                    { to: '/settings', icon: Settings, label: 'Settings' },
                  ].map(item => (
                    <Link key={item.to} to={item.to}
                      onClick={() => setShowUserMenu(false)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '9px 12px', borderRadius: '8px', textDecoration: 'none',
                        fontSize: '13px', color: '#94a3b8', transition: 'all .15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#e2e8f0'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}
                    >
                      <item.icon size={15} />
                      {item.label}
                    </Link>
                  ))}

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '6px 0' }} />

                  <button onClick={handleLogout} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '9px 12px', borderRadius: '8px', width: '100%',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    fontSize: '13px', color: '#f87171', transition: 'all .15s', textAlign: 'left',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
