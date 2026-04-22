import React from 'react';
import { Globe, Facebook, Twitter, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  const footerLinks = [
    {
      title: 'Soporte',
      links: ['Centro de ayuda', 'Seguridad', 'Opciones de cancelación', 'Reportar problema'],
    },
    {
      title: 'Comunidad',
      links: ['RentPro para anfitriones', 'Foro de la comunidad', 'Eventos', 'Blog'],
    },
    {
      title: 'Anfitrión',
      links: ['Publica tu propiedad', 'Recursos para anfitriones', 'Foro de anfitriones', 'Cobertura de seguros'],
    },
    {
      title: 'RentPro',
      links: ['Sobre nosotros', 'Carreras', 'Prensa', 'Políticas'],
    },
  ];

  return (
    <footer className="bg-gray-50 border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-gray-900 mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-gray-600 hover:text-gray-900 hover:underline transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>© 2025 RentPro, Inc.</span>
            <span className="hidden sm:inline">·</span>
            <a href="#" className="hover:underline">Privacidad</a>
            <span>·</span>
            <a href="#" className="hover:underline">Términos</a>
            <span>·</span>
            <a href="#" className="hover:underline">Mapa del sitio</a>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm font-medium hover:text-gray-900 transition-colors">
              <Globe size={16} />
              Español
            </button>
            <div className="flex items-center gap-3">
              <a href="#" className="hover:text-gray-900 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
