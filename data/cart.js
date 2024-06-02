class Cart {
    #localStorageKey;
    cart;
    
    constructor(localStorageKey) {
        this.#localStorageKey = localStorageKey;
        this.getCart();
    }

    getCart() {
        this.cart = JSON.parse(localStorage.getItem(this.#localStorageKey)) || []
        return this.cart;
    };

   findProduct(productId){
        const productInCart = this.cart.find(product => 
            product.productId === productId);
        return productInCart;
    };

    addToCart(productId, quantity=1){
        
        const productInCart = this.findProduct(productId);

        if(!productInCart){
            this.cart.push({
                productId: productId,
                quantity: quantity,
                deliveryOptionId: "1"
            }) 
        } else productInCart.quantity+= quantity;

        this.updateCartQuantity('.cart-quantity');
        this.saveToStorage();
    };

    removeProducts(id){
        this.cart = this.cart.filter(item => item.productId !== id);
        this.saveToStorage();
        this.updateCartQuantity('.checkout-items');  
    };

    saveToStorage(){
        localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cart));
    };

    updateCartQuantity(updateNode){
        let cartQuantity = 0;   
        if(this.cart) {
            this.cart.forEach(prod => cartQuantity+= prod.quantity);
            
        }
        if(updateNode) document.querySelector(updateNode).innerHTML = cartQuantity;
        return cartQuantity;
    };

    updateQuantity(productId,newQuantity){
        this.cart.forEach(prod => {
            if(prod.productId === productId) prod.quantity = newQuantity;
        });
        this.saveToStorage();   
    };

    updateDeliveryOption(productId, deliveryOptionId){
        const productInCart = this.findProduct(productId);
        productInCart.deliveryOptionId = deliveryOptionId;
        this.saveToStorage();
    };

    emptyCart(){
        localStorage.setItem(this.#localStorageKey,JSON.stringify([]));
    }
};
const cartObj = new Cart('cart');
export default cartObj;


