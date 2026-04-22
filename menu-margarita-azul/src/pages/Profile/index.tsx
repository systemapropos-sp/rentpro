import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Shield, Award, Star, Home, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Loader } from '@/components/common/Loader';
import { Avatar } from '@/components/common/Avatar';
import { formatPhoneNumber } from '@/utils/formatters';

const ProfilePage: React.FC = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
  });

  if (loading) {
    return (
      <div className="pt-24 flex justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!user) {
    navigate('/auth/login');
    return null;
  }

  const handleSave = async () => {
    setSaving(true);
    // In a real app, update profile in Supabase
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
  };

  return (
    <div className="pt-20 lg:pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl lg:text-3xl font-bold mb-8">Perfil</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="border rounded-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <Avatar src={user.avatar_url} size="xl" />
                <div>
                  <h2 className="text-xl font-semibold">{user.full_name}</h2>
                  <p className="text-gray-500">{user.role === 'host' ? 'Anfitrión' : 'Huésped'}</p>
                  {user.is_superhost && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full mt-1">
                      <Award size={12} />
                      Superanfitrión
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre completo</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, full_name: e.target.value }))
                      }
                      className="w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full pl-10 pr-3 py-2.5 border rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Teléfono</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          phone: formatPhoneNumber(e.target.value),
                        }))
                      }
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full py-2.5 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </div>

            {/* Security */}
            <div className="border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield size={20} />
                <h3 className="font-semibold">Seguridad</h3>
              </div>
              <button className="w-full text-left px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors text-sm">
                Cambiar contraseña
              </button>
            </div>
          </div>

          {/* Right - Stats */}
          <div className="space-y-4">
            <div className="border rounded-xl p-6">
              <h3 className="font-semibold mb-4">Estadísticas</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center">
                    <Star size={20} className="text-rose-500" />
                  </div>
                  <div>
                    <p className="font-medium">4.92</p>
                    <p className="text-xs text-gray-500">Rating promedio</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Home size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">12</p>
                    <p className="text-xs text-gray-500">Estancias</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <Calendar size={20} className="text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium">2 años</p>
                    <p className="text-xs text-gray-500">Miembro desde</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={signOut}
              className="w-full py-3 border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
