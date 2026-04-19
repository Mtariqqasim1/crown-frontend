import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getProducts } from '../services/api';

function ProductCard({ slug, name, price, image }) {
  function handleAdd(e) {
    e.preventDefault();
    if (window.__addToCart) window.__addToCart(name, price, image);
  }
  return (
    <div className="product">
      <div className="p-images">
        <a href={`/product?id=${slug}`}>
          <img src={image} alt={name} onError={e=>e.target.style.opacity=0.2}/>
        </a>
      </div>
      <div className="p-content">
        <div className="p-title">{name}</div>
        <div className="p-price">Rs {Number(price).toLocaleString()}</div>
        <button className="add-to-cart" onClick={handleAdd}>Add to Cart</button>
        <a href={`/product?id=${slug}`} style={{display:'block',marginTop:6,fontSize:12,color:'#888',textAlign:'center'}}>
          View Details
        </a>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="product" style={{opacity:0.5}}>
      <div style={{background:'#eee',height:180,borderRadius:8,marginBottom:10}}/>
      <div style={{background:'#eee',height:16,borderRadius:4,marginBottom:8,width:'80%'}}/>
      <div style={{background:'#eee',height:14,borderRadius:4,width:'50%'}}/>
    </div>
  );
}

export default function CategoryPage({ category, title }) {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await getProducts(category);
        if (res.success) setProducts(res.data);
      } catch (err) {
        console.error('API error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [category]);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [loading]);

  return (
    <Layout>
      <section className="container" style={{marginTop:30,textAlign:'center'}}>
        <h1 style={{color:'var(--primary)',textTransform:'uppercase'}}>{title}</h1>
        <p>Best collection of {title}.</p>
      </section>

      <section className="products container reveal" style={{marginBottom:40}}>
        <div className="products-inner">
          {loading
            ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i}/>)
            : products.length === 0
              ? <p style={{textAlign:'center',padding:40,color:'#999',gridColumn:'1/-1'}}>No products found.</p>
              : products.map(p => (
                  <ProductCard key={p.id} slug={p.slug} name={p.name} price={p.price} image={p.image}/>
                ))
          }
        </div>
      </section>
    </Layout>
  );
}
