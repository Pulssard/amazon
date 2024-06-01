import dayjs from 'dayjs';


export function formatTime(time){
     const orderTime = dayjs(time).format('dddd D');
     return orderTime;
}

export function formatDateDMD(time){
     return dayjs(time).format('dddd, MMMM D');
} 