class Cart {
    #localStorageKey; //private property, available to be modified only within the class
    cart;

    //initialization of the cart,via constructor function
    constructor(localStorageKey) {
        this.#localStorageKey = localStorageKey;
        this.getCart();
    }
    //cart initialization,either from localStorage, or an empty string
    getCart() {
        this.cart = JSON.parse(localStorage.getItem(this.#localStorageKey)) || []
        return this.cart;
    };
//search method for finding a specific product in the cart
   findProduct(productId){
        const productInCart = this.cart.find(product => 
            product.productId === productId);
        return productInCart;
    };
//adding new product to cart
    addToCart(productId, quantity = 1){//setting the default value of 1, if none is provided
        
        const productInCart = this.findProduct(productId);//searching firstly to see if there is or not a such product in the cart

        if(!productInCart){//if it's not, then it's added to the cart
            this.cart.push({
                productId: productId,
                quantity: quantity,
                deliveryOptionId: "1"
            }) 
        } else productInCart.quantity+= quantity;//if there is such a product already, only the quantity is updated with the new quantity chosen

        this.updateCartQuantity('.cart-quantity');//updating the ui to be in accordance with the new data
        this.saveToStorage();//saving the data to localStorage
    };

    removeProducts(id){//remove a certain product from cart
        this.cart = this.cart.filter(item => item.productId !== id);//using filter method, we get a new array, withot the specified product in it
        this.saveToStorage();
        this.updateCartQuantity('.checkout-items');  
    };

    saveToStorage(){
        localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cart));//setting the cart and saving it in the localStorage. 
                                                                                    //Transforming into a string, since it does not support objects;
    };

    updateCartQuantity(updateNode){//using this method to update the cart quantity in the UI, based on the class provided.
        let cartQuantity = 0;   
        if(this.cart) {
            this.cart.forEach(prod => cartQuantity+= prod.quantity);
            //getting the total amount of products to be displayed
        }
        if(updateNode) $(updateNode).html(cartQuantity);//updating the DOM Tree, if there was provided the class
        return cartQuantity;//if the class is not provided, we get only the amount, 
                            //so that the method could be used in some other places(paymentSummary for eg)
    };

    updateQuantity(productId,newQuantity){
        this.cart.forEach(prod => {
            if(prod.productId === productId) prod.quantity = newQuantity;//setting the quantity of a product
        });
        this.saveToStorage();   
    };

    updateDeliveryOption(productId, deliveryOptionId){//modifying the delivery date, based on users preference
        const productInCart = this.findProduct(productId);
        productInCart.deliveryOptionId = deliveryOptionId;//changing the value
        this.saveToStorage();//saving it
    };

    emptyCart(){
        localStorage.setItem(this.#localStorageKey,JSON.stringify([]));//clearing the cart
    }
};
const cartObj = new Cart('cart');
export default cartObj;


