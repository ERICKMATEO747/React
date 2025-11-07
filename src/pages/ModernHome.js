import React, { useState, useEffect } from 'react';
import { GiftIcon, StarIcon } from '../shared/components/LoyaltyIcons';
import { FacebookIcon, InstagramIcon, TikTokIcon, LinkedInIcon, HelpIcon } from '../shared/components/SocialIcons';
import HamburgerMenu from '../shared/components/HamburgerMenu';
import flevoLogo from '../assets/images/flvo.jpg';

const ModernHome = ({ user, onLogout, onProfile, onShowHelp }) => {
  const [expandedBusiness, setExpandedBusiness] = useState(null);
  const [showQRModal, setShowQRModal] = useState(null);
  const [showMenuModal, setShowMenuModal] = useState(null);
  const [filters, setFilters] = useState({ location: '', type: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedBusinesses, setDisplayedBusinesses] = useState(6);
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState('pending');
  const [showMunicipalityDropdown, setShowMunicipalityDropdown] = useState(false);
  const [municipalitySearch, setMunicipalitySearch] = useState('');

  // Available municipalities
  const municipalities = ['Papantla', 'Poza Rica', 'Tuxpan', 'Tecolutla', 'Coatzintla'];
  
  // Filter municipalities based on search
  const filteredMunicipalities = municipalities.filter(municipality =>
    municipality.toLowerCase().includes(municipalitySearch.toLowerCase())
  );

  // Extended dummy data for businesses
  const allBusinesses = [
    {
      id: 1,
      name: 'Restaurante El Sabor',
      address: 'Av. Principal 123, Centro',
      visits: 15,
      image: '🍽️',
      type: 'Restaurante',
      location: 'Papantla',
      hours: '10:00 AM - 10:00 PM',
      services: ['Comer en restaurante', 'Para llevar', 'Servicio a domicilio'],
      phone: '+57 301 234 5678',
      whatsapp: '+57 301 234 5678',
      facebook: '@restauranteelsabor',
      instagram: '@elsabor_oficial',
      menu: ['Bandeja Paisa - $25.000', 'Sancocho - $18.000', 'Ajiaco - $20.000', 'Cazuela de Mariscos - $35.000']
    },
    {
      id: 2,
      name: 'Café Aroma',
      address: 'Calle 5 #45-67, Norte',
      visits: 8,
      image: '☕',
      type: 'Cafetería',
      location: 'Poza Rica',
      hours: '6:00 AM - 8:00 PM',
      services: ['Para llevar', 'Pickup'],
      phone: '+57 302 345 6789',
      whatsapp: '+57 302 345 6789',
      facebook: '@cafearoma',
      instagram: '@aroma_cafe',
      menu: ['Café Americano - $4.500', 'Cappuccino - $6.000', 'Croissant - $5.500', 'Torta de Chocolate - $8.000']
    },
    {
      id: 3,
      name: 'Tienda Fashion',
      address: 'Centro Comercial, Local 201',
      visits: 3,
      image: '👕',
      type: 'Ropa',
      location: 'Tuxpan',
      hours: '9:00 AM - 9:00 PM',
      services: ['Compra en tienda'],
      phone: '+57 303 456 7890',
      whatsapp: '+57 303 456 7890',
      facebook: '@tiendafashion',
      instagram: '@fashion_store',
      menu: ['Camisas - $45.000', 'Pantalones - $65.000', 'Vestidos - $85.000', 'Zapatos - $120.000']
    },
    {
      id: 4,
      name: 'Pizza Express',
      address: 'Calle 10 #20-30, Centro',
      visits: 12,
      image: '🍕',
      type: 'Restaurante',
      location: 'Tecolutla',
      hours: '11:00 AM - 11:00 PM',
      services: ['Comer en restaurante', 'Servicio a domicilio'],
      phone: '+57 304 567 8901',
      whatsapp: '+57 304 567 8901',
      facebook: '@pizzaexpress',
      instagram: '@pizza_express',
      menu: ['Pizza Margherita - $22.000', 'Pizza Pepperoni - $26.000', 'Lasagna - $24.000', 'Calzone - $20.000']
    },
    {
      id: 5,
      name: 'Librería Mundo',
      address: 'Av. Cultura 456, Norte',
      visits: 5,
      image: '📚',
      type: 'Librería',
      location: 'Coatzintla',
      hours: '8:00 AM - 7:00 PM',
      services: ['Compra en tienda'],
      phone: '+57 305 678 9012',
      whatsapp: '+57 305 678 9012',
      facebook: '@libreriamundo',
      instagram: '@mundo_libros',
      menu: ['Novelas - $35.000', 'Libros Técnicos - $65.000', 'Comics - $15.000', 'Revistas - $8.000']
    },
    {
      id: 6,
      name: 'Gym Fitness',
      address: 'Calle Salud 789, Sur',
      visits: 20,
      image: '💪',
      type: 'Gimnasio',
      location: 'Papantla',
      hours: '5:00 AM - 10:00 PM',
      services: ['Membresía mensual', 'Clases grupales'],
      phone: '+57 306 789 0123',
      whatsapp: '+57 306 789 0123',
      facebook: '@gymfitness',
      instagram: '@fitness_gym',
      menu: ['Membresía Mensual - $80.000', 'Clase de Yoga - $15.000', 'Entrenamiento Personal - $50.000', 'Spinning - $12.000']
    },
    {
      id: 7,
      name: 'Heladería Dulce',
      address: 'Plaza Central, Local 15',
      visits: 9,
      image: '🍦',
      type: 'Heladería',
      location: 'Poza Rica',
      hours: '12:00 PM - 9:00 PM',
      services: ['Para llevar', 'Comer en local'],
      phone: '+57 307 890 1234',
      whatsapp: '+57 307 890 1234',
      facebook: '@heladeriadulce',
      instagram: '@dulce_helados',
      menu: ['Helado Simple - $8.000', 'Sundae - $15.000', 'Malteada - $12.000', 'Copa Especial - $18.000']
    },
    {
      id: 8,
      name: 'Farmacia Salud',
      address: 'Av. Bienestar 321, Norte',
      visits: 7,
      image: '💊',
      type: 'Farmacia',
      location: 'Tuxpan',
      hours: '24 horas',
      services: ['Venta de medicamentos', 'Servicio a domicilio'],
      phone: '+57 308 901 2345',
      whatsapp: '+57 308 901 2345',
      facebook: '@farmaciasalud',
      instagram: '@salud_farmacia',
      menu: ['Medicamentos Genéricos', 'Vitaminas', 'Productos de Belleza', 'Primeros Auxilios']
    }
  ];

  // Fuzzy search function
  const fuzzyMatch = (text, search) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    const textLower = text.toLowerCase();
    return textLower.includes(searchLower) || 
           searchLower.split('').every(char => textLower.includes(char));
  };

  // Filter businesses based on search and filters
  const filteredBusinesses = allBusinesses.filter(business => {
    const matchesSearch = fuzzyMatch(business.name, searchTerm);
    const matchesType = !filters.type || business.type === filters.type;
    
    // Location filtering logic
    let matchesLocation = true;
    if (userLocation && locationPermission === 'granted' && !userLocation.includes('No disponible')) {
      // If user granted location and it's available, show only businesses from their detected location
      matchesLocation = business.location === userLocation;
    } else if (filters.location) {
      // If user manually selected a location, use that filter
      matchesLocation = business.location.toLowerCase().includes(filters.location.toLowerCase());
    }
    // If no location filter is active or location is not available, show all businesses
    
    return matchesSearch && matchesLocation && matchesType;
  });

  const businesses = filteredBusinesses.slice(0, displayedBusinesses);

  // Request user location
  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Use reverse geocoding to get municipality
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=es`
            );
            const data = await response.json();
            
            // Extract municipality/city from the response
            const detectedLocation = data.city || data.locality || data.principalSubdivision || 'Ubicación desconocida';
            
            // Check if detected location matches any of our available municipalities
            const availableMunicipalities = ['Papantla', 'Poza Rica', 'Tuxpan', 'Tecolutla', 'Coatzintla'];
            const matchedMunicipality = availableMunicipalities.find(municipality => 
              detectedLocation.toLowerCase().includes(municipality.toLowerCase()) ||
              municipality.toLowerCase().includes(detectedLocation.toLowerCase())
            );
            
            if (matchedMunicipality) {
              setUserLocation(matchedMunicipality);
            } else {
              // If no match found, show the detected location but inform user
              setUserLocation(`${detectedLocation} (No disponible)`);
            }
            
            setLocationPermission('granted');
            // Clear any manual location filter when using GPS
            setFilters(prev => ({...prev, location: ''}));
            
          } catch (error) {
            console.error('Reverse geocoding error:', error);
            // Fallback to coordinates display
            setUserLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            setLocationPermission('granted');
            setFilters(prev => ({...prev, location: ''}));
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationPermission('denied');
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 300000
        }
      );
    } else {
      setLocationPermission('denied');
    }
  };

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        setDisplayedBusinesses(prev => Math.min(prev + 3, filteredBusinesses.length));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [filteredBusinesses.length]);

  const generateQR = (businessId) => {
    const qrData = {
      userId: user?.id || 'USER123',
      businessId: businessId,
      timestamp: new Date().toISOString()
    };
    setShowQRModal(qrData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-slate-50 to-yellow-100 animate-gradient-shift flex flex-col" style={{ backgroundSize: '400% 400%' }}>
      {/* Full Screen Header */}
      <div className="bg-gradient-to-br from-flevo-900 to-flevo-950 px-4 sm:px-6 py-6 sm:py-8 text-center shadow-xl relative overflow-hidden">
        {/* Decorative Icons */}
        <div className="absolute top-3 left-3 opacity-80" style={{ color: '#f9bc18' }}>
          <GiftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="absolute top-3 right-12 opacity-80" style={{ color: '#f9bc18' }}>
          <StarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        
        {/* Hamburger Menu */}
        <div className="absolute top-4 right-4">
          <HamburgerMenu onProfile={onProfile} onLogout={onLogout} />
        </div>
        
        {/* Logo */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg overflow-hidden">
          <img src={flevoLogo} alt="Flevo Logo" className="w-full h-full object-cover" />
        </div>
        
        {/* User Name */}
        <h1 className="text-lg sm:text-xl font-bold text-white mb-1 font-poppins">
          ¡Hola {user?.nombre || 'Usuario'}!
        </h1>
        <p className="text-flevo-100 text-xs font-medium">
          Tu programa de lealtad favorito
        </p>
      </div>

      {/* Body - 70% Width */}
      <div className="flex-1 px-6 py-4 w-[70%] mx-auto">
        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-accent-50 to-gold-50 rounded-2xl shadow-lg p-5 mb-5 border border-accent-100">
          <div className="text-center">
            <div className="text-3xl mb-3">🎉</div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">
              ¡Tu aventura de recompensas continúa!
            </h2>
            <p className="text-slate-600 text-sm">
              Descubre negocios y gana puntos
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-4 border border-slate-100">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Buscar negocios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:border-accent-400 transition-colors"
            />
          </div>
        </div>



        {/* Current Location Display */}
        {userLocation && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-lg p-4 mb-4 border border-green-100">
            <div className="text-center">
              <div className="text-2xl mb-2">📍</div>
              <h3 className="font-bold text-slate-800 mb-1">Tu ubicación: {userLocation}</h3>
              <p className="text-slate-600 text-sm">Mostrando negocios cercanos</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-5 border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-3 text-base flex items-center">
            🔍 <span className="ml-2">Filtros</span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {/* Municipality Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMunicipalityDropdown(!showMunicipalityDropdown)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:border-accent-400 transition-colors text-left flex items-center justify-between"
              >
                <span className={filters.location ? 'text-slate-800' : 'text-slate-400'}>
                  {filters.location || '📍 Seleccionar municipio'}
                </span>
                <span className="text-slate-400">{showMunicipalityDropdown ? '▲' : '▼'}</span>
              </button>
              
              {showMunicipalityDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-60 overflow-hidden">
                  {/* Search within dropdown */}
                  <div className="p-2 border-b border-slate-100">
                    <input
                      type="text"
                      placeholder="🔍 Buscar municipio..."
                      value={municipalitySearch}
                      onChange={(e) => setMunicipalitySearch(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-accent-400"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  
                  {/* Municipality list */}
                  <div className="max-h-40 overflow-y-auto">
                    <button
                      onClick={() => {
                        setFilters({...filters, location: ''});
                        setShowMunicipalityDropdown(false);
                        setMunicipalitySearch('');
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 transition-colors"
                    >
                      Todos los municipios
                    </button>
                    
                    {filteredMunicipalities.length > 0 ? (
                      filteredMunicipalities.map(municipality => (
                        <button
                          key={municipality}
                          onClick={() => {
                            setFilters({...filters, location: municipality});
                            setShowMunicipalityDropdown(false);
                            setMunicipalitySearch('');
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-slate-800 hover:bg-accent-50 transition-colors"
                        >
                          📍 {municipality}
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-slate-500 text-center">
                        No se encontró el municipio
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <select 
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
              className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:border-accent-400 transition-colors"
            >
              <option value="">🏪 Tipo</option>
              <option value="Restaurante">Restaurante</option>
              <option value="Cafetería">Cafetería</option>
              <option value="Ropa">Ropa</option>
              <option value="Librería">Librería</option>
              <option value="Gimnasio">Gimnasio</option>
              <option value="Heladería">Heladería</option>
              <option value="Farmacia">Farmacia</option>
            </select>
          </div>
        </div>

        {/* No Results Message */}
        {filteredBusinesses.length === 0 && (searchTerm || filters.location || filters.type) && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-slate-100 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No encontramos resultados</h3>
            <p className="text-slate-600 text-sm mb-4">
              No hay negocios que coincidan con tu búsqueda, pero ¡no te preocupes!
            </p>
            <div className="bg-gradient-to-r from-accent-50 to-gold-50 rounded-xl p-4">
              <p className="text-slate-700 text-sm">
                🚀 <strong>¡Próximamente más negocios!</strong><br/>
                Estamos trabajando para sumar más establecimientos en tu zona.
                Verifica que el nombre del municipio esté bien escrito.
              </p>
            </div>
          </div>
        )}

        {/* Business List */}
        <div className="space-y-4 mb-6">
          {businesses.map(business => (
            <div key={business.id} className="bg-white rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
              <div 
                className="p-4 cursor-pointer"
                onClick={() => setExpandedBusiness(expandedBusiness === business.id ? null : business.id)}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent-100 to-gold-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
                    {business.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 text-base mb-1">{business.name}</h3>
                    <p className="text-slate-600 text-sm mb-2 flex items-center">
                      📍 <span className="ml-1 truncate">{business.address}</span>
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="bg-accent-100 text-accent-700 px-2 py-1 rounded-lg text-xs font-medium">
                        🏆 {business.visits} visitas
                      </span>
                      <span className="text-slate-400 text-sm">
                        {expandedBusiness === business.id ? '▲' : '▼'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Expanded Details */}
              {expandedBusiness === business.id && (
                <div className="px-4 pb-4 border-t border-slate-100 pt-4 animate-slide-up">
                  <div className="space-y-4">
                    <div>
                      <span className="font-medium text-slate-600 text-sm">Horario: </span>
                      <span className="text-slate-800 text-sm">{business.hours}</span>
                    </div>
                    
                    {/* Contact Info */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="font-medium text-slate-600 text-sm block mb-1">📞 Teléfono:</span>
                        <a href={`tel:${business.phone}`} className="text-accent-600 text-sm hover:underline">
                          {business.phone}
                        </a>
                      </div>
                      <div>
                        <span className="font-medium text-slate-600 text-sm block mb-1">💬 WhatsApp:</span>
                        <a href={`https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}`} className="text-green-600 text-sm hover:underline">
                          {business.whatsapp}
                        </a>
                      </div>
                    </div>
                    
                    {/* Social Media */}
                    <div>
                      <span className="font-medium text-slate-600 text-sm block mb-2">🌐 Redes Sociales:</span>
                      <div className="flex space-x-3">
                        <a href={`https://facebook.com/${business.facebook.replace('@', '')}`} className="text-blue-600 text-sm hover:underline">
                          📘 {business.facebook}
                        </a>
                        <a href={`https://instagram.com/${business.instagram.replace('@', '')}`} className="text-pink-600 text-sm hover:underline">
                          📷 {business.instagram}
                        </a>
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-medium text-slate-600 text-sm">Servicios: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {business.services.map((service, index) => (
                          <span key={index} className="bg-accent-100 text-accent-700 px-2 py-1 rounded text-xs">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-medium text-slate-600 text-sm">Visitas este mes: </span>
                      <span className="text-accent-500 font-bold text-sm">{business.visits}</span>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMenuModal(business);
                        }}
                        className="bg-gradient-to-r from-slate-400 to-slate-500 hover:from-slate-500 hover:to-slate-600 text-white font-medium py-2 px-4 rounded-xl text-sm shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        📋 Ver Menú
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          generateQR(business.id);
                        }}
                        className="bg-gradient-to-r from-gold-400 to-accent-500 hover:from-gold-500 hover:to-accent-600 text-white font-medium py-2 px-4 rounded-xl text-sm shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        🎯 Generar QR
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* Loading indicator for infinite scroll */}
          {displayedBusinesses < filteredBusinesses.length && filteredBusinesses.length > 0 && (
            <div className="text-center py-4">
              <div className="inline-flex items-center space-x-2 text-slate-500">
                <div className="w-4 h-4 border-2 border-accent-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Cargando más negocios...</span>
              </div>
            </div>
          )}
        </div>

      {/* Menu Modal */}
      {showMenuModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{showMenuModal.image}</div>
              <h3 className="text-xl font-bold text-slate-800">{showMenuModal.name}</h3>
              <p className="text-slate-600 text-sm">Menú / Productos</p>
            </div>
            
            <div className="space-y-3 mb-6">
              {showMenuModal.menu.map((item, index) => (
                <div key={index} className="bg-slate-50 rounded-lg p-3 flex justify-between items-center">
                  <span className="text-slate-800 text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => setShowMenuModal(null)}
              className="w-full bg-slate-400 hover:bg-slate-500 text-white font-bold py-3 rounded-xl transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 text-center">
            <div className="text-6xl mb-4">📱</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Código QR Generado</h3>
            <p className="text-slate-600 text-sm mb-4">Presenta este código en el negocio</p>
            
            <div className="bg-slate-100 rounded-xl p-4 mb-4">
              <div className="text-8xl mb-2">⬜</div>
              <div className="text-xs text-slate-500 space-y-1">
                <p>Usuario: {showQRModal.userId}</p>
                <p>Negocio: {showQRModal.businessId}</p>
                <p>Fecha: {new Date(showQRModal.timestamp).toLocaleString()}</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowQRModal(null)}
              className="w-full bg-accent-400 hover:bg-accent-500 text-white font-bold py-3 rounded-xl transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      </div>

      {/* Footer - Full Width */}
      <div className="bg-white shadow-xl p-4 sm:p-6 w-full mt-auto">
        <div className="flex justify-center items-center space-x-4 sm:space-x-6 mb-4">
          <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
            <FacebookIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>
          <a href="#" className="text-slate-400 hover:text-pink-600 transition-colors">
            <InstagramIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>
          <a href="#" className="text-slate-400 hover:text-black transition-colors">
            <TikTokIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>
          <a href="#" className="text-slate-400 hover:text-blue-700 transition-colors">
            <LinkedInIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>
        </div>
        <div className="text-center">
          <button 
            onClick={onShowHelp}
            className="inline-flex items-center space-x-2 text-slate-500 hover:text-accent-500 font-medium text-xs sm:text-sm transition-colors bg-slate-50 hover:bg-accent-50 px-3 sm:px-4 py-2 rounded-lg"
          >
            <HelpIcon className="w-4 h-4" />
            <span>Ayuda</span>
          </button>
        </div>
      </div>
      {/* Location Request Modal */}
      {locationPermission === 'pending' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 text-center">
            <div className="text-6xl mb-4">📍</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">¿Permitir acceso a tu ubicación?</h3>
            <p className="text-slate-600 text-sm mb-6">Te mostraremos negocios cercanos a ti para una mejor experiencia</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={requestLocation}
                className="bg-accent-400 hover:bg-accent-500 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Permitir
              </button>
              <button
                onClick={() => setLocationPermission('denied')}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 rounded-xl transition-colors"
              >
                No permitir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Location Guide Modal */}
      {locationPermission === 'denied' && !filters.location && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Busca por municipio</h3>
            <p className="text-slate-600 text-sm mb-6">Utiliza el filtro de ubicación para encontrar negocios en tu municipio</p>
            <button
              onClick={() => setLocationPermission('dismissed')}
              className="w-full bg-accent-400 hover:bg-accent-500 text-white font-bold py-3 rounded-xl transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showMunicipalityDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowMunicipalityDropdown(false);
            setMunicipalitySearch('');
          }}
        />
      )}
    </div>
  );
};

export default ModernHome;