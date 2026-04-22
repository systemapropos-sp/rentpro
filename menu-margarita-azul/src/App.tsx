import { useState, useRef } from 'react';
import { ChevronDown, MapPin, Phone, Instagram, Facebook, Clock, Menu, X, Wine, Beer, GlassWater, Citrus, WineOff } from 'lucide-react';

interface MenuItem {
  name: string;
  description?: string;
  price: string;
  highlight?: boolean;
}

interface Category {
  id: string;
  title: string;
  icon: React.ReactNode;
  image: string;
  items: MenuItem[];
}

const menuData: Category[] = [
  {
    id: 'margaritas',
    title: 'Margaritas',
    icon: <Wine className="w-5 h-5" />,
    image: '/images/cat-margaritas.jpg',
    items: [
      { name: 'Margarita Azul', description: 'Don Julio Blanco, Triple sec, Lime Juice, Agave, Blue curacao', price: '$14.50', highlight: true },
      { name: 'Organic Margarita', description: 'Don Julio Blanco, Triple sec, Lime Juice, Agave', price: '$14.50' },
      { name: 'Pepino Diablo', description: 'Milagros Blanco, Triple sec, Lime Juice, Agave, Cucumber & Jalapeño', price: '$14.50' },
      { name: 'Honey Margarita', description: 'Milagros Reposado, Triple sec, Lime Juice, Agave, Honey', price: '$14.50' },
      { name: 'Coconut Margarita', description: '1800 Coconut, Triple sec, Lime Juice, Agave, Coconut cream', price: '$14.50' },
      { name: 'Pomegranate Margarita', description: 'Milagros Blanco, Triple sec, Lime Juice, Agave, Pomegranate', price: '$14.50' },
      { name: 'Lychee Margarita', description: 'Milagros Blanco, St Germain, Lychee Juice', price: '$14.50' },
      { name: 'La Vampira', description: 'Frozen Margarita topped with Sangria & Blackberry', price: '$14.50' },
      { name: 'Mexican Bulldog', description: 'Frozen Margarita with Coronita or Modelito', price: '$14.50' },
    ]
  },
  {
    id: 'cocktails',
    title: 'Cocktails',
    icon: <GlassWater className="w-5 h-5" />,
    image: '/images/cat-cocktails.jpg',
    items: [
      { name: 'Mojitos', description: 'Original, Blackberry, Strawberry, Pineapple, Orange, Peach', price: '$14.50' },
      { name: 'Paloma', description: 'Milagros Blanco, Lime Juice, Agave, Fresh Grapefruit Juice', price: '$14.50' },
      { name: 'Cantarito', description: 'Milagros Blanco, Fresh grapefruit juice & Fresh orange juice', price: '$14.50' },
      { name: 'Hisbicus Pina Colada', description: 'Malibu Rum, Pineapple juice, Hisbicus Coconut Cream', price: '$14.50' },
      { name: 'Lychee Martini', description: 'Grey Goose Vodka, St Germain, Lychee cream', price: '$14.50' },
      { name: 'Tequila Sunrise', description: 'Milagros Blanco Tequila, Fresh squeezed Orange Juice', price: '$14.50' },
      { name: 'Orange Crush', description: 'Absolute Mandarin, Fresh Squeezed Orange Juice, Triple sec and topped with Sprite', price: '$14.50' },
      { name: 'Mangonada', description: 'Mango Sorbet with Mango Rum, lime juice, Chamoy, Tajin', price: '$14.50' },
      { name: 'White Sangria', description: 'White wine, Pineapple juice, Apples, Oranges, & Cranberries', price: '$14.50' },
    ]
  },
  {
    id: 'cervezas',
    title: 'Cervezas',
    icon: <Beer className="w-5 h-5" />,
    image: '/images/cat-cervezas.jpg',
    items: [
      { name: 'Corona', price: '$5' },
      { name: 'Corona Light', price: '$5' },
      { name: 'Pacifico', price: '$5' },
      { name: 'Victoria', price: '$5' },
      { name: 'Stella', price: '$5' },
      { name: 'Michelob Ultra', price: '$5' },
      { name: 'Miller Light', price: '$5' },
      { name: 'Coors Light', price: '$5' },
      { name: 'Modelo', price: '$5' },
      { name: 'Modelo Negro', price: '$5' },
      { name: 'XX Lager', price: '$5' },
      { name: 'XX Amber', price: '$5' },
      { name: 'Heineken', price: '$5' },
      { name: 'Presidente', price: '$5' },
      { name: 'Blue Moon', price: '$5' },
      { name: 'Red Stripe', price: '$5' },
      { name: 'High Noon', price: '$5' },
      { name: 'White Claw', price: '$5' },
      { name: 'Beer Bucket (6)', description: 'Choose any 6 beers', price: '$25', highlight: true },
    ]
  },
  {
    id: 'happy-hour',
    title: 'Happy Hour',
    icon: <Clock className="w-5 h-5" />,
    image: '/images/cat-margaritas.jpg',
    items: [
      { name: 'Blue Margarita', description: 'Classic Margarita, Blue curacao, Mint', price: '$8', highlight: true },
      { name: 'Classic Margarita', description: 'Lime, Mango, Strawberry, Passion-Fruit, Guava, Peach, Lychee', price: '$8' },
      { name: 'Frozen Mojitos', description: 'Regular, Mango, Strawberry, Passion-Fruit, Guava, Peach, Lychee', price: '$8' },
      { name: 'Red Sangria', description: 'Red Wine, Barcardi Rum, Mango Rum, Orange Juice with fresh fruit', price: '$8' },
      { name: 'Pina Colada', description: 'Malibu, Pineapple juice, Coconut Cream', price: '$8' },
      { name: 'Mimosa', description: 'Prosecco & choice of any Agua Fresca', price: '$8' },
      { name: 'Espresso Martini', description: 'Vodka & coffee liqueur', price: '$8' },
      { name: 'Michelada', description: 'Choice of beer, clamato, mix sauces', price: '$8' },
    ]
  },
  {
    id: 'aguas-frescas',
    title: 'Adult Agua Fresca',
    icon: <Citrus className="w-5 h-5" />,
    image: '/images/cat-aguas.jpg',
    items: [
      { name: 'Pineapple', description: 'Choose your liquor & Agua Fresca', price: '$12' },
      { name: 'Cantaloupe', description: 'Choose your liquor & Agua Fresca', price: '$12' },
      { name: 'Strawberry', description: 'Choose your liquor & Agua Fresca', price: '$12' },
      { name: 'Hibiscus', description: 'Choose your liquor & Agua Fresca', price: '$12' },
      { name: 'Cucumber', description: 'Choose your liquor & Agua Fresca', price: '$12' },
      { name: 'Lemonade', description: 'Choose your liquor & Agua Fresca', price: '$12' },
    ]
  },
  {
    id: 'shots',
    title: 'Shot Flights',
    icon: <WineOff className="w-5 h-5" />,
    image: '/images/cat-cocktails.jpg',
    items: [
      { name: 'Pick One (3) For $12', description: 'Cantaritos, Spicy Mango, Lemon Drop, Green Tea', price: '$12', highlight: true },
      { name: 'Mini Azul', description: 'Frozen Margarita with Coronita or Modelito', price: '$10' },
      { name: 'Mini Cervezas', description: 'Your choice of beer', price: '$10' },
    ]
  },
];

