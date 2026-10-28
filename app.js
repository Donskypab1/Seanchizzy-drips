const STORE_EMAIL = "seanchizzy001@gmail.com";
const STORE_NAME = "Seanchizzy Drips";

const products = [
  { id: "01", name: "Blue Patterned Senator", category: "senator", image: "seanimages/Blue patterned long sleeve.png" },
  { id: "02", name: "Classic Casual Outfit", category: "casual", image: "seanimages/Classy casual outfit.png" },
  { id: "03", name: "Handmade Senator", category: "senator", image: "seanimages/Handmade senator.png" },
  { id: "04", name: "Men’s Gown", category: "kaftan", image: "seanimages/Latest design for men gown.png" },
  { id: "05", name: "Classic Kaftan", category: "kaftan", image: "seanimages/Latest kaftan design.png" },
  { id: "06", name: "Boys’ Native Style", category: "senator", image: "seanimages/Latest Native style for boys.png" },
  { id: "07", name: "Blue Senator Set", category: "senator", image: "seanimages/Latest senator 2022.png" },
  { id: "08", name: "Striped Senator", category: "senator", image: "seanimages/Latest senator stripe.png" },
  { id: "09", name: "Grey Senator", category: "senator", image: "seanimages/Latest senator style for men.png" },
  { id: "10", name: "White Senator", category: "senator", image: "seanimages/Latest white senator.png" },
];

const productGrid = document.querySelector("#product-grid");

function gmailComposeUrl(subject, body = "") {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: STORE_EMAIL,
    su: subject,
    body,
  });
  return `https://mail.google.com/mail/?${params}`;
}

function renderProducts(filter = "all", query = "") {
  const search = query.trim().toLowerCase();
  const visible = products.filter((product) => {
    const matchesCategory = filter === "all" || product.category === filter;
    const matchesSearch = product.name.toLowerCase().includes(search);
    return matchesCategory && matchesSearch;
  });

  productGrid.innerHTML = visible.length
    ? visible.map((product) => `
      <article class="product-card">
        <div class="product-image-wrap">
          <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy" />
          <a class="quick-add" href="${gmailComposeUrl(
            `Request: ${product.name}`,
            `Hello ${STORE_NAME},\n\nI’m interested in the ${product.name}. Please share availability, sizing, price, and delivery details.\n\nThank you.`,
          )}" target="_blank" rel="noopener noreferrer" aria-label="Request ${product.name} by email">Request</a>
        </div>
        <div class="product-details"><p class="product-name">${product.name}</p></div>
      </article>`).join("")
    : `<p class="no-results">No pieces found. Try another search.</p>`;
}

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".filter-button.active")?.classList.remove("active");
    button.classList.add("active");
    renderProducts(button.dataset.filter, document.querySelector("#product-search").value);
  });
});

document.querySelector("#product-search").addEventListener("input", (event) => {
  const filter = document.querySelector(".filter-button.active")?.dataset.filter ?? "all";
  renderProducts(filter, event.target.value);
});

document.querySelector(".search-toggle").addEventListener("click", () => {
  document.querySelector("#collection").scrollIntoView({ behavior: "smooth" });
  document.querySelector("#product-search").focus({ preventScroll: true });
});

const menuToggle = document.querySelector(".menu-toggle");
menuToggle.addEventListener("click", () => {
  const nav = document.querySelector(".main-nav");
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
document.querySelectorAll(".main-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector(".main-nav").classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

document.querySelector("#feedback-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  const formData = new FormData(event.currentTarget);
  const subject = encodeURIComponent(`${formData.get("topic")} — ${STORE_NAME}`);
  const body = encodeURIComponent(
    `From: ${formData.get("name")} (${formData.get("email")})\n\n${formData.get("message")}`,
  );
  const status = document.querySelector("#feedback-status");
  status.textContent = `Opening Gmail to compose your note to ${STORE_EMAIL}…`;
  window.location.href = gmailComposeUrl(subject, body);
});

renderProducts();
