import React from 'react';
import Header from "../header/Header";
import Footer from "../footer/Footer";

const Layout = ({children}) => (
    <>
        <Header/>
        <main className="app-main">{children}</main>
        <Footer/>
    </>
);

export default Layout;
