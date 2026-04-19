import { useEffect } from 'react';
import Layout from './components/Layout';
import { allProducts } from './products';
import './index.css';

const rideOnProducts = [
  { id:'dolphin-car',  ...allProducts['dolphin-car'] },
  { id:'sky-jet',      ...allProducts['sky-jet'] },
  { id:'mini-cooper',  ...allProducts['mini-cooper'] },
  { id:'mini-junior',  ...allProducts['mini-junior'] },
  { id:'range-rider',  ...allProducts['range-rider'] },
  { id:'mini-racer',   ...allProducts['mini-racer'] },
];

const babyProducts = [
  { id:'cosmos-cot',     ...allProducts['cosmos-cot'] },
  { id:'jumbo-cot',      ...allProducts['jumbo-cot'] },
  { id:'musical-walker', ...allProducts['musical-walker'] },
  { id:'Baby-Walker',    ...allProducts['Baby-Walker'] },
  { id:'potty-chair',    ...allProducts['potty-chair'] },
  { id:'car-potty',      ...allProducts['car-potty'] },
];

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
      <a href={`/product?id=${id}`} style={{display:'block',color:'inherit',textDecoration:'none'}}>
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
        <img src="images/Crown Banner.png" alt="Main Banner" style={{width:'100%'}}/>
      </div>

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

      <section className="products container reveal" id="products">
        <h2>CHILDREN'S RIDE-ON-TOYS</h2>
        <div className="products-inner">
          {rideOnProducts.map(p => <ProductCard key={p.id} {...p}/>)}
        </div>
      </section>

      <section className="products container reveal">
        <h2>BABY CARE ESSENTIALS</h2>
        <div className="products-inner">
          {babyProducts.map(p => <ProductCard key={p.id} {...p}/>)}
        </div>
      </section>

      <TurboBikeSection />
    </Layout>
  );
}
