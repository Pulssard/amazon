import { getProduct } from '../../data/products.js'
import { getDeliveryOption } from '../../data/deliveryOptions.js';
import { formatCurrency } from '../utils/money.js';
import cartObj from '../../data/cart.js';
import { addOrder } from '../../data/orders.js';

 export async function renderPaymentSummary(){

    const cart = cartObj.cart;

    let productPriceCents = 0;
    let shippingPriceCents = 0;    
    if(cart){//products grid inside the cart page are rendered only if there is a cart array, so the would not be any errors and unexpected behaviour
        for(const cartItem of cart) {
            const product = await getProduct(cartItem.productId);//using await to get the products, since getProduct is also a asynchronous function.
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

    if(cart.length === 0) {//if cart is empty, the payment section is not rendered
        paymentSummaryHTML = '';

    }
    $('.payment-summary').html(paymentSummaryHTML);
    
    if(cart.length > 0){
        $('.place-order-button')
        .on('click', async () => {//making a post request to the server, and providing as data in the body the cart array
            try{
                const response = await fetch('https://supersimplebackend.dev/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({//transformig the array into a json object , as HTTP protocol uses JSON for communicating 
                        cart: cart
                    })
                });
    
               const order = await response.json();//getting the response from the backend
               addOrder(order);//adding the order to the orders array in the local storage
            } catch(err) {//if there is any errot it would automatically be catched here
                console.log(err);
            }
            cartObj.emptyCart();//clearing the cart localStorage, after clicking the payment button
            window.location.href = 'orders.html';//transfering to the orders page
        }); 
    }
       
};

