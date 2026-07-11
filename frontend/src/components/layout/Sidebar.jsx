import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { LayoutDashboard, PlusCircle, User, LogOut, Compass } from 'lucide-react';

const Sidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar" style={{ width: '250px', background: 'var(--bg-primary)', borderRight: '1px solid var(--border-color)', padding: '30px 20px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 70px)', position: 'fixed', top: '70px', left: 0, zIndex: 10, borderBottomLeftRadius: '0', borderBottomRightRadius: '0', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <Link to="/dashboard" className={`sidebar-link ${isActive('/dashboard') ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>
        
        <Link to="/create-trip" className={`sidebar-link ${isActive('/create-trip') ? 'active' : ''}`}>
          <PlusCircle size={20} />
          <span>Plan a Trip</span>
        </Link>

        <Link to="/profile" className={`sidebar-link ${isActive('/profile') ? 'active' : ''}`}>
          <User size={20} />
          <span>My Profile</span>
        </Link>
      </div>

      <button onClick={logout} className="sidebar-logout-btn">
        <LogOut size={20} />
        <span>Sign Out</span>
      </button>

      <style>{`
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--secondary) !important;
          text-decoration: none;
          transition: all var(--transition-fast);
          background-color: transparent;
        }
        .sidebar-link svg {
          color: var(--primary);
          transition: all var(--transition-fast);
        }
        .sidebar-link:hover {
          background-color: var(--hover-light) !important;
          color: var(--primary) !important;
        }
        .sidebar-link:hover svg {
          color: var(--primary-hover);
        }
        .sidebar-link.active {
          background-color: var(--primary) !important;
          color: #FFFFFF !important;
        }
        .sidebar-link.active svg {
          color: #FFFFFF !important;
        }
        .sidebar-logout-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          background: none;
          border: none;
          color: var(--secondary);
          padding: 12px 16px;
          border-radius: var(--radius-md);
          cursor: pointer;
          font-family: inherit;
          font-size: 0.95rem;
          font-weight: 600;
          width: 100%;
          transition: all var(--transition-fast);
          text-align: left;
        }
        .sidebar-logout-btn svg {
          color: var(--accent-rose);
        }
        .sidebar-logout-btn:hover {
          background: rgba(239, 68, 68, 0.08);
          color: var(--accent-rose);
        }
        @media (max-width: 768px) {
          .sidebar { display: none !important; }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
