import { useState } from 'react';

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://127.0.0.1:8000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_name', data.user.name);
        onLogin(data.token);
      } else {
        setError(data.message || 'Username ya password galat hai.');
      }
    } catch {
      setError('Server se connect nahi ho saka.');
    }
    setLoading(false);
  }

  return (
    <div style={{minHeight:'100vh', background:'#f0f4f8', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div style={{background:'#fff', padding:40, borderRadius:12, boxShadow:'0 8px 30px rgba(0,0,0,0.1)', width:'100%', maxWidth:400}}>
        
        {/* Logo */}
        <div style={{textAlign:'center', marginBottom:30}}>
          <img src="/images/crown logo2.png" alt="Crown" style={{height:60, marginBottom:10}}/>
          <h2 style={{color:'#002b5b', margin:0}}>Admin Panel</h2>
          <p style={{color:'#888', fontSize:13, marginTop:4}}>Crown Baby Cycle Store</p>
        </div>

        {error && (
          <div style={{background:'#fff3f3', border:'1px solid #ffcdd2', borderRadius:8, padding:'10px 14px', marginBottom:16, color:'#c62828', fontSize:14}}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:16}}>
            <label style={{display:'block', marginBottom:6, fontWeight:600, fontSize:14, color:'#444'}}>Username</label>
            <input
              type="text" value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="admin"
              required
              style={{width:'100%', padding:'11px 14px', border:'1.5px solid #ddd', borderRadius:8, fontSize:14, outline:'none', boxSizing:'border-box'}}
            />
          </div>
          <div style={{marginBottom:24}}>
            <label style={{display:'block', marginBottom:6, fontWeight:600, fontSize:14, color:'#444'}}>Password</label>
            <input
              type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{width:'100%', padding:'11px 14px', border:'1.5px solid #ddd', borderRadius:8, fontSize:14, outline:'none', boxSizing:'border-box'}}
            />
          </div>
          <button type="submit" disabled={loading}
            style={{width:'100%', padding:13, background:'#002b5b', color:'#fff', border:'none', borderRadius:8, fontSize:16, fontWeight:700, cursor:'pointer'}}>
            {loading ? '⏳ Logging in...' : '🔐 Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
