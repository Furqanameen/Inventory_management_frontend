// src/components/ScrollToTop.jsx
import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    // 1) scroll the window (in case something else scrolled it)
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }

    // 2) html & body tags
    if (document.documentElement) {
      document.documentElement.scrollTo(0, 0);
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }

    // 3) Mantine AppShell body section
    //    (it uses className "mantine-AppShell-body")
    const shellBody = document.querySelector('.mantine-AppShell-main');
    if (shellBody && typeof shellBody.scrollTo === 'function') {
      console.log('Scroll to top triggered');

      shellBody.scrollTo(0, 0);
    } else {
      console.log('Scroll to top not triggered');
    }
  }, [pathname]);

  return null;
}

// import { useEffect, useState } from 'react';
// import { IconChevronUp } from '@tabler/icons-react';
// import { useLocation } from 'react-router-dom';
// import { ActionIcon } from '@mantine/core';

// const ScrollToTop = () => {
//   const [visible, setVisible] = useState(false);
//   const { pathname } = useLocation();
//   const threshold = 300; // You can adjust this threshold as needed

//   // Function to toggle button visibility based on scroll position
//   const toggleVisible = () => {
//     if (window.scrollY > threshold) {
//       setVisible(true);
//     } else {
//       setVisible(false);
//     }
//   };

//   // Smooth scroll to the top of the page
//   const scrollToTop = () => {
//     window.scrollTo({
//       top: 0,
//       behavior: 'smooth',
//     });
//   };

//   useEffect(() => {
//     // Add scroll event listener to track scroll position
//     window.addEventListener('scroll', toggleVisible);

//     // Cleanup the event listener on component unmount
//     return () => {
//       window.removeEventListener('scroll', toggleVisible);
//     };
//   }, [pathname]);

//   return (
//     <div
//       style={{
//         position: 'fixed',
//         bottom: '20px',
//         right: '20px',
//         display: visible ? 'block' : 'none',
//         zIndex: 1000,
//       }}
//     >
//       <ActionIcon
//         size="lg"
//         onClick={scrollToTop}
//         color="blue" // You may adjust the color or use a theme-provided color
//         title="Scroll to top"
//       >
//         <IconChevronUp size={24} />
//       </ActionIcon>
//     </div>
//   );
// };

// export default ScrollToTop;
