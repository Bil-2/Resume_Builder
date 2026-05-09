import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  User,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/resumes', icon: FileText, label: 'Resumes' },
  { to: '/projects', icon: Briefcase, label: 'Projects' },
  { to: '/courses', icon: GraduationCap, label: 'Courses' },
  { to: '/achievements', icon: Award, label: 'Achievements' },
  { to: '/skills', icon: Code, label: 'Skills' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const Sidebar = () => {
  return (
    <aside style={{
      display: 'none',
      position: 'fixed', left: 0, top: '64px', bottom: 0, width: '220px',
      background: '#050a14',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      overflowY: 'auto', zIndex: 40,
      flexDirection: 'column',
    }} className="sidebar-desktop">
      {/* Section label */}
      <div style={{ padding: '24px 16px 8px' }}>
        <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '.12em', textTransform: 'uppercase', color: '#334155' }}>
          Navigation
        </span>
      </div>

      <nav style={{ flex: 1, padding: '4px 10px 24px' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 12px', borderRadius: '8px',
              textDecoration: 'none', fontSize: '13px', fontWeight: '500',
              marginBottom: '2px',
              color: isActive ? '#a5b4fc' : '#64748b',
              background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
              border: isActive ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent',
              transition: 'all .15s',
            })}
            onMouseEnter={e => {
              if (!e.currentTarget.style.background.includes('rgba(99,102,241,0.12)')) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.color = '#94a3b8';
              }
            }}
            onMouseLeave={e => {
              if (!e.currentTarget.getAttribute('aria-current')) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#64748b';
              }
            }}
          >
            <item.icon size={16} style={{ flexShrink: 0 }} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom version tag */}
      <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ fontSize: '10px', color: '#1e293b', letterSpacing: '.05em' }}>Resume Builder v1.0</div>
      </div>
    </aside>
  );
};

export default Sidebar;
