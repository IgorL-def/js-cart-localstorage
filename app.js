const products = [
  { id: "p1", name: "Pomodori", price: 2.49 },
  { id: "p2", name: "Mele", price: 1.99 },
  { id: "p3", name: "Banane", price: 1.59 },
];

const els = {
  products: document.querySelector("#products"),
  openCartBtn: document.querySelector("#openCartBtn"),
  closeCartBtn: document.querySelector("#closeCartBtn"),
  clearCartBtn: document.querySelector("#clearCartBtn"),
  cartDrawer: document.querySelector("#cartDrawer"),
  cartItems: document.querySelector("#cartItems"),
  cartCount: document.querySelector("#cartCount"),
  cartTotal: document.querySelector("#cartTotal"),
};

const STORAGE_KEY = "cart_v1";
let cart = loadCart();

function loadCart() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}; }
  catch { return {}; }
}

function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function cartQty() {
  return Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
}

function cartSum() {
  return Object.values(cart).reduce((sum, item) => sum + item.qty * item.price, 0);
}

function renderProducts() {
  els.products.innerHTML = products.map(p => `
    <div class="card">
      <h3>${p.name}</h3>
      <p>€ ${p.price.toFixed(2)}</p>
      <button data-add="${p.id}">Aggiungi</button>
    </div>
  `).join("");
}

function renderCart() {
  const items = Object.values(cart);

  els.cartItems.innerHTML = items.length === 0
    ? "<p>Carrello vuoto.</p>"
    : items.map(i => `
      <div class="item">
        <div>
          <strong>${i.name}</strong><br/>
          € ${i.price.toFixed(2)} x ${i.qty}
        </div>
        <div>
          <button data-dec="${i.id}">-</button>
          <button data-inc="${i.id}">+</button>
          <button data-rem="${i.id}">x</button>
        </div>
      </div>
    `).join("");

  els.cartCount.textContent = String(cartQty());
  els.cartTotal.textContent = cartSum().toFixed(2);
}

function addToCart(productId) {
  const p = products.find(x => x.id === productId);
  if (!p) return;

  cart[productId] = cart[productId] ?? { ...p, qty: 0 };
  cart[productId].qty += 1;

  saveCart();
  renderCart();
}

function inc(id) {
  if (!cart[id]) return;
  cart[id].qty += 1;
  saveCart(); renderCart();
}

function dec(id) {
  if (!cart[id]) return;
  cart[id].qty -= 1;
  if (cart[id].qty <= 0) delete cart[id];
  saveCart(); renderCart();
}

function removeItem(id) {
  delete cart[id];
  saveCart(); renderCart();
}

function clearCart() {
  cart = {};
  saveCart(); renderCart();
}

function openCart() { els.cartDrawer.classList.add("open"); }
function closeCart() { els.cartDrawer.classList.remove("open"); }

els.products.addEventListener("click", (e) => {
  const id = e.target?.dataset?.add;
  if (id) addToCart(id);
});

els.cartItems.addEventListener("click", (e) => {
  const { inc: i, dec: d, rem: r } = e.target.dataset;
  if (i) inc(i);
  if (d) dec(d);
  if (r) removeItem(r);
});

els.openCartBtn.addEventListener("click", openCart);
els.closeCartBtn.addEventListener("click", closeCart);
els.clearCartBtn.addEventListener("click", clearCart);

renderProducts();
renderCart();
