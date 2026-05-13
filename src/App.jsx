import { useEffect } from 'react';
import Layout from './components/Layout';
import { allProducts } from './products';
import './index.css';

const rideOnKeys = ['dolphin-car','sky-jet','mini-cooper','mini-junior','range-rider','mini-racer'];
const babyKeys   = ['cosmos-cot','jumbo-cot','musical-walker','Baby-Walker','potty-chair','car-potty'];
const rideOnProducts = rideOnKeys.map(id => ({ id, ...allProducts[id] })).filter(p => p.name);
const babyProducts   = babyKeys.map(id => ({ id, ...allProducts[id] })).filter(p => p.name);

const marqueeItems = [
  { id:'dolphin-car',  img:'images/dolphin.jpg',                      label:'Dolphin Ride' },
  { id:'sky-jet',      img:'images/jet2.jpg',                         label:'Sky Jet Auto Car' },
  { id:'mini-cooper',  img:'images/mini copper.jpg',                  label:'Mini Cooper' },
  { id:'micky-cycle',  img:'images/micky red without background.png', label:'Micky Tricycle' },
  { id:'cosmos-cot',   img:'images/carry cot.jpeg',                   label:'Cosmos Carry Cot' },
  { id:'potty-chair',  img:'images/3in 1 potty.jpeg',                 label:'3in1 Potty' },
];

function ProductCard({ id, name, price, image }) {
  function handleAdd(e) {
    e.preventDefault();
    if (window.__addToCart) window.__addToCart(name, price, image);
  }
  return (
    <div className="product">
      <a href={`/product?id=${id}`} style={{ display:'block', color:'inherit', textDecoration:'none' }}>
        <div className="p-images">
          <img src={image} alt={name} onError={e => e.target.style.opacity = 0.2} />
        </div>
        <div className="p-content">
          <div className="p-title">{name}</div>
        </div>
      </a>
      <div className="p-content" style={{ paddingTop:0 }}>
        <div className="p-price">Rs {Number(price).toLocaleString()}</div>
        <button className="add-to-cart" onClick={handleAdd}>Add to Cart</button>
      </div>
    </div>
  );
}

function TurboBikeSection() {
  function handleAdd() {
    if (window.__addToCart) window.__addToCart('Turbo Ride-On Bike', 4350, 'images/imagezayan.png');
  }
  return (
    <div className="single-product-box reveal">
      <div className="single-product-image">
        <img src="images/imagezayan.png" id="featured-main-img" alt="Turbo Ride-On Bike" />
      </div>
      <div className="single-product-details">
        <h2 className="product-title">Turbo Ride-On Bike</h2>
        <p className="product-description">
          Let your child explore joy and adventure! This colorful ride-on bike improves balance,
          coordination, and fun time — perfect for indoor & outdoor use.
        </p>
        <div className="bike-options-container" style={{ marginBottom:20 }}>
          <p style={{ fontSize:14, fontWeight:600, color:'#555', marginBottom:8 }}>Select View:</p>
          <div className="bike-thumbnails" style={{ display:'flex', gap:12 }}>
            <img src="images/imagezayan.png" className="b-thumb active" alt="View 1"
              onClick={e => {
                document.getElementById('featured-main-img').src = 'images/imagezayan.png';
                document.querySelectorAll('.b-thumb').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
              }} />
            <img src="images/bike.png" className="b-thumb" alt="View 2"
              onClick={e => {
                document.getElementById('featured-main-img').src = 'images/bike.png';
                document.querySelectorAll('.b-thumb').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
              }} />
          </div>
        </div>
        <p className="product-price">Price: <span>Rs. 4,350</span></p>
        <button className="add-to-cart" onClick={handleAdd}>Add to Cart</button>
      </div>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <Layout>
      <div className="slider">
        <img src="images/Crown Banner.png" alt="Main Banner" style={{ width:'100%' }} />
      </div>

      <section className="quick-picks">
        <div className="marquee-wrapper" id="marquee-container">
          <div className="marquee-content" id="marquee-content">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <a href={`/product?id=${item.id}`} className="circle-item" key={i}>
                <div className="circle-img"><img src={item.img} alt={item.label} /></div>
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="collections container reveal">
        <div className="Heading-cat"><h1>Explore Categories</h1></div>
        <div className="collections-inner">
          <div className="collection">
            <img src="images/Ride-Ontoys.jpg" alt="Ride on Toys" />
            <div className="content"><button onClick={() => window.location.href='/rideon'}>Ride On Toys</button></div>
          </div>
          <div className="collection">
            <img src="images/Sliders-Climbers.jpg" alt="Sliders" />
            <div className="content"><button onClick={() => window.location.href='/slider'}>Slides & Climbers</button></div>
          </div>
          <div className="collection">
            <img src="images/Furniture.jpg" alt="Furniture" />
            <div className="content"><button onClick={() => window.location.href='/furniture'}>Furniture</button></div>
          </div>
        </div>
      </section>

      <section className="products container reveal" id="products">
        <h2>CHILDREN'S RIDE-ON-TOYS</h2>
        <div className="products-inner">
          {rideOnProducts.map(p => (
            <ProductCard key={p.id} id={p.id} name={p.name} price={p.price} image={p.image} />
          ))}
        </div>
      </section>

      <section className="products container reveal">
        <h2>BABY CARE ESSENTIALS</h2>
        <div className="products-inner">
          {babyProducts.map(p => (
            <ProductCard key={p.id} id={p.id} name={p.name} price={p.price} image={p.image} />
          ))}
        </div>
      </section>

      <TurboBikeSection />
    </Layout>
  );
}
