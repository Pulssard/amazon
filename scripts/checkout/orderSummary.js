import {getProduct} from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import deliveryOptions, { calculateDeliveryDate, getDeliveryOption } from '../../data/deliveryOptions.js';
import {renderPaymentSummary} from './paymentSummary.js';
import cartObj from '../../data/cart.js';

export async function renderOrderSummary() {
  const cart =  cartObj.cart;

  let html = '';
  console.log(cart)
  if(cart.length > 0){
    for (const cartItem of cart) {
      const product = await getProduct(cartItem.productId);
      
      const deliveryOptionId = cartItem.deliveryOptionId;
      const deliveryOption = getDeliveryOption(deliveryOptionId);
      const deliveryDate = calculateDeliveryDate(deliveryOption);

        html += `
        <div class="cart-item-container cart-item-container-${cartItem.productId}">
        <div class="delivery-date">
          Delivery date: ${ deliveryDate.formattedDeliveryDate}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${product.image}">

          <div class="cart-item-details">
            <div class="product-name">
            ${product.name}
            </div>
            <div class="product-price">
              $${formatCurrency(product.priceCents)}
            </div>
            <div class="product-quantity product-quantity-${cartItem.productId}">
              <span >
                Quantity: <span class="quantity-label quantity-label-${cartItem.productId}">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary" data-product-id=${cartItem.productId}>
                Update
              </span>
                <input class="quantity-input quantity-input-${cartItem.productId}" data-product-id=${cartItem.productId} type="number" value=${cartItem.quantity} min="1">
                <span class="save-quantity-link link-primary" data-product-id=${cartItem.productId}>Save</span>
              <span class="delete-quantity-link link-primary delete-quantity-link-${cartItem.productId}" data-product-id=${cartItem.productId}>
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options ">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(cartItem)}
          </div>
        </div>
      </div>
        ` ;
    };
  } else {
    html = `<h4 class="empty-message">Cart is empty. Choose a product first!</h4>`
  };
  
  document.querySelector('.order-summary').innerHTML = html;
  function deliveryOptionsHTML(cartItem) {
    let html = '';
    deliveryOptions.forEach(deliveryOption => {

      const deliveryDate = calculateDeliveryDate(deliveryOption);
      const shippingPrice = deliveryOption.priceCents === 0 ? 'FREE' : formatCurrency(deliveryOption.priceCents);
      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
      <div class="delivery-option" data-product-id="${cartItem.productId}" data-delivery-option-id="${deliveryOption.id}">
        <input ${isChecked ? 'checked' : ''} type="radio" class="delivery-option-input"
          name="delivery-option-${cartItem.productId}">
        <div>
          <div class="delivery-option-date">
            ${deliveryDate.formattedDeliveryDate}
          </div>
          <div class="delivery-option-price">
            $${shippingPrice} - Shipping
          </div>
        </div>
      </div>`
    });
    return html;
  }


  const updateButtons = document.querySelectorAll('.update-quantity-link');

  updateButtons.forEach(updateBtn => {
    updateBtn.addEventListener('click', function(){
      const productId = updateBtn.dataset.productId;
      document.querySelector(`.cart-item-container-${productId}`).classList.add('is-editing-quantity');
      document.querySelector(`.quantity-label-${productId}`).classList.add('remove-quantity-links');
      updateBtn.classList.add('remove-quantity-links');
    });
  });

  function saveNewInput(productId) { 
    const newQuantity = +document.querySelector(`.quantity-input-${productId}`).value;
    if(newQuantity <= 0 || newQuantity >=1000) {
      alert('Input invalid. Please select a quantity between 1 and 999');
      return;
    }
    cartObj.updateQuantity(productId, newQuantity);
    cartObj.updateCartQuantity('.checkout-items');
    renderOrderSummary();
    renderPaymentSummary(); 
  };

  const saveButtons = document.querySelectorAll('.save-quantity-link');

  saveButtons.forEach(saveBtn => {
    saveBtn.addEventListener('click', e => saveNewInput(e.target.dataset.productId));
  });

  window.addEventListener('keydown', (e) => {
      const {productId} = e.target.dataset;
      if(e.key === 'Enter') saveNewInput(productId);
  });

  
  const deleteBtns = document.querySelectorAll('.delete-quantity-link');

  deleteBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const productId = btn.dataset.productId;
        cartObj.removeProducts(productId);
        renderOrderSummary();
        renderPaymentSummary();
      });    
  });

  document.querySelectorAll('.delivery-option')
    .forEach(el => {
      el.addEventListener('click', () => {
        const {productId} = el.dataset;
        const {deliveryOptionId} = el.dataset;
        cartObj.updateDeliveryOption(productId, deliveryOptionId);
        renderOrderSummary();
        renderPaymentSummary();
      });
    });

    cartObj.updateCartQuantity('.checkout-items');

};