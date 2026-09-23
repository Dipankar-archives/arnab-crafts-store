'use client';

import { useEffect, useMemo, useState } from 'react';

type Product = {
  id: string;
  name: string;
  price: number;
  size: string;
  color: string;
  imageUrl: string;
  description: string;
};

type CartItem = Product & { quantity: number };

const defaultProducts: Product[] = [
  {
    id: 'walnut-classic',
    name: 'Classic Walnut Frame',
    price: 149,
    size: 'A4',
    color: 'Walnut',
    imageUrl: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80',
    description: 'Warm walnut finish for homes, gifting, and memorable family photos.'
  },
  {
    id: 'black-minimal',
    name: 'Black Minimal Frame',
    price: 299,
    size: 'A3',
    color: 'Black',
    imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
    description: 'A sleek black frame designed for clean, premium wall displays.'
  },
  {
    id: 'gold-royal',
    name: 'Royal Gold Frame',
    price: 499,
    size: 'Large',
    color: 'Golden',
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    description: 'Statement gold finish ideal for anniversaries, weddings, and gifts.'
  },
  {
    id: 'oak-family',
    name: 'Natural Oak Frame',
    price: 699,
    size: 'A2',
    color: 'Natural Oak',
    imageUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
    description: 'Natural oak texture with a warm, handcrafted feel.'
  },
  {
    id: 'white-gallery',
    name: 'White Gallery Frame',
    price: 249,
    size: '18x12',
    color: 'White',
    imageUrl: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
    description: 'Bright white finish for clean and minimal décor styling.'
  },
  {
    id: 'rosewood-collection',
    name: 'Rosewood Frame',
    price: 899,
    size: 'Large',
    color: 'Rosewood',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80',
    description: 'Luxurious rosewood style for premium portraits and special moments.'
  }
];

const defaultSettings = {
  siteName: 'Arnab Crafts',
  contactPhone: '+91 91013 87479',
  whatsappNumber: '+91 91013 87479'
};

const storage = {
  products: 'arnabCraftsProducts',
  cart: 'arnabCraftsCart',
  customers: 'arnabCraftsCustomers',
  admin: 'arnabCraftsAdmin',
  settings: 'arnabCraftsSettings',
  session: 'arnabCraftsSession'
};

function readJSON(key: string, fallback: any) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: any) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function currency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
}

