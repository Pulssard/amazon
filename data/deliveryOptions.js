import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

const deliveryOptions = [
    {
        id: "1",
        deliveryDays: 7,
        priceCents: 0,
    }, 
    {
        id: "2",
        deliveryDays: 3,
        priceCents: 499,
    },
    {
        id: "3",
        deliveryDays: 1,
        priceCents: 999,
    }
];

export function getDeliveryOption(deliveryOptionId) {
    let deliveryOption;
    deliveryOptions.forEach(option => {
      if(option.id === deliveryOptionId) deliveryOption = option;
    });
    return deliveryOption || deliveryOption[0];
};

export function calculateDeliveryDate(deliveryOption, deliveryDateArg ) {
    let deliveryDate = deliveryDateArg ? dayjs(deliveryDateArg) : dayjs();

    let addShippingDays = deliveryOption.deliveryDays;

    while (addShippingDays > 0) {
        deliveryDate = deliveryDate.add(1, 'day');
        
        if (deliveryDate.day() !== 6 && deliveryDate.day() !== 0) {
            addShippingDays--;
        }
    }

    const formattedDeliveryDate = deliveryDate.format('dddd, MMMM D');
    
    return {formattedDeliveryDate,deliveryDate};
};

export function getDeliveryDate(estimatedDeliveryTime,orderTime){
    const deliveryDays = Math.round((dayjs(estimatedDeliveryTime) - dayjs(orderTime))/86400000);

    const deliveryOptionId = deliveryOptions.find(option => {
        if(option.deliveryDays === deliveryDays) return option.id;
 
    });

    const deliveryOption = getDeliveryOption(deliveryOptionId.id);

    const deliveryDate = calculateDeliveryDate(deliveryOption, orderTime);
    return deliveryDate;
}

export default deliveryOptions;