"use client";

import { FormEvent, useMemo, useState } from "react";

type Product = {
  id: string;
  name: string;
  Assamese: string;
  category: "Fresh" | "Pantry" | "Craft";
  price: number;
  unit: string;
  image: string;
  note: string;
  tag: string;
  minimum?: string;
};

const products: Product[] = [
  {
    id: "kaji-nemu",
    name: "Kaji Nemu Farm Box",
    Assamese: "কাজি নেমু",
    category: "Fresh",
    price: 1399,
    unit: "10 kg crate",
    image: "/images/kaji-nemu.jpg",
    note: "Fragrant, juicy Assam lemons graded and packed for families, kitchens, shops and hospitality buyers.",
    tag: "10 kg minimum",
    minimum: "Minimum order: one 10 kg crate",
  },
  {
    id: "dhekia-xaak",
    name: "Dhekia Xaak",
    Assamese: "ঢেকীয়া শাক",
    category: "Fresh",
    price: 179,
    unit: "1 kg harvest pack",
    image: "/images/dhekia-fresh-2.jpg",
    note: "Tender seasonal fiddlehead greens, cleaned and bundled for traditional Assamese cooking.",
    tag: "Seasonal green",
  },
  {
    id: "bhut-jolokia",
    name: "Bhut Jolokia",
    Assamese: "ভূত জলকীয়া",
    category: "Fresh",
    price: 249,
    unit: "250 g pack",
    image: "/images/bhut-jolokia.jpg",
    note: "A fiercely hot chilli for experienced kitchens, packed in a small, clearly marked batch.",
    tag: "Handle with care",
  },
  {
    id: "lai-xaak",
    name: "Lai Xaak",
    Assamese: "লাই শাক",
    category: "Fresh",
    price: 149,
    unit: "1 kg harvest pack",
    image: "/images/lai-xaak.jpg",
    note: "Peppery mustard greens harvested for curries, stir-fries and comforting bowls of rice.",
    tag: "Field fresh",
  },
  {
    id: "banana-blossom",
    name: "Kol Dil",
    Assamese: "কলডিল",
    category: "Fresh",
    price: 189,
    unit: "2 blossom pack",
    image: "/images/banana-flower.jpg",
    note: "Fresh banana blossom for fibre-rich Assamese preparations and inventive modern kitchens.",
    tag: "Village kitchen",
  },
  {
    id: "assam-tea",
    name: "Small Grower Assam Tea",
    Assamese: "অসম চাহ",
    category: "Pantry",
    price: 349,
    unit: "250 g pack",
    image: "/images/assam-tea.jpg",
    note: "A bold everyday tea, packed close to origin for a fresher cup.",
    tag: "Garden fresh",
  },
  {
    id: "forest-honey",
    name: "Forest Blossom Honey",
    Assamese: "বনৰ মৌ",
    category: "Pantry",
    price: 449,
    unit: "500 g jar",
    image: "/images/honey.jpg",
    note: "Small-batch honey with natural seasonal variation in colour and flavour.",
    tag: "Small batch",
  },
  {
    id: "ginger-turmeric",
    name: "Ginger + Turmeric Roots",
    Assamese: "আদা-হালধি",
    category: "Pantry",
    price: 399,
    unit: "2 kg mixed pack",
    image: "/images/ginger-turmeric.jpg",
    note: "Earthy, aromatic roots for everyday cooking, pickling, tea blends and food makers.",
    tag: "Root cellar",
  },
  {
    id: "bamboo-shoot-pickle",
    name: "Bamboo Shoot Pickle",
    Assamese: "বাঁহ গাজৰ আচাৰ",
    category: "Pantry",
    price: 329,
    unit: "400 g jar",
    image: "/images/bamboo-shoot.jpg",
    note: "A sharp, savoury small-batch pickle inspired by Northeast India's bamboo shoot traditions.",
    tag: "Fermented flavour",
  },
  {
    id: "handwoven-gamusa",
    name: "Handwoven Gamusa",
    Assamese: "হাতেবোৱা গামোচা",
    category: "Craft",
    price: 799,
    unit: "1 piece",
    image: "/images/handloom.jpg",
    note: "A presentation-worthy textile made through Assam's living handloom tradition.",
    tag: "Made by hand",
  },
];

