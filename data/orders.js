
let orders = [];

export async function loadOrders(){//get the order from local storage
  orders = await JSON.parse(localStorage.getItem('orders'));
  return orders;
}

export async function getOrder(orderId){//search for a specific order,based on its id
    let orders = await JSON.parse(localStorage.getItem('orders'));
    const findOrder = orders.find(order => order.id === orderId);
    return findOrder;
}

export function addOrder(order) {//insert the new order in the orders array, on position 0;
    orders.unshift(order);
    saveToStorage();
}

export function saveToStorage(){//save orders to localStorage
    localStorage.setItem('orders', JSON.stringify(orders))
}