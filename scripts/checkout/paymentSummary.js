import { getProduct } from '../../data/products.js'
import { getDeliveryOption } from '../../data/deliveryOptions.js';
import { formatCurrency } from '../utils/money.js';
import cartObj from '../../data/cart.js';
import { addOrder } from '../../data/orders.js';


 export async function renderPaymentSummary(){
    const cart = cartObj.cart;

    let productPriceCents = 0;
    let shippingPriceCents = 0;    
    if(cart){
        for(const cartItem of cart) {
            const product = await getProduct(cartItem.productId);
            productPriceCents += product.priceCents * cartItem.quantity;

            const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
            shippingPriceCents += deliveryOption.priceCents;
        };
    };
    const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
    const taxCents = totalBeforeTaxCents * 0.1;
    const totalCents = totalBeforeTaxCents + taxCents;

    let paymentSummaryHTML = `
         <div class="payment-summary-title">
            Order Summary
        </div>

        <div class="payment-summary-row">
            <div>Items (${cartObj.updateCartQuantity()}):</div>
            <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
        </div>

        <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(shippingPriceCents)}</div>
        </div>

        <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
        </div>

        <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
        </div>

        <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
        </div>

        <button class="place-order-button button-primary">
            Place your order
        </button>
    `;

    if(cart.length === 0) {
        paymentSummaryHTML = '';

    }
    document.querySelector('.payment-summary').innerHTML = paymentSummaryHTML;
    
    if(cart.length > 0){
        document.querySelector('.place-order-button')
        .addEventListener('click', async () => {
            try{
                const response = await fetch('https://supersimplebackend.dev/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        cart: cart
                    })
                });
    
               const order = await response.json();
               addOrder(order);
            } catch(err) {
                console.log(err);
            }
            cartObj.emptyCart();
            window.location.href = 'orders.html';
        }); 
    }
       
};

