import cart,{addToCart, getCart} from '../../data/cart.js';

describe('test suite: addToCart', () => {
    it('adds an existing product to the card', () => {
        spyOn(localStorage, 'setItem');
        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([
                {
                productId:'dd82ca78-a18b-4e2a-9250-31e67412f98d',
                quantity: 1,
                deliveryOptionId:'1'
                }
            ]);
        });
        getCart();
        addToCart('dd82ca78-a18b-4e2a-9250-31e67412f98d',1);
        expect(cart.length).toEqual(1);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(cart[0].quantity).toEqual(2);
    }); 

    it('adds a new product to the cart', () => {
        spyOn(localStorage, 'setItem');
        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([]);
        });
        
        getCart();
        addToCart('dd82ca78-a18b-4e2a-9250-31e67412f98d');
        expect(cart.length).toEqual(1);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    }); 
});