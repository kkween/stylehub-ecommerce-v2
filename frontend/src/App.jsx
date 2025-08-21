import { useState, useEffect } from 'react';
import ChangePassword from "./ChangePassword";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;
import './App.css';

// Header Component
const Header = ({ user, setUser, cartItemCount }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <header className="bg-white shadow-xl sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-gray-900 hover:text-indigo-600 transition-colors">
              StyleHub
            </Link>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h10M6 19a1 1 0 100 2 1 1 0 000-2zm10 0a1 1 0 100 2 1 1 0 000-2z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <Link 
              to="/shop" 
              className="bg-orange-500 hover:bg-orange-600 text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Shop Now
            </Link>
            {user ? (
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Link to="/profile" className="hidden sm:block text-gray-600 hover:text-gray-800 px-3 py-2 text-sm font-medium transition-colors">
                  Profile
                </Link>
                {user.role === 'admin' && (
                  <Link to="/dashboard" className="hidden md:block text-gray-600 hover:text-gray-800 px-3 py-2 text-sm font-medium transition-colors">
                    Dashboard
                  </Link>
                )}
                <button 
                  onClick={handleLogout} 
                  className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <span className="hidden sm:inline">Logout</span>
                  <svg className="w-4 h-4 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <Link 
                to="/auth" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <span className="hidden sm:inline">Sign In</span>
                <svg className="w-4 h-4 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// Transparent Navbar Component
const TransparentNavbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          // Scrolling down
          setIsVisible(false);
        } else {
          // Scrolling up
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

  return (
    <nav className={`bg-transparent backdrop-blur-sm sticky top-16 z-40 transition-transform duration-300 ${
      isVisible ? 'transform translate-y-0' : 'transform -translate-y-full'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-12 sm:h-14">
          <div className="flex flex-wrap justify-center space-x-4 sm:space-x-8">
            <Link to="/" className="text-gray-700 hover:text-indigo-600 px-2 sm:px-4 py-2 text-sm font-medium transition-colors">
              Home
            </Link>
            <Link to="/shop" className="text-gray-700 hover:text-indigo-600 px-2 sm:px-4 py-2 text-sm font-medium transition-colors">
              Shop
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-indigo-600 px-2 sm:px-4 py-2 text-sm font-medium transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-indigo-600 px-2 sm:px-4 py-2 text-sm font-medium transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Sidebar Component
const Sidebar = ({ isOpen, setIsOpen }) => (
  <>
    {/* Mobile sidebar overlay */}
    {isOpen && (
      <div className="fixed inset-0 bg-gray-200 bg-opacity-50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />
    )}
    
    {/* Sidebar */}
    <aside className={`fixed left-0 z-50 w-64 h-[100vh] bg-white shadow-lg transform ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } lg:translate-x-0 transition-transform duration-300 ease-in-out border-r border-gray-200 lg:static lg:z-auto`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Quick Links</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <nav className="space-y-2">
          {[
            { name: 'Home', icon: '🏠', to: '/' },
            { name: 'Shop', icon: '🛍️', to: '/shop' },
            { name: 'Men', icon: '👔', to: '/shop?category=men' },
            { name: 'Women', icon: '👗', to: '/shop?category=women' },
            { name: 'Kids', icon: '👶', to: '/shop?category=kids' },
            { name: 'Accessories', icon: '👜', to: '/shop?category=accessories' },
            { name: 'About Us', icon: 'ℹ️', to: '/about' },
            { name: 'Contact', icon: '📞', to: '/contact' },
            { name: 'Cart', icon: '🛒', to: '/cart' }
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center space-x-3 w-full p-3 text-left text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors group"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
        
        <div className="mt-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Special Offers</h3>
          <p className="text-sm text-gray-600 mb-3">Get 20% off on your first order!</p>
          <Link to="/shop" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            Shop Now →
          </Link>
        </div>
      </div>
    </aside>
  </>
);

// Hero Carousel Component
const HeroCarousel = ({ setSidebarOpen }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
          image: '/hero6.jpg',
          title: 'Winter Collection 2025',
          subtitle: 'Embrace the Season in Style',
          description: 'Discover our premium winter collection featuring the latest trends and timeless classics.',
          buttonText: 'Shop Winter Collection',
          buttonLink: '/shop?category=winter'
    },
        {
          image: '/hero1.jpg',
      title: 'New Arrivals',
      subtitle: 'Fresh Fashion Forward',
      description: 'Check out our newest arrivals that blend comfort with contemporary design.',
      buttonText: 'Explore New Arrivals',
      buttonLink: '/shop'
    },
    {
      image: '/hero3.jpg',
      title: 'Special Offers',
      subtitle: 'Up to 50% Off',
      description: 'Limited time deals on selected items. Upgrade your wardrobe for less.',
      buttonText: 'Shop Deals',
      buttonLink: '/shop?sale=true'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
  <section className="relative w-full h-[480px] sm:h-[540px] lg:h-[600px] overflow-hidden">
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="absolute top-4 left-4 z-30 bg-white bg-opacity-80 text-gray-800 p-2 sm:p-3 rounded-lg hover:bg-opacity-90 transition-all lg:hidden shadow-lg"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image} 
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          
          {/* Content removed: no button in hero section */}
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 text-gray-800 p-2 sm:p-3 rounded-full hover:bg-opacity-90 transition-all z-20 shadow-lg"
      >
        <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 text-gray-800 p-2 sm:p-3 rounded-full hover:bg-opacity-90 transition-all z-20 shadow-lg"
      >
        <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

// Shop Component
const Shop = ({ addToCart, sidebarOpen, setSidebarOpen }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Mock more products to match the number of images
    const productImages = [
      '/assets/restaurant-blk-family.jpg',
      '/assets/tennis-blk-wm2.jpg',
      '/assets/tennis-blk-wm3.jpg',
      '/assets/tennis-blk-wm5.jpg',
      '/assets/tennis-blk-wm6.jpg',
      '/assets/tennise-blk-wm.jpg',
      '/assets/library-blkwm1.jpg',
      '/assets/library-blkwm2.jpg',
      '/assets/library-blkwm3.webp',
      '/assets/library-blkwm4.webp',
      '/assets/library-blkwm5.jpg',
      '/assets/library.png',
      '/assets/product2-1.jpg',
      '/assets/product2-2.jpg',
      '/assets/product2-3.jpg',
      '/assets/product2-4.jpg',
      '/assets/product2-5.jpg',
      '/assets/product2-6.jpg',
      '/assets/product2-7.jpg',
      '/assets/product2-8.jpg',
      '/assets/product2-9.jpg',
      '/assets/product2-10.jpg',
      '/assets/product2-11.jpg',
      '/assets/product2-12.jpg',
    ];
    const mockProducts = productImages.map((img, idx) => ({
      _id: `mock-${idx+1}`,
      name: `Product ${idx+1}`,
      description: `Description for product ${idx+1}`,
      price: 19.99 + idx,
      category: 'Mock',
    }));
    setProducts(mockProducts);
    setLoading(false);
    setError(null);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 m-6">
        <div className="flex items-center">
          <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden bg-gray-50 min-h-screen">
      <main className="w-full p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Our Collection</h1>
            <p className="text-sm sm:text-base text-gray-600">Discover our premium clothing selection</p>
          </div>
        </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-stretch">
          {(() => {
            const productImages = [
              '/assets/restaurant-blk-family.jpg',
              '/assets/tennis-blk-wm2.jpg',
              '/assets/tennis-blk-wm3.jpg',
              '/assets/tennis-blk-wm5.jpg',
              '/assets/tennis-blk-wm6.jpg',
              '/assets/tennise-blk-wm.jpg',
              '/assets/library-blkwm1.jpg',
              '/assets/library-blkwm2.jpg',
              '/assets/library-blkwm3.webp',
              '/assets/library-blkwm4.webp',
              '/assets/library-blkwm5.jpg',
              '/assets/library.png',
              '/assets/product2-1.jpg',
              '/assets/product2-2.jpg',
              '/assets/product2-3.jpg',
              '/assets/product2-4.jpg',
              '/assets/product2-5.jpg',
              '/assets/product2-6.jpg',
              '/assets/product2-7.jpg',
              '/assets/product2-8.jpg',
              '/assets/product2-9.jpg',
              '/assets/product2-10.jpg',
              '/assets/product2-11.jpg',
              '/assets/product2-12.jpg',
            ];
            return products
              .map((product, idx) => ({ product, idx }))
              .filter(({ idx }) => productImages[idx % productImages.length].startsWith('/assets/'))
              .map(({ product, idx }) => (
                <div key={product._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group h-fit">
                  <div className="bg-gray-200 overflow-hidden relative">
                    <img 
                      src={productImages[idx % productImages.length]}
                      alt={product.name} 
                      loading="lazy"
                      className="w-full h-32 sm:h-40 lg:h-48 xl:h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                      <span className="bg-indigo-600 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium">
                        {product.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-2 sm:p-3">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-gray-600 text-xs mb-2 line-clamp-1">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm sm:text-lg font-bold text-indigo-600">${product.price.toFixed(2)}</span>
                      <button 
                        onClick={() => addToCart(product)} 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs font-medium transition-colors flex items-center space-x-1 group"
                      >
                        <svg className="w-3 h-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h10" />
                        </svg>
                        <span className="hidden lg:inline">Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ));
          })()}
        </div>

        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2m-6 0H8m8 0v5a2 2 0 01-2 2H8a2 2 0 01-2-2v-5" />
            </svg>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-sm sm:text-base text-gray-600">Check back soon for new arrivals!</p>
          </div>
        )}
      </main>
    </div>
  );
};

// Cart Component with Professional Checkout
const Cart = ({ cart, setCart, user }) => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('credit-card');
  const [billingInfo, setBillingInfo] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = total > 100 ? 0 : 9.99;
  const tax = total * 0.08;
  const finalTotal = total + shipping + tax;
  
  const updateQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(index);
                            {[...Array(6)].map((_, i) => (
                              <div key={`extra-static-card-${i}`} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group h-fit">
                                <div className="bg-gray-200 overflow-hidden relative">
                                  <img 
                                    src={`https://picsum.photos/400/400?random=extra${i+1}`}
                                    alt={`Extra Static ${i+1}`}
                                    className="w-full h-32 sm:h-40 lg:h-48 xl:h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                                <div className="p-2 sm:p-3">
                                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1 line-clamp-1">Extra Card {i+1}</h3>
                                  <p className="text-gray-600 text-xs mb-2 line-clamp-1">This is an extra static card.</p>
                                </div>
                              </div>
                            ))}
      return;
    }
    const updatedCart = [...cart];
    updatedCart[index].quantity = newQuantity;
    setCart(updatedCart);
  };

  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  };

  const handleCheckout = async () => {
    if (!user) {
      alert('Please sign in to checkout');
      return;
    }
    
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(async () => {
      try {
        const order = { 
          customer: user.name,
          customerEmail: billingInfo.email,
          items: cart.map(item => ({
            productId: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          })),
          subtotal: total,
          shipping: shipping,
          tax: tax,
          total: finalTotal,
          paymentMethod: selectedPayment,
          billingAddress: billingInfo,
          date: new Date().toISOString().split('T')[0],
          deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };

  const response = await axios.post(`${apiUrl}/api/orders`, order, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        
        setCart([]);
        setCheckoutSuccess(true);
        setIsProcessing(false);
        
        // Reset form
        setTimeout(() => {
          setShowCheckout(false);
          setCheckoutSuccess(false);
        }, 3000);
        
      } catch (err) {
        console.error('Error saving order:', err);
        alert('Error during checkout. Please try again.');
        setIsProcessing(false);
      }
    }, 2000);
  };

  const paymentMethods = [
  { id: 'credit-card', name: 'Credit Card', icon: '💳' },
  { id: 'paypal', name: 'PayPal', icon: '🅿️' },
  { id: 'apple-pay', name: 'Apple Pay', icon: '🍎' },
  { id: 'google-pay', name: 'Google Pay', icon: '🔴' },
  { id: 'venmo', name: 'Venmo', icon: '💸' },
  { id: 'crypto', name: 'Cryptocurrency', icon: '₿' },
  { id: 'cod', name: 'Cash on Delivery', icon: '💵' }
  ];

  if (checkoutSuccess) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-900 mb-2">Order Placed Successfully! 🎉</h2>
          <p className="text-green-700 mb-6">Thank you for your purchase. You'll receive a confirmation email shortly.</p>
          <Link to="/shop" className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex items-center mb-6 sm:mb-8">
        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h10" />
        </svg>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
        {cart.length > 0 && (
          <span className="ml-3 bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm font-medium">
            {cart.reduce((sum, item) => sum + item.quantity, 0)} items
          </span>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-12 sm:py-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
          <svg className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h10" />
          </svg>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6 sm:mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/shop" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-medium transition-colors inline-flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Continue Shopping
          </Link>
        </div>
      ) : !showCheckout ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <img 
                    src={`https://picsum.photos/150/150?random=${item._id}`}
                    alt={item.name} 
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg mx-auto sm:mx-0"
                  />
                  
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                    <p className="text-lg font-bold text-indigo-600 mt-1">${item.price}</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button 
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        className="p-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-l-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="px-4 py-2 font-medium min-w-[3rem] text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        className="p-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-r-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(index)}
                      className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                      title="Remove item"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {shipping === 0 && (
                  <div className="text-sm text-green-600 font-medium">
                    ✓ Free shipping on orders over $100
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setShowCheckout(true)} 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg text-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Proceed to Checkout</span>
              </button>
              
              <div className="mt-4 text-center">
                <Link to="/shop" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Professional Checkout Form */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email"
                    value={billingInfo.email}
                    onChange={(e) => setBillingInfo({...billingInfo, email: e.target.value})}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="your@email.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input 
                      type="text"
                      value={billingInfo.firstName}
                      onChange={(e) => setBillingInfo({...billingInfo, firstName: e.target.value})}
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input 
                      type="text"
                      value={billingInfo.lastName}
                      onChange={(e) => setBillingInfo({...billingInfo, lastName: e.target.value})}
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input 
                    type="text"
                    value={billingInfo.address}
                    onChange={(e) => setBillingInfo({...billingInfo, address: e.target.value})}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="123 Main Street"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input 
                      type="text"
                      value={billingInfo.city}
                      onChange={(e) => setBillingInfo({...billingInfo, city: e.target.value})}
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input 
                      type="text"
                      value={billingInfo.state}
                      onChange={(e) => setBillingInfo({...billingInfo, state: e.target.value})}
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                    <input 
                      type="text"
                      value={billingInfo.zipCode}
                      onChange={(e) => setBillingInfo({...billingInfo, zipCode: e.target.value})}
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input 
                      type="tel"
                      value={billingInfo.phone}
                      onChange={(e) => setBillingInfo({...billingInfo, phone: e.target.value})}
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      selectedPayment === method.id 
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="text-2xl mb-1">{method.icon}</div>
                    <div className="text-xs font-medium">{method.name}</div>
                  </button>
                ))}
              </div>

              {selectedPayment === 'credit-card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <input 
                      type="text"
                      value={paymentInfo.cardNumber}
                      onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                      <input 
                        type="text"
                        value={paymentInfo.expiryDate}
                        onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input 
                        type="text"
                        value={paymentInfo.cvv}
                        onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="123"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                    <input 
                      type="text"
                      value={paymentInfo.cardName}
                      onChange={(e) => setPaymentInfo({...paymentInfo, cardName: e.target.value})}
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              {selectedPayment !== 'credit-card' && (
                selectedPayment === 'cod' ? (
                  <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                    <div className="text-4xl mb-2">💵</div>
                    <p className="text-gray-700">You have selected <b>Cash on Delivery</b>. Please prepare the exact amount to pay when your order arrives.</p>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                    <div className="text-4xl mb-2">{paymentMethods.find(m => m.id === selectedPayment)?.icon}</div>
                    <p className="text-gray-700">You'll be redirected to {paymentMethods.find(m => m.id === selectedPayment)?.name} to complete your payment.</p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Order Review */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Review</h3>
              <div className="space-y-3">
                {cart.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 py-2">
                    <img 
                      src={`https://picsum.photos/60/60?random=${item._id}`}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                      <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Total</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg text-lg font-medium disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>Complete Order</span>
                    </>
                  )}
                </button>
                
                <button 
                  onClick={() => setShowCheckout(false)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 py-3 px-4 rounded-lg transition-colors font-medium"
                >
                  ← Back to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Profile Component  
const Profile = ({ user, orders }) => (
  <div className="max-w-4xl mx-auto p-6 lg:p-8">
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white mb-8">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
          <p className="text-indigo-100">{user?.email}</p>
          {user?.role === 'admin' && (
            <span className="inline-block bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold mt-2">
              Administrator
            </span>
          )}
        </div>
      </div>
    </div>

    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Order History
      </h2>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-600 mb-6">Start shopping to see your order history here!</p>
          <Link to="/shop" className="bg-gradient-to-r from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Order #{order._id.slice(-8)}</h3>
                  <p className="text-sm text-gray-600">Placed on {order.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-indigo-600">${order.total?.toFixed(2)}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p><strong>Expected Delivery:</strong> {order.deliveryDate}</p>
                </div>
                <div>
                  <p><strong>Items:</strong> {order.items?.length || 'N/A'} item(s)</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    <ChangePassword />
  </div>
);

// Admin Dashboard Component
const AdminDashboard = ({ orders, customers }) => (
  <div className="max-w-7xl mx-auto p-6 lg:p-8">
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
      <p className="text-gray-600">Manage your store, customers, and orders</p>
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100">Total Orders</p>
            <p className="text-3xl font-bold">{orders.length}</p>
          </div>
          <svg className="w-10 h-10 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100">Total Customers</p>
            <p className="text-3xl font-bold">{customers.length}</p>
          </div>
          <svg className="w-10 h-10 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100">Revenue</p>
            <p className="text-3xl font-bold">
              ${orders.reduce((sum, order) => sum + (order.total || 0), 0).toFixed(2)}
            </p>
          </div>
          <svg className="w-10 h-10 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-600">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900">Order #{order._id.slice(-8)}</p>
                    <p className="text-sm text-gray-600">Customer: {order.customer}</p>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">${order.total?.toFixed(2)}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Customer List */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Customers</h2>
        {customers.length === 0 ? (
          <p className="text-gray-600">No customers yet.</p>
        ) : (
          <div className="space-y-4">
            {customers.map((customer) => (
              <div key={customer._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold">{customer.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-600">{customer.email}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      customer.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {customer.role?.charAt(0).toUpperCase() + customer.role?.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

// Auth Component (Combined Sign In/Sign Up)
const Auth = ({ setUser }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/signin';
  const response = await axios.post(`${apiUrl}${endpoint}`, {
        email,
        password,
        name: isSignUp ? name : undefined,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setUser({ 
          name: response.data.name, 
          email: response.data.email,
          role: response.data.role 
        });
        navigate('/profile');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </h2>
          <p className="text-gray-600">
            {isSignUp ? 'Join us and start shopping' : 'Welcome back! Please sign in to continue'}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-xl sm:px-10">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isSignUp}
                  className="w-full bg-amber-50 px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-2 text-sm bg-indigo-200 text-indigo-700 hover:bg-indigo-300 hover:text-indigo-900 rounded px-2 py-1 focus:outline-none"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-indigo-700 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="w-full text-center text-white bg-indigo-700 hover:bg-indigo-800 font-medium rounded-lg py-3 transition-colors"
              >
                {isSignUp ? 'Sign in instead' : 'Create new account'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Footer Component
const Footer = () => (
  <footer className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 text-gray-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-2xl font-bold mb-4 text-indigo-600">StyleHub</h3>
          <p className="text-gray-600 mb-6 max-w-md">
            Your premier destination for fashion-forward clothing. We bring you the latest trends 
            with uncompromising quality and style.
          </p>
          <div className="flex space-x-4">
            {[
              { icon: 'M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z', name: 'Twitter' },
              { icon: 'M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z', name: 'Facebook' },
              { icon: 'M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.219-5.175 1.219-5.175s-.311-.623-.311-1.544c0-1.447.839-2.529 1.884-2.529.888 0 1.319.665 1.319 1.463 0 .891-.568 2.225-.861 3.462-.245 1.041.522 1.887 1.551 1.887 1.863 0 3.298-1.965 3.298-4.805 0-2.516-1.809-4.276-4.384-4.276-2.986 0-4.739 2.24-4.739 4.558 0 .902.347 1.873.78 2.398a.309.309 0 01.071.295c-.078.324-.25 1.011-.284 1.152-.043.181-.141.219-.326.132-1.221-.569-1.985-2.358-1.985-3.79 0-3.094 2.253-5.943 6.492-5.943 3.41 0 6.063 2.431 6.063 5.681 0 3.388-2.137 6.115-5.105 6.115-.997 0-1.936-.52-2.256-1.139l-.614 2.34c-.222.857-.823 1.934-1.226 2.593C9.145 23.738 10.557 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z', name: 'Instagram' }
            ].map((social, index) => (
              <a key={index} href="#" className="text-gray-500 hover:text-gray-700 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d={social.icon} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {[
              { name: 'Shop', to: '/shop' },
              { name: 'About Us', to: '/about' },
              { name: 'Contact', to: '/contact' },
              { name: 'Size Guide', to: '#' },
              { name: 'Returns', to: '#' }
            ].map((link) => (
              <li key={link.name}>
                <Link to={link.to} className="text-gray-600 hover:text-gray-800 transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
          <ul className="space-y-2">
            {[
              { name: 'FAQ', to: '#' },
              { name: 'Shipping Info', to: '#' },
              { name: 'Track Order', to: '#' },
              { name: 'Privacy Policy', to: '#' },
              { name: 'Terms of Service', to: '#' }
            ].map((link) => (
              <li key={link.name}>
                <Link to={link.to} className="text-gray-600 hover:text-gray-800 transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-purple-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-600 text-sm">
          &copy; 2025 StyleHub. All rights reserved.
        </p>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <span className="text-gray-600 text-sm">Secure payments with</span>
          <div className="flex space-x-2">
            {['Visa', 'Mastercard', 'PayPal'].map((payment) => (
              <div key={payment} className="bg-white rounded px-2 py-1 shadow-sm">
                <span className="text-gray-800 text-xs font-medium">{payment}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </footer>
);

// Main App Component
const App = () => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
  axios.get(`${apiUrl}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => setUser({ 
          name: response.data.name, 
          email: response.data.email,
          role: response.data.role 
        }))
        .catch((err) => {
          console.error('Error fetching user:', err);
          localStorage.removeItem('token');
        });
    }
  }, []);

  useEffect(() => {
    if (user) {
      // Fetch orders
  axios.get(`${apiUrl}/api/orders`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
        .then((response) => setOrders(response.data))
        .catch((err) => console.error('Error fetching orders:', err));

      // Fetch customers if admin
      if (user.role === 'admin') {
  axios.get(`${apiUrl}/api/users`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
          .then((response) => setCustomers(response.data))
          .catch((err) => console.error('Error fetching customers:', err));
      }
    }
  }, [user]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existingItem = prev.find(item => item._id === product._id);
      if (existingItem) {
        return prev.map(item => 
          item._id === product._id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  return (
    <Router>
      <div className="w-full min-h-screen bg-gray-50 flex flex-col">
        <Header user={user} setUser={setUser} cartItemCount={cartItemCount} />
        <TransparentNavbar />
        <main className="flex-grow w-full">
          <div className="max-w-[1440px] mx-auto w-full px-4">
            <Routes>
            <Route
              path="/"
              element={
                <div className="flex w-full overflow-hidden">
                  <div className="flex w-full min-h-[calc(100vh-4rem)]">{/* 4rem = header + navbar height */}
                    <div className="flex flex-col h-full">
                      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
                    </div>
                    <div className="flex-1 lg:ml-0 flex flex-col">
                      <HeroCarousel setSidebarOpen={setSidebarOpen} />
                      <Shop addToCart={addToCart} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                    </div>
                  </div>
                </div>
              }
            />
            <Route 
              path="/shop" 
              element={
                <div className="flex w-full overflow-hidden">
                  <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
                  <div className="flex-1 lg:ml-0">
                    <Shop addToCart={addToCart} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                  </div>
                </div>
              } 
            />
            <Route path="/cart" element={
              <div className="flex w-full overflow-hidden">
                <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
                <div className="flex-1 lg:ml-0">
                  <Cart cart={cart} setCart={setCart} user={user} />
                </div>
              </div>
            } />
            <Route path="/profile" element={
              <div className="flex w-full overflow-hidden">
                <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
                <div className="flex-1 lg:ml-0">
                  {user ? <Profile user={user} orders={orders} /> : <Auth setUser={setUser} />}
                </div>
              </div>
            } />
            <Route path="/auth" element={
              <div className="flex w-full overflow-hidden">
                <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
                <div className="flex-1 lg:ml-0">
                  <Auth setUser={setUser} />
                </div>
              </div>
            } />
            <Route path="/about" element={
              <div className="flex w-full overflow-hidden">
                <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
                <div className="flex-1 lg:ml-0">
                  <div className="max-w-4xl mx-auto p-6 lg:p-8">
                    <div className="bg-white rounded-xl shadow-md p-8">
                      <h1 className="text-4xl font-bold text-gray-900 mb-6">About StyleHub</h1>
                      <div className="prose prose-lg text-gray-600">
                        <p className="text-xl leading-relaxed mb-6">
                          Welcome to StyleHub, where fashion meets innovation. Since our founding, we've been dedicated 
                          to bringing you the latest trends and timeless classics in clothing and accessories.
                        </p>
                        <p className="mb-6">
                          Our journey began with a simple vision: to make high-quality, fashionable clothing accessible 
                          to everyone. Today, we're proud to serve customers worldwide with our carefully curated 
                          collection of premium apparel.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Mission</h3>
                            <p>To inspire confidence through exceptional fashion while maintaining sustainable practices.</p>
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Vision</h3>
                            <p>To be the world's most trusted and innovative fashion destination.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            } />
            <Route path="/contact" element={
              <div className="flex w-full overflow-hidden">
                <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
                <div className="flex-1 lg:ml-0">
                  <div className="max-w-4xl mx-auto p-6 lg:p-8">
                    <div className="bg-gray-50 rounded-xl shadow-md p-8">
                      <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-4">Get in Touch</h3>
                          <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span>support@stylehub.com</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <span>(555) 123-4567</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span>123 Fashion Street, Style City, SC 12345</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-4">Business Hours</h3>
                          <div className="space-y-2 text-gray-600">
                            <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
                            <p>Saturday: 10:00 AM - 6:00 PM</p>
                            <p>Sunday: 12:00 PM - 5:00 PM</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            } />
            <Route path="/dashboard" element={
              <div className="flex w-full overflow-hidden">
                <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
                <div className="flex-1 lg:ml-0">
                  {user?.role === 'admin' ? 
                    <AdminDashboard orders={orders} customers={customers} /> : 
                    <div className="max-w-2xl mx-auto p-8 text-center">
                      <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
                      <p className="text-gray-600">You need administrator privileges to access this page.</p>
                    </div>
                  }
                </div>
              </div>
            } />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
