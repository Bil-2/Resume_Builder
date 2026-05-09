import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#050a14', color: '#e2e8f0' }}>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '24px 32px', marginLeft: '220px', marginTop: '64px', minHeight: 'calc(100vh - 64px)' }}
          className="layout-main">
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
