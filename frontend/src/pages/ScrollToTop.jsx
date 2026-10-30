import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const scrollPositions = {};

export default function ScrollManager() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    // Save scroll position before leaving page
    return () => {
      scrollPositions[location.pathname] = window.scrollY;
    };
  }, [location.pathname]);

  useEffect(() => {
    // Same page → do nothing
    if (prevPath.current === location.pathname) return;

    // Back / Forward → restore scroll
    if (navigationType === "POP") {
      window.scrollTo({
        top: scrollPositions[location.pathname] || 0,
        behavior: "instant",
      });
    } else {
      // New navigation → smooth scroll to top
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }

    prevPath.current = location.pathname;
  }, [location.pathname, navigationType]);

  return null;
}