function App() {
  const [openCategory, setOpenCategory] = useState<string | null>('margaritas');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const toggleCategory = (id: string) => {
    setOpenCategory(openCategory === id ? null : id);
    setTimeout(() => {
      categoryRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const scrollToCategory = (id: string) => {
    setOpenCategory(id);
    setMobileMenuOpen(false);
    setTimeout(() => {
      categoryRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
              <Wine className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-wide">MARGARITA AZUL</span>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors md:hidden"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="hidden md:flex items-center gap-1 text-sm">
            {menuData.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg transition-colors text-xs font-medium ${
                  openCategory === cat.id ? 'bg-cyan-500 text-white' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 py-3 space-y-1">
            {menuData.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToCategory(cat.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                  openCategory === cat.id ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                {cat.icon}
                <span className="font-medium">{cat.title}</span>
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Hero */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        <img 
          src="/images/cat-margaritas.jpg" 
          alt="Margarita Azul" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-wider text-white mb-2">
            MARGARITA AZUL
          </h1>
          <p className="text-cyan-400 text-sm sm:text-base font-medium tracking-wide uppercase">
            Cocktails & Mexican Kitchen
          </p>
          <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Open Daily</span>
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Your Location</span>
          </div>
        </div>
      </div>

      {/* Category Quick Nav - Mobile Scroll */}
      <div className="md:hidden sticky top-[57px] z-40 bg-slate-900/90 backdrop-blur border-b border-slate-800">
        <div className="flex gap-2 px-4 py-2 overflow-x-auto scrollbar-hide">
          {menuData.map((cat) => (
            <button
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap text-xs font-medium transition-colors shrink-0 ${
                openCategory === cat.id 
                  ? 'bg-cyan-500 text-white' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat.icon}
              {cat.title}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Content */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4 pb-24">
        {menuData.map((category) => (
          <div 
            key={category.id}
            ref={(el) => { categoryRefs.current[category.id] = el; }}
            className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900/50"
          >
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full flex items-center gap-3 p-4 hover:bg-slate-800/50 transition-colors text-left"
            >
              <img 
                src={category.image} 
                alt={category.title}
                className="w-14 h-14 rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-lg text-white flex items-center gap-2">
                  {category.title}
                </h2>
                <p className="text-slate-400 text-xs">{category.items.length} items</p>
              </div>
              <div className={`text-cyan-400 transition-transform duration-200 ${openCategory === category.id ? 'rotate-180' : ''}`}>
                <ChevronDown className="w-5 h-5" />
              </div>
            </button>

            {/* Category Items */}
            <div 
              className={`overflow-hidden transition-all duration-300 ${
                openCategory === category.id ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-4 pb-4 space-y-1">
                {category.items.map((item, idx) => (
                  <div 
                    key={idx}
                    className={`flex items-start justify-between gap-3 py-3 border-b border-slate-800/50 last:border-0 ${
                      item.highlight ? 'bg-cyan-500/10 -mx-4 px-4 rounded-lg border-0 mb-2' : ''
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold text-sm ${item.highlight ? 'text-cyan-400' : 'text-white'}`}>
                          {item.name}
                        </h3>
                        {item.highlight && (
                          <span className="px-1.5 py-0.5 bg-cyan-500 text-white text-[10px] font-bold rounded uppercase">
                            Popular
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{item.description}</p>
                      )}
                    </div>
                    <span className={`font-bold text-sm shrink-0 ${item.highlight ? 'text-cyan-400' : 'text-white'}`}>
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
              <Wine className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">MARGARITA AZUL</span>
          </div>
          <p className="text-slate-400 text-sm mb-4">Cocktails & Mexican Kitchen</p>
          <div className="flex items-center justify-center gap-4 text-slate-500">
            <a href="#" className="hover:text-cyan-400 transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="hover:text-cyan-400 transition-colors"><Facebook className="w-5 h-5" /></a>
            <a href="#" className="hover:text-cyan-400 transition-colors"><Phone className="w-5 h-5" /></a>
          </div>
          <p className="text-slate-600 text-xs mt-4">© 2025 Margarita Azul. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
