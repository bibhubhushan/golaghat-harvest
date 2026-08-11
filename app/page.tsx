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
  AssameseNote: string;
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
    image: "images/kaji-nemu.jpg",
    note: "Long, aromatic Assam lemons—graded and packed into one 10 kg farm crate.",
    AssameseNote: "সুগন্ধি, দীঘলীয়া কাজি নেমু—১০ কিলোগ্ৰামৰ বাছনি কৰা খেতিৰ বাকচ।",
    tag: "10 kg minimum",
    minimum: "Minimum order: one 10 kg crate",
  },
  {
    id: "dhekia-xaak",
    name: "Dhekia Xaak",
    Assamese: "ঢেকীয়া শাক",
    category: "Fresh",
    price: 179,
    unit: "500 g harvest pack",
    image: "images/dhekia-fresh-2.jpg",
    note: "Tender fiddlehead greens, gathered at their seasonal best and packed for quick cooking.",
    AssameseNote: "কোমল ঢেকীয়া, ঋতুৰ সৰ্বোত্তম সময়ত সংগ্ৰহ কৰা।",
    tag: "Seasonal green",
  },
  {
    id: "bhut-jolokia",
    name: "Bhut Jolokia",
    Assamese: "ভূত জলকীয়া",
    category: "Fresh",
    price: 249,
    unit: "100 g pack",
    image: "images/bhut-jolokia.jpg",
    note: "Assam's legendary heat, packed for cooks who know exactly what they are doing.",
    AssameseNote: "অসমৰ বিখ্যাত তীব্ৰ জলকীয়া—সাৱধানে ব্যৱহাৰ কৰক।",
    tag: "Handle with care",
  },
  {
    id: "lai-xaak",
    name: "Lai Xaak",
    Assamese: "লাই শাক",
    category: "Fresh",
    price: 149,
    unit: "500 g harvest pack",
    image: "images/lai-xaak.jpg",
    note: "Fresh mustard greens with a clean peppery bite—made for simple, comforting food.",
    AssameseNote: "দৈনন্দিন ৰন্ধনৰ বাবে তাজা আৰু কোমল লাই শাক।",
    tag: "Field fresh",
  },
  {
    id: "banana-blossom",
    name: "Kol Dil",
    Assamese: "কলডিল",
    category: "Fresh",
    price: 189,
    unit: "2-blossom pack",
    image: "images/banana-flower.jpg",
    note: "Fresh banana blossom with a tender texture and a deep place in Assamese cooking.",
    AssameseNote: "অসমীয়া ৰান্ধনীঘৰৰ চিনাকি, কোমল আৰু তাজা কলডিল।",
    tag: "Village kitchen",
  },
  {
    id: "assam-tea",
    name: "Assam Black Tea",
    Assamese: "অসম চাহ",
    category: "Pantry",
    price: 349,
    unit: "250 g pack",
    image: "images/assam-tea.jpg",
    note: "Full-bodied black tea with the strong, malty character Assam is known for.",
    AssameseNote: "প্ৰগাঢ় ৰং আৰু পৰিপূৰ্ণ সোৱাদৰ অসম ক’লা চাহ।",
    tag: "Assam tea",
  },
  {
    id: "seasonal-honey",
    name: "Seasonal Blossom Honey",
    Assamese: "ঋতুৰ ফুলৰ মৌ",
    category: "Pantry",
    price: 449,
    unit: "500 g jar",
    image: "images/honey.jpg",
    note: "Golden blossom honey; its colour and flavour naturally vary with each season.",
    AssameseNote: "ঋতু অনুসৰি ৰং আৰু সোৱাদ সলনি হোৱা সুণালী ফুলৰ মৌ।",
    tag: "Seasonal harvest",
  },
  {
    id: "ginger-turmeric",
    name: "Ginger + Turmeric Roots",
    Assamese: "আদা-হালধি",
    category: "Pantry",
    price: 399,
    unit: "2 kg mixed pack",
    image: "images/ginger-turmeric.jpg",
    note: "Fresh roots with the colour, aroma and warmth every working kitchen needs.",
    AssameseNote: "ঘৰুৱা ৰন্ধনৰ বাবে সুগন্ধি তাজা আদা আৰু হালধি।",
    tag: "Root cellar",
  },
  {
    id: "fresh-bamboo-shoot",
    name: "Fresh Bamboo Shoot",
    Assamese: "বাঁহৰ গাজ",
    category: "Fresh",
    price: 299,
    unit: "1 kg pack",
    image: "images/bamboo-shoot.jpg",
    note: "Tender bamboo shoot for curries, khorisa, pickles and other regional preparations.",
    AssameseNote: "তৰকাৰী, খৰিচা আৰু আচাৰৰ বাবে কোমল বাঁহৰ গাজ।",
    tag: "Seasonal shoot",
  },
  {
    id: "handwoven-gamusa",
    name: "Handwoven Gamusa",
    Assamese: "হাতেবোৱা গামোচা",
    category: "Craft",
    price: 799,
    unit: "1 piece",
    image: "images/handloom.jpg",
    note: "A handwoven Assamese essential—made to be used, gifted and kept.",
    AssameseNote: "হাতে বোৱা অসমীয়া গামোচা—ব্যৱহাৰ, উপহাৰ আৰু স্মৃতিৰ বাবে।",
    tag: "Made by hand",
  },
];

