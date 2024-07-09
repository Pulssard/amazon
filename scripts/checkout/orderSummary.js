import {getProduct} from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import deliveryOptions, { calculateDeliveryDate, getDeliveryOption } from '../../data/deliveryOptions.js';
import {renderPaymentSummary} from './paymentSummary.js';
import cartObj from '../../data/cart.js';
import {removeSpinner, renderSpinner } from '../amazon/spinner.js';
import { renderToastHTML } from '../utils/renderPopUp.js';


export async function renderOrderSummary() {

  renderSpinner();

  const cart =  cartObj.cart;//getting the data from the cart

  let html = '';

  if(cart.length > 0){//checking if there are any products in the cart, if so, they are rendered
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
    html = `<h4 class="empty-message">Cart is empty. Choose a product first!</h4>`//if there are no products, is rendered the message that announce it
  };
  removeSpinner();

  $('.order-summary').html(html);

  function deliveryOptionsHTML(cartItem) {//rendering the delviery options of the products in the cart.the function is called inside the one rendering the products in the cart
                                          //so if the cart is empty, this function will note be called;
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


  const updateButtons = $('.update-quantity-link');

//dinamically rendering the inputs and buttons of the prodcuts(update, quantity,save)
  updateButtons.each(function() {
    $(this).on('click', function(){
      const productId = $(this).data('product-id');
      $(`.cart-item-container-${productId}`).addClass('is-editing-quantity');
      $(`.quantity-label-${productId}`).addClass('remove-quantity-links');
      $(this).addClass('remove-quantity-links');
    });
  });

  function saveNewInput(productId) { 
    const newQuantity = +$(`.quantity-input-${productId}`).val();
    if(newQuantity <= 0 || newQuantity >=100) {//validating the inputs
      /*alert('Input invalid. Please select a quantity between 1 and 999');*/
      renderToastHTML('alert');
      return;
    }
    cartObj.updateQuantity(productId, newQuantity);
    cartObj.updateCartQuantity('.checkout-items');
    renderOrderSummary();
    renderPaymentSummary(); 
  };

  const saveButtons = $('.save-quantity-link');

  saveButtons.each(function() {
    $(this).on('click', e => saveNewInput(e.target.dataset.productId));
  });

  $(window).on('keydown', e => {
      const {productId} = e.target.dataset;
      if(e.key === 'Enter') saveNewInput(productId);
  });

  
  const deleteBtns = $('.delete-quantity-link');
//based on each products dataset product-id is possible to delete products specifically by their id
  deleteBtns.each(function() {
      $(this).on('click', function() {
        const productId = $(this).data('product-id');
        cartObj.removeProducts(productId);
        renderOrderSummary();
        renderPaymentSummary();
        renderToastHTML('info');
      });    
  });

//modifying the delivery option as user wants it

$('.delivery-option').each(function() {
  $(this).on('click', function() {
      const productId = $(this).data('product-id');
      const deliveryOptionId = $(this).data('delivery-option-id').toString();
      console.log(typeof productId, typeof deliveryOptionId)
      cartObj.updateDeliveryOption(productId, deliveryOptionId);

      renderOrderSummary();
      renderPaymentSummary();
  });
});

cartObj.updateCartQuantity('.checkout-items');

};
