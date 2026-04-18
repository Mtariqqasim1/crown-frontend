import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { allProducts } from '../products';

const DELIVERY_CHARGE = 299;

export function getCart()   { try { return JSON.parse(localStorage.getItem('cart')) || []; } catch { return []; } }
export function saveCart(c) { localStorage.setItem('cart', JSON.stringify(c)); }

export default function Layout({ children }) {
  const navigate = useNavigate();

  const [cart,             setCart]             = useState(getCart);
  const [cartOpen,         setCartOpen]         = useState(false);
  const [menuOpen,         setMenuOpen]         = useState(false);
  const [catOpen,          setCatOpen]          = useState(false);
  const [search,           setSearch]           = useState('');
  const [suggestions,      setSuggestions]      = useState([]);
  const [showSug,          setShowSug]          = useState(false);
  const [scrollShow,       setScrollShow]       = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const mobileInputRef = useRef(null);

  useEffect(() => { saveCart(cart); }, [cart]);

  useEffect(() => {
    const fn = () => setScrollShow(window.scrollY > 300);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    window.__addToCart = (name, price, image) => {
      // price always store as plain number
      const numPrice = Number(price) || 0;
      setCart(prev => {
        const ex = prev.find(i => i.name === name);
        if (ex) return prev.map(i => i.name === name ? {...i, qty: i.qty + 1} : i);
        return [...prev, { name, price: numPrice, image, qty: 1 }];
      });
      setCartOpen(true);
    };
  }, []);

  useEffect(() => {
    if (mobileSearchOpen && mobileInputRef.current) mobileInputRef.current.focus();
  }, [mobileSearchOpen]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartSubtotal = cart.reduce((s, i) => {
    const p = Number(i.price) || 0;
    return s + p * i.qty;
  }, 0);
  const cartTotal = cartSubtotal + (cart.length > 0 ? DELIVERY_CHARGE : 0);

  function removeFromCart(idx) { setCart(prev => prev.filter((_, i) => i !== idx)); }
  function updateQty(idx, ch) {
    setCart(prev => prev.map((item, i) => i === idx ? {...item, qty: item.qty + ch} : item).filter(i => i.qty > 0));
  }

  function handleSearch(val) {
    setSearch(val);
    if (val.length > 0) {
      const f = Object.entries(allProducts).filter(([, p]) =>
        p.name.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(f);
      setShowSug(true);
    } else {
      setShowSug(false);
    }
  }

  function handleSearchSubmit(e) {
    if (e.key === 'Enter' && suggestions.length > 0) {
      const [firstId] = suggestions[0];
      setShowSug(false); setMobileSearchOpen(false);
      navigate(`/product?id=${firstId}`);
    }
  }

  function handleSuggestionClick(id) {
    setShowSug(false); setSearch(''); setMobileSearchOpen(false);
    navigate(`/product?id=${id}`);
  }

  function handleSearchIconClick() {
    if (search.trim().length > 0 && suggestions.length > 0) {
      const [firstId] = suggestions[0];
      setShowSug(false); setMobileSearchOpen(false);
      navigate(`/product?id=${firstId}`);
    }
  }

  return (
    <>
      {/* ── DESKTOP HEADER ── */}
      <header className="header flex desktop" style={{width:'100%',padding:'0 30px',boxSizing:'border-box',justifyContent:'space-between'}}>
        <div className="logo">
          <a href="/"><img src="images/crown logo2.png" alt="Crown Logo"/></a>
        </div>
        <div className="search-bar">
          <div className="search-inner" style={{position:'relative'}}>
            <input type="search" id="search-input" placeholder="Search for products..."
              value={search} onChange={e => handleSearch(e.target.value)}
              onKeyDown={handleSearchSubmit} onBlur={() => setTimeout(() => setShowSug(false), 200)}/>
            <i className="fas fa-search" style={{cursor:'pointer'}} onClick={handleSearchIconClick}></i>
            {showSug && suggestions.length > 0 && (
              <div id="suggestions-box" style={{display:'block'}}>
                {suggestions.map(([id, p]) => (
                  <div key={id} className="suggestion-item" onMouseDown={() => handleSuggestionClick(id)}>{p.name}</div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="icons">
          <div className="icon-p open-cart" onClick={() => setCartOpen(true)} style={{cursor:'pointer'}}>
            <i className="fas fa-shopping-cart fa-lg"></i>
            <div className="counter cart-counter">{cartCount}</div>
          </div>
        </div>
      </header>

      {/* ── MOBILE HEADER ── */}
      <header className="header flex tablet container">
        <div onClick={() => setMenuOpen(true)} style={{fontSize:24,cursor:'pointer'}}>&#9776;</div>
        <div className="logo"><a href="/"><img src="images/crown logo2.png" alt="Logo"/></a></div>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{fontSize:20,cursor:'pointer',color:'var(--primary)'}} onClick={() => setMobileSearchOpen(prev => !prev)}>
            <i className="fas fa-search"></i>
          </div>
          <div className="icon-p open-cart" onClick={() => setCartOpen(true)} style={{cursor:'pointer'}}>
            <i className="fas fa-shopping-cart fa-lg"></i>
            <div className="counter cart-counter">{cartCount}</div>
          </div>
        </div>
      </header>

      {/* ── MOBILE SEARCH BAR ── */}
      {mobileSearchOpen && (
        <div style={{background:'#fff',padding:'10px 16px',borderBottom:'1px solid #eee',position:'sticky',top:0,zIndex:9990,boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}}>
          <div style={{position:'relative',display:'flex',alignItems:'center',gap:8}}>
            <input ref={mobileInputRef} type="search" placeholder="Search for products..."
              value={search} onChange={e => handleSearch(e.target.value)}
              onKeyDown={handleSearchSubmit} onBlur={() => setTimeout(() => setShowSug(false), 200)}
              style={{flex:1,padding:'10px 14px',fontSize:15,border:'1.5px solid #ddd',borderRadius:8,outline:'none'}}/>
            <button onClick={handleSearchIconClick}
              style={{background:'var(--primary)',color:'#fff',border:'none',borderRadius:8,padding:'10px 16px',cursor:'pointer',fontSize:16}}>
              <i className="fas fa-search"></i>
            </button>
          </div>
          {showSug && suggestions.length > 0 && (
            <div style={{background:'#fff',border:'1px solid #eee',borderRadius:8,marginTop:4,boxShadow:'0 4px 12px rgba(0,0,0,0.1)',zIndex:9999}}>
              {suggestions.map(([id, p]) => (
                <div key={id} onMouseDown={() => handleSuggestionClick(id)}
                  style={{padding:'10px 14px',cursor:'pointer',fontSize:14,borderBottom:'1px solid #f0f0f0'}}>{p.name}</div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── MOBILE SIDEBAR ── */}
      <div className={`mobile-sidebar-menu ${menuOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <img src="images/crown logo2.png" alt="Crown Logo"/>
          <span id="close-menu" onClick={() => setMenuOpen(false)}>&times;</span>
        </div>
        <div className="sidebar-body">
          <ul className="nav-list">
            <li className="nav-item"><a href="/" className="nav-link" onClick={() => setMenuOpen(false)}><i className="fas fa-home"></i> Home</a></li>
            <li className="nav-item"><a href="/#products" className="nav-link" onClick={() => setMenuOpen(false)}><i className="fas fa-shopping-bag"></i> Shop All Products</a></li>
            <li className="nav-item accordion-item">
              <div className="accordion-header nav-link" onClick={() => setCatOpen(!catOpen)}>
                <span><i className="fas fa-layer-group"></i> Top Categories</span>
                <i className={`fas fa-chevron-right arrow-icon${catOpen ? ' fa-rotate-90' : ''}`}></i>
              </div>
              <ul className={`submenu${catOpen ? ' open' : ''}`}>
                <li><a href="/tricycle"  onClick={() => setMenuOpen(false)}><i className="fas fa-caret-right"></i> Tricycles</a></li>
                <li><a href="/rideon"    onClick={() => setMenuOpen(false)}><i className="fas fa-caret-right"></i> Ride On Toys</a></li>
                <li><a href="/slider"    onClick={() => setMenuOpen(false)}><i className="fas fa-caret-right"></i> Sliders &amp; Climbers</a></li>
                <li><a href="/furniture" onClick={() => setMenuOpen(false)}><i className="fas fa-caret-right"></i> Kids Furniture</a></li>
              </ul>
            </li>
            <li className="nav-item"><a href="/#fotter" className="nav-link" onClick={() => setMenuOpen(false)}><i className="fas fa-phone-alt"></i> Contact Us</a></li>
          </ul>
        </div>
        <div className="sidebar-footer-dev">
          <p>Powered by <span>MintQode Solutions</span></p>
          <div className="dev-socials">
            <a href="https://www.instagram.com/mintqodesolutions" target="_blank" rel="noreferrer"><i className="fab fa-instagram"></i></a>
            <a href="https://wa.me/923001234567" target="_blank" rel="noreferrer"><i className="fab fa-whatsapp"></i></a>
          </div>
        </div>
      </div>
      {menuOpen && <div className="menu-overlay active" onClick={() => setMenuOpen(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:9998}}/>}

      {/* ── CART SIDEBAR ── */}
      <div id="cart-sidebar" className={`cart-sidebar${cartOpen ? ' open' : ''}`}>
        <div className="cart-header">
          <h3>Your Cart</h3>
          <span onClick={() => setCartOpen(false)} style={{cursor:'pointer',fontSize:24}}>&times;</span>
        </div>
        <div id="cart-items" className="cart-items">
          {cart.length === 0
            ? <p style={{textAlign:'center',padding:30,color:'#999'}}>Your cart is empty</p>
            : cart.map((item, idx) => {
                const price = Number(item.price) || 0;
                return (
                  <div className="cart-item" key={idx}>
                    <img src={item.image} alt={item.name}/>
                    <div style={{flex:1}}>
                      <h4 style={{fontSize:14,marginBottom:5}}>{item.name}</h4>
                      <p style={{fontSize:12,color:'#666'}}>Rs {price.toLocaleString()} x {item.qty}</p>
                      <div style={{display:'flex',alignItems:'center',gap:10,marginTop:5}}>
                        <button onClick={() => updateQty(idx, -1)} style={{padding:'2px 8px',border:'1px solid #ddd',background:'#fff',cursor:'pointer'}}>-</button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateQty(idx, +1)} style={{padding:'2px 8px',border:'1px solid #ddd',background:'#fff',cursor:'pointer'}}>+</button>
                      </div>
                    </div>
                    <span onClick={() => removeFromCart(idx)} style={{color:'red',cursor:'pointer',fontSize:20}}>&times;</span>
                  </div>
                );
              })
          }
        </div>
        <div className="cart-footer">
          {cart.length > 0 && (
            <div style={{fontSize:13,color:'#666',marginBottom:6,display:'flex',justifyContent:'space-between'}}>
              <span>Subtotal:</span>
              <span>Rs {cartSubtotal.toLocaleString()}</span>
            </div>
          )}
          {cart.length > 0 && (
            <div style={{fontSize:13,color:'#666',marginBottom:8,display:'flex',justifyContent:'space-between'}}>
              <span>Delivery:</span>
              <span>Rs {DELIVERY_CHARGE.toLocaleString()}</span>
            </div>
          )}
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:12,paddingTop:8,borderTop:'1px solid #eee'}}>
            <strong>Total:</strong>
            <strong id="cart-total">Rs {cartTotal.toLocaleString()}</strong>
          </div>
          <button
            onClick={() => { setCartOpen(false); navigate('/checkout'); }}
            style={{background:'var(--primary)',color:'white',border:'none',width:'100%',padding:12,borderRadius:8,fontWeight:700,fontSize:16,cursor:'pointer'}}
          >
            <i className="fas fa-paper-plane"></i> Confirm Order
          </button>
        </div>
      </div>

      {/* ── PAGE CONTENT ── */}
      {children}

      {/* ── FOOTER ── */}
      <footer>
        <div id="fotter" className="footer">
          <div className="footer-container">
            <div className="footer-col">
              <h3>Crown Baby Cycle Store</h3>
              <p>House of toys - Premium quality kids toys in Pakistan. We make Ride-on Cars, Swing Cars, Push Cars, Slides, Desks &amp; Storage Cabinets.</p>
            </div>
            <div className="footer-col">
              <h3>Contact Information</h3>
              <p>📞 +92300-3237707</p>
              <p>📧 info@crownbabycycle.com</p>
              <div className="social-icons" style={{marginTop:15}}>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="https://wa.me/923003237707"><i className="fab fa-whatsapp"></i></a>
              </div>
            </div>
            <div className="footer-col">
              <h3>Policies</h3>
              <a href="/terms">Terms &amp; Conditions</a>
              <a href="/privacy">Privacy Policy</a>
            </div>
          </div>
          <div className="powered-by-dev">
            <p>Powered By <span>MintQode Solutions</span></p>
            <div className="dev-icons">
              <a href="https://www.instagram.com/mintqodesolutions" target="_blank" rel="noreferrer"><i className="fab fa-instagram"></i></a>
              <a href="https://wa.me/923253209977" target="_blank" rel="noreferrer"><i className="fab fa-whatsapp"></i></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom"><p>Copyright © 2025 Crown Baby Cycle Store.</p></div>
      </footer>

      {/* ── FLOATING BUTTONS ── */}
      <div className="floating-container">
        <button className={`float-btn top-btn${scrollShow ? ' show' : ''}`}
          onClick={() => window.scrollTo({top:0,behavior:'smooth'})}>
          <i className="fas fa-arrow-up"></i>
        </button>
        <a href="https://wa.me/923003237707" className="float-btn wa-btn" target="_blank" rel="noreferrer">
          <i className="fab fa-whatsapp"></i>
        </a>
      </div>
    </>
  );
}