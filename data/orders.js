
let orders = [];

export async function loadOrders(){
  orders = await JSON.parse(localStorage.getItem('orders'));
  return orders;
}

export async function getOrder(orderId){
    let orders = await JSON.parse(localStorage.getItem('orders'));
    const findOrder = orders.find(order => order.id === orderId);
    return findOrder;
}

export function addOrder(order) {
    orders.unshift(order);
    saveToStorage();
}

export function saveToStorage(){
    localStorage.setItem('orders', JSON.stringify(orders))
}