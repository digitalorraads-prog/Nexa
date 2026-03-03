import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "../../../Protected/axios"; // ✅ Correct - using custom axios instance
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon, PauseIcon } from '@heroicons/react/24/outline';

export default function HeroSection({ pageId: propPageId, heroId, className = "" }) {
  const location = useLocation();
  const [heroes, setHeroes] = useState([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Page ID determine karo
  const pageId = propPageId || location.pathname.split('/')[1] || 'home';
  
  useEffect(() => {
    fetchHeroes();
  }, [pageId, heroId]);
  
  useEffect(() => {
    // Auto slide for slider type
    let interval;
    const currentHero = heroes[currentHeroIndex];
    
    if (currentHero?.backgroundType === 'slider' && 
        currentHero.sliderSettings?.autoplay && 
        isPlaying &&
        currentHero.images?.length > 1) {
      
      interval = setInterval(() => {
        setCurrentSlide(prev => 
          prev === currentHero.images.length - 1 ? 0 : prev + 1
        );
      }, currentHero.sliderSettings.autoplaySpeed || 5000);
    }
    
    return () => clearInterval(interval);
  }, [currentHeroIndex, heroes, isPlaying]);
  
  const fetchHeroes = async () => {
    try {
      setLoading(true);
      
      let response;
      if (heroId) {
        // ✅ Fixed: Using relative paths with axios instance
        response = await axios.get(`/api/heroes/single/${heroId}`);
        if (response.data.success) {
          setHeroes([response.data.data]);
        }
      } else {
        // ✅ Fixed: Using relative paths with axios instance
        response = await axios.get(`/api/heroes/page/${pageId}`);
        if (response.data.success) {
          setHeroes(response.data.data);
        }
      }
    } catch (err) {
      console.error('Hero fetch error:', err);
      setError(err.response?.data?.message || "Failed to load hero section");
    } finally {
      setLoading(false);
    }
  };
  
  // Height classes
  const heightClasses = {
    small: 'h-[300px]',
    medium: 'h-[400px]',
    large: 'h-[500px]',
    full: 'h-screen'
  };
  
  // Alignment classes
  const alignmentClasses = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right'
  };
  
  // Animation classes
  const animationClasses = {
    fade: 'animate-fadeIn',
    slide: 'animate-slideUp',
    zoom: 'animate-zoomIn',
    none: ''
  };
  
  if (loading) {
    return (
      <div className={`${heightClasses.large} bg-[#0c0c16] flex items-center justify-center`}>
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error || heroes.length === 0) {
    return (
      <div className={`${heightClasses.medium} bg-red-900/20 flex items-center justify-center`}>
        <p className="text-red-400">{error || "No hero section found"}</p>
      </div>
    );
  }
  
  const currentHero = heroes[currentHeroIndex];
  const hasMultipleHeroes = heroes.length > 1;
  const hasMultipleImages = currentHero.images?.length > 1;
  
  // Get current image
  const currentImage = currentHero.images?.[currentSlide] || 
                      { url: currentHero.backgroundImage };
  
  // Background style
  const backgroundStyle = {
    backgroundImage: currentHero.backgroundType === 'image' && currentImage.url 
      ? `url(${currentImage.url})` 
      : 'none',
    backgroundColor: currentHero.backgroundColor,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: currentHero.textColor
  };
  
  return (
    <section 
      className={`relative ${heightClasses[currentHero.height]} w-full overflow-hidden ${className}`}
      style={backgroundStyle}
    >
      {/* Slider Background */}
      {currentHero.backgroundType === 'slider' && currentHero.images?.length > 0 && (
        <div className="absolute inset-0">
          {currentHero.images.map((image, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                idx === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url(${image.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          ))}
          
          {/* Slider Controls */}
          {hasMultipleImages && currentHero.sliderSettings?.arrows && (
            <>
              <button
                onClick={() => setCurrentSlide(prev => 
                  prev === 0 ? currentHero.images.length - 1 : prev - 1
                )}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
              <button
                onClick={() => setCurrentSlide(prev => 
                  prev === currentHero.images.length - 1 ? 0 : prev + 1
                )}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      )}
      
      {/* Video Background */}
      {currentHero.backgroundType === 'video' && currentHero.backgroundVideo && (
        <div className="absolute inset-0">
          <video
            src={currentHero.backgroundVideo}
            autoPlay
            muted
            loop
            playsInline
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover"
          />
        </div>
      )}
      
      {/* Overlay */}
      {(currentHero.backgroundType === 'image' || 
        currentHero.backgroundType === 'slider' || 
        currentHero.backgroundType === 'video') && (
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: currentHero.overlayOpacity }}
        ></div>
      )}
      
      {/* Content */}
      <div className={`relative h-full flex ${alignmentClasses[currentHero.alignment]} justify-center px-4 sm:px-6 lg:px-8`}>
        <div className={`max-w-4xl ${animationClasses[currentHero.animationType]}`}>
          {/* Subtitle */}
          {currentHero.subtitle && (
            <p className="text-lg sm:text-xl mb-4 opacity-90 uppercase tracking-wider">
              {currentHero.subtitle}
            </p>
          )}
          
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {currentHero.title}
          </h1>
          
          {/* Description */}
          {currentHero.description && (
            <p className="text-lg sm:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              {currentHero.description}
            </p>
          )}
          
          {/* Buttons */}
          {currentHero.showButtons && (
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to={currentHero.primaryButtonLink}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-full font-semibold transition transform hover:scale-105 shadow-lg"
              >
                {currentHero.primaryButtonText}
              </Link>
              
              <Link
                to={currentHero.secondaryButtonLink}
                className="px-8 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full font-semibold transition transform hover:scale-105 border border-white/30"
              >
                {currentHero.secondaryButtonText}
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Multiple Heroes Navigation */}
      {hasMultipleHeroes && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {heroes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentHeroIndex(idx);
                setCurrentSlide(0);
              }}
              className={`w-2 h-2 rounded-full transition ${
                idx === currentHeroIndex ? 'bg-cyan-400 w-4' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
      
      {/* Slider Dots */}
      {currentHero.backgroundType === 'slider' && 
       currentHero.sliderSettings?.dots && 
       currentHero.images?.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {currentHero.images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition ${
                idx === currentSlide ? 'bg-cyan-400 w-4' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
      
      {/* Play/Pause for Slider */}
      {currentHero.backgroundType === 'slider' && 
       currentHero.sliderSettings?.autoplay && 
       currentHero.images?.length > 1 && (
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
        >
          {isPlaying ? (
            <PauseIcon className="w-5 h-5" />
          ) : (
            <PlayIcon className="w-5 h-5" />
          )}
        </button>
      )}
    </section>
  );
}