import { useEffect, useState, useCallback, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "../../../Protected/axios";
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon, PauseIcon } from '@heroicons/react/24/outline';

// Configuration constants
const CONFIG = {
  ANIMATION_DURATION: 1000,
  DEFAULT_AUTOPLAY_SPEED: 5000,
  OVERLAY_DEFAULT_OPACITY: 0.5,
  MAX_DESCRIPTION_LENGTH: 500
};

// Height classes mapping
const HEIGHT_CLASSES = {
  small: 'h-[300px] sm:h-[350px]',
  medium: 'h-[400px] sm:h-[450px] lg:h-[500px]',
  large: 'h-[500px] sm:h-[550px] lg:h-[600px]',
  full: 'h-screen min-h-[600px]'
};

// Alignment classes mapping
const ALIGNMENT_CLASSES = {
  left: 'items-start text-left',
  center: 'items-center text-center',
  right: 'items-end text-right'
};

// Content alignment utilities
const CONTENT_ALIGNMENT = {
  left: { justify: 'justify-start', items: 'items-start', text: 'text-left' },
  center: { justify: 'justify-center', items: 'items-center', text: 'text-center' },
  right: { justify: 'justify-end', items: 'items-end', text: 'text-right' }
};

// Animation classes
const ANIMATION_CLASSES = {
  fade: 'animate-fadeIn',
  slide: 'animate-slideUp',
  zoom: 'animate-zoomIn',
  none: ''
};

// Font size options mapping
const FONT_SIZE_CLASSES = {
  title: {
    small: 'text-3xl sm:text-4xl lg:text-5xl',
    medium: 'text-4xl sm:text-5xl lg:text-6xl',
    large: 'text-5xl sm:text-6xl lg:text-7xl',
    custom: 'text-6xl sm:text-7xl lg:text-8xl'
  },
  subtitle: {
    small: 'text-xs sm:text-sm',
    medium: 'text-sm sm:text-base',
    large: 'text-base sm:text-lg',
    custom: 'text-lg sm:text-xl'
  },
  description: {
    small: 'text-sm sm:text-base',
    medium: 'text-base sm:text-lg',
    large: 'text-lg sm:text-xl',
    custom: 'text-xl sm:text-2xl'
  },
  badge: {
    small: 'text-xs px-2 py-1',
    medium: 'text-sm px-3 py-1.5',
    large: 'text-base px-4 py-2',
    custom: 'text-lg px-5 py-2.5'
  }
};

// Badge styles mapping
const BADGE_STYLES = {
  internship: 'from-green-400 to-emerald-500 border-green-400/30 text-white shadow-green-500/30',
  placement: 'from-blue-400 to-cyan-500 border-blue-400/30 text-white shadow-blue-500/30',
  job: 'from-purple-400 to-fuchsia-500 border-purple-400/30 text-white shadow-purple-500/30',
  default: 'from-gray-400 to-gray-500 border-gray-400/30 text-white shadow-gray-500/30'
};

// Icons mapping
const BADGE_ICONS = {
  internship: '🎓',
  placement: '💼',
  job: '🚀',
  default: '✨'
};

