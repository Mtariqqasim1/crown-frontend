import { useEffect, useState } from 'react';
import Layout from './components/Layout';
import { getProducts } from './services/api';
import './index.css';

// ── Marquee items (static — sirf images hain) ─────────────────────────────────
const marqueeItems = [
  { id:'dolphin-car',  img:'images/dolphin.jpg',                      label:'Dolphin Ride' },
  { id:'sky-jet',      img:'images/jet2.jpg',                         label:'Sky Jet Auto Car' },
  { id:'mini-cooper',  img:'images/mini copper.jpg',                  label:'Mini Cooper' },
  { id:'micky-cycle',  img:'images/micky red without background.png', label:'Micky Tricycle' },
  { id:'cosmos-cot',   img:'images/carry cot.jpeg',                   label:'Cosmos Carry Cot' },
  { id:'potty-chair',  img:'images/3in 1 potty.jpeg',                 label:'3in1 Potty' },
];

// ── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({ slug, name, price, image }) {
  function handleAdd(e) {
    e.preventDefault();
    if (window.__addToCart) window.__addToCart(name, price, image);
  }
  return (
    <div className="product">
      <a href={`/product?id=${slug}`} style={{display:'block',color:'inherit',textDecoration:'none'}}>
        <div className="p-images">
          <img src={image} alt={name} onError={e=>e.target.style.opacity=0.2}/>
        </div>
        <div className="p-content">
          <div className="p-title">{name}</div>
        </div>
      </a>
      <div className="p-content" style={{paddingTop:0}}>
        <div className="p-price">Rs {Number(price).toLocaleString()}</div>
        <button className="add-to-cart" onClick={handleAdd}>Add to Cart</button>
      </div>
    </div>
  );
}

// ── Turbo Bike Featured Section ───────────────────────────────────────────────
function TurboBikeSection() {
  function handleAdd() {
    if (window.__addToCart) window.__addToCart('Turbo Ride-On Bike', 4350, 'images/imagezayan.png');
  }
  return (
    <div className="single-product-box reveal">
      <div className="single-product-image">
        <img src="images/imagezayan.png" id="featured-main-img" alt="Turbo Ride-On Bike"/>
      </div>
      <div className="single-product-details">
        <h2 className="product-title">Turbo Ride-On Bike</h2>
        <p className="product-description">
          Let your child explore joy and adventure! This colorful ride-on bike improves balance,
          coordination, and fun time — perfect for indoor &amp; outdoor use.
        </p>
        <div className="bike-options-container" style={{marginBottom:20}}>
          <p style={{fontSize:14,fontWeight:600,color:'#555',marginBottom:8}}>Select View:</p>
          <div className="bike-thumbnails" style={{display:'flex',gap:12}}>
            <img src="images/imagezayan.png" className="b-thumb active" alt="View 1"
              onClick={e=>{
                document.getElementById('featured-main-img').src='images/imagezayan.png';
                document.querySelectorAll('.b-thumb').forEach(t=>t.classList.remove('active'));
                e.target.classList.add('active');
              }}/>
            <img src="images/bike.png" className="b-thumb" alt="View 2"
              onClick={e=>{
                document.getElementById('featured-main-img').src='images/bike.png';
                document.querySelectorAll('.b-thumb').forEach(t=>t.classList.remove('active'));
                e.target.classList.add('active');
              }}/>
          </div>
        </div>
        <p className="product-price">Price: <span>Rs. 4,350</span></p>
        <button className="add-to-cart" onClick={handleAdd}>
          Add to Cart&nbsp;
          <svg width="18px" height="16px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor">
            <path d="M160 112c0-35.3 28.7-64 64-64s64 28.7 64 64v48H160V112zm-48 48H48c-26.5 0-48 21.5-48 48V416c0 53 43 96 96 96H352c53 0 96-43 96-96V208c0-26.5-21.5-48-48-48H336V112C336 50.1 285.9 0 224 0S112 50.1 112 112v48zm24 48a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm152 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ── Skeleton Loader ───────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="product" style={{opacity:0.5}}>
      <div style={{background:'#eee',height:180,borderRadius:8,marginBottom:10}}/>
      <div style={{background:'#eee',height:16,borderRadius:4,marginBottom:8,width:'80%'}}/>
      <div style={{background:'#eee',height:14,borderRadius:4,width:'50%'}}/>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [rideOnProducts, setRideOnProducts] = useState([]);
  const [babyProducts,   setBabyProducts]   = useState([]);
  const [loading,        setLoading]        = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const [rideonRes, babyRes] = await Promise.all([
          getProducts('rideon'),
          getProducts('baby'),
        ]);

        if (rideonRes.success) {
          // Sirf 6 products — same as before
          setRideOnProducts(rideonRes.data.slice(0, 6));
        }
        if (babyRes.success) {
          setBabyProducts(babyRes.data);
        }
      } catch (err) {
        console.error('API error:', err);
      } finally {
        setLoading(false); 
      }
    }
    fetchProducts();
  }, []);

  // Scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [loading]);

  return (
    <Layout>

      {/* ── MAIN BANNER ── */}
      <div className="slider">
        <img src="images/Crown Banner.png" alt="Main Banner" style={{width:'100%'}}/>
      </div>

      {/* ── CIRCULAR MARQUEE ── */}
      <section className="quick-picks">
        <div className="marquee-wrapper" id="marquee-container">
          <div className="marquee-content" id="marquee-content">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <a href={`/product?id=${item.id}`} className="circle-item" key={i}>
                <div className="circle-img"><img src={item.img} alt={item.label}/></div>
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── COLLECTIONS ── */}
      <section className="collections container reveal">
        <div className="Heading-cat"><h1>Explore Categories</h1></div>
        <div className="collections-inner">
          <div className="collection">
            <img src="images/Ride-Ontoys.jpg" alt="Ride on Toys"/>
            <div className="content"><button onClick={()=>window.location.href='/rideon'}>Ride On Toys</button></div>
          </div>
          <div className="collection">
            <img src="images/Sliders-Climbers.jpg" alt="Sliders"/>
            <div className="content"><button onClick={()=>window.location.href='/slider'}>Slides &amp; Climbers</button></div>
          </div>
          <div className="collection">
            <img src="images/Furniture.jpg" alt="Furniture"/>
            <div className="content"><button onClick={()=>window.location.href='/furniture'}>Furniture</button></div>
          </div>
        </div>
      </section>

      {/* ── RIDE ON TOYS ── */}
      <section className="products container reveal" id="products">
        <h2>CHILDREN'S RIDE-ON-TOYS</h2>
        <div className="products-inner">
          {loading
            ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i}/>)
            : rideOnProducts.map(p => (
                <ProductCard key={p.id} slug={p.slug} name={p.name} price={p.price} image={p.image}/>
              ))
          }
        </div>
      </section>

      {/* ── BABY ESSENTIALS ── */}
      <section className="products container reveal">
        <h2>BABY CARE ESSENTIALS</h2>
        <div className="products-inner">
          {loading
            ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i}/>)
            : babyProducts.map(p => (
                <ProductCard key={p.id} slug={p.slug} name={p.name} price={p.price} image={p.image}/>
              ))
          }
        </div>
      </section>

      {/* ── TURBO BIKE FEATURED ── */}
      <TurboBikeSection />

    </Layout>
  );
}
