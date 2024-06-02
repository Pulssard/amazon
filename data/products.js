import {formatCurrency} from '../scripts/utils/money.js';

export const PRODUCTS_PER_PAGE = 12;

export async function getProduct(productId) {
  const products = await fetchProducts();
  const product = products.find(prod => 
    prod.id === productId);
  return product;
}

class Product{

  constructor(productDetails) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.priceCents = productDetails.priceCents;
    this.keywords = productDetails.keywords;
  }

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

class Clothing extends Product {
  sizeChartLink;

  constructor(productDetails){
    super(productDetails);
    this.sizeChartLink = productDetails.sizeChartLink;
  };

  extraInfoHTML() {
    return `
      <a href="${this.sizeChartLink}" target="_blank">Size Chart</a>
    `
  }
};

class Appliance extends Product {
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

let cachedProducts;

export async function fetchProducts(){
  if (!cachedProducts) {
    const response = await fetch('https://supersimplebackend.dev/products');
    const loadedData = await response.json();
    cachedProducts = loadedData;
  }
  return cachedProducts;
}

export async function loadProducts(){
  const loadedData = cachedProducts ? cachedProducts : await fetchProducts();
  const products = loadedData.map(productDetails => {
    if(productDetails.type === 'clothing') return new Clothing(productDetails);
    if(productDetails.keywords[2] === 'appliances') return new Appliance(productDetails);
    return new Product(productDetails);
    });
  return products;
};