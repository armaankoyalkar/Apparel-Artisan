import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

async function apiRequest(path, options = {}, token) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Something went wrong. Please try again.');
  return data;
}

function ProductImage({ product, className = '' }) {
  return product.imageUrl ? (
    <img className={className} src={product.imageUrl} alt={product.name} />
  ) : (
    <div className={`product-image-placeholder ${className}`} aria-label={`${product.name} placeholder`}>
      AA
    </div>
  );
}

function Header({ auth, cartCount, onLogout }) {
  return (
    <header className="site-header">
      <Link className="brand" to="/">Apparel <span>Artisan</span></Link>
      <nav aria-label="Primary navigation">
        <NavLink to="/products">Shop</NavLink>
        {auth && <NavLink to="/orders">Orders</NavLink>}
      </nav>
      <div className="header-actions">
        <Link className="cart-link" to="/cart">Cart <span>{cartCount}</span></Link>
        {auth ? (
          <button className="text-button" onClick={onLogout}>Sign out</button>
        ) : (
          <Link className="button button-small" to="/login">Sign in</Link>
        )}
      </div>
    </header>
  );
}

function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Independent designs, thoughtfully made</p>
          <h1>Wear something original.</h1>
          <p>Small-batch apparel made to turn everyday outfits into a point of view.</p>
          <div className="button-row">
            <Link className="button" to="/products">Shop the collection</Link>
            <Link className="button button-quiet" to="/register">Create an account</Link>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true"><span>AA</span></div>
      </section>
      <section className="value-grid section">
        <article><b>Artist-led</b><p>Original illustrations from independent creatives.</p></article>
        <article><b>Built to live in</b><p>Comfortable, durable fabrics and considered fits.</p></article>
        <article><b>Easy returns</b><p>Find your fit with a simple 30-day return window.</p></article>
      </section>
    </>
  );
}

function ProductListPage({ products, loading, error, onAddToCart }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const categories = useMemo(() => ['All', ...new Set(products.map((product) => product.category).filter(Boolean))], [products]);
  const visibleProducts = products.filter((product) => {
    const searchable = `${product.name} ${product.description} ${product.category}`.toLowerCase();
    return (category === 'All' || product.category === category) && searchable.includes(query.toLowerCase());
  });

  return (
    <section className="section shop-page">
      <div className="page-heading">
        <div><p className="eyebrow">The collection</p><h1>Made for your rotation.</h1></div>
        <label className="search-field"><span className="sr-only">Search products</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the collection" /></label>
      </div>
      <div className="filter-row" aria-label="Product categories">
        {categories.map((item) => <button key={item} className={item === category ? 'filter active' : 'filter'} onClick={() => setCategory(item)}>{item}</button>)}
      </div>
      {loading && <div className="loading-state">Loading the collection...</div>}
      {error && <div className="notice error">{error}</div>}
      {!loading && !error && (
        visibleProducts.length ? <div className="product-grid">{visibleProducts.map((product) => <ProductCard key={product._id} product={product} onAddToCart={onAddToCart} />)}</div> : <EmptyState title="No products found" detail="Try another search or category." action="Clear filters" onAction={() => { setQuery(''); setCategory('All'); }} />
      )}
    </section>
  );
}

function ProductCard({ product, onAddToCart }) {
  const available = product.countInStock > 0;
  return (
    <article className="product-card">
      <Link to={`/products/${product._id}`} className="product-media"><ProductImage product={product} /></Link>
      <div className="product-card-copy">
        <p className="product-category">{product.category || 'Apparel Artisan'}</p>
        <Link to={`/products/${product._id}`}><h2>{product.name}</h2></Link>
        <div className="product-card-footer"><span>{currency.format(product.price)}</span><button className="add-button" disabled={!available} onClick={() => onAddToCart(product)}>{available ? 'Add' : 'Sold out'}</button></div>
      </div>
    </article>
  );
}