export default function Storefront() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [priceLimit, setPriceLimit] = useState(4200);
  const [sizeFilter, setSizeFilter] = useState('all');
  const [colorFilter, setColorFilter] = useState('all');
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    address: ''
  });

  const [adminPassword, setAdminPassword] = useState('arnabcrafts@123');
  const [settings, setSettings] = useState(defaultSettings);
  const [customer, setCustomer] = useState<{ name: string; email: string; phone: string } | null>(null);

  useEffect(() => {
    const savedProducts = readJSON(storage.products, defaultProducts);
    const savedCart = readJSON(storage.cart, []);
    const savedAdmin = readJSON(storage.admin, 'arnabcrafts@123');
    const savedSettings = readJSON(storage.settings, defaultSettings);
    const activeCustomer = readJSON(storage.session, null);

    setProducts(savedProducts);
    setCart(savedCart);
    setAdminPassword(savedAdmin);
    setSettings(savedSettings);
    setCustomer(activeCustomer);
    writeJSON(storage.products, savedProducts);
    writeJSON(storage.cart, savedCart);
    writeJSON(storage.admin, savedAdmin);
    writeJSON(storage.settings, savedSettings);
  }, []);

  useEffect(() => {
    writeJSON(storage.cart, cart);
  }, [cart]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const visibleProducts = useMemo(() => {
    return products.filter((product) => {
      const withinPrice = product.price <= priceLimit;
      const matchesSize = sizeFilter === 'all' || product.size === sizeFilter;
      const matchesColor = colorFilter === 'all' || product.color === colorFilter;
      return withinPrice && matchesSize && matchesColor;
    });
  }, [products, priceLimit, sizeFilter, colorFilter]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addToCart = (product: Product) => {
    setCart((items) => {
      const existing = items.find((item) => item.id === product.id);
      if (existing) {
        return items.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...items, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
    setToast(`${product.name} added to cart.`);
  };

  const removeItem = (productId: string) => {
    setCart((items) => items.filter((item) => item.id !== productId));
    setToast('Item removed from cart.');
  };

  const placeOrder = () => {
    if (!cart.length) {
      setToast('Your cart is empty.');
      return;
    }
    if (!customer) {
      setAuthOpen(true);
      setToast('Please register or login to place your order.');
      return;
    }

    const message = `Hello Arnab Crafts,%0A%0AOrder for ${customer.name}%0APhone: ${customer.phone}%0AAddress: ${form.address || 'To be confirmed'}%0A%0A${cart.map((item) => `- ${item.name} x${item.quantity} (${item.size}, ${item.color})`).join('%0A')}`;
    window.open(`https://wa.me/919101387479?text=${message}`, '_blank');
    setCart([]);
    setCartOpen(false);
    setToast('Order placed. WhatsApp confirmation opened.');
  };

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    const customers = readJSON(storage.customers, []);
    const match = customers.find((person: any) => {
      const samePhone = person.phone === form.phone || person.email === form.email;
      return samePhone && person.password === form.password;
    });

    if (!match) {
      setToast('Invalid login details. Please register first.');
      return;
    }

    setCustomer({ name: match.name, email: match.email, phone: match.phone });
    writeJSON(storage.session, { name: match.name, email: match.email, phone: match.phone });
    setAuthOpen(false);
    setToast(`Welcome back, ${match.name}!`);
  };

  const handleRegister = (event: React.FormEvent) => {
    event.preventDefault();
    const customers = readJSON(storage.customers, []);

    if (customers.some((person: any) => person.email === form.email || person.phone === form.phone)) {
      setToast('A customer with this email or phone already exists.');
      return;
    }

    const customerData = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password
    };

    customers.push(customerData);
    writeJSON(storage.customers, customers);
    writeJSON(storage.session, { name: form.name, email: form.email, phone: form.phone });
    setCustomer({ name: form.name, email: form.email, phone: form.phone });
    setAuthOpen(false);
    setToast('Registration successful. You can order now.');
  };

  const handleAdminLogin = (event: React.FormEvent) => {
    event.preventDefault();
    const entered = (document.getElementById('admin-password') as HTMLInputElement)?.value || '';
    if (entered === adminPassword) {
      setDashboardOpen(true);
      setToast('Seller dashboard opened.');
    } else {
      setToast('Incorrect seller password.');
    }
  };

  const saveSettings = (event: React.FormEvent) => {
    event.preventDefault();
    const siteName = (document.getElementById('site-name') as HTMLInputElement)?.value || settings.siteName;
    const contactPhone = (document.getElementById('contact-phone') as HTMLInputElement)?.value || settings.contactPhone;
    const whatsappNumber = (document.getElementById('whatsapp-number') as HTMLInputElement)?.value || settings.whatsappNumber;
    const newPassword = (document.getElementById('new-admin-password') as HTMLInputElement)?.value || '';

    const nextSettings = { siteName, contactPhone, whatsappNumber };
    setSettings(nextSettings);
    writeJSON(storage.settings, nextSettings);

    if (newPassword.trim()) {
      setAdminPassword(newPassword.trim());
      writeJSON(storage.admin, newPassword.trim());
    }

    setToast('Settings updated successfully.');
    setDashboardOpen(false);
  };

  const addProduct = (event: React.FormEvent) => {
    event.preventDefault();
    const productName = (document.getElementById('product-name') as HTMLInputElement)?.value.trim();
    const productPrice = Number((document.getElementById('product-price') as HTMLInputElement)?.value || 0);
    const productSize = (document.getElementById('product-size') as HTMLSelectElement)?.value || 'A4';
    const productColor = (document.getElementById('product-color') as HTMLSelectElement)?.value || 'Walnut';
    const productImage = (document.getElementById('product-image') as HTMLInputElement)?.value.trim();

    if (!productName || !productImage || !productPrice) {
      setToast('Please enter all product details.');
      return;
    }

    const newProduct: Product = {
      id: `${Date.now()}`,
      name: productName,
      price: productPrice,
      size: productSize,
      color: productColor,
      imageUrl: productImage,
      description: `${productColor} ${productSize} frame for custom art and gifting.`
    };

    const updated = [newProduct, ...products];
    setProducts(updated);
    writeJSON(storage.products, updated);
    setToast('New product added.');
    (event.target as HTMLFormElement).reset();
  };

  return (
    <>
      <header className="topbar">
        <div className="container nav">
          <div className="brand">
            <div className="brand-mark">AC</div>
            <div className="brand-text">
              <p>Custom handmade</p>
              <h1>{settings.siteName}</h1>
            </div>
          </div>

          <nav className="main-nav">
            <a href="#home" className="nav-link">Home</a>
            <a href="#shop" className="nav-link">Shop</a>
            <a href="#filters" className="nav-link">Filters</a>
            <a href="#contact" className="nav-link">Contact</a>
            <button className="nav-button" onClick={() => setAuthOpen(true)}>{customer ? 'My Account' : 'Login / Register'}</button>
            <button className="nav-button" onClick={() => setDashboardOpen(true)}>Seller Login</button>
          </nav>

          <button className="cart-button" onClick={() => setCartOpen(true)}>
            <span>Cart</span>
            <span className="badge">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
          </button>
        </div>
      </header>

      <main id="home">
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">Custom photo frames</p>
              <h2>Turn your moments into timeless art.</h2>
              <p>
                Personalized handcrafted photo frames made for weddings, anniversaries, gifting,
                home décor, and family memories. Starting price only ₹149 and available in A4 to large sizes.
              </p>
              <div className="hero-actions">
                <a href="#shop" className="primary-btn">Shop Frames</a>
                <a href="https://wa.me/919101387479" target="_blank" rel="noreferrer" className="secondary-btn">WhatsApp Order</a>
              </div>

              <div className="stats">
                <div>
                  <strong>₹149</strong>
                  <span>Starting price</span>
                </div>
                <div>
                  <strong>A4 to Large</strong>
                  <span>Size options</span>
                </div>
                <div>
                  <strong>Custom</strong>
                  <span>Photo framing</span>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="image-card">
                <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80" alt="Decorative custom frame display" />
              </div>
            </div>
          </div>
        </section>

        <section className="container features">
          <div className="feature-card">
            <span>01</span>
            <h3>Customized Designs</h3>
            <p>Choose size, finish, and color for your own personalized frame.</p>
          </div>
          <div className="feature-card">
            <span>02</span>
            <h3>Premium Materials</h3>
            <p>Strong wood finishes and polished designs made to last.</p>
          </div>
          <div className="feature-card">
            <span>03</span>
            <h3>Wide Size Range</h3>
            <p>From compact A4 frames to large wall statement sizes.</p>
          </div>
        </section>

        <section className="shop" id="shop">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Collection</p>
                <h2>Choose your perfect frame</h2>
              </div>
              <p>Custom-made for home décor, gifting, and keepsakes.</p>
            </div>

            <div className="filter-panel" id="filters">
              <div className="filter-box">
                <label htmlFor="priceRange">Price range</label>
                <input id="priceRange" type="range" min="149" max="4200" value={priceLimit} onChange={(e) => setPriceLimit(Number(e.target.value))} />
                <div className="filter-values">
                  <span>₹149</span>
                  <strong>Up to {currency(priceLimit)}</strong>
                </div>
              </div>

              <div className="filter-box">
                <label htmlFor="sizeRange">Frame size</label>
                <select id="sizeRange" value={sizeFilter} onChange={(e) => setSizeFilter(e.target.value)}>
                  <option value="all">All sizes</option>
                  <option value="A4">A4</option>
                  <option value="A3">A3</option>
                  <option value="A2">A2</option>
                  <option value="18x12">18x12</option>
                  <option value="Large">Large</option>
                </select>
              </div>

              <div className="filter-box">
                <label htmlFor="colorRange">Frame color</label>
                <select id="colorRange" value={colorFilter} onChange={(e) => setColorFilter(e.target.value)}>
                  <option value="all">All colors</option>
                  <option value="Walnut">Walnut</option>
                  <option value="Black">Black</option>
                  <option value="White">White</option>
                  <option value="Golden">Golden</option>
                  <option value="Natural Oak">Natural Oak</option>
                  <option value="Rosewood">Rosewood</option>
                </select>
              </div>
            </div>

            <div className="product-grid">
              {visibleProducts.map((product) => (
                <article className="product-card" key={product.id}>
                  <img src={product.imageUrl} alt={product.name} />
                  <div className="product-body">
                    <div className="product-header">
                      <h3>{product.name}</h3>
                      <div className="product-price">{currency(product.price)}</div>
                    </div>
                    <div className="product-meta">
                      <span className="meta-pill">{product.size}</span>
                      <span className="meta-pill">{product.color}</span>
                    </div>
                    <p style={{ color: '#605d57', lineHeight: 1.7 }}>{product.description}</p>
                    <div className="product-actions">
                      <button className="add-cart" onClick={() => addToCart(product)}>Add to cart</button>
                      <button className="buy-now" onClick={() => { addToCart(product); setCartOpen(true); }}>Buy now</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="why-us container">
          <div className="section-heading" style={{ marginBottom: 24 }}>
            <div>
              <p className="eyebrow">Why choose us</p>
              <h2>Built to make memories feel premium.</h2>
            </div>
          </div>

          <div className="benefits">
            <div className="benefit">
              <h3>Premium finishes</h3>
              <p>From warm walnut to polished black and classic gold, each frame is crafted to stand out.</p>
            </div>
            <div className="benefit">
              <h3>Gift-ready pieces</h3>
              <p>Perfect for weddings, anniversaries, birthdays, and thoughtful keepsakes.</p>
            </div>
            <div className="benefit">
              <h3>Payments available</h3>
              <p>Choose UPI, cards, net banking, wallet, Razorpay-ready checkout, or cash on delivery.</p>
            </div>
          </div>
        </section>

        <section id="contact" className="container contact-wrap">
          <div className="contact-box">
            <div className="contact-copy">
              <p className="eyebrow">Contact us</p>
              <h2>Order your custom frame</h2>
              <ul>
                <li>Phone: {settings.contactPhone}</li>
                <li>WhatsApp: {settings.whatsappNumber}</li>
                <li>Owner: Arnab Crafts</li>
                <li>Delivery: India-wide</li>
              </ul>
            </div>

            <div className="contact-actions">
              <a href="tel:+919101387479" className="primary-btn">Call now</a>
              <a href="https://wa.me/919101387479" target="_blank" rel="noreferrer" className="secondary-btn">Message on WhatsApp</a>
            </div>
          </div>
        </section>
      </main>

      <aside className={`cart-panel ${cartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>Your cart</h3>
          <button className="close-btn" onClick={() => setCartOpen(false)} aria-label="Close cart">×</button>
        </div>

        <ul className="cart-items">
          {cart.length === 0 ? <li style={{ color: '#605d57' }}>Your cart is empty.</li> : cart.map((item) => (
            <li key={item.id} className="cart-item">
              <img src={item.imageUrl} alt={item.name} />
              <div>
                <h4>{item.name}</h4>
                <p>{item.size} • {item.color}</p>
                <p>{currency(item.price)} × {item.quantity}</p>
              </div>
              <button onClick={() => removeItem(item.id)}>×</button>
            </li>
          ))}
        </ul>

        <div className="cart-footer">
          <span>Total</span>
          <span className="cart-total">{currency(total)}</span>
        </div>

        <div className="cart-footer" style={{ borderBottom: 'none', paddingTop: 12 }}>
          <button className="primary-btn full-width" onClick={placeOrder}>Proceed to order</button>
        </div>
      </aside>

      {authOpen && (
        <div className="modal">
          <div className="modal-card">
            <button className="close-btn" style={{ position: 'absolute', right: 18, top: 18 }} onClick={() => setAuthOpen(false)} aria-label="Close auth form">×</button>
            <div className="auth-header">
              <button className={`auth-tab ${authTab === 'login' ? 'active' : ''}`} onClick={() => setAuthTab('login')}>Login</button>
              <button className={`auth-tab ${authTab === 'register' ? 'active' : ''}`} onClick={() => setAuthTab('register')}>Register</button>
            </div>

            {authTab === 'login' ? (
              <form className="auth-form" onSubmit={handleLogin}>
                <label>
                  Phone or email
                  <input className="form-control" value={form.phone || form.email} onChange={(e) => setForm({ ...form, phone: e.target.value, email: e.target.value })} placeholder="Enter phone or email" required />
                </label>
                <label>
                  Password
                  <input className="form-control" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" required />
                </label>
                <button className="primary-btn full-width" type="submit">Login</button>
              </form>
            ) : (
              <form className="auth-form" onSubmit={handleRegister}>
                <div className="form-row">
                  <label>
                    Full name
                    <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" required />
                  </label>
                  <label>
                    Phone
                    <input className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98xxx" required />
                  </label>
                </div>
                <label>
                  Email
                  <input className="form-control" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required />
                </label>
                <label>
                  Password
                  <input className="form-control" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Create a password" required />
                </label>
                <button className="primary-btn full-width" type="submit">Register</button>
              </form>
            )}
          </div>
        </div>
      )}

      {dashboardOpen && (
        <div className="modal">
          <div className="modal-card dashboard-card">
            <button className="close-btn" style={{ position: 'absolute', right: 18, top: 18 }} onClick={() => setDashboardOpen(false)} aria-label="Close dashboard">×</button>
            <div className="dashboard-head">
              <h3>Seller dashboard</h3>
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-panel">
                <h4>Seller login</h4>
                <form className="dashboard-form" onSubmit={handleAdminLogin}>
                  <label>
                    Seller password
                    <input id="admin-password" className="form-control" type="password" placeholder="Enter password" required />
                  </label>
                  <button className="primary-btn full-width" type="submit">Open dashboard</button>
                </form>
              </div>

              <div className="dashboard-panel">
                <h4>Owner settings</h4>
                <form className="dashboard-form" onSubmit={saveSettings}>
                  <label>
                    Website name
                    <input id="site-name" className="form-control" defaultValue={settings.siteName} />
                  </label>
                  <label>
                    Contact number
                    <input id="contact-phone" className="form-control" defaultValue={settings.contactPhone} />
                  </label>
                  <label>
                    WhatsApp number
                    <input id="whatsapp-number" className="form-control" defaultValue={settings.whatsappNumber} />
                  </label>
                  <label>
                    New admin password
                    <input id="new-admin-password" className="form-control" type="password" placeholder="Change password" />
                  </label>
                  <button className="primary-btn full-width" type="submit">Save settings</button>
                </form>
              </div>
            </div>

            <div className="dashboard-panel" style={{ marginTop: 18 }}>
              <h4>Add a new product</h4>
              <form className="dashboard-form" onSubmit={addProduct}>
                <div className="form-row">
                  <label>
                    Product name
                    <input id="product-name" className="form-control" placeholder="e.g. Solid Pine Frame" required />
                  </label>
                  <label>
                    Price (₹)
                    <input id="product-price" className="form-control" type="number" min="149" placeholder="149" required />
                  </label>
                </div>

                <div className="form-row">
                  <label>
                    Size
                    <select id="product-size" className="form-control">
                      <option value="A4">A4</option>
                      <option value="A3">A3</option>
                      <option value="A2">A2</option>
                      <option value="18x12">18x12</option>
                      <option value="Large">Large</option>
                    </select>
                  </label>
                  <label>
                    Color
                    <select id="product-color" className="form-control">
                      <option value="Walnut">Walnut</option>
                      <option value="Black">Black</option>
                      <option value="White">White</option>
                      <option value="Golden">Golden</option>
                      <option value="Natural Oak">Natural Oak</option>
                      <option value="Rosewood">Rosewood</option>
                    </select>
                  </label>
                </div>

                <label>
                  Image URL
                  <input id="product-image" className="form-control" type="url" placeholder="https://..." required />
                </label>

                <button className="primary-btn full-width" type="submit">Add product</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>}
    </>
  );
}
