import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { getProductBySlug } from '../services/api';

export default function ProductPage() {
  const [params]  = useSearchParams();
  const id        = params.get('id');

  const [product,  setProduct]  = useState(null);
  const [mainImg,  setMainImg]  = useState('');
  const [qty,      setQty]      = useState(1);
  const [added,    setAdded]    = useState(false);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) { setNotFound(true); setLoading(false); return; }
      try {
        const res = await getProductBySlug(id);
        if (res.success && res.data) {
          setProduct(res.data);
          setMainImg(res.data.image);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  function handleAddToCart() {
    if (window.__addToCart) {
      for (let i = 0; i < qty; i++) window.__addToCart(product.name, product.price, mainImg);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  }

  // ── Loading ──
  if (loading) return (
    <Layout>
      <div style={{textAlign:'center',padding:80}}>
        <div style={{fontSize:40,marginBottom:16}}>⏳</div>
        <p style={{color:'#888'}}>Loading product...</p>
      </div>
    </Layout>
  );

  // ── Not Found ──
  if (notFound || !product) return (
    <Layout>
      <div style={{textAlign:'center',padding:80}}>
        <h2>Product Not Found</h2>
        <a href="/" style={{color:'var(--primary)',fontWeight:600}}>← Go Back</a>
      </div>
    </Layout>
  );

  // variants — API se JSON string aata hai, parse karo
  const variants = product.variants
    ? (typeof product.variants === 'string' ? JSON.parse(product.variants) : product.variants)
    : [];

  return (
    <Layout>
      <div className="product-detail-container">

        {/* ── IMAGE SIDE ── */}
        <div className="pd-image">
          <img src={mainImg} id="main-product-img" alt={product.name}
            onError={e => e.target.style.opacity = 0.2}/>

          {/* Color Variants */}
          {variants.length > 0 && (
            <div className="variants-wrapper">
              <h4 className="variants-label">Select Color:</h4>
              <div className="variant-list">
                {variants.map((v, i) => (
                  <button key={i}
                    className={`variant-btn${mainImg === v.img ? ' active' : ''}`}
                    onClick={() => setMainImg(v.img)}
                    title={v.label || `Color ${i + 1}`}
                  >
                    <img src={v.img} alt={v.label || `variant-${i}`}
                      onError={e => e.target.style.opacity = 0.2}/>
                    {v.label && <span className="variant-label">{v.label}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── INFO SIDE ── */}
        <div className="pd-info">
          <h1 className="pd-title">{product.name}</h1>
          <div className="pd-price">Rs {Number(product.price).toLocaleString()}</div>
          <p className="pd-desc">{product.description}</p>

          <div className="qty-box">
            <label><strong>Quantity:</strong></label>
            <input type="number" value={qty} min="1"
              onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}/>
          </div>

          <button className="btn-large" onClick={handleAddToCart}
            style={added ? {background:'#16a34a'} : {}}>
            {added ? '✓ Added to Cart!' : <><i className="fas fa-shopping-cart"></i> Add to Cart</>}
          </button>
        </div>

      </div>

      <style>{`
        .product-detail-container { display:flex; flex-wrap:wrap; gap:40px; padding:40px 20px; background:#fff; max-width:1000px; margin:30px auto; border-radius:10px; box-shadow:0 5px 20px rgba(0,0,0,0.06); }
        .pd-image { flex:1; min-width:300px; text-align:center; }
        .pd-image > img { width:100%; max-height:400px; object-fit:contain; border-radius:10px; border:1px solid #eee; }
        .pd-info { flex:1; min-width:280px; display:flex; flex-direction:column; justify-content:center; }
        .pd-title { font-size:2rem; color:var(--primary); margin-bottom:10px; }
        .pd-price { font-size:1.5rem; color:#e63946; font-weight:bold; margin-bottom:20px; }
        .pd-desc { font-size:1rem; color:#555; line-height:1.6; margin-bottom:30px; }
        .qty-box { display:flex; align-items:center; gap:10px; margin-bottom:20px; }
        .qty-box input { width:60px; padding:10px; font-size:18px; text-align:center; border:1px solid #ccc; border-radius:5px; }
        .btn-large { padding:15px 30px; font-size:18px; background:var(--primary); color:white; border:none; border-radius:5px; cursor:pointer; transition:0.3s; }
        .btn-large:hover { background:var(--accent); color:var(--primary); }
        .variants-wrapper { margin-top:18px; text-align:left; }
        .variants-label { font-size:14px; font-weight:600; color:#444; margin-bottom:10px; text-transform:uppercase; letter-spacing:0.5px; }
        .variant-list { display:flex; flex-wrap:wrap; gap:10px; }
        .variant-btn { display:flex; flex-direction:column; align-items:center; gap:5px; background:#fff; border:2px solid #ddd; border-radius:10px; padding:5px; cursor:pointer; transition:all 0.2s ease; width:72px; }
        .variant-btn img { width:58px; height:58px; object-fit:cover; border-radius:7px; display:block; }
        .variant-btn .variant-label { font-size:11px; color:#555; text-align:center; line-height:1.2; font-weight:500; }
        .variant-btn:hover { border-color:var(--primary); transform:translateY(-2px); box-shadow:0 4px 10px rgba(0,0,0,0.1); }
        .variant-btn.active { border-color:var(--primary); background:#f0f4ff; box-shadow:0 0 0 3px rgba(0,43,91,0.15); }
        @media(max-width:768px){ .product-detail-container{flex-direction:column;} .pd-title{font-size:1.5rem;} .variant-btn{width:64px;} .variant-btn img{width:52px;height:52px;} }
      `}</style>
    </Layout>
  );
}
