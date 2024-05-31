import { getProduct } from "../data/products.js";
import { getOrder } from "../data/orders.js";
import cartObj from "../data/cart.js";
import { getDeliveryDate } from "../data/deliveryOptions.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

async function renderTrackingHTML() {
    const url = new URL(window.location.href);
    const productId = url.searchParams.get('productId');
    const orderId = url.searchParams.get('orderId');

    const product = await getProduct(productId);
    const order = await getOrder(orderId);

    const {quantity, estimatedDeliveryTime} =  order.products.find(product => product.productId === productId);
    
    const deliveryDate = getDeliveryDate(estimatedDeliveryTime, order.orderTime)
    const currentTime = dayjs();
    const orderTime = dayjs(order.orderTime);
    const deliveryTime = dayjs(deliveryDate.deliveryDate);
 
    const percentProgressiveBar = ((currentTime - orderTime) / (deliveryTime - orderTime)) * 100;


    const html = `<div class="order-tracking">
    <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
    </a>

    <div class="delivery-date">
        Arriving on ${deliveryDate.formattedDeliveryDate}
    </div>

    <div class="product-info">
        ${product.name}
    </div>

    <div class="product-info">
        Quantity: ${quantity}
    </div>

    <img class="product-image" src="${product.image}">

    <div class="progress-labels-container">
        <div class="progress-label ${percentProgressiveBar < 50 ? 'current-status' : ''}"  >
        Preparing
        </div>
        <div class="progress-label ${(percentProgressiveBar >= 50 && percentProgressiveBar < 99) ? 'current-status' : ''}">
        Shipped
        </div>
        <div class="progress-label ${percentProgressiveBar > 99 ? 'current-status' : ''}">
        Delivered
        </div>
    </div>

    <div class="progress-bar-container">
        <div class="progress-bar"></div>
    </div>
    </div>`

    document.querySelector('.main').innerHTML = html;
    document.querySelector('.progress-bar').style.width = `${percentProgressiveBar}%`;

    cartObj.updateCartQuantity('.cart-quantity');


};

renderTrackingHTML();