/**
 * Custom Layout component
 */

import React from 'react';
import { Layout as RaLayout, LayoutProps } from 'react-admin';
import { AppBar } from './AppBar';
import { Menu } from './Menu';

/**
 * Custom Layout with branded AppBar and Menu
 */
export const Layout: React.FC<LayoutProps> = (props) => {
  return <RaLayout {...props} appBar={AppBar} menu={Menu} />;
};
