
let cart = JSON.parse(localStorage.getItem('cart')) || [
    {
        productId:"e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity:2,
        deliveryOptionId: "3"
    }
];

export function addToCart(productId, quantity){
    const isInCart = cart.find(product => 
        product.productId === productId);

    if(!isInCart){
      cart.push({
          productId:productId,
          quantity: quantity,
          deliveryOptionId: "1"
      }) 
  } else isInCart.quantity+= quantity;

  updateCartQuantity('.cart-quantity');
  saveToStorage();
};

export function removeProducts(id){
   cart = cart.filter(item => item.productId !== id);
   saveToStorage();
   updateCartQuantity('.checkout-items');  
};

export function saveToStorage(){
    localStorage.setItem('cart', JSON.stringify(cart));
}
export function updateCartQuantity(updateNode){
    let cartQuantity = 0;   
    cart.forEach(prod => cartQuantity+= prod.quantity);
    if(updateNode) document.querySelector(updateNode).innerHTML = cartQuantity;
    return cartQuantity;
  }

export function updateQuantity(productId,newQuantity){
    cart.forEach(prod => {
        if(prod.productId === productId) prod.quantity = newQuantity;
    });
    saveToStorage();   
}

export function updateDeliveryOption(productId, deliveryOptionId){
const isInCart = cart.find(product => 
    product.productId === productId);
isInCart.deliveryOptionId = deliveryOptionId;
saveToStorage();
}

export function getCart() {
    cart = JSON.parse(localStorage.getItem('cart'));
    return cart;
}

export default cart;