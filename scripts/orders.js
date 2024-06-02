import { loadOrders } from '../data/orders.js'
import { formatCurrency } from './utils/money.js';
import { formatTime } from './utils/time.js'
import { getDeliveryDate } from "../data/deliveryOptions.js";
import { getProduct } from '../data/products.js';
import cartObj from '../data/cart.js';

async function renderOrderHTML(){
    let html = '';
    
    const orders = await loadOrders();

    if(!orders || orders[0].errorMessage){
        html = `
        <h4 class="empty-message">Your order history is empty. Make a purchase first!</h4>
        `;
    } else{
        for(const order of orders){
            html += `
            <div class="order-container">
                <div class="order-header">
                    <div class="order-header-left-section">
                        <div class="order-date">
                        <div class="order-header-label">Order Placed:</div>
                        <div>${formatTime(order.orderTime)}</div>
                        </div>
                        <div class="order-total">
                        <div class="order-header-label">Total:</div>
                        <div>$${formatCurrency(order.totalCostCents)}</div>
                        </div>
                    </div>
                
                    <div class="order-header-right-section">
                        <div class="order-header-label">Order ID:</div>
                        <div>${order.id}</div>
                    </div>
                </div>
            
                <div class="order-details-grid">
                    ${await renderProductsGrid(order.products, order.id, order.orderTime)}
                </div>
            </div>`;
        };
    }


async function renderProductsGrid(orderItem, orderId, orderTime){
    let gridHTML = '';
        if(orderItem){
            for (const item of orderItem){
                const product = await getProduct(item.productId);
            
                const deliveryDate = getDeliveryDate(item.estimatedDeliveryTime, orderTime)
                gridHTML += `
                    <div class="product-image-container">
                    <img src="${product.image}">
                    </div>
            
                    <div class="product-details">
                    <div class="product-name">
                        ${product.name}
                    </div>
                    <div class="product-delivery-date">
                        Arriving on: ${deliveryDate.formattedDeliveryDate}
                    </div>
                    <div class="product-quantity">
                        Quantity: ${item.quantity}
                    </div>
                    <button class="buy-again-button button-primary" data-product-id="${item.productId}">
                        <img class="buy-again-icon" src="images/icons/buy-again.png">
                        <span class="buy-again-message">Buy it again</span>
                    </button>
                    </div>
                    <div class="product-actions">
                    <a href="tracking.html?orderId=${orderId}&productId=${item.productId}">
                        <button class="track-package-button button-secondary">
                        Track package
                        </button>
                    </a>
                    </div>`
                };
    };
    return gridHTML;
};   
document.querySelector('.orders-grid').innerHTML = html;

document.querySelectorAll('.buy-again-button')
.forEach(btn => {
    btn.addEventListener('click', () => {
        const {productId} = btn.dataset;
        cartObj.addToCart(productId);
    });
});



cartObj.updateCartQuantity('.cart-quantity');
}
renderOrderHTML()