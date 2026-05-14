import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import { useState,useEffect } from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  History, 
  User, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { Avatar, AvatarFallback } from '../ui/avatar';
import Logo from '../../../assets/Logo.svg';

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
    try {
      const res = await apiFetch('/profile');
      setUser(res);
    } catch (err) {
      console.error(err);
      localStorage.removeItem("token");
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/');
  };

  const menuItems = [
    { path: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/app/screening', icon: ClipboardList, label: 'Mulai Skrining' },
    { path: '/app/history', icon: History, label: 'Riwayat' },
    { path: '/app/profile', icon: User, label: 'Profil' },
  ];

  const closeSidebar = () => setIsSidebarOpen(false);
  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 bg-white border-r border-gray-200 fixed h-full left-0 top-0 z-30
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-16 h-16 bg-[#FFFFFF] rounded-xl flex items-center justify-center">
                {/* <Activity className="w-6 h-6 text-white" /> */}
                <img src={Logo} className="object-fit-contain" />
              </div>
              <span className="text-xl font-bold text-[#1F2937]">Tensio</span>
            </div>
            <button 
              onClick={closeSidebar}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-500/30'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 w-full transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Navbar */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
          <div className="px-4 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-[#1F2937]">
                  Halo, {user.name}! 👋
                </h2>
                <p className="text-xs lg:text-sm text-gray-500">Selamat datang kembali di Tensio</p>
              </div>
            </div>

            <div className="flex items-center gap-3 lg:gap-4">
              <div className="hidden md:block text-right mr-3">
                <p className="font-medium text-[#1F2937] text-sm lg:text-base">{user.name}</p>
                <p className="text-xs lg:text-sm text-gray-500">{user.email}</p>
              </div>
              <Avatar className="w-10 h-10 lg:w-12 lg:h-12 ring-2 ring-[#2563EB] ring-offset-2">
                <AvatarFallback className="bg-gradient-to-br from-[#2563EB] to-[#3B82F6] text-white text-base lg:text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}