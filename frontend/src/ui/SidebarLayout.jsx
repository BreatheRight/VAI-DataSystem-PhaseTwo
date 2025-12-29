import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { Navigate } from 'react-router-dom';
import {
  User,
  Settings,
  LogOut
} from 'lucide-react';

export function SidebarLayout() {
  const { isAuthenticated, setIsAuthenticated, setSurveyData, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    localStorage.removeItem("surveyData");
    setUser({});
    setIsAuthenticated(false);
    setSurveyData([]);
    navigate("/");
  };

  const mainNavItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Manage Events', path: '/dashboard/events' },
    { label: 'Survey Creative Suite', path: '/dashboard/survey-builder' },
    { label: 'View Users', path: '/dashboard/table' },
  ];

  const pagesItems = [
    { label: 'Documentation', path: '/dashboard/docs' },
    { label: 'Asterix', path: '/dashboard/asterix' },
    { label: 'Errors', path: '/dashboard/errors' },
  ];

  const isActive = (path) => location.pathname === path;

  // Block rendering of sidebar layout if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="grid grid-cols-[260px_1fr] h-screen bg-vai-white">
      {/* Sidebar */}
      <aside className="border-r border-vai-grayLight flex flex-col bg-white">
        {/* Logo */}
        <div className="p-6 border-b border-vai-grayLight">
          <img
            src="/Van Alen Institute Logo.png"
            alt="Van Alen Institute"
            className="w-full h-auto max-w-[220px] mx-auto"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div class="text-xl font-heading font-bold text-vai-black text-center">VAN ALEN<br/>INSTITUTE</div>';
            }}
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {/* Main Navigation */}
          {mainNavItems.map((item) => {
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors
                  ${isActive(item.path)
                    ? 'bg-vai-bluePale font-medium text-vai-black'
                    : 'text-vai-grayText hover:bg-vai-bluePale/40 hover:text-vai-black'
                  }
                `}
              >
                <span className="text-sm font-sans">{item.label}</span>
              </button>
            );
          })}

          {/* Pages Section */}
          <div className="pt-6 pb-2">
            <div className="px-4 text-xs font-sans font-medium text-vai-grayText uppercase tracking-wider mb-2">
              Pages
            </div>
            {pagesItems.map((item) => {
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors
                    ${isActive(item.path)
                      ? 'bg-vai-bluePale font-medium text-vai-black'
                      : 'text-vai-grayText hover:bg-vai-bluePale/40 hover:text-vai-black'
                    }
                  `}
                >
                  <span className="text-sm font-sans">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Profile Button */}
        <div className="p-4 border-t border-vai-grayLight relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors hover:bg-vai-bluePale/40 text-vai-grayText hover:text-vai-black"
          >
            <User className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-sm font-sans">Profile</span>
          </button>

          {showProfileMenu && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-vai-grayLight rounded-lg shadow-lg py-2">
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/dashboard/settings');
                }}
                className="w-full px-4 py-2 text-left text-sm font-sans hover:bg-vai-bluePale/40 transition-colors flex items-center gap-2"
              >
                <Settings className="w-4 h-4" strokeWidth={1.5} />
                Settings
              </button>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  handleLogout();
                }}
                className="w-full px-4 py-2 text-left text-sm font-sans hover:bg-red-50 text-red-600 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" strokeWidth={1.5} />
                Logout
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
