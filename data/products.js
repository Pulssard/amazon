import {formatCurrency} from '../scripts/utils/money.js';

export const PRODUCTS_PER_PAGE = 12;//setting the number of pages, a static value

export async function getProduct(productId) {//searching for a speific product, using find method
  const products = await fetchProducts();
  const product = products.find(prod => 
    prod.id === productId);
  return product;
}

class Product{
//initializing the properties for each instance of the Product Class, based on their own values, provided by the API
  constructor(productDetails) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.priceCents = productDetails.priceCents;
    this.keywords = productDetails.keywords;
  }
//setting the common methods for all instances of the Product Class,that will be inherited;
  getStarsUrl() {
    return `images/ratings/rating-${this.rating.stars * 10}.png`;
  };

  getPrice() {
    return `$${formatCurrency(this.priceCents)}`;
  };

  extraInfoHTML() {
    return '';
  }
};

class Clothing extends Product {//constructing a new class, that share some common properties and methods with the Product class, 
                   //  inherit them via extends and super methods.
  sizeChartLink;

  constructor(productDetails){
    super(productDetails);
    this.sizeChartLink = productDetails.sizeChartLink;
  };
//redeclaring the method of the Product class, known as polymorphism
  extraInfoHTML() {
    return `
      <a href="${this.sizeChartLink}" target="_blank">Size Chart</a>
    `
  }
};

class Appliance extends Product {//same as Cltothing class
  instructionsLink = 'images/appliance-instructions.png';
  warrantyLink = 'images/appliance-warranty.png';

  constructor(productDetails){
    super(productDetails);
  };

  extraInfoHTML() {
    return `
      <a href="${this.instructionsLink}" target="_blank">Instructions</a>
      <a href="${this.warrantyLink}" target="_blank">Warranty</a>
    `
  }
};

let cachedProducts;//for saving the fetched products, and reusing them, to optimize the workflow

export async function fetchProducts(){//fetching the products from the API
  if (!cachedProducts) {//checking the products have been already fetched, in order not re-fetch them each time, to optimize the work of the website.
    const response = await fetch('https://supersimplebackend.dev/products');
    const loadedData = await response.json();
    cachedProducts = loadedData;
  }
  return cachedProducts;
}

export async function loadProducts(){//
  const loadedData = cachedProducts ? cachedProducts : await fetchProducts();//checks if the product are fetched already or not, so not to refetch them everytime the main page is rendered
  const products = loadedData.map(productDetails => {//rendering the products, based on their specific classes.
    if(productDetails.type === 'clothing') return new Clothing(productDetails);
    if(productDetails.keywords[2] === 'appliances') return new Appliance(productDetails);
    return new Product(productDetails);
    });
  return products;
};