function ProductDetailPage({ products, loading, onAddToCart }) {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState('');
  const product = products.find((item) => item._id === id);
  if (loading) return <div className="loading-state">Loading product...</div>;
  if (!product) return <EmptyState title="Product not found" detail="It may have been removed from the collection." action="Browse products" to="/products" />;
  const available = product.countInStock > 0;
  const sizes = product.sizes?.length ? product.sizes : [];
  return (
    <section className="section product-detail">
      <div className="detail-media"><ProductImage product={product} /></div>
      <div className="detail-copy">
        <Link className="back-link" to="/products">Back to shop</Link>
        <p className="eyebrow">{product.category} / {product.brand}</p>
        <h1>{product.name}</h1>
        <p className="detail-price">{currency.format(product.price)}</p>
        <p className="detail-description">{product.description}</p>
        {sizes.length > 0 && <div className="size-picker"><p>Choose a size</p><div>{sizes.map((size) => <button key={size} className={size === selectedSize ? 'size active' : 'size'} onClick={() => setSelectedSize(size)}>{size}</button>)}</div></div>}
        <p className={available ? 'stock-status' : 'stock-status sold-out'}>{available ? `${product.countInStock} available` : 'Currently sold out'}</p>
        <button className="button full-width" disabled={!available} onClick={() => onAddToCart(product, selectedSize)}>{available ? 'Add to cart' : 'Sold out'}</button>
      </div>
    </section>
  );
}

function CartPage({ cart, auth, onUpdateQuantity, onRemove, onCheckout, checkoutError, checkoutLoading }) {
  const navigate = useNavigate();
  const [address, setAddress] = useState({ street: '', city: '', state: '', zipCode: '', country: '' });
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const submit = async (event) => {
    event.preventDefault();
    if (!auth) return navigate('/login', { state: { from: { pathname: '/cart' } } });
    await onCheckout(address);
  };
  if (!cart.length) return <EmptyState title="Your cart is waiting." detail="Add a piece from the collection when you are ready." action="Browse products" to="/products" />;
  return (
    <section className="section cart-page">
      <div className="page-heading compact"><div><p className="eyebrow">Your bag</p><h1>Cart</h1></div><p>{cart.length} item{cart.length === 1 ? '' : 's'}</p></div>
      <div className="cart-layout">
        <div className="cart-items">{cart.map((item) => <CartLine key={item.product._id} item={item} onUpdateQuantity={onUpdateQuantity} onRemove={onRemove} />)}</div>
        <aside className="order-summary"><h2>Order summary</h2><div><span>Subtotal</span><b>{currency.format(total)}</b></div><div><span>Shipping</span><span>Calculated at checkout</span></div><div className="summary-total"><span>Total</span><b>{currency.format(total)}</b></div>
          <form onSubmit={submit} className="checkout-form">
            <h3>{auth ? 'Shipping address' : 'Sign in to check out'}</h3>
            {auth && <><input required placeholder="Street address" value={address.street} onChange={(event) => setAddress({ ...address, street: event.target.value })} /><div className="two-fields"><input required placeholder="City" value={address.city} onChange={(event) => setAddress({ ...address, city: event.target.value })} /><input required placeholder="State" value={address.state} onChange={(event) => setAddress({ ...address, state: event.target.value })} /></div><div className="two-fields"><input required placeholder="Postal code" value={address.zipCode} onChange={(event) => setAddress({ ...address, zipCode: event.target.value })} /><input required placeholder="Country" value={address.country} onChange={(event) => setAddress({ ...address, country: event.target.value })} /></div></>}
            {checkoutError && <p className="form-error">{checkoutError}</p>}
            <button className="button full-width" disabled={checkoutLoading}>{checkoutLoading ? 'Placing order...' : auth ? 'Place order' : 'Sign in to check out'}</button>
          </form>
        </aside>
      </div>
    </section>
  );
}

