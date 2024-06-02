import { loadProducts, PRODUCTS_PER_PAGE } from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import cartObj from '../data/cart.js';
import { renderSpinner, removeSpinner } from './amazon/spinner.js';


async function loadHomePage(){

  let products = await loadProducts();

  let numberOfPages = Math.ceil(products.length/PRODUCTS_PER_PAGE);
  let pageTracker = 1;

  let isSearchParam;
  let url;

  let modifiedProductsList;

  function renderHomePageHTML(){
    let html = '';
    url = new URL(window.location.href);
    isSearchParam = url.searchParams.get('search');
    
    const firstProd = (pageTracker - 1) * PRODUCTS_PER_PAGE;
    const lastProd = PRODUCTS_PER_PAGE * pageTracker;
    modifiedProductsList = products.slice(firstProd,lastProd);

    if(isSearchParam) {
      const product = products.filter(prod => {
        const prodName = prod.name.toLowerCase().includes(isSearchParam);
        const keywords = prod.keywords.some(keyword => keyword === isSearchParam.toLocaleLowerCase());
        if(prodName || keywords) return prod; 
      });
      modifiedProductsList = [...product];
    };

    modifiedProductsList.forEach((product) => {
      html += `
      <div class="product-container">
      <div class="product-image-container">
        <img class="product-image"
          src="${product.image}">
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars"
          src="images/ratings/rating-${product.rating.stars * 10 }.png">
        <div class="product-rating-count link-primary">
        ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
      $${formatCurrency(product.priceCents)}
      </div>

      <div class="product-quantity-container">
        <select class="js-quantity-selector-${product.id}">
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      ${product.extraInfoHTML()}

      <div class="product-spacer"></div>

      <div class="added-to-cart added-to-cart-${product.id}">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <button class="add-to-cart-button button-primary" data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>`;
  });
  //removeSpinner();
  document.querySelector('.products-grid').innerHTML = html;
  const addToCartBtns = document.querySelectorAll('.add-to-cart-button');

  addToCartBtns.forEach((btn) => {
    let addedTimeout;
    btn.addEventListener('click', () => {

        const productId= btn.dataset.productId;
        
        const selectedProdQuant = document.querySelector(`.js-quantity-selector-${productId}`);
        const quantity = +selectedProdQuant.value;

        
        document.querySelector(`.added-to-cart-${productId}`).style.opacity = 1;
        if(addedTimeout) clearTimeout(addedTimeout);

        const addedTimeoutMessage = setTimeout(() => {
          if(document.querySelector(`.added-to-cart-${productId}`)){
            document.querySelector(`.added-to-cart-${productId}`).style.opacity = 0; 
          }
        },1000)

        addedTimeout = addedTimeoutMessage;

        cartObj.addToCart(productId,quantity);
        
    });
    renderPaginationHTML();
  });
  cartObj.updateCartQuantity('.cart-quantity');
};

 function handleSearch(){
  const searchParam = document.querySelector('.search-bar').value;
  if(searchParam){
    const newUrl = `index.html?search=${searchParam}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  }
  renderHomePageHTML()
}
  document.querySelector('.search-button')
    .addEventListener('click', function(){
      handleSearch()
    });

  window.addEventListener('keydown', function(e){
    if(e.key === 'Enter'){
      handleSearch()
    }
  });


  function renderPaginationHTML() {
    let html = '';
    const urlPage = url.searchParams.get('page');
    if(urlPage) pageTracker = +urlPage;
    if(isSearchParam){
      numberOfPages = Math.ceil(modifiedProductsList.length/PRODUCTS_PER_PAGE);
      if(numberOfPages < 2) numberOfPages = 0;
    }
    
    for(let i=1; i<=numberOfPages; i++){
      html += `
      <li class="page-item" style="cursor:pointer"><a class="page-link ${pageTracker === i ? 'active' : ''}" >${i}</a></li>
      `;
    }
    document.querySelector('.pagination').innerHTML = html;

    document.querySelectorAll('.page-item')
    .forEach(pageNum => {
      pageNum.addEventListener('click', function(){
        
        pageTracker = +pageNum.textContent;
        const newUrl = `index.html?page=${pageTracker}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
        renderHomePageHTML();
        renderPaginationHTML();
      });
    });
  };
  renderHomePageHTML();
  renderPaginationHTML();
};

loadHomePage();