const categories = ["All", "Fresh", "Pantry", "Craft"] as const;

export default function Home() {
  const [filter, setFilter] = useState<(typeof categories)[number]>("All");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);

  const visibleProducts = filter === "All" ? products : products.filter((product) => product.category === filter);
  const cartItems = products.filter((product) => cart[product.id]).map((product) => ({ ...product, quantity: cart[product.id] }));
  const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [cartItems]);

  function addToCart(id: string) {
    setCart((current) => ({ ...current, [id]: (current[id] || 0) + 1 }));
    setCartOpen(true);
    setSent(false);
  }

  function changeQuantity(id: string, change: number) {
    setCart((current) => {
      const next = Math.max(0, (current[id] || 0) + change);
      const updated = { ...current, [id]: next };
      if (!next) delete updated[id];
      return updated;
    });
  }

  function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <main>
      <div className="announcement">An ecommerce platform from Golaghat <span>•</span> Khumtai&apos;s Kaji Nemu, first</div>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Khumtai Market home">
          <span className="brand-mark">K</span>
          <span><strong>Khumtai</strong><small>Market · Golaghat</small></span>
        </a>
        <button className="menu-button" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "Close" : "Menu"}</button>
        <nav className={menuOpen ? "nav-open" : ""} aria-label="Main navigation">
          <a href="#shop" onClick={closeMenu}>Shop</a>
          <a href="#story" onClick={closeMenu}>Our story</a>
          <a href="#plan" onClick={closeMenu}>How it works</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
        </nav>
        <button className="cart-button" onClick={() => setCartOpen(true)} aria-label={`Open cart with ${cartCount} items`}>
          Cart <span>{String(cartCount).padStart(2, "0")}</span>
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">খুমটাইৰ কাজি নেমু · 10 kg farm crates</p>
          <h1>Kaji Nemu.<br /><em>Fresh from Khumtai.</em><br />Ready to travel.</h1>
          <p className="hero-text">The signature lemon of Khumtai leads this ecommerce platform from Golaghat—graded into 10 kg farm crates for families, shops, restaurants and hospitality buyers.</p>
          <div className="hero-actions">
            <a className="button primary" href="#shop">Enter the Khumtai market <span>↗</span></a>
            <a className="text-link" href="#plan">See how it works <span>↓</span></a>
          </div>
          <div className="hero-proof">
            <span className="proof-number">10</span>
            <span>kg minimum<br />one farm crate</span>
          </div>
        </div>
        <div className="hero-visual">
          <img src="/images/kaji-nemu.jpg" alt="Green lemons growing on a leafy branch" />
          <div className="image-label"><span>Signature product</span> Kaji Nemu<br />Khumtai, Golaghat</div>
          <div className="origin-stamp"><strong>Grown in Assam</strong><span>Origin · Aroma · Identity</span></div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Store promises">
        <span>10 kg lemon minimum</span><i>✦</i><span>Clearly graded</span><i>✦</i><span>Carefully packed</span><i>✦</i><span>Directly connected</span>
      </section>

      <section className="nemu-focus" aria-label="Kaji Nemu ordering highlights">
        <div className="nemu-intro"><p className="eyebrow">The product that leads the market</p><h2>One remarkable<br /><em>lemon.</em></h2></div>
        <div className="nemu-promise"><p>Kaji Nemu is not buried inside a general catalogue. It is the first product, the strongest visual identity and the starting point for every Khumtai Market buyer relationship.</p><div className="nemu-facts"><div><span>01</span><strong>10 kg</strong><small>Minimum farm crate</small></div><div><span>02</span><strong>Fresh</strong><small>Availability confirmed before payment</small></div><div><span>03</span><strong>Flexible</strong><small>One crate to recurring bulk orders</small></div></div></div>
      </section>

      <section className="shop section" id="shop">
        <div className="section-heading">
          <div><p className="eyebrow">Kaji Nemu first · 9 more Assamese goods</p><h2>The lemon leads.<br />Assam follows.</h2></div>
          <p>Begin with Khumtai&apos;s 10 kg Kaji Nemu crate, then discover fresh greens, powerful chillies, roots, pantry staples and living craft from across Assam.</p>
        </div>
        <div className="filters" role="group" aria-label="Filter products">
          {categories.map((category) => <button key={category} className={filter === category ? "active" : ""} onClick={() => setFilter(category)}>{category}</button>)}
        </div>
        <div className="product-grid">
          {visibleProducts.map((product, index) => (
            <article className="product-card" key={product.id}>
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                <span className="product-tag">{product.tag}</span>
                <span className="product-index">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="product-info">
                <div><p className="assamese-name">{product.Assamese}</p><h3>{product.name}</h3></div>
                <p className="product-note">{product.note}</p>
                {product.minimum && <p className="minimum-note">{product.minimum}</p>}
                <div className="product-buy">
                  <p><strong>₹{product.price}</strong><span>{product.unit}</span></p>
                  <button onClick={() => addToCart(product.id)} aria-label={`Add ${product.name} to cart`}>Add <span>+</span></button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="price-note">Kaji Nemu starts at one 10 kg crate. Prices are indicative; final availability, grade, delivery area and shipping charge will be confirmed before payment.</p>
      </section>

      <section className="story" id="story">
        <div className="story-image"><img src="/images/assam-tea.jpg" alt="Hands plucking fresh green tea leaves" /><span>Small growers. One strong market face.</span></div>
        <div className="story-copy">
          <p className="eyebrow light">Why Khumtai Market</p>
          <h2>Not another middleman.<br /><em>A shared market layer.</em></h2>
          <p>Local producers already know how to grow and make exceptional things. The missing layer is often consistent grading, presentation, digital discovery and a dependable route to the buyer.</p>
          <blockquote>“One place where origin is visible, quality is clear, and every order can be traced back to the local value chain.”</blockquote>
          <a href="#plan" className="button lime">See how the model works <span>↘</span></a>
        </div>
      </section>

      <section className="plan section" id="plan">
        <div className="plan-title">
          <p className="eyebrow">The Khumtai growth plan</p>
          <h2>Build the market<br />around the harvest.</h2>
          <p>This website is the customer-facing layer of a practical local commerce system. The supply network will begin as a focused pilot and grow from verified demand.</p>
        </div>
        <div className="system-flow">
          {[
            ["01", "Collect", "Onboard producers and map seasonal supply."],
            ["02", "Grade", "Create simple, visible quality standards."],
            ["03", "Pack", "Use a shared Khumtai identity and practical packaging."],
            ["04", "Sell", "Reach households, institutions and wholesale buyers."],
            ["05", "Learn", "Track orders, repeat demand and producer feedback."],
          ].map(([number, title, copy]) => <div className="flow-step" key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></div>)}
        </div>
        <div className="pilot-plan">
          <div className="pilot-lead"><span>90-day launch plan</span><h3>Start narrow.<br />Prove demand.<br />Scale what works.</h3></div>
          <ol>
            <li><span>Weeks 1–3</span><strong>Verify</strong><p>Confirm producer group, product grades, packing method and responsible operator.</p></li>
            <li><span>Weeks 4–6</span><strong>Launch</strong><p>Open a limited delivery area with the 10 kg Kaji Nemu crate as the lead product.</p></li>
            <li><span>Weeks 7–12</span><strong>Measure</strong><p>Review fulfilment, repeat orders, wastage, buyer feedback and producer economics.</p></li>
          </ol>
        </div>
      </section>

      <section className="outcomes">
        <div className="outcomes-copy"><p className="eyebrow light">What success should look like</p><h2>A better route<br />from village<br />to value.</h2><p>Measure the pilot by evidence—not slogans. These are the outcomes the system should be designed to test.</p></div>
        <div className="outcome-grid">
          <div><span>01</span><h3>Producer visibility</h3><p>Make origin, maker and growing region part of the product—not invisible background.</p></div>
          <div><span>02</span><h3>Lower avoidable loss</h3><p>Match harvest windows with pre-orders, grading and clearer demand signals.</p></div>
          <div><span>03</span><h3>Market confidence</h3><p>Build repeat buying through consistent quality, packaging and communication.</p></div>
          <div><span>04</span><h3>Local capability</h3><p>Create practical roles in aggregation, packing, catalogue work and fulfilment.</p></div>
        </div>
      </section>

      <section className="buyer-banner" id="contact">
        <p className="eyebrow">For families & groups · retailers · hotels · institutions</p>
        <h2>Need 10 kg or more?</h2>
        <p>Start with one lemon crate or tell us your larger weekly requirement. The request helps us plan harvest, packing and delivery.</p>
        <button className="button dark" onClick={() => setCartOpen(true)}>Start a buyer request <span>↗</span></button>
      </section>

      <footer>
        <div className="footer-brand"><span className="brand-mark">K</span><h2>Khumtai Market</h2><p>অসমৰ সোৱাদ, আপোনাৰ দুৱাৰত।<br />An ecommerce platform from Golaghat.</p></div>
        <div><h4>Explore</h4><a href="#shop">Shop</a><a href="#story">Our story</a><a href="#plan">How it works</a></div>
        <div><h4>Our promise</h4><p>Visible origin<br />Clear quality<br />Careful packing<br />Direct connection</p></div>
        <div><h4>Status</h4><p>Presentation prototype<br />11 August 2026</p></div>
        <p className="copyright">© 2026 Khumtai Market concept. Product supply, prices and partner details require local verification.</p>
      </footer>

      {cartOpen && <div className="drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }}>
        <aside className="cart-drawer" aria-label="Shopping cart" aria-modal="true" role="dialog">
          <div className="drawer-head"><div><p className="eyebrow">Your request</p><h2>Market basket</h2></div><button onClick={() => setCartOpen(false)} aria-label="Close cart">×</button></div>
          {sent ? <div className="success-message"><span>✓</span><h3>Request captured for the demo.</h3><p>In the live pilot, this step will send the order to the Khumtai fulfilment team for availability and delivery confirmation.</p><button className="button primary" onClick={() => { setSent(false); setCartOpen(false); }}>Continue exploring</button></div> : cartItems.length ? <>
            <div className="cart-items">{cartItems.map((item) => <div className="cart-item" key={item.id}><img src={item.image} alt="" /><div><strong>{item.name}</strong><span>₹{item.price} · {item.unit}</span><div className="quantity"><button onClick={() => changeQuantity(item.id, -1)} aria-label={`Remove one ${item.name}`}>−</button><b>{item.quantity}</b><button onClick={() => changeQuantity(item.id, 1)} aria-label={`Add one ${item.name}`}>+</button></div></div><strong>₹{item.price * item.quantity}</strong></div>)}</div>
            <div className="subtotal"><span>Indicative subtotal</span><strong>₹{subtotal}</strong></div>
            <form onSubmit={submitOrder} className="order-form"><label>Name<input required name="name" placeholder="Your name" /></label><label>Phone<input required name="phone" type="tel" placeholder="10-digit mobile number" pattern="[0-9 +()-]{10,}" /></label><label>Delivery location<input required name="location" placeholder="Town / city / PIN" /></label><button className="button primary" type="submit">Request availability <span>↗</span></button><small>No payment is taken in this presentation prototype.</small></form>
          </> : <div className="empty-cart"><span>○</span><h3>Your basket is empty.</h3><p>Add a product to create a sample order request.</p><button className="button primary" onClick={() => { setCartOpen(false); document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); }}>Explore the collection</button></div>}
        </aside>
      </div>}
    </main>
  );
}
