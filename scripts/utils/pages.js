import { PRODUCTS_PER_PAGE } from "../../data/products.js";

export function calculatePagesNumber(products) {
    let numberOfPages = Math.ceil(products.length/PRODUCTS_PER_PAGE);
    if(numberOfPages === 1) numberOfPages = 0;
    return numberOfPages;
}