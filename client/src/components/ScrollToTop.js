import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    // Only scroll if pathname actually changed
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      
      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      });
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
