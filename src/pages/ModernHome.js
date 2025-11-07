import React, { useState, useEffect } from 'react';
import { GiftIcon, StarIcon } from '../shared/components/LoyaltyIcons';
import { FacebookIcon, InstagramIcon, TikTokIcon, LinkedInIcon, HelpIcon } from '../shared/components/SocialIcons';
import HamburgerMenu from '../shared/components/HamburgerMenu';
import LoadingSpinner from '../shared/components/LoadingSpinner';
import { useBusinesses } from '../shared/hooks/useBusinesses';
import { useVisits } from '../shared/hooks/useVisits';
import { useMunicipalities } from '../shared/hooks/useMunicipalities';
import { useProfile } from '../shared/hooks/useProfile';
import { useBusinessMenu } from '../shared/hooks/useBusinessMenu';
import flevoLogo from '../assets/images/flvo.jpg';

const ModernHome = ({ user, onLogout, onProfile, onShowHelp }) => {
  const [expandedBusiness, setExpandedBusiness] = useState(null);
  const [showQRModal, setShowQRModal] = useState(null);
  const [showMenuModal, setShowMenuModal] = useState(null);
  const [filters, setFilters] = useState({ location: '', type: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedBusinesses, setDisplayedBusinesses] = useState(6);
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState('checking');
  const [showMunicipalityDropdown, setShowMunicipalityDropdown] = useState(false);
  const [municipalitySearch, setMunicipalitySearch] = useState('');
  const [locationAsked, setLocationAsked] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);

  // API Hooks
  const { businesses: allBusinesses, loading: businessesLoading, error: businessesError } = useBusinesses();
  const { visits, totalVisits, createVisit, loading: visitsLoading } = useVisits();
  const { municipalities, loading: municipalitiesLoading } = useMunicipalities();
  const { profile } = useProfile();
  const { menuItems, loading: menuLoading, error: menuError } = useBusinessMenu(showMenuModal?.id);
  
  // Filter municipalities based on search
  const filteredMunicipalities = municipalities.filter(municipality =>
    municipality.municipio.toLowerCase().includes(municipalitySearch.toLowerCase())
  );

  // Get business icon based on category
  const getBusinessIcon = (category) => {
    const icons = {
      'Restaurante': '🍽️',
      'Cafetería': '☕',
      'Ropa': '👕',
      'Librería': '📚',
      'Gimnasio': '💪',
      'Heladería': '🍦',
      'Farmacia': '💊',
      'Deportes': '⚽'
    };
    return icons[category] || '🏪';
  };

  // Get visit count for a business
  const getBusinessVisitCount = (businessId) => {
    const businessVisit = visits.find(visit => visit.business_id === businessId);
    return businessVisit ? businessVisit.visit_count : 0;
  };

  // Normalize text by removing accents and converting to lowercase
  const normalizeText = (text) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters except spaces
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
  };

  // Fuzzy search function with accent and case insensitive matching
  const fuzzyMatch = (text, search) => {
    if (!search || !text) return true;
    
    const normalizedText = normalizeText(text);
    const normalizedSearch = normalizeText(search);
    
    // Direct substring match
    if (normalizedText.includes(normalizedSearch)) {
      return true;
    }
    
    // Word-based partial matching
    const searchWords = normalizedSearch.split(' ').filter(word => word.length > 0);
    const textWords = normalizedText.split(' ');
    
    return searchWords.every(searchWord => 
      textWords.some(textWord => 
        textWord.includes(searchWord) || searchWord.includes(textWord)
      )
    );
  };

  // Filter businesses based on search and filters
  const filteredBusinesses = allBusinesses.filter(business => {
    const matchesSearch = fuzzyMatch(business.name, searchTerm);
    const matchesType = !filters.type || business.category === filters.type;
    
    // Location filtering logic
    let matchesLocation = true;
    const businessLocation = business.municipality || business.municipio || business.location;
    
    // Priority: Manual filter overrides GPS location
    if (filters.location && filters.location.trim() !== '') {
      // If user manually selected a specific location, use that filter
      matchesLocation = businessLocation && businessLocation.toLowerCase().includes(filters.location.toLowerCase());
      console.log(`Manual filter active - Filter: '${filters.location}', Business: ${businessLocation}, Match: ${matchesLocation}`);
    } else if (filters.location === '') {
      // User explicitly selected "Todos los municipios" - show all businesses
      matchesLocation = true;
      console.log(`All municipalities selected - showing all businesses`);
    } else if (userLocation && locationPermission === 'granted' && !userLocation.includes('No disponible')) {
      // If no manual filter but GPS location is available, use GPS location
      matchesLocation = businessLocation === userLocation;
      console.log(`GPS filter active - User: ${userLocation}, Business: ${businessLocation}, Match: ${matchesLocation}`);
    } else {
      // No filters active - show all businesses
      matchesLocation = true;
      console.log(`No location filter - showing all businesses`);
    }
    // If no location filter is active or location is not available, show all businesses
    
    const finalMatch = matchesSearch && matchesLocation && matchesType;
    if (!finalMatch) {
      console.log(`Business filtered out: ${business.name} - Search: ${matchesSearch}, Location: ${matchesLocation}, Type: ${matchesType}`);
    }
    
    return finalMatch;
  });
  
  console.log(`Total businesses: ${allBusinesses.length}, Filtered: ${filteredBusinesses.length}`);

  const businesses = filteredBusinesses.slice(0, displayedBusinesses);

  // Request user location
  const requestLocation = () => {
    if (navigator.geolocation) {
      setLocationLoading(true);
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
            const availableMunicipalities = municipalities.length > 0 ? municipalities.map(m => m.municipio) : [];
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
            setLocationAsked(true);
            setLocationLoading(false);
            // Clear any manual location filter when using GPS
            setFilters(prev => ({...prev, location: ''}));
            
          } catch (error) {
            console.error('Reverse geocoding error:', error);
            // Fallback to coordinates display
            setUserLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            setLocationPermission('granted');
            setLocationLoading(false);
            setFilters(prev => ({...prev, location: ''}));
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationPermission('denied');
          setLocationAsked(true);
          setLocationLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 300000
        }
      );
    } else {
      setLocationPermission('denied');
      setLocationAsked(true);
      setLocationLoading(false);
    }
  };

  // Check location permission on mount
  useEffect(() => {
    // Only check permissions after municipalities are loaded
    if (municipalities.length === 0) return;
    
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          setLocationPermission('granted');
          requestLocation();
        } else if (result.state === 'denied') {
          setLocationPermission('denied');
        } else {
          setLocationPermission('pending');
        }
      }).catch(() => {
        setLocationPermission('pending');
      });
    } else {
      setLocationPermission('pending');
    }
  }, [municipalities]);

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.offsetHeight;
      const clientHeight = window.innerHeight;
      const scrolledToBottom = scrollTop + clientHeight >= scrollHeight - 1000;
      
      console.log(`Scroll - Top: ${scrollTop}, Height: ${scrollHeight}, Client: ${clientHeight}, Near bottom: ${scrolledToBottom}`);
      console.log(`Displayed: ${displayedBusinesses}, Filtered: ${filteredBusinesses.length}`);
      
      if (scrolledToBottom && displayedBusinesses < filteredBusinesses.length) {
        console.log('Loading more businesses...');
        setDisplayedBusinesses(prev => {
          const newCount = Math.min(prev + 3, filteredBusinesses.length);
          console.log(`Updating displayed businesses from ${prev} to ${newCount}`);
          return newCount;
        });
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [filteredBusinesses.length, displayedBusinesses]);

  const generateQR = async (businessId) => {
    setQrLoading(true);
    const business = allBusinesses.find(b => b.id === businessId);
    const visitData = {
      business_id: businessId,
      user_id: profile?.id || user?.id,
      visit_date: new Date().toISOString()
    };
    
    const result = await createVisit(visitData);
    setQrLoading(false);
    if (result.success) {
      setShowQRModal({
        qrCode: result.qrCode,
        businessId,
        businessName: business?.name || 'Negocio',
        timestamp: new Date().toISOString()
      });
    }
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
          ¡Hola {profile?.name || user?.nombre || 'Usuario'}!
        </h1>
        <p className="text-flevo-100 text-xs font-medium">
          Tu programa de lealtad favorito
        </p>
      </div>

      {/* Body - Responsive Width */}
      <div className="flex-1 px-4 sm:px-6 py-4 w-[90%] sm:w-[70%] mx-auto">
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
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-sm p-3 mb-4 border border-green-100">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg">📍</span>
              <div className="text-center">
                <h3 className="font-medium text-slate-800 text-sm">Tu ubicación: {userLocation}</h3>
                <p className="text-slate-500 text-xs">Mostrando negocios cercanos</p>
              </div>
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
                          key={municipality.id}
                          onClick={() => {
                            setFilters({...filters, location: municipality.municipio});
                            setShowMunicipalityDropdown(false);
                            setMunicipalitySearch('');
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-slate-800 hover:bg-accent-50 transition-colors"
                        >
                          📍 {municipality.municipio}
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
              {[...new Set(allBusinesses.map(b => b.category))].map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
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

        {/* Loading State */}
        {businessesLoading && (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-accent-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Cargando negocios...</p>
          </div>
        )}

        {/* Error State */}
        {businessesError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <p className="text-red-600 text-sm text-center">{businessesError}</p>
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
                    {business.logo ? (
                      <img src={business.logo} alt={business.name} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      getBusinessIcon(business.category)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 text-base mb-1">{business.name}</h3>
                    <p className="text-slate-600 text-sm mb-1 flex items-center">
                      📍 <span className="ml-1 truncate">{business.address}</span>
                    </p>
                    <p className="text-slate-500 text-xs mb-2 flex items-center">
                      🏛️ <span className="ml-1">{business.municipality || business.municipio || business.location || 'Sin municipio'}</span>
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="bg-accent-100 text-accent-700 px-2 py-1 rounded-lg text-xs font-medium">
                        🏆 {getBusinessVisitCount(business.id)} visitas este mes
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
                      <span className="font-medium text-slate-600 text-sm">Descripción: </span>
                      <span className="text-slate-800 text-sm">{business.description}</span>
                    </div>
                    
                    {/* Contact Info */}
                    <div className="grid grid-cols-2 gap-3">
                      {business.phone && (
                        <div>
                          <span className="font-medium text-slate-600 text-sm block mb-1">📞 Teléfono:</span>
                          <a href={`tel:${business.phone}`} className="text-accent-600 text-sm hover:underline">
                            {business.phone}
                          </a>
                        </div>
                      )}
                      {business.whatsapp && (
                        <div>
                          <span className="font-medium text-slate-600 text-sm block mb-1">WhatsApp:</span>
                          <a href={business.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                            </svg>
                            <span className="text-sm">WhatsApp</span>
                          </a>
                        </div>
                      )}
                    </div>
                    
                    {/* Social Media */}
                    {(business.facebook || business.instagram || business.tiktok) && (
                      <div>
                        <span className="font-medium text-slate-600 text-sm block mb-2">Redes Sociales:</span>
                        <div className="flex space-x-3">
                          {business.facebook && (
                            <a href={business.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 transition-colors">
                              <FacebookIcon className="w-5 h-5" />
                            </a>
                          )}
                          {business.instagram && (
                            <a href={business.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700 transition-colors">
                              <InstagramIcon className="w-5 h-5" />
                            </a>
                          )}
                          {business.tiktok && (
                            <a href={business.tiktok} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-700 transition-colors">
                              <TikTokIcon className="w-5 h-5" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <span className="font-medium text-slate-600 text-sm">Categoría: </span>
                      <span className="bg-accent-100 text-accent-700 px-2 py-1 rounded text-xs">
                        {business.category}
                      </span>
                    </div>
                    
                    <div>
                      <span className="font-medium text-slate-600 text-sm">Visitas este mes: </span>
                      <span className="text-accent-500 font-bold text-sm">{getBusinessVisitCount(business.id)}</span>
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
                        disabled={qrLoading}
                        className="bg-gradient-to-r from-gold-400 to-accent-500 hover:from-gold-500 hover:to-accent-600 text-white font-medium py-2 px-4 rounded-xl text-sm shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                      >
                        {qrLoading ? '⏳ Generando...' : '🎯 Generar QR'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* Loading indicator for infinite scroll */}
          {displayedBusinesses < filteredBusinesses.length && filteredBusinesses.length > 0 && (
            <div className="py-8">
              <div className="text-center">
                <div className="relative mb-4">
                  <div className="w-12 h-12 mx-auto relative">
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-accent-400 border-r-gold-400 animate-spin"></div>
                    <div className="absolute inset-1 rounded-full border-2 border-transparent border-b-flevo-900 border-l-accent-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                    <div className="absolute inset-2 rounded-full overflow-hidden bg-white shadow-lg">
                      <img src={flevoLogo} alt="Flevo" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
                <p className="text-slate-600 text-sm font-medium">Cargando más negocios...</p>
              </div>
            </div>
          )}
        </div>



      {/* Menu Modal */}
      {showMenuModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{getBusinessIcon(showMenuModal.category)}</div>
              <h3 className="text-xl font-bold text-slate-800">{showMenuModal.name}</h3>
              <p className="text-slate-600 text-sm">Menú / Productos</p>
            </div>
            
            {menuLoading ? (
              <div className="text-center py-8">
                <div className="w-6 h-6 border-2 border-accent-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-slate-600 text-sm">Cargando menú...</p>
              </div>
            ) : menuError ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl mb-2">⚠️</div>
                  <p className="text-red-700 text-sm font-medium">Error al cargar menú</p>
                  <p className="text-red-600 text-xs mt-1">{menuError}</p>
                </div>
              </div>
            ) : menuItems.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl mb-2">🚧</div>
                  <p className="text-yellow-700 text-sm font-medium">Menú no disponible</p>
                  <p className="text-yellow-600 text-xs mt-1">El negocio aún no ha subido su menú digital</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                {menuItems.map((item) => (
                  <div key={item.id} className="bg-slate-50 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-800 text-sm">{item.producto}</h4>
                        {item.descripcion && (
                          <p className="text-slate-600 text-xs mt-1">{item.descripcion}</p>
                        )}
                        {item.categoria && (
                          <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs mt-1">
                            {item.categoria}
                          </span>
                        )}
                      </div>
                      <div className="ml-3">
                        <span className="font-bold text-accent-600 text-sm">${item.precio}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
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
            <h3 className="text-xl font-bold text-slate-800 mb-2">¡Visita Registrada!</h3>
            <p className="text-slate-600 text-sm mb-4">Tu código QR ha sido generado</p>
            
            <div className="bg-slate-100 rounded-xl p-4 mb-4">
              {showQRModal.qrCode ? (
                <img src={showQRModal.qrCode} alt="QR Code" className="w-52 h-52 mx-auto mb-2" />
              ) : (
                <div className="text-8xl mb-2">⬜</div>
              )}
              <div className="text-xs text-slate-500 space-y-1">
                <p>Negocio: {showQRModal.businessName}</p>
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
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors">
            <FacebookIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-600 transition-colors">
            <InstagramIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-black transition-colors">
            <TikTokIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-700 transition-colors">
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
      {locationPermission === 'pending' && !locationAsked && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 text-center">
            <div className="text-6xl mb-4">📍</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">¿Permitir acceso a tu ubicación?</h3>
            <p className="text-slate-600 text-sm mb-6">Te mostraremos negocios cercanos a ti para una mejor experiencia</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  requestLocation();
                  setLocationAsked(true);
                }}
                className="bg-accent-400 hover:bg-accent-500 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Permitir
              </button>
              <button
                onClick={() => {
                  setLocationPermission('denied');
                  setLocationAsked(true);
                }}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 rounded-xl transition-colors"
              >
                No permitir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Location Guide Modal */}
      {locationPermission === 'denied' && !filters.location && !locationAsked && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Busca por municipio</h3>
            <p className="text-slate-600 text-sm mb-6">Utiliza el filtro de ubicación para encontrar negocios en tu municipio</p>
            <button
              onClick={() => setLocationAsked(true)}
              className="w-full bg-accent-400 hover:bg-accent-500 text-white font-bold py-3 rounded-xl transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Location Loading Modal */}
      {locationLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4">
            <div className="relative mb-4">
              <div className="w-16 h-16 mx-auto relative">
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-accent-400 border-r-gold-400 animate-spin"></div>
                <div className="absolute inset-1 rounded-full border-2 border-transparent border-b-flevo-900 border-l-accent-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                <div className="absolute inset-2 rounded-full overflow-hidden bg-white shadow-lg">
                  <img src={flevoLogo} alt="Flevo" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
            <h3 className="text-lg font-bold text-flevo-900 mb-2">Obteniendo ubicación</h3>
            <p className="text-slate-600 text-sm">Detectando tu municipio...</p>
          </div>
        </div>
      )}

      {/* QR Generation Loading Modal */}
      {qrLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4">
            <div className="relative mb-4">
              <div className="w-16 h-16 mx-auto relative">
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-accent-400 border-r-gold-400 animate-spin"></div>
                <div className="absolute inset-1 rounded-full border-2 border-transparent border-b-flevo-900 border-l-accent-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                <div className="absolute inset-2 rounded-full overflow-hidden bg-white shadow-lg">
                  <img src={flevoLogo} alt="Flevo" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
            <h3 className="text-lg font-bold text-flevo-900 mb-2">Generando código QR</h3>
            <p className="text-slate-600 text-sm">Registrando tu visita...</p>
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