const categories = [
  { value: "All", label: "All", Assamese: "সকলো" },
  { value: "Fresh", label: "Fresh", Assamese: "তাজা" },
  { value: "Pantry", label: "Pantry", Assamese: "ভঁৰাল" },
  { value: "Craft", label: "Craft", Assamese: "শিল্প" },
] as const;

export default function Home() {
  const [filter, setFilter] = useState<(typeof categories)[number]["value"]>("All");
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
        document.documentElement.classList.toggle("has-scrolled", window.scrollY > 260);
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
      <div className="announcement"><span lang="as">অসমৰ পথাৰৰ পৰা</span><i>•</i> Fresh produce <i>•</i> Pantry <i>•</i> Craft</div>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Assam Harvest home">
          <span className="brand-mark" lang="as">অ</span>
          <span><strong>Assam Harvest</strong><small lang="as">অসমৰ বজাৰ</small></span>
        </a>
        <button className="menu-button" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "Close" : "Menu"}</button>
        <nav className={menuOpen ? "nav-open" : ""} aria-label="Main navigation">
          <a href="#shop" onClick={closeMenu}><span>Shop</span><small lang="as">বজাৰ</small></a>
          <a href="#story" onClick={closeMenu}><span>Our story</span><small lang="as">আমাৰ কাহিনী</small></a>
          <a href="#plan" onClick={closeMenu}><span>How it works</span><small lang="as">কেনেকৈ চলে</small></a>
          <a href="#contact" onClick={closeMenu}><span>Contact</span><small lang="as">যোগাযোগ</small></a>
        </nav>
        <button className={`cart-button ${cartCount ? "has-items" : ""}`} onClick={() => setCartOpen(true)} aria-label={`Open cart with ${cartCount} items`}>
          Cart <span>{String(cartCount).padStart(2, "0")}</span>
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span lang="as">অসমৰ সতেজ সোৱাদ</span> · Fresh from Assam</p>
          <h1><span>Fresh from</span><span><em>Assam.</em></span><span>Made with care.</span></h1>
          <p className="hero-text"><span lang="as">পথাৰৰ শাক-পাচলি, চাহ, মৌ আৰু হাতে বোৱা সামগ্ৰী।</span><br />Fresh food, pantry essentials and living craft—presented with clear origin and equal respect.</p>
          <div className="hero-actions">
            <a className="button primary" href="#shop">Shop now · এতিয়াই কিনক <span>↗</span></a>
            <a className="text-link" href="#story">Meet the makers <span>↓</span></a>
          </div>
          <div className="hero-proof">
            <span className="proof-number">10</span>
            <span>goods to begin<br /><b lang="as">১০ বিধ সামগ্ৰী</b></span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-collage">
            <figure className="collage-nemu"><img src="images/kaji-nemu.jpg" alt="An elongated green Kaji Nemu growing on a branch" /><figcaption>Kaji Nemu</figcaption></figure>
            <figure className="collage-dhekia"><img src="images/dhekia-fresh-2.jpg" alt="Fresh Dhekia Xaak" /><figcaption>Dhekia Xaak</figcaption></figure>
            <figure className="collage-chilli"><img src="images/bhut-jolokia.jpg" alt="Fresh Bhut Jolokia chillies" /><figcaption>Bhut Jolokia</figcaption></figure>
            <figure className="collage-craft"><img src="images/handloom.jpg" alt="A traditional red-and-white Assamese Gamusa" /><figcaption>Handwoven Gamusa</figcaption></figure>
          </div>
          <div className="origin-stamp"><strong>From Assam</strong><span lang="as">অসমৰ পথাৰ আৰু তাঁতশালৰ পৰা</span></div>
        </div>
      </section>

      <section className="shop section" id="shop">
        <div className="section-heading" data-reveal>
          <div><p className="eyebrow"><span lang="as">এতিয়াই বজাৰ কৰক</span> · Ready to order</p><h2>Shop Assam.<br /><em lang="as">অসমৰ বজাৰ।</em></h2></div>
          <p>See the food first. Compare the pack, price and minimum order clearly. Every request is confirmed for freshness, availability and delivery before payment.</p>
        </div>
        <div className="filters" role="group" aria-label="Filter products">
          {categories.map((category) => <button key={category.value} data-category={category.value} className={filter === category.value ? "active" : ""} onClick={() => setFilter(category.value)}><span>{category.label}</span><small lang="as">{category.Assamese}</small></button>)}
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
                <div><p className="assamese-name" lang="as">{product.Assamese}</p><h3>{product.name}</h3></div>
                <p className="product-note"><span>{product.note}</span><small lang="as">{product.AssameseNote}</small></p>
                {product.minimum && <p className="minimum-note">{product.minimum}</p>}
                <div className="product-buy">
                  <p><strong>₹{product.price}</strong><span>{product.unit}</span></p>
                  <button onClick={() => addToCart(product.id)} aria-label={`Add ${product.name} to cart`}>Add · যোগ <span>+</span></button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="price-note"><strong lang="as">মন কৰিব:</strong> Kaji Nemu starts at one 10 kg crate. Prices are indicative; final availability, grade, delivery area and shipping charge will be confirmed before payment.</p>
      </section>

      <section className="trust-strip" aria-label="Store promises">
        <span><b lang="as">তাজা</b> Fresh</span><i>✦</i><span><b lang="as">বিশ্বাস</b> Clear origin</span><i>✦</i><span><b lang="as">যত্ন</b> Careful packing</span><i>✦</i><span><b lang="as">হাতে বনোৱা</b> Handmade</span>
      </section>

      <section className="nemu-focus" aria-label="Assam Harvest collection highlights" data-reveal>
        <div className="nemu-intro"><p className="eyebrow"><span lang="as">অসমৰ মানুহ · অসমৰ কাম</span></p><h2>Food. Craft.<br /><em>People.</em></h2></div>
        <div className="nemu-promise"><p><span lang="as">এই বজাৰখন কেৱল সামগ্ৰীৰ তালিকা নহয়—ই কৃষক, খাদ্য প্ৰস্তুতকাৰী আৰু শিল্পীৰ কামৰ বাবে এটা স্পষ্ট, সন্মানজনক পথ।</span><br />Assam Harvest gives growers, food makers and craftspeople one carefully presented marketplace. Origin is visible, categories are equal and every order begins with trust.</p><div className="nemu-facts"><div data-reveal><span>01</span><strong>Grow</strong><small lang="as">কৃষক · শাক-পাচলি আৰু শস্য</small></div><div data-reveal><span>02</span><strong>Make</strong><small lang="as">খাদ্য · চাহ, মৌ আৰু আচাৰ</small></div><div data-reveal><span>03</span><strong>Craft</strong><small lang="as">শিল্পী · তাঁত, বাঁহ আৰু ধাতু</small></div></div></div>
      </section>

      <section className="story" id="story" data-reveal>
        <div className="story-image"><img src="images/assam-tea.jpg" alt="Hands plucking fresh green tea leaves" /><span><b lang="as">মানুহৰ হাতৰ মূল্য</b> · Value the work</span></div>
        <div className="story-copy">
          <p className="eyebrow light"><span lang="as">সামগ্ৰীৰ আঁৰৰ মানুহ</span> · The people behind it</p>
          <h2>Value the work.<br /><em>Not only the thing.</em></h2>
          <p><span lang="as">ভাল শস্য আৰু দক্ষ হাতে বনোৱা সামগ্ৰীৰ মূল্য তাৰ উৎস, যত্ন আৰু মানুহৰ কাহিনীত থাকে।</span><br />Good produce and meaningful craft carry the labour, skill and place behind them. Clear presentation helps buyers understand that value—and helps more of it travel back to the people who created it.</p>
          <blockquote>“Know the product. See its origin. Respect the work.”</blockquote>
          <a href="#plan" className="button secondary">See how it works <span>↓</span></a>
        </div>
      </section>

      <section className="culture section" aria-labelledby="culture-title">
        <div className="culture-heading" data-reveal>
          <p className="eyebrow"><span lang="as">খাদ্যৰ ভাষা</span> · The language of food</p>
          <h2 id="culture-title">A market shaped<br />by how Assam eats.</h2>
          <p>Assamese food draws meaning from seasonal greens, bright sourness, fermented ingredients and careful use of the whole plant. The catalogue starts with those living food traditions.</p>
        </div>
        <div className="culture-grid">
          {[
            ["images/dhekia-fresh-2.jpg", "Xaak", "শাক", "Seasonal greens are everyday food, not decoration. Dhekia and Lai bring the landscape directly to the kitchen."],
            ["images/kaji-nemu.jpg", "Tenga", "টেঙা", "Kaji Nemu brings a clean, aromatic sourness that brightens dal, fish, greens and simple meals."],
            ["images/bamboo-shoot.jpg", "Khorisa", "খৰিচা", "Bamboo shoot may be used fresh, fermented or pickled—an ingredient with a deep place in regional food memory."],
            ["images/handloom.jpg", "Handmade", "হাতে বনোৱা", "Food and craft belong together: the same market can value a harvest, a woven textile and the hands behind both."],
          ].map(([image, title, Assamese, copy], index) => <article className="culture-card" key={title} data-reveal><img src={image} alt="" /><div><span>0{index + 1}</span><p lang="as">{Assamese}</p><h3>{title}</h3><small>{copy}</small></div></article>)}
        </div>
      </section>

      <section className="plan section" id="plan">
        <div className="plan-title" data-reveal>
          <p className="eyebrow"><span lang="as">পথাৰৰ পৰা দুৱাৰলৈ</span> · From source to doorstep</p>
          <h2>A shorter path<br />to the buyer.</h2>
          <p>Keep the system understandable: show what is ready, confirm the real order, pack with care and deliver with clear communication.</p>
        </div>
        <div className="system-flow">
          {[
            ["01", "Share", "দেখুৱাওক", "Growers and makers show the real product, pack and available quantity."],
            ["02", "Confirm", "নিশ্চিত কৰক", "The buyer receives a clear confirmation before any payment is taken."],
            ["03", "Pack", "যতনে পেক কৰক", "Fresh goods are graded; craft is protected; every order is handled with care."],
            ["04", "Deliver", "পঠিয়াই দিয়ক", "Homes, kitchens and retailers receive updates through the final handoff."],
          ].map(([number, title, Assamese, copy]) => <div className="flow-step" key={number} data-reveal><span>{number}</span><small lang="as">{Assamese}</small><h3>{title}</h3><p>{copy}</p></div>)}
        </div>
        <div className="maker-panel" data-reveal>
          <p className="eyebrow"><span lang="as">কৃষক আৰু শিল্পীৰ বাবে</span> · For growers and makers</p>
          <h3>Your work belongs<br />in a wider market.</h3>
          <p>Fresh produce, tea, honey, handloom, bamboo, cane, pottery and metal craft can all be presented with the same clarity: who made it, where it came from and what the buyer will receive.</p>
          <a className="button secondary" href="#contact">Connect with the market <span>↗</span></a>
        </div>
      </section>

      <section className="outcomes" data-reveal>
        <div className="outcomes-copy"><p className="eyebrow light"><span lang="as">ভাল বজাৰৰ নীতি</span> · Principles of a good market</p><h2>Clear.<br />Fair.<br />Human.</h2><p>The design stays quiet so the food, the craft and the people remain visible.</p></div>
        <div className="outcome-grid">
          <div><span>01</span><small lang="as">উৎস দেখা যায়</small><h3>Visible origin</h3><p>The place and maker stay attached to the product story.</p></div>
          <div><span>02</span><small lang="as">স্পষ্ট তথ্য</small><h3>Clear buying</h3><p>Pack, price, minimum quantity and next step are easy to scan.</p></div>
          <div><span>03</span><small lang="as">সমান সন্মান</small><h3>Equal respect</h3><p>Vegetables, pantry goods and craft receive the same visual care.</p></div>
          <div><span>04</span><small lang="as">মানুহৰ সংযোগ</small><h3>Human contact</h3><p>Every order is confirmed by a real person before payment.</p></div>
        </div>
      </section>

      <section className="buyer-banner" id="contact" data-reveal>
        <p className="eyebrow"><span lang="as">ঘৰ · দোকান · ৰেষ্টুৰেণ্ট</span> · Home or business</p>
        <h2>Bring Assam<br />to your table.</h2>
        <p><span lang="as">এটা সামগ্ৰী বাছক বা আপোনাৰ নিয়মীয়া প্ৰয়োজন জনাওক।</span><br />Choose one product or tell us your weekly requirement. We will confirm freshness, availability and delivery before payment.</p>
        <button className="button primary" onClick={() => setCartOpen(true)}>Start an order · অৰ্ডাৰ কৰক <span>↗</span></button>
      </section>

      <footer>
        <div className="footer-brand"><span className="brand-mark" lang="as">অ</span><h2>Assam Harvest</h2><p lang="as">অসমৰ সোৱাদ, আপোনাৰ দুৱাৰত।</p><p>An ecommerce platform from Assam.</p></div>
        <div><h4>Explore · চাওক</h4><a href="#shop">Shop · বজাৰ</a><a href="#story">Our story · কাহিনী</a><a href="#plan">How it works · প্ৰক্ৰিয়া</a></div>
        <div><h4>Our promise · প্ৰতিশ্ৰুতি</h4><p>Visible origin<br />Clear quality<br />Careful packing<br />Direct connection</p></div>
        <div><h4>Orders · অৰ্ডাৰ</h4><p>Now taking enquiries<br />Across Assam</p><a href="image-credits.html">Image credits</a></div>
        <p className="copyright">© 2026 Assam Harvest. Prices and availability are confirmed before every order.</p>
      </footer>

      {cartOpen && <div className="drawer-backdrop">
        <button className="drawer-dismiss" type="button" aria-label="Close shopping cart" onClick={() => setCartOpen(false)} />
        <aside className="cart-drawer" aria-label="Shopping cart" aria-modal="true" role="dialog">
          <div className="drawer-head"><div><p className="eyebrow"><span lang="as">আপোনাৰ অনুৰোধ</span> · Your request</p><h2>Market basket</h2></div><button onClick={() => setCartOpen(false)} aria-label="Close cart">×</button></div>
          {sent ? <div className="success-message"><span>✓</span><h3>Your request is ready.</h3><p><span lang="as">পেমেণ্টৰ আগতে উপলব্ধতা আৰু ডেলিভাৰী নিশ্চিত কৰা হ’ব।</span><br />The Assam Harvest team will confirm availability and delivery before any payment is taken.</p><button className="button primary" onClick={() => { setSent(false); setCartOpen(false); }}>Continue shopping</button></div> : cartItems.length ? <>
            <div className="cart-items">{cartItems.map((item) => <div className="cart-item" key={item.id}><img src={item.image} alt="" /><div><strong>{item.name}</strong><span>₹{item.price} · {item.unit}</span><div className="quantity"><button onClick={() => changeQuantity(item.id, -1)} aria-label={`Remove one ${item.name}`}>−</button><b>{item.quantity}</b><button onClick={() => changeQuantity(item.id, 1)} aria-label={`Add one ${item.name}`}>+</button></div></div><strong>₹{item.price * item.quantity}</strong></div>)}</div>
            <div className="subtotal"><span>Indicative subtotal</span><strong>₹{subtotal}</strong></div>
            <form onSubmit={submitOrder} className="order-form"><label>Name · নাম<input required name="name" placeholder="Your name" /></label><label>Phone · ফোন<input required name="phone" type="tel" placeholder="10-digit mobile number" pattern="[0-9 +()-]{10,}" /></label><label>Delivery location · ঠিকনা<input required name="location" placeholder="Town / city / PIN" /></label><button className="button primary" type="submit">Confirm request · নিশ্চিত কৰক <span>↗</span></button><small>We will confirm availability, delivery and payment details by phone.</small></form>
          </> : <div className="empty-cart"><span>○</span><h3>Your basket is ready for something good.</h3><p>Start with a 10 kg Kaji Nemu crate or explore the Assamese collection.</p><button className="button primary" onClick={() => { setCartOpen(false); document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); }}>Explore the collection</button></div>}
        </aside>
      </div>}
      {!cartOpen && <div className="mobile-order-bar"><div><small lang="as">অসমৰ বজাৰ · Assam Harvest</small><strong>Shop 10 goods</strong></div><button onClick={() => document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" })}>Shop · কিনক <span>↗</span></button></div>}
    </main>
  );
}
