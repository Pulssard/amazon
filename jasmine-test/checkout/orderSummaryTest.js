import {renderOrderSummary} from '../../scripts/checkout/orderSummary.js';
import { getCart } from '../../data/cart.js';

describe('test suite: renderOrderSummary', () => {
    const productId2 = 'dd82ca78-a18b-4e2a-9250-31e67412f98d';
    const productId1 = "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";
    beforeEach(() => {
        spyOn(localStorage, 'setItem');

        document.querySelector('.js-test-container').innerHTML = `
        <div class="order-summary"></div>
        <div class="checkout-items"></div>
        <div class="payment-summary"></div>
        `;

        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([
                {
                    productId: productId1,
                    quantity: 3,
                    deliveryOptionId:'1'
                },{
                    productId: productId2,
                    quantity: 2,
                    deliveryOptionId: "3"
                }
            ]);
        });


        getCart();
        renderOrderSummary();
    });
    it('displays the cart', () => {

        expect(document.querySelectorAll('.cart-item-container').length)
            .toEqual(2);
        expect(
            document.querySelector(`.product-quantity-${productId1}`).innerText
        ).toContain('Quantity: 3');
        document.querySelector('.js-test-container').innerHTML = '';
    });

    it('removes a product',  () => {
        document.querySelector(`.delete-quantity-link-${productId2}`).click();
        
        //expect(document.querySelectorAll('.cart-item-container').length).toEqual(1);
        setTimeout(() => {
            expect(document.querySelectorAll('.cart-item-container').length).toEqual(1);
            done();
        }, 100);
        document.querySelector('.js-test-container').innerHTML = '';
    });
});