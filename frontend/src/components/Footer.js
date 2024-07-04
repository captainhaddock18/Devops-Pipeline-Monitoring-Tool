import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center py-4">
      <p className="text-sm">&copy; {new Date().getFullYear()} Tharakadatta D Hegde and Varshit Manikanta. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
