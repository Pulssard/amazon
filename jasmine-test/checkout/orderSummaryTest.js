import {renderOrderSummary} from '../../scripts/checkout/orderSummary.js';
import cartObj from '../../data/cart.js';

describe('test suite: renderOrderSummary', () => {
    const productId2 = 'dd82ca78-a18b-4e2a-9250-31e67412f98d';
    const productId1 = "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";

    beforeEach( async () => {
        spyOn(localStorage, 'setItem');
        
        $('.js-test-container').html(`
        <div class="order-summary"></div>
        <div class="checkout-items"></div>
        <div class="payment-summary"></div>
        `);

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

        cartObj.getCart();
        await renderOrderSummary();
    });

    afterAll(() => {
        $('.js-test-container').html('');
    })
    
    it('displays the cart', () => {
        expect($('.cart-item-container').length)
            .toEqual(2);
        expect(
            $(`.product-quantity-${productId1}`).text()
        ).toContain('Quantity: 3');
    });

    it('removes a product',  (done) => {
       $(`.delete-quantity-link-${productId2}`).click();
         setTimeout(() => {
            expect($('.cart-item-container').length).toEqual(1);
            expect($(`.cart-item-container-${productId2}`).length).toEqual(0);
            expect($(`.cart-item-container-${productId1}`)).not.toEqual(null);
            expect(cartObj.cart.length).toEqual(1);
            expect(cartObj.cart[0].productId).toEqual(productId1);
            done();
        }, 100);
    });
});