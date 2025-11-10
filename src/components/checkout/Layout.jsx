// src/components/checkout/Layout.jsx
import React from 'react';
import NavbarGlobal from './NavbarGlobal';

const Layout = ({ children, withNavbarPadding = true, navbarSolid = false }) => {
  return (
    <div className="layout-wrapper">
      <NavbarGlobal solid={navbarSolid} />
      <main
        className="main-content"
        style={withNavbarPadding ? { paddingTop: '58px' } : {}}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;