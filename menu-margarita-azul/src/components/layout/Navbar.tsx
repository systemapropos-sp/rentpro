import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Search,
  Globe,
  User,
  LogOut,
  LayoutDashboard,
  MessageSquare,
  Heart,
  Calendar,
  PlusCircle,
  Shield,
  Home,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Avatar } from '@/components/common/Avatar';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isHost, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navLinks = [
    ...(isHost
      ? [
          { to: '/host/dashboard', label: 'Panel Anfitrión', icon: LayoutDashboard },
          { to: '/host/properties', label: 'Mis Propiedades', icon: Home },
          { to: '/host/bookings', label: 'Reservas', icon: Calendar },
        ]
      : []),
    ...(isAuthenticated
      ? [
          { to: '/dashboard', label: 'Mis Viajes', icon: Calendar },
          { to: '/messages', label: 'Mensajes', icon: MessageSquare },
          { to: '/wishlist', label: 'Favoritos', icon: Heart },
        ]
      : []),
    ...(isAdmin
      ? [
          { to: '/admin', label: 'Admin', icon: Shield },
        ]
      : []),
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 bg-white transition-shadow duration-200 ${
          scrolled ? 'shadow-md' : 'border-b'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-rose-500 hidden sm:inline">RentPro</span>
            </Link>

            {/* Search Bar - Desktop */}
            <button
              onClick={() => navigate('/search')}
              className="hidden md:flex items-center gap-4 px-4 py-2 rounded-full border shadow-sm hover:shadow-md transition-shadow flex-1 max-w-md mx-8"
            >
              <span className="text-sm font-medium text-gray-700">Cualquier lugar</span>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-500">Cualquier semana</span>
              <span className="text-gray-300">|</span>
              <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center">
                <Search className="w-4 h-4 text-white" />
              </div>
            </button>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Host Link - Desktop */}
              {isAuthenticated && !isHost && (
                <Link
                  to="/host/become"
                  className="hidden lg:block text-sm font-medium hover:bg-gray-100 px-4 py-2 rounded-full transition-colors"
                >
                  Conviértete en anfitrión
                </Link>
              )}

              {/* Globe */}
              <button className="hidden sm:flex p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Globe size={18} />
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 border rounded-full px-2 py-1 hover:shadow-md transition-shadow"
                >
                  <Menu size={16} className="text-gray-500" />
                  <Avatar src={user?.avatar_url} size="sm" />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border py-2 z-50">
                      {isAuthenticated ? (
                        <>
                          <div className="px-4 py-2 border-b mb-1">
                            <p className="font-medium text-sm">{user?.full_name}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                          </div>
                          {navLinks.map((link) => (
                            <Link
                              key={link.to}
                              to={link.to}
                              className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                            >
                              <link.icon size={16} />
                              {link.label}
                            </Link>
                          ))}
                          <div className="border-t mt-1 pt-1">
                            <Link
                              to="/profile"
                              className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                            >
                              <User size={16} />
                              Perfil
                            </Link>
                            <button
                              onClick={handleSignOut}
                              className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors text-left"
                            >
                              <LogOut size={16} />
                              Cerrar sesión
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setUserMenuOpen(false);
                              navigate('/auth/login');
                            }}
                            className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-100 transition-colors"
                          >
                            Iniciar sesión
                          </button>
                          <button
                            onClick={() => {
                              setUserMenuOpen(false);
                              navigate('/auth/register');
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                          >
                            Registrarse
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-3">
            <button
              onClick={() => navigate('/search')}
              className="flex items-center w-full gap-3 px-4 py-2.5 rounded-full border shadow-sm"
            >
              <Search className="w-4 h-4 text-rose-500" />
              <span className="text-sm text-gray-500">¿A dónde vas?</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-white transform transition-transform duration-300 lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-rose-500">RentPro</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-73px)]">
          {isAuthenticated && (
            <div className="flex items-center gap-3 p-3 mb-4 bg-gray-50 rounded-xl">
              <Avatar src={user?.avatar_url} size="lg" />
              <div>
                <p className="font-medium">{user?.full_name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
          )}

          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              <link.icon size={20} className="text-gray-500" />
              {link.label}
            </Link>
          ))}

          {isAuthenticated && !isHost && (
            <Link
              to="/host/become"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              <PlusCircle size={20} className="text-gray-500" />
              Conviértete en anfitrión
            </Link>
          )}

          <div className="border-t mt-4 pt-4 space-y-1">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  <User size={20} className="text-gray-500" />
                  Perfil
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors text-left"
                >
                  <LogOut size={20} className="text-gray-500" />
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  <User size={20} className="text-gray-500" />
                  Iniciar sesión
                </Link>
                <Link
                  to="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  <PlusCircle size={20} className="text-gray-500" />
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
