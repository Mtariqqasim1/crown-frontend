import { useEffect } from 'react';
import Layout from '../components/Layout';
import { allProducts } from '../products';

function ProductCard({ id, name, price, image }) {
  function handleAdd(e) {
    e.preventDefault();
    if(window.__addToCart) window.__addToCart(name, price, image);
  }
  return (
    <div className="product">
      <div className="p-images">
        <a href={`/product?id=${id}`}>
          <img src={image} alt={name} onError={e=>e.target.style.opacity=0.2}/>
        </a>
      </div>
      <div className="p-content">
        <div className="p-title">{name}</div>
        <div className="p-price">Rs {Number(price).toLocaleString()}</div>
        <button className="add-to-cart" onClick={handleAdd}>Add to Cart</button>
        <a href={`/product?id=${id}`} style={{display:'block',marginTop:6,fontSize:12,color:'#888',textAlign:'center'}}>
          View Details
        </a>
      </div>
    </div>
  );
}

export default function CategoryPage({ category, title }) {
  const products = Object.entries(allProducts).filter(([,p]) => p.page === category);

  useEffect(() => {
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('active'); });
    },{threshold:0.1});
    document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
    return ()=>obs.disconnect();
  },[]);

  return (
    <Layout>
      <section className="container" style={{marginTop:30,textAlign:'center'}}>
        <h1 style={{color:'var(--primary)',textTransform:'uppercase'}}>{title}</h1>
        <p>Best collection of {title}.</p>
      </section>
      <section className="products container reveal" style={{marginBottom:40}}>
        <div className="products-inner">
          {products.length === 0
            ? <p style={{textAlign:'center',padding:40,color:'#999',gridColumn:'1/-1'}}>No products found.</p>
            : products.map(([id, p]) => <ProductCard key={id} id={id} name={p.name} price={p.price} image={p.image}/>)
          }
        </div>
      </section>
    </Layout>
  );
}
