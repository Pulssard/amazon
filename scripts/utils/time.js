import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

export function formatTime(time){
     const orderTime = dayjs(time).format('dddd D');
     return orderTime;
}

export function formatDateDMD(time){
     return dayjs(time).format('dddd, MMMM D');
} 