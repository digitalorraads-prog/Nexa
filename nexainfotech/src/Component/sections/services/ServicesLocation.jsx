import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function ServicesLocation({ 
  cities = [], 
  countryName = "Global", 
  countryFlag = "🌍",
  showCityTabs = true,
  onCityChange = null 
}) {
  const sectionRef = useRef(null);
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [activeLocation, setActiveLocation] = useState("");
  const [activeHeadCity, setActiveHeadCity] = useState("");
  const [activeState, setActiveState] = useState("newyork");
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showLondonDropdown, setShowLondonDropdown] = useState(false);
  const [showDubaiDropdown, setShowDubaiDropdown] = useState(false);
  const [showSingaporeDropdown, setShowSingaporeDropdown] = useState(false);
  const [showSydneyDropdown, setShowSydneyDropdown] = useState(false);
  const [showTorontoDropdown, setShowTorontoDropdown] = useState(false);
  
  const dropdownRef = useRef(null);

  // Head city mapping for URL structure
  const headCityMapping = {
    // New York
    newyork: "newyork",
    "new-york-city": "newyork",
    buffalo: "newyork",
    rochester: "newyork",
    yonkers: "newyork",
    syracuse: "newyork",
    albany: "newyork",
    "new-rochelle": "newyork",
    "mount-vernon": "newyork",
    schenectady: "newyork",
    utica: "newyork",
    troy: "newyork",
    ithaca: "newyork",
    binghamton: "newyork",
    "niagara-falls": "newyork",
    "white-plains": "newyork",
    hempstead: "newyork",
    montauk: "newyork",
    cheektowaga: "newyork",
    
    // California
    california: "california",
    "los-angeles": "california",
    "san-francisco": "california",
    "san-diego": "california",
    sacramento: "california",
    "long-beach": "california",
    oakland: "california",
    bakersfield: "california",
    anaheim: "california",
    "santa-clara": "california",
    berkeley: "california",
    fresno: "california",
    riverside: "california",
    stockton: "california",
    irvine: "california",
    pasadena: "california",
    "santa-monica": "california",
    malibu: "california",
    "palm-springs": "california",
    
    // London
    london: "gblondon",
    westminster: "gblondon",
    camden: "gblondon",
    greenwich: "gblondon",
    kensington: "gblondon",
    islington: "gblondon",
    lambeth: "gblondon",
    southwark: "gblondon",
    "tower-hamlets": "gblondon",
    wandsworth: "gblondon",
    brent: "gblondon",
    ealing: "gblondon",
    hackney: "gblondon",
    hammersmith: "gblondon",
    harrow: "gblondon",
    hounslow: "gblondon",
    
    // Dubai
    dubai: "aedubai",
    "downtown-dubai": "aedubai",
    "dubai-marina": "aedubai",
    jumeirah: "aedubai",
    deira: "aedubai",
    "bur-dubai": "aedubai",
    "al-barsha": "aedubai",
    "palm-jumeirah": "aedubai",
    "business-bay": "aedubai",
    jlt: "aedubai",
    "al-quoz": "aedubai",
    "al-ain": "aedubai",
    sharjah: "aedubai",
    ajman: "aedubai",
    rak: "aedubai",
    
    // Singapore
    singapore: "sgsingapore",
    "marina-bay": "sgsingapore",
    "orchard-road": "sgsingapore",
    chinatown: "sgsingapore",
    "little-india": "sgsingapore",
    bugis: "sgsingapore",
    sentosa: "sgsingapore",
    jurong: "sgsingapore",
    tampines: "sgsingapore",
    woodlands: "sgsingapore",
    yishun: "sgsingapore",
    "ang-mo-kio": "sgsingapore",
    bedok: "sgsingapore",
    hougang: "sgsingapore",
    sengkang: "sgsingapore",
    punggol: "sgsingapore",
    
    // Sydney
    sydney: "ausydney",
    "sydney-cbd": "ausydney",
    parramatta: "ausydney",
    bondi: "ausydney",
    manly: "ausydney",
    chatswood: "ausydney",
    hurstville: "ausydney",
    burwood: "ausydney",
    strathfield: "ausydney",
    blacktown: "ausydney",
    penrith: "ausydney",
    campbelltown: "ausydney",
    liverpool: "ausydney",
    wollongong: "ausydney",
    newcastle: "ausydney",
    "central-coast": "ausydney",
    
    // Toronto
    toronto: "catoronto",
    "downtown-toronto": "catoronto",
    "north-york": "catoronto",
    scarborough: "catoronto",
    etobicoke: "catoronto",
    york: "catoronto",
    "east-york": "catoronto",
    mississauga: "catoronto",
    brampton: "catoronto",
    markham: "catoronto",
    vaughan: "catoronto",
    "richmond-hill": "catoronto",
    oakville: "catoronto",
    burlington: "catoronto",
    hamilton: "catoronto",
    oshawa: "catoronto"
  };

  // State data for all locations with their cities
  const locationCities = {
    newyork: {
      headId: "newyork",
      name: "NEW YORK",
      displayName: "New York",
      flag: "🗽",
      color: "from-cyan-400 to-blue-500",
      cities: [
        { id: "new-york-city", name: "New York City", flag: "🗽" },
        { id: "buffalo", name: "Buffalo", flag: "🗽" },
        { id: "rochester", name: "Rochester", flag: "🗽" },
        { id: "yonkers", name: "Yonkers", flag: "🗽" },
        { id: "syracuse", name: "Syracuse", flag: "🗽" },
        { id: "albany", name: "Albany", flag: "🗽" },
        { id: "new-rochelle", name: "New Rochelle", flag: "🗽" },
        { id: "mount-vernon", name: "Mount Vernon", flag: "🗽" },
        { id: "schenectady", name: "Schenectady", flag: "🗽" },
        { id: "utica", name: "Utica", flag: "🗽" },
        { id: "troy", name: "Troy Amsterdam", flag: "🗽" },
        { id: "ithaca", name: "Ithaca", flag: "🗽" },
        { id: "binghamton", name: "Binghamton", flag: "🗽" },
        { id: "niagara-falls", name: "Niagara Falls", flag: "🗽" },
        { id: "white-plains", name: "White Plains", flag: "🗽" },
        { id: "hempstead", name: "Hempstead", flag: "🗽" },
        { id: "montauk", name: "Montauk", flag: "🗽" },
        { id: "cheektowaga", name: "Cheektowaga", flag: "🗽" }
      ]
    },
    california: {
      headId: "california",
      name: "CALIFORNIA",
      displayName: "California",
      flag: "🌴",
      color: "from-purple-400 to-pink-500",
      cities: [
        { id: "los-angeles", name: "Los Angeles", flag: "🌴" },
        { id: "san-francisco", name: "San Francisco", flag: "🌴" },
        { id: "san-diego", name: "San Diego", flag: "🌴" },
        { id: "sacramento", name: "Sacramento", flag: "🌴" },
        { id: "long-beach", name: "Long Beach", flag: "🌴" },
        { id: "oakland", name: "Oakland", flag: "🌴" },
        { id: "bakersfield", name: "Bakersfield", flag: "🌴" },
        { id: "anaheim", name: "Anaheim", flag: "🌴" },
        { id: "santa-clara", name: "Santa Clara", flag: "🌴" },
        { id: "berkeley", name: "Berkeley", flag: "🌴" },
        { id: "fresno", name: "Fresno", flag: "🌴" },
        { id: "riverside", name: "Riverside", flag: "🌴" },
        { id: "stockton", name: "Stockton", flag: "🌴" },
        { id: "irvine", name: "Irvine", flag: "🌴" },
        { id: "pasadena", name: "Pasadena", flag: "🌴" },
        { id: "santa-monica", name: "Santa Monica", flag: "🌴" },
        { id: "malibu", name: "Malibu", flag: "🌴" },
        { id: "palm-springs", name: "Palm Springs", flag: "🌴" }
      ]
    },
    london: {
      headId: "gblondon",
      name: "GB LONDON",
      displayName: "London",
      flag: "🇬🇧",
      color: "from-blue-400 to-purple-500",
      cities: [
        { id: "westminster", name: "Westminster", flag: "🇬🇧" },
        { id: "camden", name: "Camden", flag: "🇬🇧" },
        { id: "greenwich", name: "Greenwich", flag: "🇬🇧" },
        { id: "kensington", name: "Kensington", flag: "🇬🇧" },
        { id: "islington", name: "Islington", flag: "🇬🇧" },
        { id: "lambeth", name: "Lambeth", flag: "🇬🇧" },
        { id: "southwark", name: "Southwark", flag: "🇬🇧" },
        { id: "tower-hamlets", name: "Tower Hamlets", flag: "🇬🇧" },
        { id: "wandsworth", name: "Wandsworth", flag: "🇬🇧" },
        { id: "brent", name: "Brent", flag: "🇬🇧" },
        { id: "ealing", name: "Ealing", flag: "🇬🇧" },
        { id: "hackney", name: "Hackney", flag: "🇬🇧" },
        { id: "hammersmith", name: "Hammersmith", flag: "🇬🇧" },
        { id: "harrow", name: "Harrow", flag: "🇬🇧" },
        { id: "hounslow", name: "Hounslow", flag: "🇬🇧" }
      ]
    },
    dubai: {
      headId: "aedubai",
      name: "AE DUBAI",
      displayName: "Dubai",
      flag: "🇦🇪",
      color: "from-purple-400 to-pink-500",
      cities: [
        { id: "downtown-dubai", name: "Downtown Dubai", flag: "🇦🇪" },
        { id: "dubai-marina", name: "Dubai Marina", flag: "🇦🇪" },
        { id: "jumeirah", name: "Jumeirah", flag: "🇦🇪" },
        { id: "deira", name: "Deira", flag: "🇦🇪" },
        { id: "bur-dubai", name: "Bur Dubai", flag: "🇦🇪" },
        { id: "al-barsha", name: "Al Barsha", flag: "🇦🇪" },
        { id: "palm-jumeirah", name: "Palm Jumeirah", flag: "🇦🇪" },
        { id: "business-bay", name: "Business Bay", flag: "🇦🇪" },
        { id: "jlt", name: "JLT", flag: "🇦🇪" },
        { id: "al-quoz", name: "Al Quoz", flag: "🇦🇪" },
        { id: "al-ain", name: "Al Ain", flag: "🇦🇪" },
        { id: "sharjah", name: "Sharjah", flag: "🇦🇪" },
        { id: "ajman", name: "Ajman", flag: "🇦🇪" },
        { id: "rak", name: "Ras Al Khaimah", flag: "🇦🇪" }
      ]
    },
    singapore: {
      headId: "sgsingapore",
      name: "SG SINGAPORE",
      displayName: "Singapore",
      flag: "🇸🇬",
      color: "from-pink-400 to-rose-500",
      cities: [
        { id: "marina-bay", name: "Marina Bay", flag: "🇸🇬" },
        { id: "orchard-road", name: "Orchard Road", flag: "🇸🇬" },
        { id: "chinatown", name: "Chinatown", flag: "🇸🇬" },
        { id: "little-india", name: "Little India", flag: "🇸🇬" },
        { id: "bugis", name: "Bugis", flag: "🇸🇬" },
        { id: "sentosa", name: "Sentosa", flag: "🇸🇬" },
        { id: "jurong", name: "Jurong", flag: "🇸🇬" },
        { id: "tampines", name: "Tampines", flag: "🇸🇬" },
        { id: "woodlands", name: "Woodlands", flag: "🇸🇬" },
        { id: "yishun", name: "Yishun", flag: "🇸🇬" },
        { id: "ang-mo-kio", name: "Ang Mo Kio", flag: "🇸🇬" },
        { id: "bedok", name: "Bedok", flag: "🇸🇬" },
        { id: "hougang", name: "Hougang", flag: "🇸🇬" },
        { id: "sengkang", name: "Sengkang", flag: "🇸🇬" },
        { id: "punggol", name: "Punggol", flag: "🇸🇬" }
      ]
    },
    sydney: {
      headId: "ausydney",
      name: "AU SYDNEY",
      displayName: "Sydney",
      flag: "🇦🇺",
      color: "from-rose-400 to-orange-500",
      cities: [
        { id: "sydney-cbd", name: "Sydney CBD", flag: "🇦🇺" },
        { id: "parramatta", name: "Parramatta", flag: "🇦🇺" },
        { id: "bondi", name: "Bondi", flag: "🇦🇺" },
        { id: "manly", name: "Manly", flag: "🇦🇺" },
        { id: "chatswood", name: "Chatswood", flag: "🇦🇺" },
        { id: "hurstville", name: "Hurstville", flag: "🇦🇺" },
        { id: "burwood", name: "Burwood", flag: "🇦🇺" },
        { id: "strathfield", name: "Strathfield", flag: "🇦🇺" },
        { id: "blacktown", name: "Blacktown", flag: "🇦🇺" },
        { id: "penrith", name: "Penrith", flag: "🇦🇺" },
        { id: "campbelltown", name: "Campbelltown", flag: "🇦🇺" },
        { id: "liverpool", name: "Liverpool", flag: "🇦🇺" },
        { id: "wollongong", name: "Wollongong", flag: "🇦🇺" },
        { id: "newcastle", name: "Newcastle", flag: "🇦🇺" },
        { id: "central-coast", name: "Central Coast", flag: "🇦🇺" }
      ]
    },
    toronto: {
      headId: "catoronto",
      name: "CA TORONTO",
      displayName: "Toronto",
      flag: "🇨🇦",
      color: "from-orange-400 to-yellow-500",
      cities: [
        { id: "downtown-toronto", name: "Downtown Toronto", flag: "🇨🇦" },
        { id: "north-york", name: "North York", flag: "🇨🇦" },
        { id: "scarborough", name: "Scarborough", flag: "🇨🇦" },
        { id: "etobicoke", name: "Etobicoke", flag: "🇨🇦" },
        { id: "york", name: "York", flag: "🇨🇦" },
        { id: "east-york", name: "East York", flag: "🇨🇦" },
        { id: "mississauga", name: "Mississauga", flag: "🇨🇦" },
        { id: "brampton", name: "Brampton", flag: "🇨🇦" },
        { id: "markham", name: "Markham", flag: "🇨🇦" },
        { id: "vaughan", name: "Vaughan", flag: "🇨🇦" },
        { id: "richmond-hill", name: "Richmond Hill", flag: "🇨🇦" },
        { id: "oakville", name: "Oakville", flag: "🇨🇦" },
        { id: "burlington", name: "Burlington", flag: "🇨🇦" },
        { id: "hamilton", name: "Hamilton", flag: "🇨🇦" },
        { id: "oshawa", name: "Oshawa", flag: "🇨🇦" }
      ]
    }
  };

  // Default cities for tabs
  const defaultCities = [
    { id: "newyork", name: "NEW YORK", flag: "🗽", color: "from-cyan-400 to-blue-500" },
    { id: "london", name: "GB LONDON", flag: "🇬🇧", color: "from-blue-400 to-purple-500" },
    { id: "dubai", name: "AE DUBAI", flag: "🇦🇪", color: "from-purple-400 to-pink-500" },
    { id: "singapore", name: "SG SINGAPORE", flag: "🇸🇬", color: "from-pink-400 to-rose-500" },
    { id: "sydney", name: "AU SYDNEY", flag: "🇦🇺", color: "from-rose-400 to-orange-500" },
    { id: "toronto", name: "CA TORONTO", flag: "🇨🇦", color: "from-orange-400 to-yellow-500" }
  ];

  const locationData = cities.length > 0 ? cities : defaultCities;

  // Function to close all dropdowns
  const closeAllDropdowns = () => {
    setShowStateDropdown(false);
    setShowLondonDropdown(false);
    setShowDubaiDropdown(false);
    setShowSingaporeDropdown(false);
    setShowSydneyDropdown(false);
    setShowTorontoDropdown(false);
  };

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeAllDropdowns();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (locationData.length > 0 && !activeLocation) {
      setActiveLocation(locationData[0].id);
      setActiveHeadCity(headCityMapping[locationData[0].id] || locationData[0].id);
      if (onCityChange) onCityChange(locationData[0].id);
    }
  }, [locationData]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const services = [
    { 
      name: "Digital Marketing", 
      icon: "📱", 
      desc: "Comprehensive digital strategies including social media, content, and email marketing",
      slug: "digital-marketing"
    },
    { 
      name: "Social Media Marketing", 
      icon: "📲", 
      desc: "Engage your audience effectively across all major social platforms",
      slug: "social-media-marketing"
    },
    { 
      name: "Graphic Designing", 
      icon: "🎨", 
      desc: "Creative visual solutions that capture your brand's essence",
      slug: "graphic-designing"
    },
    { 
      name: "Web Development", 
      icon: "💻", 
      desc: "Modern responsive websites with cutting-edge technology",
      slug: "web-development"
    },
    { 
      name: "SEO Optimization", 
      icon: "🔍", 
      desc: "Boost your search rankings and drive organic traffic",
      slug: "seo-optimization"
    },
    { 
      name: "PPC Advertising", 
      icon: "💰", 
      desc: "Targeted ad campaigns that maximize ROI",
      slug: "ppc-advertising"
    }
  ];

  const handleCityClick = (cityId) => {
    setActiveLocation(cityId);
    setActiveHeadCity(headCityMapping[cityId] || cityId);
    closeAllDropdowns();
    
    // Show dropdown for the clicked city
    switch(cityId) {
      case "newyork":
        setShowStateDropdown(true);
        setActiveState("newyork");
        break;
      case "california":
        setShowStateDropdown(true);
        setActiveState("california");
        break;
      case "london":
        setShowLondonDropdown(true);
        break;
      case "dubai":
        setShowDubaiDropdown(true);
        break;
      case "singapore":
        setShowSingaporeDropdown(true);
        break;
      case "sydney":
        setShowSydneyDropdown(true);
        break;
      case "toronto":
        setShowTorontoDropdown(true);
        break;
      default:
        break;
    }
    
    if (onCityChange) {
      onCityChange(cityId);
    }
  };

  const handleCitySelect = (locationId, cityId) => {
    setActiveLocation(cityId);
    setActiveHeadCity(headCityMapping[locationId] || locationId);
    closeAllDropdowns();
    if (onCityChange) {
      onCityChange(cityId);
    }
  };

  const handleServiceClick = (serviceSlug) => {
    if (activeLocation && activeHeadCity) {
      // URL format: /headcity/actualcity/service-slug
      navigate(`/${activeHeadCity}/${activeLocation}/${serviceSlug}`);
    }
  };

  // Get current active city display name
  const getActiveCityDisplay = () => {
    if (!activeLocation) return "Select City";
    
    // Check in all location cities
    for (const [key, location] of Object.entries(locationCities)) {
      const city = location.cities.find(c => c.id === activeLocation);
      if (city) return city.name;
    }
    
    // Check in main locations
    const mainCity = locationData.find(c => c.id === activeLocation);
    if (mainCity) return mainCity.name;
    
    return "Select City";
  };

  // Get head city display name
  const getHeadCityDisplay = () => {
    if (!activeHeadCity) return "";
    
    for (const [key, location] of Object.entries(locationCities)) {
      if (location.headId === activeHeadCity || location.id === activeHeadCity) {
        return location.displayName;
      }
    }
    
    return activeHeadCity;
  };

  // Get current active city flag
  const getActiveCityFlag = () => {
    if (!activeLocation) return "📍";
    
    for (const [key, location] of Object.entries(locationCities)) {
      const city = location.cities.find(c => c.id === activeLocation);
      if (city) return city.flag;
    }
    
    const mainCity = locationData.find(c => c.id === activeLocation);
    if (mainCity) return mainCity.flag;
    
    return "📍";
  };

  // Get active city details for services
  const getActiveCityDetails = () => {
    if (!activeLocation) return null;
    
    // Check in main locations first
    const mainCity = locationData.find(c => c.id === activeLocation);
    if (mainCity) {
      return {
        id: mainCity.id,
        name: mainCity.name,
        flag: mainCity.flag,
        color: mainCity.color,
        headCity: activeHeadCity
      };
    }
    
    // Check in all location cities
    for (const [key, location] of Object.entries(locationCities)) {
      const city = location.cities.find(c => c.id === activeLocation);
      if (city) {
        return {
          id: city.id,
          name: city.name,
          flag: city.flag,
          color: location.color,
          headCity: location.headId,
          headCityDisplay: location.displayName
        };
      }
    }
    
    return null;
  };

  // Render dropdown for a location
  const renderDropdown = (locationId, isOpen, setIsOpen) => {
    if (!isOpen) return null;
    
    const location = locationCities[locationId];
    if (!location) return null;
    
    return (
      <div 
        ref={dropdownRef}
        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 w-64 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl z-50 backdrop-blur-xl"
      >
        <div className="p-2">
          <div className="text-xs text-gray-400 px-3 py-2 border-b border-white/10">
            Select a city in {location.displayName}
          </div>
          <div className="max-h-64 overflow-y-auto">
            {location.cities.map((city) => (
              <button
                key={city.id}
                onClick={() => handleCitySelect(locationId, city.id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2
                  ${activeLocation === city.id 
                    ? 'bg-linear-to-r ' + location.color + ' text-white' 
                    : 'hover:bg-white/10 text-gray-300'
                  }`}
              >
                <span className="text-lg">{city.flag}</span>
                <span className="text-sm">{city.name}</span>
                {activeLocation === city.id && (
                  <span className="ml-auto text-xs">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const activeCityDetails = getActiveCityDetails();

  return (
    <section
      ref={sectionRef}
      className="relative py-8 md:py-20 bg-[#0a0a14] text-white overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
      </div>

      {/* World Map Dots */}
      <div className="absolute inset-0 opacity-20">
        <div className="relative w-full h-full">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${Math.random() * 3 + 2}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-4 md:mb-6">
            <span className="text-lg md:text-xl">{countryFlag}</span>
            <span className="text-xs md:text-sm font-semibold text-cyan-400">
              {countryName === "Global" ? "GLOBAL PRESENCE" : `${countryName.toUpperCase()} NETWORK`}
            </span>
            <span className="text-lg md:text-xl">🌎</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 px-2">
            Our Services in{" "}
            <span className="bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent bg-size-200 animate-gradient">
              {countryName === "Global" ? "Major Cities" : countryName}
            </span>
          </h2>
          <p className="text-sm md:text-lg text-gray-400 max-w-2xl mx-auto px-4">
            {countryName === "Global" 
              ? "Explore our services available worldwide"
              : `Select your city in ${countryName} to explore location-specific digital solutions`}
          </p>
        </motion.div>

        {/* City Tabs with Dropdowns */}
        {showCityTabs && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-12"
          >
            {/* New York Tab */}
            <div className="relative">
              <button
                onClick={() => handleCityClick("newyork")}
                className={`group relative px-4 md:px-6 py-2 md:py-3 rounded-full backdrop-blur-sm border transition-all duration-300 text-sm md:text-base
                  ${activeHeadCity === "newyork" || activeHeadCity === "california" || 
                    (activeCityDetails && (activeCityDetails.headCity === "newyork" || activeCityDetails.headCity === "california"))
                    ? 'bg-linear-to-r from-cyan-400 to-blue-500 border-white/20 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]' 
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-cyan-400/30'
                  }`}
              >
                <span className="flex items-center gap-1 md:gap-2">
                  <span className="text-lg md:text-xl">🗽</span>
                  <span className="font-semibold">NEW YORK</span>
                  <span className="text-xs ml-1">▼</span>
                </span>
                {(activeHeadCity === "newyork" || activeHeadCity === "california" || 
                  (activeCityDetails && (activeCityDetails.headCity === "newyork" || activeCityDetails.headCity === "california"))) && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1">
                    <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 bg-cyan-400 rounded-full"></div>
                  </div>
                )}
              </button>
              {renderDropdown("newyork", showStateDropdown && activeState === "newyork", setShowStateDropdown)}
            </div>

            {/* London Tab */}
            <div className="relative">
              <button
                onClick={() => handleCityClick("london")}
                className={`group relative px-4 md:px-6 py-2 md:py-3 rounded-full backdrop-blur-sm border transition-all duration-300 text-sm md:text-base
                  ${activeHeadCity === "gblondon" || (activeCityDetails && activeCityDetails.headCity === "gblondon")
                    ? 'bg-linear-to-r from-blue-400 to-purple-500 border-white/20 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]' 
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-cyan-400/30'
                  }`}
              >
                <span className="flex items-center gap-1 md:gap-2">
                  <span className="text-lg md:text-xl">🇬🇧</span>
                  <span className="font-semibold">GB LONDON</span>
                  <span className="text-xs ml-1">▼</span>
                </span>
                {(activeHeadCity === "gblondon" || (activeCityDetails && activeCityDetails.headCity === "gblondon")) && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1">
                    <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 bg-cyan-400 rounded-full"></div>
                  </div>
                )}
              </button>
              {renderDropdown("london", showLondonDropdown, setShowLondonDropdown)}
            </div>

            {/* Dubai Tab */}
            <div className="relative">
              <button
                onClick={() => handleCityClick("dubai")}
                className={`group relative px-4 md:px-6 py-2 md:py-3 rounded-full backdrop-blur-sm border transition-all duration-300 text-sm md:text-base
                  ${activeHeadCity === "aedubai" || (activeCityDetails && activeCityDetails.headCity === "aedubai")
                    ? 'bg-linear-to-r from-purple-400 to-pink-500 border-white/20 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]' 
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-cyan-400/30'
                  }`}
              >
                <span className="flex items-center gap-1 md:gap-2">
                  <span className="text-lg md:text-xl">🇦🇪</span>
                  <span className="font-semibold">AE DUBAI</span>
                  <span className="text-xs ml-1">▼</span>
                </span>
                {(activeHeadCity === "aedubai" || (activeCityDetails && activeCityDetails.headCity === "aedubai")) && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1">
                    <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 bg-cyan-400 rounded-full"></div>
                  </div>
                )}
              </button>
              {renderDropdown("dubai", showDubaiDropdown, setShowDubaiDropdown)}
            </div>

            {/* Singapore Tab */}
            <div className="relative">
              <button
                onClick={() => handleCityClick("singapore")}
                className={`group relative px-4 md:px-6 py-2 md:py-3 rounded-full backdrop-blur-sm border transition-all duration-300 text-sm md:text-base
                  ${activeHeadCity === "sgsingapore" || (activeCityDetails && activeCityDetails.headCity === "sgsingapore")
                    ? 'bg-linear-to-r from-pink-400 to-rose-500 border-white/20 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]' 
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-cyan-400/30'
                  }`}
              >
                <span className="flex items-center gap-1 md:gap-2">
                  <span className="text-lg md:text-xl">🇸🇬</span>
                  <span className="font-semibold">SG SINGAPORE</span>
                  <span className="text-xs ml-1">▼</span>
                </span>
                {(activeHeadCity === "sgsingapore" || (activeCityDetails && activeCityDetails.headCity === "sgsingapore")) && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1">
                    <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 bg-cyan-400 rounded-full"></div>
                  </div>
                )}
              </button>
              {renderDropdown("singapore", showSingaporeDropdown, setShowSingaporeDropdown)}
            </div>

            {/* Sydney Tab */}
            <div className="relative">
              <button
                onClick={() => handleCityClick("sydney")}
                className={`group relative px-4 md:px-6 py-2 md:py-3 rounded-full backdrop-blur-sm border transition-all duration-300 text-sm md:text-base
                  ${activeHeadCity === "ausydney" || (activeCityDetails && activeCityDetails.headCity === "ausydney")
                    ? 'bg-linear-to-r from-rose-400 to-orange-500 border-white/20 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]' 
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-cyan-400/30'
                  }`}
              >
                <span className="flex items-center gap-1 md:gap-2">
                  <span className="text-lg md:text-xl">🇦🇺</span>
                  <span className="font-semibold">AU SYDNEY</span>
                  <span className="text-xs ml-1">▼</span>
                </span>
                {(activeHeadCity === "ausydney" || (activeCityDetails && activeCityDetails.headCity === "ausydney")) && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1">
                    <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 bg-cyan-400 rounded-full"></div>
                  </div>
                )}
              </button>
              {renderDropdown("sydney", showSydneyDropdown, setShowSydneyDropdown)}
            </div>

            {/* Toronto Tab */}
            <div className="relative">
              <button
                onClick={() => handleCityClick("toronto")}
                className={`group relative px-4 md:px-6 py-2 md:py-3 rounded-full backdrop-blur-sm border transition-all duration-300 text-sm md:text-base
                  ${activeHeadCity === "catoronto" || (activeCityDetails && activeCityDetails.headCity === "catoronto")
                    ? 'bg-linear-to-r from-orange-400 to-yellow-500 border-white/20 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]' 
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-cyan-400/30'
                  }`}
              >
                <span className="flex items-center gap-1 md:gap-2">
                  <span className="text-lg md:text-xl">🇨🇦</span>
                  <span className="font-semibold">CA TORONTO</span>
                  <span className="text-xs ml-1">▼</span>
                </span>
                {(activeHeadCity === "catoronto" || (activeCityDetails && activeCityDetails.headCity === "catoronto")) && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1">
                    <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 bg-cyan-400 rounded-full"></div>
                  </div>
                )}
              </button>
              {renderDropdown("toronto", showTorontoDropdown, setShowTorontoDropdown)}
            </div>
          </motion.div>
        )}

        {/* Active City Display */}
        {activeLocation && activeHeadCity && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
              <span className="text-xl">{getActiveCityFlag()}</span>
              <span className="text-sm font-semibold text-cyan-400">
                Currently viewing services in: {getHeadCityDisplay()} / {getActiveCityDisplay()}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              URL: /{activeHeadCity}/{activeLocation}/[service]
            </div>
          </motion.div>
        )}

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {services.map((service, index) => {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={visible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                onClick={() => handleServiceClick(service.slug)}
                className="cursor-pointer"
              >
                <div className="group relative p-4 md:p-6 bg-linear-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden
                  hover:scale-105 hover:-translate-y-2 transition-all duration-300
                  hover:shadow-[0_20px_40px_-15px_rgba(6,182,212,0.5)]">
                  
                  {/* Location-based gradient on hover */}
                  {activeCityDetails && (
                    <div className={`absolute inset-0 bg-linear-to-r ${activeCityDetails.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  )}
                  
                  <div className="flex items-start gap-3 md:gap-4">
                    {/* Icon with location flag */}
                    <div className="relative">
                      <div className="text-2xl md:text-3xl bg-white/10 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        {service.icon}
                      </div>
                      {activeCityDetails && (
                        <div className="absolute -top-1 -right-1 text-xs md:text-sm">
                          {activeCityDetails.flag}
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      {/* Service Name */}
                      <h3 className="text-base md:text-lg font-bold mb-1 md:mb-2 group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-cyan-400 group-hover:to-blue-400 group-hover:bg-clip-text transition-all duration-300">
                        {service.name}
                      </h3>

                      {/* Description */}
                      <p className="text-xs md:text-sm text-gray-400 mb-2 md:mb-3 group-hover:text-gray-300 transition-colors duration-300">
                        {service.desc}
                      </p>

                      {/* Location-specific badge */}
                      {activeCityDetails && (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] md:text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10">
                            {activeCityDetails.headCityDisplay || getHeadCityDisplay()} / {activeCityDetails.name}
                          </span>
                          <span className="text-[10px] md:text-xs text-cyan-400">✓ Available</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Line */}
                  {activeCityDetails && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/5">
                      <div className={`h-full w-0 bg-linear-to-r ${activeCityDetails.color} transition-all duration-500 group-hover:w-full`}></div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Global CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center mt-8 md:mt-12"
        >
          <button 
            onClick={() => navigate('/contact')}
            className="group relative px-6 md:px-8 py-3 md:py-4 bg-linear-to-r from-cyan-500 to-blue-600 rounded-full font-semibold text-sm md:text-base overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Get Started Today
              <span className="text-lg md:text-xl group-hover:translate-x-1 transition-transform">
                {countryFlag}
              </span>
            </span>
            <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </motion.div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        /* Custom scrollbar for dropdown */
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.5);
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.8);
        }
      `}</style>
    </section>
  );
}
