(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const categories = ["Fresh", "Fresh", "Fresh", "Fresh", "Fresh", "Pantry", "Pantry", "Pantry", "Pantry", "Craft"];
  const cards = $$(".product-card");
  const cart = new Map();

  const products = cards.map((card, index) => {
    card.dataset.category = categories[index];
    return {
      id: index,
      card,
      name: $("h3", card).textContent.trim(),
      price: Number($(".product-buy strong", card).textContent.replace(/[^0-9]/g, "")),
      unit: $(".product-buy p span", card).textContent.trim(),
      image: $("img", card).getAttribute("src"),
    };
  });

  const updateProgress = () => {
    const distance = document.documentElement.scrollHeight - innerHeight;
    document.documentElement.style.setProperty("--scroll-progress", `${distance > 0 ? (scrollY / distance) * 100 : 0}%`);
  };
  addEventListener("scroll", updateProgress, { passive: true });
  addEventListener("resize", updateProgress);
  updateProgress();

  document.documentElement.classList.add("motion-ready");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -35px" });
  $$('[data-reveal]').forEach((element) => observer.observe(element));

  const menuButton = $(".menu-button");
  const navigation = $("nav");
  menuButton?.addEventListener("click", () => {
    const open = navigation.classList.toggle("nav-open");
    menuButton.textContent = open ? "Close" : "Menu";
  });
  $$("nav a").forEach((link) => link.addEventListener("click", () => {
    navigation.classList.remove("nav-open");
    menuButton.textContent = "Menu";
  }));

  $$(".filters button").forEach((button) => button.addEventListener("click", () => {
    $$(".filters button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const category = button.textContent.trim();
    products.forEach((product) => {
      product.card.hidden = category !== "All" && product.card.dataset.category !== category;
    });
  }));

  const cartButton = $(".cart-button");
  let backdrop;
  let orderSent = false;

  const count = () => [...cart.values()].reduce((sum, quantity) => sum + quantity, 0);
  const updateCartBadge = () => {
    const total = count();
    $("span", cartButton).textContent = String(total).padStart(2, "0");
    cartButton.setAttribute("aria-label", `Open cart with ${total} items`);
    cartButton.classList.toggle("has-items", total > 0);
  };

  const closeCart = () => {
    backdrop?.remove();
    backdrop = null;
  };

  const renderCart = () => {
    const aside = $(".cart-drawer", backdrop);
    const items = products.filter((product) => cart.get(product.id));
    const subtotal = items.reduce((sum, product) => sum + product.price * cart.get(product.id), 0);

    let body;
    if (orderSent) {
      body = `<div class="success-message"><span>✓</span><h3>Your request is ready.</h3><p>The Golaghat Harvest team will confirm availability and delivery before any payment is taken.</p><button class="button primary" data-action="continue">Continue shopping</button></div>`;
    } else if (!items.length) {
      body = `<div class="empty-cart"><span>○</span><h3>Your basket is ready for something good.</h3><p>Explore fresh produce, pantry goods and Assamese craft.</p><button class="button primary" data-action="explore">Explore the collection</button></div>`;
    } else {
      const rows = items.map((product) => `<div class="cart-item"><img src="${product.image}" alt=""><div><strong>${product.name}</strong><span>₹${product.price} · ${product.unit}</span><div class="quantity"><button data-action="minus" data-id="${product.id}" aria-label="Remove one ${product.name}">−</button><b>${cart.get(product.id)}</b><button data-action="plus" data-id="${product.id}" aria-label="Add one ${product.name}">+</button></div></div><strong>₹${product.price * cart.get(product.id)}</strong></div>`).join("");
      body = `<div class="cart-items">${rows}</div><div class="subtotal"><span>Indicative subtotal</span><strong>₹${subtotal}</strong></div><form class="order-form"><label>Name<input required name="name" placeholder="Your name"></label><label>Phone<input required name="phone" type="tel" placeholder="10-digit mobile number" pattern="[0-9 +()-]{10,}"></label><label>Delivery location<input required name="location" placeholder="Town / city / PIN"></label><button class="button primary" type="submit">Confirm my request <span>↗</span></button><small>We will confirm availability, delivery and payment details by phone.</small></form>`;
    }

    aside.innerHTML = `<div class="drawer-head"><div><p class="eyebrow">Your request</p><h2>Market basket</h2></div><button data-action="close" aria-label="Close cart">×</button></div>${body}`;
  };

  const openCart = () => {
    orderSent = false;
    backdrop = document.createElement("div");
    backdrop.className = "drawer-backdrop";
    backdrop.innerHTML = '<aside class="cart-drawer" aria-label="Shopping cart" aria-modal="true" role="dialog"></aside>';
    document.body.append(backdrop);
    renderCart();

    backdrop.addEventListener("mousedown", (event) => {
      if (event.target === backdrop) closeCart();
    });
    backdrop.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-action]");
      if (!button) return;
      const action = button.dataset.action;
      const id = Number(button.dataset.id);
      if (action === "close") return closeCart();
      if (action === "continue") return closeCart();
      if (action === "explore") {
        closeCart();
        $("#shop")?.scrollIntoView({ behavior: "smooth" });
        return;
      }
      if (action === "minus") cart.set(id, Math.max(0, (cart.get(id) || 0) - 1));
      if (action === "plus") cart.set(id, (cart.get(id) || 0) + 1);
      if (!cart.get(id)) cart.delete(id);
      updateCartBadge();
      renderCart();
    });
    backdrop.addEventListener("submit", (event) => {
      event.preventDefault();
      orderSent = true;
      renderCart();
    });
  };

  products.forEach((product) => {
    $(".product-buy button", product.card).addEventListener("click", () => {
      cart.set(product.id, (cart.get(product.id) || 0) + 1);
      updateCartBadge();
      openCart();
    });
  });
  cartButton?.addEventListener("click", openCart);
  $(".buyer-banner button")?.addEventListener("click", openCart);
  $(".mobile-order-bar button")?.addEventListener("click", () => $("#shop")?.scrollIntoView({ behavior: "smooth" }));
})();