export default function HeroSection({
  pageId: propPageId,
  heroId,
  className = ""
}) {
  const location = useLocation();
  const [heroes, setHeroes] = useState([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  const [imageLoadError, setImageLoadError] = useState({});

  // Memoized page ID
  const pageId = useMemo(() =>
    propPageId || location.pathname.split('/')[1] || 'home',
    [propPageId, location.pathname]
  );

  // Fetch heroes data
  const fetchHeroes = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      let response;
      if (heroId) {
        response = await axios.get(`/api/heroes/single/${heroId}`);
      } else {
        response = await axios.get(`/api/heroes/page/${pageId}`);
      }

      if (response.data?.success) {
        const heroesData = heroId ? [response.data.data] : response.data.data;
        setHeroes(heroesData);
        setCurrentHeroIndex(0);
        setCurrentSlide(0);
        setIsPlaying(true);
      } else {
        setError("No hero section found");
      }
    } catch (err) {
      console.error('Hero fetch error:', err);
      setError(err.response?.data?.message || "Failed to load hero section");
    } finally {
      setLoading(false);
    }
  }, [pageId, heroId]);

  useEffect(() => {
    fetchHeroes();
  }, [fetchHeroes]);

  // Auto-slide effect
  useEffect(() => {
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
      }, currentHero.sliderSettings.autoplaySpeed || CONFIG.DEFAULT_AUTOPLAY_SPEED);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentHeroIndex, heroes, isPlaying]);

  // Handle slide change
  const handleSlideChange = useCallback((direction) => {
    const currentHero = heroes[currentHeroIndex];
    if (!currentHero?.images?.length) return;

    setCurrentSlide(prev => {
      if (direction === 'next') {
        return prev === currentHero.images.length - 1 ? 0 : prev + 1;
      } else {
        return prev === 0 ? currentHero.images.length - 1 : prev - 1;
      }
    });
  }, [currentHeroIndex, heroes]);

  // Handle hero change
  const handleHeroChange = useCallback((index) => {
    setCurrentHeroIndex(index);
    setCurrentSlide(0);
    setIsPlaying(true);
  }, []);

  // Handle image error
  const handleImageError = useCallback((imageId) => {
    setImageLoadError(prev => ({
      ...prev,
      [imageId]: true
    }));
  }, []);

  // Get font size class
  const getFontSizeClass = (element, defaultValue = 'large') => {
    const currentHero = heroes[currentHeroIndex];
    if (!currentHero?.fontSize) return FONT_SIZE_CLASSES[element][defaultValue];
    return FONT_SIZE_CLASSES[element][currentHero.fontSize[element] || defaultValue];
  };

  // Get text color class
  const getTextColorClass = (element) => {
    const currentHero = heroes[currentHeroIndex];
    if (!currentHero?.customColors) return '';

    if (element === 'title') return currentHero.customColors.title || 'text-white';
    if (element === 'subtitle') return currentHero.customColors.subtitle || 'text-cyan-400';
    if (element === 'description') return currentHero.customColors.description || 'text-gray-300';
    return '';
  };

  // Render description with formatting
  const renderDescription = useCallback((description, alignment) => {
    if (!description) return null;

    const lines = description.split('\n').filter(line => line.trim() !== '');
    const align = CONTENT_ALIGNMENT[alignment] || CONTENT_ALIGNMENT.left;
    const fontSizeClass = getFontSizeClass('description');
    const textColorClass = getTextColorClass('description');

    return (
      <div className={`space-y-4 ${align.text} ${textColorClass}`}>
        {(() => {
          const renderedLines = [];
          let badgeGroup = [];

          lines.forEach((line, index) => {
            const trimmedLine = line.trim();
            const lowerLine = trimmedLine.toLowerCase();

            // Check for key-value pairs (contains colon)
            if (trimmedLine.includes(':')) {
              // Flush any gathered badges
              if (badgeGroup.length > 0) {
                renderedLines.push(
                  <div key={`badges-${index}`} className={`flex flex-wrap gap-3 ${align.justify}`}>
                    {badgeGroup}
                  </div>
                );
                badgeGroup = [];
              }

              const [label, ...valueParts] = trimmedLine.split(':');
              const value = valueParts.join(':').trim();
              renderedLines.push(
                <div key={`kv-${index}`} className={`flex items-center gap-3 ${fontSizeClass} ${align.justify}`}>
                  <span className="text-cyan-400 font-bold tracking-wide">{label.trim()}:</span>
                  <span className="opacity-90 font-light">{value}</span>
                </div>
              );
              return;
            }

            // Check for special keywords (badges)
            const badgeType = lowerLine.includes('internship') ? 'internship'
              : lowerLine.includes('placement') ? 'placement'
                : lowerLine.includes('job') ? 'job'
                  : null;

            if (badgeType) {
              const badgeSizeClass = getFontSizeClass('badge');
              const currentHero = heroes[currentHeroIndex];
              // Support user defined custom style or fallback to old presets
              const customBadgeStyle = currentHero?.badgeStyle;
              const styleClasses = customBadgeStyle ? customBadgeStyle : `bg-gradient-to-r ${BADGE_STYLES[badgeType]}`;

              badgeGroup.push(
                <span key={`badge-${index}`} className={`
                  ${styleClasses} 
                  backdrop-blur-md rounded-full font-medium 
                  inline-flex items-center gap-2 
                  shadow-lg hover:scale-105 
                  transition-all duration-300 cursor-default
                  ${badgeSizeClass}
                `}>
                  <span className="text-lg" aria-hidden="true">
                    {BADGE_ICONS[badgeType]}
                  </span>
                  <span className="tracking-wide">{trimmedLine}</span>
                </span>
              );
              return;
            }

            // Flush any gathered badges before non-badge lines
            if (badgeGroup.length > 0) {
              renderedLines.push(
                <div key={`badges-${index}`} className={`flex flex-wrap gap-3 mt-4 mb-4 ${align.justify}`}>
                  {badgeGroup}
                </div>
              );
              badgeGroup = [];
            }

            // Check for bullet points
            if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
              renderedLines.push(
                <div key={`bullet-${index}`} className={`flex items-start gap-3 ${fontSizeClass} font-light ${align.justify}`}>
                  <span className="text-cyan-400 mt-1 flex-shrink-0" aria-hidden="true">◆</span>
                  <span className="opacity-90">{trimmedLine.substring(1).trim()}</span>
                </div>
              );
              return;
            }

            // Regular paragraph
            renderedLines.push(
              <p key={`p-${index}`} className={`
                font-light opacity-80 leading-relaxed
                ${fontSizeClass}
                ${alignment === 'center' ? 'mx-auto max-w-3xl' : ''}
              `}>
                {trimmedLine}
              </p>
            );
          });

          // Flush any remaining badges at the end
          if (badgeGroup.length > 0) {
            renderedLines.push(
              <div key="badges-end" className={`flex flex-wrap gap-3 mt-4 mb-4 ${align.justify}`}>
                {badgeGroup}
              </div>
            );
          }

          return renderedLines;
        })()}
      </div>
    );
  }, [heroes, currentHeroIndex]);

  // Loading state
  if (loading) {
    return (
      <div className={`${HEIGHT_CLASSES.large} bg-gradient-to-br from-[#0c0c16] to-[#1a1a2e] flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-400 animate-pulse">Loading hero section...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || heroes.length === 0) {
    return (
      <div className={`${HEIGHT_CLASSES.medium} bg-gradient-to-br from-red-900/20 to-red-800/10 flex items-center justify-center px-4`}>
        <div className="text-center">
          <p className="text-red-400 text-lg mb-2">{error || "No hero section found"}</p>
          <button
            onClick={fetchHeroes}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentHero = heroes[currentHeroIndex];
  const hasMultipleHeroes = heroes.length > 1;
  const hasMultipleImages = currentHero.images?.length > 1;

  // Get current image
  const currentImage = currentHero.images?.[currentSlide] || {
    url: currentHero.backgroundImage,
    alt: currentHero.title || 'Hero background'
  };

  // Check image error
  const isImageError = imageLoadError[currentImage.url];

  // Background style
  const backgroundStyle = {
    backgroundImage: !isImageError && currentHero.backgroundType === 'image' && currentImage.url
      ? `url(${currentImage.url})`
      : 'none',
    backgroundColor: currentHero.backgroundColor || '#0c0c16',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <section
      className={`relative ${HEIGHT_CLASSES[currentHero.height]} w-full  overflow-hidden ${className}`}
      style={backgroundStyle}
      aria-label="Hero section"
    >
      {/* Skip to content link */}
      <a
        href="#hero-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-cyan-500 text-white px-4 py-2 rounded z-50"
      >
        Skip to content
      </a>

      {/* Slider Background */}
      {currentHero.backgroundType === 'slider' && currentHero.images?.length > 0 && (
        <div className="absolute inset-0">
          {currentHero.images.map((image, idx) => (
            <div
              key={`${image.url}-${idx}`}
              className={`absolute inset-0 transition-opacity duration-1000 
                ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              style={{
                backgroundImage: `url(${image.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              role="img"
              aria-label={image.alt || `Slide ${idx + 1}`}
              onError={() => handleImageError(image.url)}
            />
          ))}

          {/* Slider Controls */}
          {hasMultipleImages && currentHero.sliderSettings?.arrows && (
            <>
              <button
                onClick={() => handleSlideChange('prev')}
                className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 
                  bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 
                  rounded-full transition-all z-20
                  hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                aria-label="Previous slide"
              >
                <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={() => handleSlideChange('next')}
                className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 
                  bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 
                  rounded-full transition-all z-20
                  hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                aria-label="Next slide"
              >
                <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6" />
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
            aria-label="Background video"
          />
        </div>
      )}

      {/* Overlay */}
      {(currentHero.backgroundType === 'image' ||
        currentHero.backgroundType === 'slider' ||
        currentHero.backgroundType === 'video') && (
          <div
            className="absolute inset-0 bg-black"
            style={{
              opacity: currentHero.overlayOpacity ?? CONFIG.OVERLAY_DEFAULT_OPACITY
            }}
            aria-hidden="true"
          ></div>
        )}

      {/* Content */}
      <div
        id="hero-content"
        className={`relative h-full flex ${ALIGNMENT_CLASSES[currentHero.alignment]} 
          justify-center px-4 sm:px-6 lg:px-8`}
        style={{ color: currentHero.textColor }}
      >
        <div className={`
          max-w-5xl w-full py-8 sm:py-12 lg:py-16
          ${ANIMATION_CLASSES[currentHero.animationType]} 
          relative z-20
        `}>
          {/* Subtitle */}
          {currentHero.subtitle && (
            <div className={`
              flex mb-4 sm:mb-6 
              ${CONTENT_ALIGNMENT[currentHero.alignment].justify}
            `}>
              <span className={`
                rounded-full  
                bg-cyan-500/10 backdrop-blur-md 
                uppercase tracking-[0.2em] font-medium 
                shadow-[0_0_15px_rgba(6,182,212,0.15)]
                ${getFontSizeClass('subtitle')}
                ${getTextColorClass('subtitle')}
              `}>
                {currentHero.subtitle}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className={`
            font-extrabold mb-4 sm:mb-6 lg:mb-8 
            leading-[1.1] tracking-tight
            ${getFontSizeClass('title')}
            ${getTextColorClass('title')}
          `}>
            {currentHero.title}
          </h1>

          {/* Description */}
          {currentHero.description && (
            <div className="mb-6 sm:mb-8 lg:mb-10">
              {renderDescription(currentHero.description, currentHero.alignment)}
            </div>
          )}

          {/* Buttons */}
          {currentHero.showButtons && (
            <div className={`
              flex flex-wrap gap-3 sm:gap-4 lg:gap-5 mt-4 sm:mt-6 lg:mt-8
              ${CONTENT_ALIGNMENT[currentHero.alignment].justify}
            `}>
              {currentHero.primaryButtonText && currentHero.primaryButtonLink && (
                <Link
                  to={currentHero.primaryButtonLink}
                  className="
                    group relative px-6 sm:px-8 py-2.5 sm:py-3.5 
                    bg-gradient-to-r from-cyan-500 to-blue-600 
                    hover:from-cyan-400 hover:to-blue-500 
                    text-white rounded-full font-semibold 
                    transition-all duration-300 
                    transform hover:-translate-y-1 
                    shadow-[0_0_20px_rgba(6,182,212,0.4)] 
                    hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] 
                    overflow-hidden text-sm sm:text-base
                  "
                  aria-label={currentHero.primaryButtonText}
                >
                  <div className="
                    absolute inset-0 bg-white/20 
                    translate-y-full group-hover:translate-y-0 
                    transition-transform duration-300 ease-out 
                    rounded-full
                  " />
                  <span className="relative z-10">
                    {currentHero.primaryButtonText}
                  </span>
                </Link>
              )}

              {currentHero.secondaryButtonText && currentHero.secondaryButtonLink && (
                <Link
                  to={currentHero.secondaryButtonLink}
                  className="
                    group px-6 sm:px-8 py-2.5 sm:py-3.5 
                    bg-white/5 backdrop-blur-md 
                    hover:bg-white/10 text-white 
                    rounded-full font-semibold 
                    transition-all duration-300 
                    transform hover:-translate-y-1 
                    border border-white/20 hover:border-white/40 
                    shadow-lg text-sm sm:text-base
                  "
                  aria-label={currentHero.secondaryButtonText}
                >
                  {currentHero.secondaryButtonText}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Multiple Heroes Navigation */}
      {hasMultipleHeroes && (
        <div className="
          absolute bottom-4 left-1/2 transform -translate-x-1/2 
          flex gap-2 z-30
        ">
          {heroes.map((hero, idx) => (
            <button
              key={hero._id || idx}
              onClick={() => handleHeroChange(idx)}
              className={`
                transition-all duration-300 rounded-full
                focus:outline-none focus:ring-2 focus:ring-cyan-500
                ${idx === currentHeroIndex
                  ? 'w-6 sm:w-8 bg-cyan-400 h-2 sm:h-2.5'
                  : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/50 hover:bg-white/80'
                }
              `}
              aria-label={`Go to hero section ${idx + 1}`}
              aria-current={idx === currentHeroIndex ? 'true' : 'false'}
            />
          ))}
        </div>
      )}

      {/* Slider Dots */}
      {currentHero.backgroundType === 'slider' &&
        currentHero.sliderSettings?.dots &&
        currentHero.images?.length > 1 && (
          <div className="
            absolute bottom-4 left-1/2 transform -translate-x-1/2 
            flex gap-2 z-30
          ">
            {currentHero.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`
                  transition-all duration-300 rounded-full
                  focus:outline-none focus:ring-2 focus:ring-cyan-500
                  ${idx === currentSlide
                    ? 'w-6 sm:w-8 bg-cyan-400 h-2 sm:h-2.5'
                    : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/50 hover:bg-white/80'
                  }
                `}
                aria-label={`Go to slide ${idx + 1}`}
                aria-current={idx === currentSlide ? 'true' : 'false'}
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
            className="
              absolute bottom-4 right-4 
              bg-black/50 hover:bg-black/70 
              text-white p-2 sm:p-3 
              rounded-full transition-all z-30
              hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-500
            "
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? (
              <PauseIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <PlayIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        )}

      {/* Progress bar */}
      {currentHero.backgroundType === 'slider' &&
        currentHero.sliderSettings?.autoplay &&
        currentHero.images?.length > 1 && isPlaying && (
          <div className="absolute bottom-0 left-0 h-1 bg-cyan-500/30 z-30">
            <div
              className="h-full bg-cyan-400 transition-all duration-300"
              style={{
                width: `${((currentSlide + 1) / currentHero.images.length) * 100}%`
              }}
            />
          </div>
        )}
    </section>
  );
}