function CartLine({ item, onUpdateQuantity, onRemove }) {
  const { product, quantity, size } = item;
  return <article className="cart-line"><ProductImage product={product} className="cart-image" /><div className="cart-line-copy"><Link to={`/products/${product._id}`}><h2>{product.name}</h2></Link>{size && <p>Size: {size}</p>}<p>{currency.format(product.price)}</p><div className="quantity-picker"><button aria-label={`Reduce ${product.name} quantity`} onClick={() => onUpdateQuantity(product._id, quantity - 1)}>-</button><span>{quantity}</span><button aria-label={`Increase ${product.name} quantity`} disabled={quantity >= product.countInStock} onClick={() => onUpdateQuantity(product._id, quantity + 1)}>+</button></div></div><div className="cart-line-actions"><b>{currency.format(product.price * quantity)}</b><button className="text-button danger" onClick={() => onRemove(product._id)}>Remove</button></div></article>;
}

function AuthPage({ mode, onAuthenticate }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isRegister = mode === 'register';
  const submit = async (event) => {
    event.preventDefault();
    setError(''); setLoading(true);
    try { await onAuthenticate(isRegister ? 'register' : 'login', form); navigate(location.state?.from?.pathname || '/'); }
    catch (requestError) { setError(requestError.message); }
    finally { setLoading(false); }
  };
  return <section className="auth-shell"><form className="auth-card" onSubmit={submit}><Link className="brand auth-brand" to="/">Apparel <span>Artisan</span></Link><p className="eyebrow">{isRegister ? 'Join the studio' : 'Welcome back'}</p><h1>{isRegister ? 'Create your account' : 'Sign in to your account'}</h1>{isRegister && <label>Name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>}<label>Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label><label>Password<input required minLength="6" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>{error && <p className="form-error">{error}</p>}<button className="button full-width" disabled={loading}>{loading ? 'Please wait...' : isRegister ? 'Create account' : 'Sign in'}</button><p className="auth-switch">{isRegister ? 'Already a member?' : 'New here?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Sign in' : 'Create an account'}</Link></p></form></section>;
}

