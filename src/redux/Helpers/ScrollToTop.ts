import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = ({ children }: { children: any }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    setTimeout(() => {
      try {
        window.scroll({
          top: 0,
          behavior: 'smooth',
        });
      } catch (error) {
        window.scrollTo(0, 0);
      }
    }, 1000);
  }, [pathname]);

  return children;
};

export default ScrollToTop;
