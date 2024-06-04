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

export function getDeliveryOption(deliveryOptionId) {//based on the value provided, the function return the delivery option(either 1,3 or 7 days)
    let deliveryOption;
    deliveryOptions.forEach(option => {
      if(option.id === deliveryOptionId) deliveryOption = option;
    });
    return deliveryOption || deliveryOption[0];
};

export function calculateDeliveryDate(deliveryOption, deliveryDateArg ) {//based on the deliveryOption or deliveryData(when it should be delivered)
    let deliveryDate = deliveryDateArg ? dayjs(deliveryDateArg) : dayjs();//is calculated the time of delivery, excluding weekends.

    let addShippingDays = deliveryOption.deliveryDays;

    while (addShippingDays > 0) {//considering that deliveryDate is considered to be the amount of working days, the weekend are being skipped
        deliveryDate = deliveryDate.add(1, 'day');
        
        if (deliveryDate.day() !== 6 && deliveryDate.day() !== 0) {
            addShippingDays--;
        }
    }

    const formattedDeliveryDate = deliveryDate.format('dddd, MMMM D');
    
    return {formattedDeliveryDate,deliveryDate};
};

export function getDeliveryDate(estimatedDeliveryTime,orderTime){//since order object is provided by the supersimplebackend API, which does not
    const deliveryDays = Math.round((dayjs(estimatedDeliveryTime) - dayjs(orderTime))/86400000);//take into count the weekends, based on the input gottten from the api, I changed them so that they would consider the weekends as in the function above
    //get the amount of days to deliver
    const deliveryOptionId = deliveryOptions.find(option => {
        if(option.deliveryDays === deliveryDays) return option.id; 
    });//based on deliveryDays, get the deliveryOption

    const deliveryDate = calculateDeliveryDate(deliveryOptionId, orderTime);//based on delivery option, get the updated deliveryDate
    return deliveryDate;
}

export default deliveryOptions;