function OrdersPage({ auth, orders, loading, error }) {
  if (!auth) return <Navigate to="/login" replace state={{ from: { pathname: '/orders' } }} />;
  if (loading) return <div className="loading-state">Loading your orders...</div>;
  if (error) return <div className="notice error section">{error}</div>;
  return <section className="section orders-page"><div className="page-heading compact"><div><p className="eyebrow">Your account</p><h1>Order history</h1></div></div>{orders.length ? <div className="orders-list">{orders.map((order) => <article className="order-card" key={order._id}><div className="order-card-head"><div><p>Order #{order._id.slice(-6).toUpperCase()}</p><span>{new Date(order.createdAt).toLocaleDateString()}</span></div><b className="status-chip">{order.status}</b></div><div className="order-products">{order.items.map((item) => <div key={item._id || item.product}><span>{item.qty} x {item.name}</span><span>{currency.format(item.price * item.qty)}</span></div>)}</div><div className="order-total"><span>Total</span><b>{currency.format(order.totalAmount)}</b></div></article>)}</div> : <EmptyState title="No orders yet" detail="Your completed orders will appear here." action="Shop now" to="/products" />}</section>;
}

function EmptyState({ title, detail, action, to, onAction }) {
  const content = <><h1>{title}</h1><p>{detail}</p></>;
  return <section className="empty-state section">{content}{to ? <Link className="button" to={to}>{action}</Link> : <button className="button" onClick={onAction}>{action}</button>}</section>;
}

function AppContent() {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState('');
  const [auth, setAuth] = useState(() => { try { return JSON.parse(localStorage.getItem('apparelAuth')) || null; } catch { return null; } });
  const [cart, setCart] = useState(() => { try { return JSON.parse(localStorage.getItem('apparelCart')) || []; } catch { return []; } });
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => { apiRequest('/products').then(setProducts).catch((error) => setProductsError(error.message)).finally(() => setProductsLoading(false)); }, []);
  useEffect(() => { localStorage.setItem('apparelCart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => {
    if (!auth) { setOrders([]); return; }
    setOrdersLoading(true); setOrdersError('');
    apiRequest('/orders', {}, auth.token).then(setOrders).catch((error) => setOrdersError(error.message)).finally(() => setOrdersLoading(false));
  }, [auth]);
  useEffect(() => {
    if (!auth) return;
    apiRequest('/cart', {}, auth.token).then((serverCart) => {
      if (serverCart.items?.length) setCart(serverCart.items.map((item) => ({ product: item.product, quantity: item.qty, size: item.size || '' })));
    }).catch(() => {});
  }, [auth]);
  useEffect(() => { if (!notice) return undefined; const timer = window.setTimeout(() => setNotice(''), 3000); return () => window.clearTimeout(timer); }, [notice]);

  const addToCart = async (product, size = '') => {
    if (product.countInStock < 1) return;
    setCart((current) => {
      const existing = current.find((item) => item.product._id === product._id && item.size === size);
      if (existing && existing.quantity >= product.countInStock) return current;
      return existing ? current.map((item) => item === existing ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { product, quantity: 1, size }];
    });
    setNotice(`${product.name} added to your cart.`);
    if (auth) apiRequest('/cart/add', { method: 'POST', body: JSON.stringify({ productId: product._id, qty: 1 }) }, auth.token).catch((error) => setNotice(error.message));
  };
  const updateQuantity = (productId, quantity) => {
    setCart((current) => current.flatMap((item) => item.product._id !== productId ? [item] : quantity > 0 ? [{ ...item, quantity }] : []));
    if (auth) apiRequest(`/cart/update/${productId}`, { method: 'PUT', body: JSON.stringify({ qty: quantity }) }, auth.token).catch((error) => setNotice(error.message));
  };
  const removeFromCart = (productId) => {
    setCart((current) => current.filter((item) => item.product._id !== productId));
    if (auth) apiRequest(`/cart/remove/${productId}`, { method: 'DELETE' }, auth.token).catch((error) => setNotice(error.message));
  };
  const authenticate = async (path, form) => {
    const data = await apiRequest(`/auth/${path}`, { method: 'POST', body: JSON.stringify(form) });
    const nextAuth = { token: data.token, user: { _id: data._id, name: data.name, email: data.email, role: data.role } };
    if (cart.length) await Promise.all(cart.map((item) => apiRequest('/cart/add', { method: 'POST', body: JSON.stringify({ productId: item.product._id, qty: item.quantity }) }, nextAuth.token)));
    setAuth(nextAuth); localStorage.setItem('apparelAuth', JSON.stringify(nextAuth));
  };
  const logout = () => { setAuth(null); localStorage.removeItem('apparelAuth'); setNotice('You have been signed out.'); };
  const checkout = async (shippingAddress) => {
    setCheckoutError(''); setCheckoutLoading(true);
    try { const order = await apiRequest('/orders', { method: 'POST', body: JSON.stringify({ shippingAddress }) }, auth.token); setCart([]); setOrders((current) => [order, ...current]); setNotice('Your order has been placed.'); }
    catch (error) { setCheckoutError(error.message); }
    finally { setCheckoutLoading(false); }
  };
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return <div className="app-shell"><Header auth={auth} cartCount={cartCount} onLogout={logout} />{notice && <div className="toast" role="status">{notice}</div>}<main><Routes><Route path="/" element={<HomePage />} /><Route path="/products" element={<ProductListPage products={products} loading={productsLoading} error={productsError} onAddToCart={addToCart} />} /><Route path="/products/:id" element={<ProductDetailPage products={products} loading={productsLoading} onAddToCart={addToCart} />} /><Route path="/cart" element={<CartPage cart={cart} auth={auth} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} onCheckout={checkout} checkoutError={checkoutError} checkoutLoading={checkoutLoading} />} /><Route path="/login" element={<AuthPage mode="login" onAuthenticate={authenticate} />} /><Route path="/register" element={<AuthPage mode="register" onAuthenticate={authenticate} />} /><Route path="/orders" element={<OrdersPage auth={auth} orders={orders} loading={ordersLoading} error={ordersError} />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></main><footer>Apparel Artisan / Thoughtful apparel for everyday originals.</footer></div>;
}

export default function App() { return <AppContent />; }
