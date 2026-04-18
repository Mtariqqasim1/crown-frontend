import { useState } from 'react';
import { getCart, saveCart } from '../components/Layout';

const DELIVERY_CHARGE = 299;

export default function CheckoutPage() {
  const cart = getCart();

  const [name,       setName]       = useState('');
  const [phone,      setPhone]      = useState('');
  const [address,    setAddress]    = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [loading,    setLoading]    = useState(false);
  const [success,    setSuccess]    = useState(false);
  const [error,      setError]      = useState('');

  const subtotal   = cart.reduce((sum, item) => {
    const p = parseInt(String(item.price).replace(/[^0-9]/g,''))||0;
    return sum + p * item.qty;
  }, 0);
  const grandTotal = subtotal + (cart.length > 0 ? DELIVERY_CHARGE : 0);

  async function handleSubmit(e) {
    e.preventDefault();
    if (cart.length === 0) return;
    setLoading(true);
    setError('');

    const fullAddress = postalCode ? `${address}, Postal Code: ${postalCode}` : address;

    try {
      const res = await fetch('http://127.0.0.1:8000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          customer_name:    name,
          customer_phone:   phone,
          customer_address: fullAddress,
          items:            cart,
          total_amount:     grandTotal,
        })
      });

      const data = await res.json();
      if (data.success) {
        saveCart([]);
        setSuccess(true);
      } else {
        setError('Order could not be placed. Please try again.');
      }
    } catch {
      setError('Could not connect to server. Please check your connection.');
    }
    setLoading(false);
  }

  // ── Success Screen ──────────────────────────────────────────────────────────
  if (success) return (
    <div style={{textAlign:'center', padding:'80px 20px'}}>
      <div style={{fontSize:60, marginBottom:20}}>🎉</div>
      <h2 style={{color:'#16a34a', marginBottom:10}}>Order Placed Successfully!</h2>
      <p style={{color:'#555', marginBottom:10}}>Your order has been received.</p>
      <p style={{color:'#888', marginBottom:30, fontSize:14}}>
        📧 A confirmation email has been sent — we will contact you shortly.
      </p>
      <a href="/" style={{background:'var(--primary)', color:'#fff', padding:'12px 30px', borderRadius:8, fontWeight:700, textDecoration:'none'}}>
        Back to Home
      </a>
    </div>
  );

  return (
    <>
      <header className="header flex container">
        <div className="logo">
          <a href="/"><img src="images/crown logo2.png" alt="Crown Logo"/></a>
        </div>
        <div style={{fontWeight:'bold', color:'var(--primary)'}}>Secure Checkout</div>
      </header>

      <div className="checkout-wrap">
        <div className="card">
          <h1><i className="fas fa-shopping-bag"></i> Confirm Order</h1>

          {/* Order Summary */}
          <div className="order-summary">
            {cart.length === 0
              ? <p style={{textAlign:'center'}}>Your cart is empty.</p>
              : cart.map((item, i) => {
                  const price = parseInt(String(item.price).replace(/[^0-9]/g, '')) || 0;
                  return (
                    <div className="summary-row" key={i}>
                      <span>{item.name} <small style={{color:'#888'}}>(x{item.qty})</small></span>
                      <span>Rs {(price * item.qty).toLocaleString()}</span>
                    </div>
                  );
                })
            }
          </div>

          {/* Price Breakdown */}
          <div style={{fontSize:14, color:'#666', marginBottom:6, display:'flex', justifyContent:'space-between'}}>
            <span>Subtotal:</span>
            <span>Rs {subtotal.toLocaleString()}</span>
          </div>
          <div style={{fontSize:14, color:'#666', marginBottom:10, display:'flex', justifyContent:'space-between'}}>
            <span>Delivery Charges:</span>
            <span style={{color:'#e63946', fontWeight:600}}>Rs {DELIVERY_CHARGE.toLocaleString()}</span>
          </div>
          <div className="total-row">
            <span>Total Payable:</span>
            <span>Rs {grandTotal.toLocaleString()}</span>
          </div>
          <br/>

          {error && (
            <div style={{background:'#fff3f3', border:'1px solid #ffcdd2', borderRadius:8, padding:'12px 16px', marginBottom:15, color:'#c62828', fontSize:14}}>
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Enter your full name" required/>
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="0300-XXXXXXX" required/>
            </div>
            <div className="form-group">
              <label>Delivery Address</label>
              <textarea value={address} onChange={e => setAddress(e.target.value)}
                rows="3" placeholder="House No, Street, City..." required/>
            </div>
            <div className="form-group">
              <label>Postal Code <span style={{color:'#aaa', fontWeight:400, fontSize:12}}>(Optional)</span></label>
              <input type="text" value={postalCode} onChange={e => setPostalCode(e.target.value)}
                placeholder="e.g. 75500"/>
            </div>

            <div style={{background:'#f0f9ff', border:'1px solid #bae6fd', borderRadius:8, padding:'10px 14px', marginBottom:16, fontSize:13, color:'#0369a1'}}>
              💳 Payment Method: <strong>Cash on Delivery (COD)</strong>
            </div>

            <button type="submit" disabled={cart.length === 0 || loading} className="order-btn"
              style={cart.length === 0 ? {background:'#ccc', cursor:'not-allowed'} : {}}>
              {loading
                ? <><i className="fas fa-spinner fa-spin"></i> Placing order...</>
                : <><i className="fas fa-paper-plane"></i> Place Order — Rs {grandTotal.toLocaleString()}</>
              }
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .checkout-wrap { max-width:600px; margin:40px auto; padding:20px; }
        .card { background:white; padding:30px; border-radius:10px; box-shadow:0 5px 20px rgba(0,0,0,0.05); }
        h1 { color:var(--primary); text-align:center; margin-bottom:20px; font-size:1.5rem; }
        .form-group { margin-bottom:15px; }
        .form-group label { display:block; margin-bottom:8px; font-weight:600; font-size:14px; color:#444; }
        .form-group input, .form-group textarea { width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; font-size:14px; outline:none; box-sizing:border-box; transition:0.2s; }
        .form-group input:focus, .form-group textarea:focus { border-color:var(--primary); box-shadow:0 0 0 3px rgba(0,43,91,0.08); }
        .order-summary { background:#f8f9fa; padding:15px; border-radius:8px; margin-bottom:12px; border:1px dashed #ddd; }
        .summary-row { display:flex; justify-content:space-between; margin-bottom:8px; font-size:14px; color:#555; }
        .total-row { display:flex; justify-content:space-between; font-weight:bold; font-size:18px; color:var(--primary); border-top:2px solid #002b5b; padding-top:10px; margin-top:5px; }
        .order-btn { background:var(--primary); color:white; width:100%; padding:15px; border:none; border-radius:8px; font-size:17px; font-weight:bold; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px; transition:0.3s; }
        .order-btn:hover:not(:disabled) { background:var(--accent); color:var(--primary); transform:translateY(-2px); }
      `}</style>
    </>
  );
}
