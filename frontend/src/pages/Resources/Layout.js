import React from 'react';
import { Outlet } from 'react-router-dom';
import Large from '../../components/Container-lg';
import Modal from '../Modals/Modal';
import '../Resources/Layout.css';
import Sidebar from '../Sidebar';

const Layout = () => {
  return (
    <div>
      {/* Large container for the main content */}
      <Large>
        {/* Sidebar component */}
        <Sidebar />

        {/* Outlet to render nested child routes */}
        {/* The nested child routes will be rendered here based on the parent route */}
        <Outlet />
      </Large>

      {/* Modal component */}
      {/* The modal that can be triggered to show additional content */}
      <Modal />
    </div>
  );
};

export default Layout;
