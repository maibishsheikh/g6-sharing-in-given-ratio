// src/core/hooks/useViewport.js
import { useState, useEffect } from 'react';

export function useViewport() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [height, setHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 768);

  useEffect(() => {
    const onResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    window.addEventListener('resize', onResize);

    // Measure app header and set --header-h CSS custom property dynamically
    const headerEl = document.querySelector('.app-header');
    if (headerEl) {
      const updateHeaderH = () => {
        const rect = headerEl.getBoundingClientRect();
        if (rect.height > 0) {
          document.documentElement.style.setProperty('--header-h', `${Math.round(rect.height)}px`);
        }
      };

      updateHeaderH();

      if (window.ResizeObserver) {
        const ro = new ResizeObserver(updateHeaderH);
        ro.observe(headerEl);
        return () => {
          ro.disconnect();
          window.removeEventListener('resize', onResize);
        };
      }
    }

    return () => window.removeEventListener('resize', onResize);
  }, []);

  return {
    width,
    height,
    isMobile: width <= 480,
    isTablet: width <= 768,
  };
}

export default useViewport;
