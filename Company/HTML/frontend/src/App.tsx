import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Introduce from './components/introduce';
import ContactUs from './components/contact-us';
import Products from './components/products';
import MailOnline from './components/mail-online';
import Order from './components/order';
import StellarShop from './components/StellarShop';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<Introduce />} />
          <Route path="/products" element={<Products />} />
          <Route path="/shop" element={<StellarShop />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/inquiry" element={<MailOnline />} />
          <Route path="/order" element={<Order />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
