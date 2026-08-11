"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

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
    note: "Bright aroma, generous juice—graded and packed into a 10 kg Golaghat farm crate.",
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
    note: "Tender fiddlehead greens, gathered at their seasonal best and packed for quick cooking.",
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
    note: "Assam's legendary heat, packed for cooks who know exactly what they are doing.",
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
    note: "Fresh mustard greens with a clean peppery bite—made for simple, comforting food.",
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
    note: "Fresh banana blossom with a tender texture and a deep place in Assamese cooking.",
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
    note: "Full-bodied Assam tea from small growers, packed close to origin for a brighter cup.",
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
    note: "Small-batch blossom honey; colour and flavour shift naturally with the season.",
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
    note: "Fresh roots with the colour, aroma and warmth every working kitchen needs.",
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
    note: "A sharp, savoury bamboo shoot pickle made for rice, meat and everyday meals.",
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
    note: "A handwoven Assamese essential—made to be used, gifted and kept.",
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

  useEffect(() => {
    let frame = 0;
    const updateProgress = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const distance = document.documentElement.scrollHeight - window.innerHeight;
        const progress = distance > 0 ? (window.scrollY / distance) * 100 : 0;
        document.documentElement.style.setProperty("--scroll-progress", `${progress}%`);
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px" });

    document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
    document.documentElement.classList.add("motion-ready");
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [filter]);

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
      <div className="scroll-progress" aria-hidden="true" />
      <div className="announcement">Fresh produce <span>•</span> Assamese pantry <span>•</span> Living craft</div>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Golaghat Harvest home">
          <span className="brand-mark">G</span>
          <span><strong>Golaghat Harvest</strong><small>Golaghat · Assam</small></span>
        </a>
        <button className="menu-button" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "Close" : "Menu"}</button>
        <nav className={menuOpen ? "nav-open" : ""} aria-label="Main navigation">
          <a href="#shop" onClick={closeMenu}>Shop</a>
          <a href="#story" onClick={closeMenu}>Our story</a>
          <a href="#plan" onClick={closeMenu}>How it works</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
        </nav>
        <button className={`cart-button ${cartCount ? "has-items" : ""}`} onClick={() => setCartOpen(true)} aria-label={`Open cart with ${cartCount} items`}>
          Cart <span>{String(cartCount).padStart(2, "0")}</span>
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">গোলাঘাটৰ বজাৰ · Golaghat, Assam</p>
          <h1><span>The taste of</span><span><em>Golaghat.</em></span><span>All in one place.</span></h1>
          <p className="hero-text">Fresh vegetables, fragrant roots, bold pantry goods and Assamese craft—thoughtfully gathered for homes, kitchens and retailers.</p>
          <div className="hero-actions">
            <a className="button primary" href="#shop">Shop the harvest <span>↗</span></a>
            <a className="text-link" href="#story">Meet the market <span>↓</span></a>
          </div>
          <div className="hero-proof">
            <span className="proof-number">10</span>
            <span>distinct goods<br />one Assamese market</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-collage">
            <figure className="collage-nemu"><img src="/images/kaji-nemu.jpg" alt="Fresh Kaji Nemu growing on a branch" /><figcaption>Kaji Nemu</figcaption></figure>
            <figure className="collage-dhekia"><img src="/images/dhekia-fresh-2.jpg" alt="Fresh Dhekia Xaak" /><figcaption>Dhekia Xaak</figcaption></figure>
            <figure className="collage-chilli"><img src="/images/bhut-jolokia.jpg" alt="Fresh Bhut Jolokia chillies" /><figcaption>Bhut Jolokia</figcaption></figure>
            <figure className="collage-craft"><img src="/images/handloom.jpg" alt="Handwoven Assamese textile" /><figcaption>Handwoven craft</figcaption></figure>
          </div>
          <div className="origin-stamp"><strong>From Assam</strong><span>Field · Pantry · Craft</span></div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Store promises">
        <span>Fresh vegetables</span><i>✦</i><span>Pantry originals</span><i>✦</i><span>Living craft</span><i>✦</i><span>Visible origin</span>
      </section>

      <section className="nemu-focus" aria-label="Golaghat Harvest collection highlights" data-reveal>
        <div className="nemu-intro"><p className="eyebrow">One place · many makers</p><h2>A wider view<br /><em>of Assam.</em></h2></div>
        <div className="nemu-promise"><p>Golaghat Harvest brings everyday vegetables, distinctive ingredients and meaningful craft into one clear marketplace. Every category matters; every product carries its own place, use and story.</p><div className="nemu-facts"><div data-reveal><span>01</span><strong>Fresh</strong><small>Greens, chillies and roots</small></div><div data-reveal><span>02</span><strong>Pantry</strong><small>Tea, honey and pickles</small></div><div data-reveal><span>03</span><strong>Craft</strong><small>Made by Assamese hands</small></div></div></div>
      </section>

      <section className="shop section" id="shop">
        <div className="section-heading" data-reveal>
          <div><p className="eyebrow">10 goods · one Assamese market</p><h2>From field to home.<br />From Assam to you.</h2></div>
          <p>Discover fresh greens, Kaji Nemu, bold chillies, fragrant roots, tea, honey, pickles and living craft—each presented with equal care.</p>
        </div>
        <div className="filters" role="group" aria-label="Filter products">
          {categories.map((category) => <button key={category} className={filter === category ? "active" : ""} onClick={() => setFilter(category)}>{category}</button>)}
        </div>
        <div className="product-grid" key={filter}>
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

      <section className="story" id="story" data-reveal>
        <div className="story-image"><img src="/images/assam-tea.jpg" alt="Hands plucking fresh green tea leaves" /><span>Strong produce. Clear origin. Better reach.</span></div>
        <div className="story-copy">
          <p className="eyebrow light">Why Golaghat Harvest</p>
          <h2>Great produce deserves<br /><em>a better route.</em></h2>
          <p>Growers already know how to raise remarkable produce. Golaghat Harvest adds what buyers need: clear standards, confident presentation and dependable fulfilment.</p>
          <blockquote>“See where it comes from. Know what you are buying. Order with confidence.”</blockquote>
          <a href="#plan" className="button lime">Follow the journey <span>↘</span></a>
        </div>
      </section>

      <section className="plan section" id="plan">
        <div className="plan-title" data-reveal>
          <p className="eyebrow">From harvest to doorstep</p>
          <h2>A simple route<br />to a wider market.</h2>
          <p>Start with real supply and real orders. Build trust through consistent grading, thoughtful packing and dependable delivery.</p>
        </div>
        <div className="system-flow">
          {[
            ["01", "Source", "Work with growers and map what is ready, when."],
            ["02", "Grade", "Make size, freshness and quality easy to understand."],
            ["03", "Pack", "Protect the produce and make Golaghat recognisable."],
            ["04", "Deliver", "Serve homes, kitchens, retailers and bulk buyers."],
            ["05", "Improve", "Learn from repeat orders and producer feedback."],
          ].map(([number, title, copy]) => <div className="flow-step" key={number} data-reveal><span>{number}</span><h3>{title}</h3><p>{copy}</p></div>)}
        </div>
        <div className="pilot-plan">
          <div className="pilot-lead"><span>The first 90 days</span><h3>Start focused.<br />Earn trust.<br />Grow with demand.</h3></div>
          <ol>
            <li><span>Weeks 1–3</span><strong>Prepare</strong><p>Confirm growers, product grades, packing and the team responsible for each order.</p></li>
            <li><span>Weeks 4–6</span><strong>Launch</strong><p>Begin with a limited delivery area and the 10 kg Kaji Nemu crate.</p></li>
            <li><span>Weeks 7–12</span><strong>Improve</strong><p>Review delivery, repeat orders, avoidable loss and buyer feedback.</p></li>
          </ol>
        </div>
      </section>

      <section className="outcomes" data-reveal>
        <div className="outcomes-copy"><p className="eyebrow light">What good looks like</p><h2>More reach.<br />Less waste.<br />Clear value.</h2><p>Judge the market by what can be seen and measured: better buying, better fulfilment and stronger repeat demand.</p></div>
        <div className="outcome-grid">
          <div><span>01</span><h3>Visible origin</h3><p>Make the grower and place part of the product story.</p></div>
          <div><span>02</span><h3>Smarter demand</h3><p>Match harvest windows with orders and clearer buying signals.</p></div>
          <div><span>03</span><h3>Buyer confidence</h3><p>Earn repeat orders through consistent quality and communication.</p></div>
          <div><span>04</span><h3>Local capability</h3><p>Build practical skills in grading, packing, cataloguing and delivery.</p></div>
        </div>
      </section>

      <section className="buyer-banner" id="contact" data-reveal>
        <p className="eyebrow">For homes · retailers · restaurants · hospitality</p>
        <h2>Buying for home or business?</h2>
        <p>Choose one product or tell us your weekly requirement. We will confirm freshness, availability and delivery before payment.</p>
        <button className="button dark" onClick={() => setCartOpen(true)}>Start an order <span>↗</span></button>
      </section>

      <footer>
        <div className="footer-brand"><span className="brand-mark">G</span><h2>Golaghat Harvest</h2><p>অসমৰ সোৱাদ, আপোনাৰ দুৱাৰত।<br />An ecommerce platform from Golaghat.</p></div>
        <div><h4>Explore</h4><a href="#shop">Shop</a><a href="#story">Our story</a><a href="#plan">How it works</a></div>
        <div><h4>Our promise</h4><p>Visible origin<br />Clear quality<br />Careful packing<br />Direct connection</p></div>
        <div><h4>Orders</h4><p>Now taking enquiries<br />Golaghat · Assam</p></div>
        <p className="copyright">© 2026 Golaghat Harvest. Prices and availability are confirmed before every order.</p>
      </footer>

      {cartOpen && <div className="drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }}>
        <aside className="cart-drawer" aria-label="Shopping cart" aria-modal="true" role="dialog">
          <div className="drawer-head"><div><p className="eyebrow">Your request</p><h2>Market basket</h2></div><button onClick={() => setCartOpen(false)} aria-label="Close cart">×</button></div>
          {sent ? <div className="success-message"><span>✓</span><h3>Your request is ready.</h3><p>The Golaghat Harvest team will confirm availability and delivery before any payment is taken.</p><button className="button primary" onClick={() => { setSent(false); setCartOpen(false); }}>Continue shopping</button></div> : cartItems.length ? <>
            <div className="cart-items">{cartItems.map((item) => <div className="cart-item" key={item.id}><img src={item.image} alt="" /><div><strong>{item.name}</strong><span>₹{item.price} · {item.unit}</span><div className="quantity"><button onClick={() => changeQuantity(item.id, -1)} aria-label={`Remove one ${item.name}`}>−</button><b>{item.quantity}</b><button onClick={() => changeQuantity(item.id, 1)} aria-label={`Add one ${item.name}`}>+</button></div></div><strong>₹{item.price * item.quantity}</strong></div>)}</div>
            <div className="subtotal"><span>Indicative subtotal</span><strong>₹{subtotal}</strong></div>
            <form onSubmit={submitOrder} className="order-form"><label>Name<input required name="name" placeholder="Your name" /></label><label>Phone<input required name="phone" type="tel" placeholder="10-digit mobile number" pattern="[0-9 +()-]{10,}" /></label><label>Delivery location<input required name="location" placeholder="Town / city / PIN" /></label><button className="button primary" type="submit">Confirm my request <span>↗</span></button><small>We will confirm availability, delivery and payment details by phone.</small></form>
          </> : <div className="empty-cart"><span>○</span><h3>Your basket is ready for something good.</h3><p>Start with a 10 kg Kaji Nemu crate or explore the Assamese collection.</p><button className="button primary" onClick={() => { setCartOpen(false); document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); }}>Explore the collection</button></div>}
        </aside>
      </div>}
      {!cartOpen && <div className="mobile-order-bar"><div><small>Golaghat Harvest</small><strong>10 Assamese goods</strong></div><button onClick={() => document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" })}>Shop now <span>↗</span></button></div>}
    </main>
  );
}
