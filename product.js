/*
  KASHAM FOOTWEARS - SINGLE PRODUCT DETAILS
  Product names, prices and image filenames are edited in products.js.
  This file displays the selected product and lets customers add/order it.
*/

document.addEventListener('DOMContentLoaded', function () {
  const root = document.querySelector('#productDetail');
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const requestedId = Number(params.get('id')) || 1;
  const product = window.KASHAM_PRODUCTS.find(function (item) {
    return item.id === requestedId;
  }) || window.KASHAM_PRODUCTS[0];

  if (!product) {
    root.innerHTML = '<p class="muted">This product could not be found. Please return to the shop.</p>';
    return;
  }

  const sizes = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45];
  const sizeOptions = sizes.map(function (size) {
    return '<option value="' + size + '">' + size + '</option>';
  }).join('');

  root.innerHTML = `
    <div class="detail-grid">
      <div class="detail-image">
        <img id="detailProductImage" src="${product.image}" alt="${product.name}" loading="eager">
      </div>
      <div>
        <span class="eyebrow">${product.category} · Handmade</span>
        <h1 style="font-family:'Playfair Display',serif;font-size:clamp(2.2rem,4vw,3.6rem);line-height:1.08">${product.name}</h1>
        <div class="product-detail-price">${Kasham.money(product.price)}</div>
        <p class="muted">${product.description}</p>

        <div class="detail-options">
          <div class="form-field">
            <label for="size">Select size</label>
            <select id="size" required>
              <option value="">Choose size</option>
              ${sizeOptions}
            </select>
          </div>
          <div class="form-field">
            <label for="colour">Colour preference</label>
            <select id="colour">
              <option>As pictured</option>
              <option>Ask for available colours</option>
              <option>Custom colour enquiry</option>
            </select>
          </div>
        </div>

        <div class="form-field">
          <label for="qty">Quantity</label>
          <input id="qty" type="number" min="1" max="10" value="1">
        </div>
        <button class="btn btn-primary" id="addDetail" type="button">Add to bag</button>
        <button class="btn btn-gold" id="orderDirect" type="button">Order on WhatsApp</button>
        <p class="form-note">Confirm sizing and availability before payment.</p>
      </div>
    </div>
  `;

  // If the image filename is wrong, show a clear fallback rather than a broken-image icon.
  const image = document.querySelector('#detailProductImage');
  image.addEventListener('error', function () {
    if (image.dataset.fallbackShown) return;
    image.dataset.fallbackShown = 'true';
    image.src = 'shoe-01.svg';
    image.alt = product.name + ' (default image; check the image filename in products.js)';
  });

  function getOrderDetails() {
    const size = document.querySelector('#size').value;
    if (!size) {
      Kasham.toast('Please choose a size');
      return null;
    }
    const quantity = Math.min(10, Math.max(1, Number(document.querySelector('#qty').value) || 1));
    return {
      size: size,
      quantity: quantity,
      colour: document.querySelector('#colour').value
    };
  }

  document.querySelector('#addDetail').addEventListener('click', function () {
    const details = getOrderDetails();
    if (!details) return;
    Kasham.add(product.id, details.quantity, details.size, details.colour);
  });

  document.querySelector('#orderDirect').addEventListener('click', function () {
    const details = getOrderDetails();
    if (!details) return;
    const orderItem = Object.assign({}, product, {
      qty: details.quantity,
      size: details.size,
      colour: details.colour
    });
    Kasham.wa(Kasham.message([orderItem]));
  });
});
