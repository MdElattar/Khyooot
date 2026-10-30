import React from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import ScrollArrow from './components/ScrollArrow'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.css';
import Cart from './pages/Cart'
import ScrollToTop from './pages/ScrollToTop'
import PrivacyPolicy from './pages/PrivacyPolicy'
import FAQ from './pages/FAQ'

const Layout = () => (
  <div className="app-layout">
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const App = () => {
  return (
    <>
      {/* Toast Container فاجر ومحطوط في النص فوق مع أنيميشن فخم */}
      <ToastContainer
        position="top-center"
        autoClose={2000}
        limit={1} 
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
        toastClassName="custom-luxury-toast"
        style={{ zIndex: 99999, top: '20px' }}
      />

      <ScrollArrow />
      <ScrollToTop />

      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/about" element={<About />} />
          <Route path="/contactus" element={<Contact />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} /> 
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;