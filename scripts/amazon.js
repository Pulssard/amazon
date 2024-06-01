import { loadProducts } from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import cartObj from '../data/cart.js';


async function loadHomePage(){

  let products = await loadProducts();
  const productsPerPage = 12;
  const numberOfPages = Math.ceil(products.length/productsPerPage);
  let pageTracker = 1;

  const url = new URL(window.location.href);
  const isSearchParam = url.searchParams.get('search');
  const urlPage = url.searchParams.get('page');
  if(urlPage) pageTracker = +urlPage;

  if(isSearchParam) {
    const product = products.filter(prod => {
      const prodName = prod.name.toLowerCase().includes(isSearchParam);
      const keywords = prod.keywords.some(keyword => keyword === isSearchParam.toLocaleLowerCase());
      if(prodName || keywords) return prod; 
    });
    products = [...product];
  }

  function renderHomePageHTML(){
    let html = '';
    const firstProd = (pageTracker - 1) * productsPerPage;
    const lastProd = productsPerPage * pageTracker;
    
    products.slice(firstProd,lastProd).forEach((product) => {

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
            document.querySelector(`.added-to-cart-${productId}`).style.opacity = 0; 
        },1000)

        addedTimeout = addedTimeoutMessage;

        cartObj.addToCart(productId,quantity);
        
    });
  });
  cartObj.updateCartQuantity('.cart-quantity');
};

  document.querySelector('.search-button')
    .addEventListener('click', async function(){
      const searchParam = await document.querySelector('.search-bar').value;
      window.location.href = `index.html?search=${searchParam}`;
    });

    window.addEventListener('keydown', async function(e){
      if(e.key === 'Enter'){
        const searchParam = await document.querySelector('.search-bar').value;
        window.location.href = `index.html?search=${searchParam}`;
      }
    });

  function renderPaginationHTML() {
    let html = '';
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




