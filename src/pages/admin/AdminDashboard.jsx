import { useState, useEffect } from 'react';

const API = 'http://127.0.0.1:8000/api';

const STATUS_COLORS = {
  pending:   { bg:'#fff8e1', color:'#f57f17', label:'Pending' },
  confirmed: { bg:'#e3f2fd', color:'#1565c0', label:'Confirmed' },
  shipped:   { bg:'#f3e5f5', color:'#6a1b9a', label:'Shipped' },
  delivered: { bg:'#e8f5e9', color:'#2e7d32', label:'Delivered' },
  cancelled: { bg:'#ffebee', color:'#c62828', label:'Cancelled' },
};

const CATEGORIES = [
  { value:'rideon',    label:'Ride On Toys' },
  { value:'tricycle',  label:'Tricycles' },
  { value:'baby',      label:'Baby Essentials' },
  { value:'slider',    label:'Sliders & Climbers' },
  { value:'furniture', label:'Kids Furniture' },
];

// ── Reusable input style ──────────────────────────────────────
const inp = { width:'100%', padding:'10px 12px', border:'1.5px solid #ddd', borderRadius:8, fontSize:14, outline:'none', boxSizing:'border-box' };

// ══════════════════════════════════════════════════════════════
// ORDERS TAB
// ══════════════════════════════════════════════════════════════
function OrdersTab({ token }) {
  const [orders,        setOrders]        = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusLoading, setStatusLoading] = useState(null);
  const [filterStatus,  setFilterStatus]  = useState('all');

  useEffect(() => { fetchOrders(); }, []);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/orders`, { headers:{ Authorization:`Bearer ${token}`, Accept:'application/json' } });
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch {}
    setLoading(false);
  }

  async function updateStatus(orderId, newStatus) {
    setStatusLoading(orderId);
    try {
      const res  = await fetch(`${API}/orders/${orderId}/status`, {
        method:'PATCH',
        headers:{ Authorization:`Bearer ${token}`, 'Content-Type':'application/json', Accept:'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.id===orderId ? {...o, status:newStatus} : o));
        if (selectedOrder?.id === orderId) setSelectedOrder(p => ({...p, status:newStatus}));
      }
    } catch {}
    setStatusLoading(null);
  }

  const total     = orders.length;
  const pending   = orders.filter(o => o.status==='pending').length;
  const delivered = orders.filter(o => o.status==='delivered').length;
  const revenue   = orders.filter(o => o.status!=='cancelled').reduce((s,o) => s+parseFloat(o.total_amount), 0);
  const filtered  = filterStatus==='all' ? orders : orders.filter(o => o.status===filterStatus);

  return (
    <>
      {/* Stats */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24}}>
        {[
          { label:'Total Orders',  value:total,                        icon:'📦', color:'#002b5b' },
          { label:'Pending',       value:pending,                      icon:'⏳', color:'#f57f17' },
          { label:'Delivered',     value:delivered,                    icon:'✅', color:'#2e7d32' },
          { label:'Total Revenue', value:`Rs ${revenue.toLocaleString()}`, icon:'💰', color:'#c62828' },
        ].map((s,i) => (
          <div key={i} style={{background:'#fff', borderRadius:10, padding:20, boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
            <div style={{fontSize:28, marginBottom:6}}>{s.icon}</div>
            <div style={{fontSize:22, fontWeight:700, color:s.color}}>{s.value}</div>
            <div style={{fontSize:13, color:'#888', marginTop:2}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div style={{background:'#fff', borderRadius:10, boxShadow:'0 2px 8px rgba(0,0,0,0.06)', overflow:'hidden'}}>
        <div style={{padding:'16px 20px', borderBottom:'1px solid #eee', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10}}>
          <h2 style={{margin:0, color:'#002b5b', fontSize:18}}>📋 Orders</h2>
          <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
            {['all','pending','confirmed','shipped','delivered','cancelled'].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                style={{ padding:'5px 12px', borderRadius:20, fontSize:12, fontWeight:600, cursor:'pointer',
                  border: filterStatus===s ? 'none':'1px solid #ddd',
                  background: filterStatus===s ? '#002b5b':'#fff',
                  color: filterStatus===s ? '#fff':'#555' }}>
                {s==='all' ? 'All' : STATUS_COLORS[s]?.label}
              </button>
            ))}
            <button onClick={fetchOrders} style={{padding:'5px 12px', borderRadius:20, fontSize:12, background:'#f0f4f8', border:'1px solid #ddd', cursor:'pointer'}}>🔄</button>
          </div>
        </div>

        {loading ? <div style={{textAlign:'center', padding:60, color:'#888'}}>⏳ Loading...</div>
        : filtered.length===0 ? <div style={{textAlign:'center', padding:60, color:'#888'}}>📭 Koi order nahi.</div>
        : <div style={{overflowX:'auto'}}>
            <table style={{width:'100%', borderCollapse:'collapse', fontSize:14}}>
              <thead>
                <tr style={{background:'#f8f9fa'}}>
                  {['Order #','Customer','Phone','Items','Total','Status','Update','Detail'].map(h => (
                    <th key={h} style={{padding:'12px 16px', textAlign:'left', color:'#555', fontWeight:600, fontSize:12, textTransform:'uppercase', whiteSpace:'nowrap'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => {
                  const items = typeof order.items==='string' ? JSON.parse(order.items) : order.items;
                  const sc    = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
                  return (
                    <tr key={order.id} style={{borderBottom:'1px solid #f0f0f0'}}>
                      <td style={{padding:'12px 16px', fontWeight:600, color:'#002b5b', whiteSpace:'nowrap'}}>{order.order_number}</td>
                      <td style={{padding:'12px 16px'}}>{order.customer_name}</td>
                      <td style={{padding:'12px 16px', color:'#555'}}>{order.customer_phone}</td>
                      <td style={{padding:'12px 16px', color:'#555'}}>{items.length} items</td>
                      <td style={{padding:'12px 16px', fontWeight:600, color:'#c62828', whiteSpace:'nowrap'}}>Rs {parseFloat(order.total_amount).toLocaleString()}</td>
                      <td style={{padding:'12px 16px'}}>
                        <span style={{background:sc.bg, color:sc.color, padding:'3px 10px', borderRadius:20, fontSize:12, fontWeight:600}}>{sc.label}</span>
                      </td>
                      <td style={{padding:'12px 16px'}}>
                        <select value={order.status} disabled={statusLoading===order.id}
                          onChange={e => updateStatus(order.id, e.target.value)}
                          style={{padding:'5px 8px', borderRadius:6, border:'1px solid #ddd', fontSize:12, cursor:'pointer', outline:'none'}}>
                          {Object.entries(STATUS_COLORS).map(([v,s]) => <option key={v} value={v}>{s.label}</option>)}
                        </select>
                        {statusLoading===order.id && <span style={{marginLeft:6, fontSize:11, color:'#888'}}>⏳</span>}
                      </td>
                      <td style={{padding:'12px 16px'}}>
                        <button onClick={() => setSelectedOrder({...order, items})}
                          style={{background:'#002b5b', color:'#fff', border:'none', borderRadius:6, padding:'5px 12px', fontSize:12, cursor:'pointer'}}>View</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        }
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:20}}
          onClick={e => { if(e.target===e.currentTarget) setSelectedOrder(null); }}>
          <div style={{background:'#fff', borderRadius:12, padding:30, maxWidth:520, width:'100%', maxHeight:'85vh', overflowY:'auto'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
              <h3 style={{margin:0, color:'#002b5b'}}>Order Detail</h3>
              <button onClick={() => setSelectedOrder(null)} style={{background:'none', border:'none', fontSize:22, cursor:'pointer', color:'#888'}}>×</button>
            </div>
            <div style={{background:'#f8f9fa', borderRadius:8, padding:16, marginBottom:16}}>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, fontSize:14}}>
                <div><span style={{color:'#888'}}>Order #:</span><br/><strong>{selectedOrder.order_number}</strong></div>
                <div><span style={{color:'#888'}}>Status:</span><br/>
                  <span style={{background:STATUS_COLORS[selectedOrder.status]?.bg, color:STATUS_COLORS[selectedOrder.status]?.color, padding:'2px 10px', borderRadius:20, fontSize:12, fontWeight:600}}>
                    {STATUS_COLORS[selectedOrder.status]?.label}
                  </span>
                </div>
                <div><span style={{color:'#888'}}>Name:</span><br/><strong>{selectedOrder.customer_name}</strong></div>
                <div><span style={{color:'#888'}}>Phone:</span><br/><strong>{selectedOrder.customer_phone}</strong></div>
                <div style={{gridColumn:'1/-1'}}><span style={{color:'#888'}}>Address:</span><br/><strong>{selectedOrder.customer_address}</strong></div>
              </div>
            </div>
            <h4 style={{color:'#444', marginBottom:10}}>Items:</h4>
            {selectedOrder.items.map((item,i) => {
              const price = parseInt(String(item.price).replace(/[^0-9]/g,''))||0;
              return (
                <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #f0f0f0', fontSize:14}}>
                  <span>{item.name} <span style={{color:'#888'}}>x{item.qty}</span></span>
                  <span style={{fontWeight:600}}>Rs {(price*item.qty).toLocaleString()}</span>
                </div>
              );
            })}
            <div style={{display:'flex', justifyContent:'space-between', marginTop:16, padding:'12px 0', borderTop:'2px solid #002b5b'}}>
              <strong style={{color:'#002b5b'}}>Total:</strong>
              <strong style={{color:'#c62828', fontSize:18}}>Rs {parseFloat(selectedOrder.total_amount).toLocaleString()}</strong>
            </div>
            <div style={{marginTop:16}}>
              <label style={{fontSize:13, fontWeight:600, color:'#444', marginBottom:6, display:'block'}}>Status Update:</label>
              <select value={selectedOrder.status} onChange={e => updateStatus(selectedOrder.id, e.target.value)}
                style={{width:'100%', padding:'10px 12px', borderRadius:8, border:'1px solid #ddd', fontSize:14, outline:'none'}}>
                {Object.entries(STATUS_COLORS).map(([v,s]) => <option key={v} value={v}>{s.label}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ══════════════════════════════════════════════════════════════
// PRODUCTS TAB
// ══════════════════════════════════════════════════════════════
function ProductsTab({ token }) {
  const [products,    setProducts]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [filterCat,   setFilterCat]   = useState('all');
  const [editProduct, setEditProduct] = useState(null);  // null = closed, obj = editing
  const [showAdd,     setShowAdd]     = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [msg,         setMsg]         = useState('');

  // New product form
  const emptyForm = { name:'', category:'rideon', price:'', image:'', description:'', stock:0, is_active:true, variants:[] };
  const [form, setForm] = useState(emptyForm);

  // Variant temp
  const [variantImg, setVariantImg] = useState('');

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/products?all=1`, { headers:{ Authorization:`Bearer ${token}`, Accept:'application/json' } });
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch {}
    setLoading(false);
  }

  async function saveProduct() {
    setSaving(true);
    setMsg('');
    try {
      const isEdit = !!editProduct?.id;
      const url    = isEdit ? `${API}/admin/products/${editProduct.id}` : `${API}/admin/products`;
      const method = isEdit ? 'PUT' : 'POST';

      const payload = {
        name:        form.name,
        category:    form.category,
        price:       parseFloat(form.price),
        image:       form.image,
        description: form.description,
        stock:       parseInt(form.stock) || 0,
        is_active:   form.is_active,
        variants:    form.variants.length > 0 ? form.variants : null,
      };

      const res  = await fetch(url, {
        method,
        headers:{ Authorization:`Bearer ${token}`, 'Content-Type':'application/json', Accept:'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setMsg('✅ ' + data.message);
        fetchProducts();
        setEditProduct(null);
        setShowAdd(false);
        setForm(emptyForm);
      } else {
        setMsg('❌ Error: ' + JSON.stringify(data.errors || data.message));
      }
    } catch (e) {
      setMsg('❌ Server error');
    }
    setSaving(false);
  }

  async function deleteProduct(id, name) {
    if (!window.confirm(`"${name}" delete karna chahte hain?`)) return;
    try {
      const res  = await fetch(`${API}/admin/products/${id}`, {
        method:'DELETE',
        headers:{ Authorization:`Bearer ${token}`, Accept:'application/json' },
      });
      const data = await res.json();
      if (data.success) { setMsg('✅ ' + data.message); fetchProducts(); }
    } catch {}
  }

  function openEdit(p) {
    const variants = p.variants ? (typeof p.variants==='string' ? JSON.parse(p.variants) : p.variants) : [];
    setForm({ name:p.name, category:p.category, price:p.price, image:p.image, description:p.description||'', stock:p.stock||0, is_active:p.is_active, variants });
    setEditProduct(p);
    setShowAdd(false);
    setMsg('');
  }

  function openAdd() {
    setForm(emptyForm);
    setEditProduct(null);
    setShowAdd(true);
    setMsg('');
  }

  function addVariant() {
    if (!variantImg.trim()) return;
    setForm(f => ({...f, variants:[...f.variants, {img: variantImg.trim()}]}));
    setVariantImg('');
  }

  function removeVariant(i) {
    setForm(f => ({...f, variants: f.variants.filter((_,idx) => idx!==i)}));
  }

  const filtered = filterCat==='all' ? products : products.filter(p => p.category===filterCat);

  const formPanel = (
    <div style={{background:'#fff', borderRadius:10, boxShadow:'0 2px 8px rgba(0,0,0,0.06)', padding:24, marginBottom:24}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
        <h3 style={{margin:0, color:'#002b5b'}}>{editProduct ? '✏️ Edit Product' : '➕ Naya Product Add'}</h3>
        <button onClick={() => { setEditProduct(null); setShowAdd(false); }}
          style={{background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#888'}}>×</button>
      </div>

      {msg && <div style={{padding:'10px 14px', borderRadius:8, marginBottom:16, fontSize:14,
        background: msg.startsWith('✅') ? '#e8f5e9':'#fff3f3',
        color: msg.startsWith('✅') ? '#2e7d32':'#c62828',
        border: `1px solid ${msg.startsWith('✅') ? '#c8e6c9':'#ffcdd2'}`}}>{msg}</div>}

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
        <div>
          <label style={{display:'block', marginBottom:6, fontWeight:600, fontSize:13, color:'#444'}}>Product Name *</label>
          <input style={inp} value={form.name} onChange={e => setForm(f=>({...f, name:e.target.value}))} placeholder="e.g. Dolphin Car"/>
        </div>
        <div>
          <label style={{display:'block', marginBottom:6, fontWeight:600, fontSize:13, color:'#444'}}>Category *</label>
          <select style={{...inp}} value={form.category} onChange={e => setForm(f=>({...f, category:e.target.value}))}>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label style={{display:'block', marginBottom:6, fontWeight:600, fontSize:13, color:'#444'}}>Price (Rs) *</label>
          <input style={inp} type="number" value={form.price} onChange={e => setForm(f=>({...f, price:e.target.value}))} placeholder="e.g. 4200"/>
        </div>
        <div>
          <label style={{display:'block', marginBottom:6, fontWeight:600, fontSize:13, color:'#444'}}>Stock Quantity</label>
          <input style={inp} type="number" value={form.stock} onChange={e => setForm(f=>({...f, stock:e.target.value}))} placeholder="0"/>
        </div>
        <div style={{gridColumn:'1/-1'}}>
          <label style={{display:'block', marginBottom:6, fontWeight:600, fontSize:13, color:'#444'}}>Main Image Path *</label>
          <input style={inp} value={form.image} onChange={e => setForm(f=>({...f, image:e.target.value}))} placeholder="images/dolphin.jpg"/>
          {form.image && <img src={`/${form.image}`} alt="preview" style={{marginTop:8, height:60, borderRadius:6, border:'1px solid #eee', objectFit:'contain'}} onError={e=>e.target.style.display='none'}/>}
        </div>
        <div style={{gridColumn:'1/-1'}}>
          <label style={{display:'block', marginBottom:6, fontWeight:600, fontSize:13, color:'#444'}}>Description</label>
          <textarea style={{...inp, minHeight:80, resize:'vertical'}} value={form.description} onChange={e => setForm(f=>({...f, description:e.target.value}))} placeholder="Product description..."/>
        </div>

        {/* Variants */}
        <div style={{gridColumn:'1/-1'}}>
          <label style={{display:'block', marginBottom:8, fontWeight:600, fontSize:13, color:'#444'}}>Color Variants (optional)</label>
          <div style={{display:'flex', gap:8, marginBottom:8}}>
            <input style={{...inp, flex:1}} value={variantImg} onChange={e => setVariantImg(e.target.value)} placeholder="images/variant-red.jpg"/>
            <button onClick={addVariant}
              style={{padding:'10px 16px', background:'#002b5b', color:'#fff', border:'none', borderRadius:8, cursor:'pointer', whiteSpace:'nowrap'}}>+ Add</button>
          </div>
          {form.variants.length > 0 && (
            <div style={{display:'flex', flexWrap:'wrap', gap:10}}>
              {form.variants.map((v,i) => (
                <div key={i} style={{position:'relative', border:'1px solid #ddd', borderRadius:8, padding:4}}>
                  <img src={`/${v.img}`} alt="" style={{width:56, height:56, objectFit:'cover', borderRadius:6, display:'block'}} onError={e=>e.target.style.opacity=0.3}/>
                  <button onClick={() => removeVariant(i)}
                    style={{position:'absolute', top:-6, right:-6, background:'#e53935', color:'#fff', border:'none', borderRadius:'50%', width:18, height:18, fontSize:11, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center'}}>×</button>
                  <div style={{fontSize:10, color:'#888', marginTop:2, maxWidth:56, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{v.img.split('/').pop()}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active toggle */}
        <div style={{gridColumn:'1/-1', display:'flex', alignItems:'center', gap:10}}>
          <input type="checkbox" id="is_active" checked={form.is_active} onChange={e => setForm(f=>({...f, is_active:e.target.checked}))} style={{width:16, height:16}}/>
          <label htmlFor="is_active" style={{fontWeight:600, fontSize:13, color:'#444', cursor:'pointer'}}>Product Active (website pe dikhaye)</label>
        </div>
      </div>

      <div style={{display:'flex', gap:12, marginTop:20}}>
        <button onClick={saveProduct} disabled={saving}
          style={{padding:'11px 28px', background:'#002b5b', color:'#fff', border:'none', borderRadius:8, fontWeight:700, fontSize:14, cursor:'pointer'}}>
          {saving ? '⏳ Saving...' : editProduct ? '💾 Update Product' : '➕ Add Product'}
        </button>
        <button onClick={() => { setEditProduct(null); setShowAdd(false); setMsg(''); }}
          style={{padding:'11px 20px', background:'#f0f4f8', color:'#555', border:'1px solid #ddd', borderRadius:8, fontSize:14, cursor:'pointer'}}>
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Filter + Add button */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16, flexWrap:'wrap', gap:10}}>
        <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
          <button onClick={() => setFilterCat('all')}
            style={{padding:'6px 14px', borderRadius:20, fontSize:12, fontWeight:600, cursor:'pointer', border: filterCat==='all'?'none':'1px solid #ddd', background: filterCat==='all'?'#002b5b':'#fff', color: filterCat==='all'?'#fff':'#555'}}>
            All ({products.length})
          </button>
          {CATEGORIES.map(c => (
            <button key={c.value} onClick={() => setFilterCat(c.value)}
              style={{padding:'6px 14px', borderRadius:20, fontSize:12, fontWeight:600, cursor:'pointer', border: filterCat===c.value?'none':'1px solid #ddd', background: filterCat===c.value?'#002b5b':'#fff', color: filterCat===c.value?'#fff':'#555'}}>
              {c.label} ({products.filter(p=>p.category===c.value).length})
            </button>
          ))}
        </div>
        <button onClick={openAdd}
          style={{padding:'8px 20px', background:'#16a34a', color:'#fff', border:'none', borderRadius:8, fontWeight:700, fontSize:14, cursor:'pointer'}}>
          ➕ Add Product
        </button>
      </div>

      {/* Form panel */}
      {(showAdd || editProduct) && formPanel}

      {/* Products Grid */}
      {loading ? <div style={{textAlign:'center', padding:60, color:'#888'}}>⏳ Loading products...</div>
      : (
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:16}}>
          {filtered.map(p => {
            const variants = p.variants ? (typeof p.variants==='string' ? JSON.parse(p.variants) : p.variants) : [];
            return (
              <div key={p.id} style={{background:'#fff', borderRadius:10, boxShadow:'0 2px 8px rgba(0,0,0,0.06)', overflow:'hidden', opacity: p.is_active ? 1 : 0.6}}>
                <div style={{position:'relative'}}>
                  <img src={`/${p.image}`} alt={p.name} style={{width:'100%', height:160, objectFit:'contain', background:'#f9f9f9', padding:8, boxSizing:'border-box'}} onError={e=>e.target.style.opacity=0.3}/>
                  {!p.is_active && <div style={{position:'absolute', top:8, right:8, background:'#e53935', color:'#fff', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20}}>INACTIVE</div>}
                  {p.stock <= 5 && p.stock >= 0 && <div style={{position:'absolute', top:8, left:8, background: p.stock===0?'#e53935':'#f57f17', color:'#fff', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20}}>{p.stock===0?'OUT OF STOCK':`Low: ${p.stock}`}</div>}
                </div>
                <div style={{padding:12}}>
                  <div style={{fontSize:13, fontWeight:700, color:'#002b5b', marginBottom:4, lineHeight:1.3}}>{p.name}</div>
                  <div style={{fontSize:12, color:'#888', marginBottom:6, textTransform:'capitalize'}}>{p.category}</div>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
                    <span style={{fontSize:15, fontWeight:700, color:'#c62828'}}>Rs {Number(p.price).toLocaleString()}</span>
                    <span style={{fontSize:12, color: p.stock===0?'#e53935': p.stock<=5?'#f57f17':'#2e7d32', fontWeight:600}}>Stock: {p.stock}</span>
                  </div>
                  {variants.length > 0 && (
                    <div style={{display:'flex', gap:4, marginBottom:8, flexWrap:'wrap'}}>
                      {variants.map((v,i) => <img key={i} src={`/${v.img}`} alt="" style={{width:24, height:24, borderRadius:4, objectFit:'cover', border:'1px solid #ddd'}} onError={e=>e.target.style.display='none'}/>)}
                    </div>
                  )}
                  <div style={{display:'flex', gap:8}}>
                    <button onClick={() => openEdit(p)}
                      style={{flex:1, padding:'7px 0', background:'#e3f2fd', color:'#1565c0', border:'none', borderRadius:6, fontSize:12, fontWeight:600, cursor:'pointer'}}>✏️ Edit</button>
                    <button onClick={() => deleteProduct(p.id, p.name)}
                      style={{padding:'7px 12px', background:'#ffebee', color:'#c62828', border:'none', borderRadius:6, fontSize:12, fontWeight:600, cursor:'pointer'}}>🗑️</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

// ══════════════════════════════════════════════════════════════
// MARQUEE TAB
// ══════════════════════════════════════════════════════════════
function MarqueeTab({ token }) {
  const STORAGE_KEY = 'crown_marquee_items';

  const defaultItems = [
    { id:'dolphin-car',  img:'images/dolphin.jpg',                      label:'Dolphin Ride' },
    { id:'sky-jet',      img:'images/jet2.jpg',                         label:'Sky Jet Auto Car' },
    { id:'mini-cooper',  img:'images/mini copper.jpg',                  label:'Mini Cooper' },
    { id:'micky-cycle',  img:'images/micky red without background.png', label:'Micky Tricycle' },
    { id:'cosmos-cot',   img:'images/carry cot.jpeg',                   label:'Cosmos Carry Cot' },
    { id:'potty-chair',  img:'images/3in 1 potty.jpeg',                 label:'3in1 Potty' },
  ];

  const [items,   setItems]   = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultItems; } catch { return defaultItems; }
  });
  const [form,    setForm]    = useState({ id:'', img:'', label:'' });
  const [msg,     setMsg]     = useState('');
  const [editIdx, setEditIdx] = useState(null);

  function save(newItems) {
    setItems(newItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
  }

  function addItem() {
    if (!form.id || !form.img || !form.label) { setMsg('❌ Sab fields bharein'); return; }
    if (editIdx !== null) {
      const updated = items.map((it,i) => i===editIdx ? {...form} : it);
      save(updated);
      setEditIdx(null);
    } else {
      save([...items, {...form}]);
    }
    setForm({ id:'', img:'', label:'' });
    setMsg('✅ Marquee update ho gaya!');
  }

  function removeItem(i) {
    save(items.filter((_,idx) => idx!==i));
  }

  function startEdit(i) {
    setForm({...items[i]});
    setEditIdx(i);
    setMsg('');
  }

  function moveUp(i) {
    if (i===0) return;
    const arr = [...items];
    [arr[i-1], arr[i]] = [arr[i], arr[i-1]];
    save(arr);
  }

  function moveDown(i) {
    if (i===items.length-1) return;
    const arr = [...items];
    [arr[i], arr[i+1]] = [arr[i+1], arr[i]];
    save(arr);
  }

  function resetDefault() {
    if (!window.confirm('Default items pe reset karna chahte hain?')) return;
    save(defaultItems);
    setMsg('✅ Default items restore ho gaye!');
  }

  return (
    <div style={{maxWidth:700}}>
      <div style={{background:'#fff8e1', border:'1px solid #ffe082', borderRadius:8, padding:'12px 16px', marginBottom:20, fontSize:13, color:'#795548'}}>
        ⚠️ <strong>Note:</strong> Marquee changes abhi sirf is browser mein save honge. Deploy ke baad backend API se connect karenge.
      </div>

      {/* Add/Edit Form */}
      <div style={{background:'#fff', borderRadius:10, boxShadow:'0 2px 8px rgba(0,0,0,0.06)', padding:24, marginBottom:24}}>
        <h3 style={{margin:'0 0 16px', color:'#002b5b'}}>{editIdx!==null ? '✏️ Edit Item' : '➕ Naya Marquee Item'}</h3>

        {msg && <div style={{padding:'10px 14px', borderRadius:8, marginBottom:16, fontSize:14,
          background: msg.startsWith('✅')?'#e8f5e9':'#fff3f3',
          color: msg.startsWith('✅')?'#2e7d32':'#c62828',
          border:`1px solid ${msg.startsWith('✅')?'#c8e6c9':'#ffcdd2'}`}}>{msg}</div>}

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12}}>
          <div>
            <label style={{display:'block', marginBottom:5, fontWeight:600, fontSize:13, color:'#444'}}>Product ID (slug)</label>
            <input style={inp} value={form.id} onChange={e=>setForm(f=>({...f, id:e.target.value}))} placeholder="e.g. dolphin-car"/>
          </div>
          <div>
            <label style={{display:'block', marginBottom:5, fontWeight:600, fontSize:13, color:'#444'}}>Label (naam)</label>
            <input style={inp} value={form.label} onChange={e=>setForm(f=>({...f, label:e.target.value}))} placeholder="e.g. Dolphin Ride"/>
          </div>
          <div style={{gridColumn:'1/-1'}}>
            <label style={{display:'block', marginBottom:5, fontWeight:600, fontSize:13, color:'#444'}}>Image Path</label>
            <input style={inp} value={form.img} onChange={e=>setForm(f=>({...f, img:e.target.value}))} placeholder="images/dolphin.jpg"/>
            {form.img && <img src={`/${form.img}`} alt="" style={{marginTop:8, height:50, borderRadius:6, border:'1px solid #eee', objectFit:'contain'}} onError={e=>e.target.style.display='none'}/>}
          </div>
        </div>
        <div style={{display:'flex', gap:10}}>
          <button onClick={addItem}
            style={{padding:'10px 20px', background:'#002b5b', color:'#fff', border:'none', borderRadius:8, fontWeight:700, fontSize:13, cursor:'pointer'}}>
            {editIdx!==null ? '💾 Update' : '➕ Add'}
          </button>
          {editIdx!==null && (
            <button onClick={() => { setEditIdx(null); setForm({id:'',img:'',label:''}); }}
              style={{padding:'10px 16px', background:'#f0f4f8', color:'#555', border:'1px solid #ddd', borderRadius:8, fontSize:13, cursor:'pointer'}}>Cancel</button>
          )}
          <button onClick={resetDefault}
            style={{marginLeft:'auto', padding:'10px 16px', background:'#fff8e1', color:'#795548', border:'1px solid #ffe082', borderRadius:8, fontSize:13, cursor:'pointer'}}>🔄 Reset Default</button>
        </div>
      </div>

      {/* Current Items */}
      <div style={{background:'#fff', borderRadius:10, boxShadow:'0 2px 8px rgba(0,0,0,0.06)', padding:24}}>
        <h3 style={{margin:'0 0 16px', color:'#002b5b'}}>Current Marquee Items ({items.length})</h3>
        {items.map((item, i) => (
          <div key={i} style={{display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid #f0f0f0'}}>
            <img src={`/${item.img}`} alt={item.label} style={{width:48, height:48, borderRadius:8, objectFit:'cover', border:'1px solid #eee', background:'#f9f9f9'}} onError={e=>e.target.style.opacity=0.3}/>
            <div style={{flex:1}}>
              <div style={{fontWeight:600, fontSize:14, color:'#002b5b'}}>{item.label}</div>
              <div style={{fontSize:12, color:'#888'}}>{item.id} — {item.img}</div>
            </div>
            <div style={{display:'flex', gap:6}}>
              <button onClick={() => moveUp(i)} disabled={i===0}   style={{padding:'4px 8px', border:'1px solid #ddd', borderRadius:6, cursor:'pointer', background:'#fff', fontSize:12, opacity:i===0?0.3:1}}>↑</button>
              <button onClick={() => moveDown(i)} disabled={i===items.length-1} style={{padding:'4px 8px', border:'1px solid #ddd', borderRadius:6, cursor:'pointer', background:'#fff', fontSize:12, opacity:i===items.length-1?0.3:1}}>↓</button>
              <button onClick={() => startEdit(i)} style={{padding:'4px 10px', background:'#e3f2fd', color:'#1565c0', border:'none', borderRadius:6, fontSize:12, fontWeight:600, cursor:'pointer'}}>✏️</button>
              <button onClick={() => removeItem(i)} style={{padding:'4px 10px', background:'#ffebee', color:'#c62828', border:'none', borderRadius:6, fontSize:12, fontWeight:600, cursor:'pointer'}}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ══════════════════════════════════════════════════════════════
export default function AdminDashboard({ token, onLogout }) {
  const [activeTab, setActiveTab] = useState('orders');

  function handleLogout() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_name');
    onLogout();
  }

  const tabs = [
    { key:'orders',   label:'📋 Orders' },
    { key:'products', label:'📦 Products' },
    { key:'marquee',  label:'🎠 Marquee' },
  ];

  return (
    <div style={{minHeight:'100vh', background:'#f0f4f8', fontFamily:'Arial, sans-serif'}}>

      {/* Header */}
      <div style={{background:'#002b5b', padding:'0 30px', display:'flex', alignItems:'center', justifyContent:'space-between', height:60}}>
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <img src="/images/crown logo2.png" alt="Crown" style={{height:36}}/>
          <span style={{color:'#fff', fontWeight:700, fontSize:18}}>Admin Panel</span>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:16}}>
          <span style={{color:'#a8c4e0', fontSize:13}}>👤 {localStorage.getItem('admin_name') || 'Admin'}</span>
          <button onClick={handleLogout}
            style={{background:'rgba(255,255,255,0.1)', color:'#fff', border:'1px solid rgba(255,255,255,0.2)', borderRadius:6, padding:'6px 14px', cursor:'pointer', fontSize:13}}>
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{background:'#fff', borderBottom:'1px solid #e0e0e0', padding:'0 24px'}}>
        <div style={{display:'flex', gap:0}}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              style={{padding:'14px 24px', border:'none', background:'none', cursor:'pointer', fontSize:14, fontWeight:600,
                color: activeTab===t.key ? '#002b5b':'#888',
                borderBottom: activeTab===t.key ? '3px solid #002b5b':'3px solid transparent',
              }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{padding:24, maxWidth:1300, margin:'0 auto'}}>
        {activeTab==='orders'   && <OrdersTab   token={token}/>}
        {activeTab==='products' && <ProductsTab token={token}/>}
        {activeTab==='marquee'  && <MarqueeTab  token={token}/>}
      </div>
    </div>
  );
}
