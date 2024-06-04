# Amazon
This is a simple clone of the amazon marketplace, where the user can add products to cart, delete and updating the quantity, checking the previous orders, as well as tracking the status of the order(if it is preparing, shipping or delviered), based on time passed from the order time and until delviery date. Delivery Date is calculated considering the weekends, and eliminating the from the total days count.
Also the user can search for the products, using the search bar(finding prudcts either containg in the keywrds the value searched for, or included in its name).

## Features
- Add to cart products.
- Data is persisted through sessions using localStorage.
- Updating the qouantity of products, deleting them (all dinamically, without needing to refresh the page).
- Search for products, based on their names or keywords.
- Orders history.
- Tracking the products, based on time passed from the order time and until delivery date.
- Pagination for a better user experience.


## Demo
https://prut-amazon.netlify.app/

## Project Background
This project was designed by supersimpledev. Most the HTML and CSS was provided by the creator, as well as the overall projects structure. Also the API used to get the products data is supersimplebackend.dev/products.

## Modifications
*   -CSS, HTML and structure modifications, such as:
-spinner while the page is loading;
-error meessage for empty cart/order list;
-bug fixes of style difference of search bar in different pages;
-pagination;
-lazy loading for images;

* JavaScript:
 -the JS code was almost in its entirety implemented by me, as it might be seen by comparing this project with [https://github.com/SuperSimpleDev/javascript-course/tree/main/2-copy-of-code/lesson-18], and spotting the differences.
