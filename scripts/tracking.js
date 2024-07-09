import { getProduct } from "../data/products.js";
import { getOrder } from "../data/orders.js";
import cartObj from "../data/cart.js";
import { getDeliveryDate } from "../data/deliveryOptions.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

async function renderTrackingHTML() {
    const url = new URL(window.location.href);
    const productId = url.searchParams.get('productId');
    const orderId = url.searchParams.get('orderId');
//getting via the url parameters the order and product id's, and using them, the order and product themselves
    const product = await getProduct(productId);
    const order = await getOrder(orderId);
//after that, desctructure the quantity and estimated delivery time that is used further
    const {quantity, estimatedDeliveryTime} =  order.products.find(product => product.productId === productId);
    //calculating the real delivery time, considering the weekends;
    const deliveryDate = getDeliveryDate(estimatedDeliveryTime, order.orderTime)
//setting all the data to be the same type, so it would be possible to make calculations
    const currentTime = dayjs();
    const orderTime = dayjs(order.orderTime);
    const deliveryTime = dayjs(deliveryDate.deliveryDate);
 
    const percentProgressiveBar = ((currentTime - orderTime) / (deliveryTime - orderTime)) * 100;//getting the percentage of time passed until delivery

//rendering the product, and based on time passed, dinamically setting the status(preparing, shipped, delivered);
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

    <img class="product-image" src="${product.image}" loading="lazy">

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


    <!-- <div class="progress-bar-container">
        <div class="progress-bar"></div>
    </div> -->

<div class="progress" role="progressbar" aria-label="Animated striped example" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
  <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: ${percentProgressiveBar+2}%"></div> 
</div>
    
    </div>`

    $('.main').html(html);

    cartObj.updateCartQuantity('.cart-quantity');


};

renderTrackingHTML();