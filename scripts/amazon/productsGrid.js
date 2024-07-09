import { loadProducts, PRODUCTS_PER_PAGE } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import { renderSpinner, removeSpinner } from './spinner.js';
import cartObj from '../../data/cart.js';
import { renderPaginationHTML } from './pagination.js';
import { handleSearch } from '../../data/search.js';
import { calculatePagesNumber } from '../utils/pages.js';

export  async function renderHomePageHTML(pageTracker = 1, filterProd='all', passedProducts){
    
    renderSpinner();//renders the spinner until the products are rendered
    
    let products = passedProducts || await loadProducts();//getting the products list

    let html = '';

    let url = new URL(window.location.href);
    let isSearchParam = url.searchParams.get('search');
    const isPageParam = url.searchParams.get('page');

    let numberOfPages = calculatePagesNumber(products);//getting the amount of pages needed to be rendered, based on the products array length
    if(isPageParam && isPageParam < numberOfPages) pageTracker = +isPageParam;



    if(isSearchParam) {//checking if there is a product searched and if the value is either a keyword for a certain product, or a component of its name
        const product = products.filter(prod => {
            const prodName = prod.name.toLowerCase().includes(isSearchParam);
            const keywords = prod.keywords.some(keyword => keyword === isSearchParam.toLocaleLowerCase());
            if(prodName || keywords) return prod; //if so, then that product is being returned
        });
        modifiedProductsList = [...product];
    };

    if(filterProd && filterProd !== 'all'){
        const product = products.filter(prod => prod.keywords.includes(filterProd));
           products = [...product];
           numberOfPages = calculatePagesNumber(products);
        }

    $('.dropdown-item.filter').removeClass('active');
    $(`.${filterProd}`).addClass('active');
    
    $(`.sort`).on('click', function() {
        $('.sort').removeClass('active')
        $(this).addClass('active');
    })

    $('.filter').each(function(){
        $(this).on('click', e => {
            const filteredProd = e.target.dataset.filterProd;
            const newUrl = `index.html`;
            window.history.pushState({ path: newUrl }, '', newUrl);
           renderHomePageHTML(1,filteredProd)
        });
    });

    $('.sort').each(function(){
        $(this).on('click', e => {
            const sortVal = e.target.dataset.sortVal;

            if(sortVal === 'asc') {
                products = products.sort((a,b) => a.priceCents - b.priceCents);
            }else{
                products = products.sort((a,b) => b.priceCents - a.priceCents);
            }

            renderHomePageHTML(1,'all', products)
        });
    });

    const firstProd = (pageTracker - 1) * PRODUCTS_PER_PAGE;//setting the start index of the product to start with
    const lastProd = PRODUCTS_PER_PAGE * pageTracker; //setting the last index of the product to render on the page
    
    //based on amount of products per page, modifying the array to be displayed;
    let modifiedProductsList = products.slice(firstProd,lastProd);

    //setting an object of values that will be transmitted s parameters for pagination function
    const paginationParams = {
        isSearchParam,
        url,
        modifiedProductsList,
        pageTracker,
        numberOfPages,
        filterProd,
    };
//modifiedProductsList = modifiedProductsList.slice(filterProd,lastProd)    
//dinamically rendering the products, considering the pagination and if a product was search for or not
if(modifiedProductsList.length > 0){
    modifiedProductsList.forEach((product) => {
        html += `
        <div class="product-container">
        <div class="product-image-container">
        <img class="product-image"
            src="${product.image}" loading="lazy">
        </div>

        <div class="product-name limit-text-to-2-lines">
        ${product.name}
        </div>

        <div class="product-rating-container">
        <img class="product-rating-stars"
            src="images/ratings/rating-${product.rating.stars * 10 }.png" loading="lazy">
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
} else {
    html += `<h4 class="empty-message"> There is no such product. Plesea try again!</h4>`
}

    removeSpinner();//removing the spinner right before the DOM to be rendered

    $('.products-grid').html(html);
   
    const addToCartBtns = $('.add-to-cart-button');
//adding a pop-up that shows if a product was added to cart;
    addToCartBtns.each(function() {
    let addedTimeout;
    $(this).on('click', () => {

        const productId= $(this).data('product-id');
        
        const selectedProdQuant = $(`.js-quantity-selector-${productId}`);
        const quantity = +selectedProdQuant.val();

        $(`.added-to-cart-${productId}`).css('opacity', 1);

        if(addedTimeout) clearTimeout(addedTimeout);//if there is already a timeout, it is removed, and the time goes all over again.

        const addedTimeoutMessage = setTimeout(() => {
            if($(`.added-to-cart-${productId}`)){
            $(`.added-to-cart-${productId}`).css('opacity', 0); 
            }
        },1000)

        addedTimeout = addedTimeoutMessage;//resetting the timeout pointer to the newly one declared above;

        cartObj.addToCart(productId, +quantity);//adding the product to the cart
        
    });
    });
    cartObj.updateCartQuantity('.cart-quantity');//updating the UI whe is involved the quantity value
//handling the search initialization

    $('.search-button')
    .on('click', () => {
        handleSearch();
        renderHomePageHTML()
    });

    $(window).on('keydown', e => {
    if(e.key === 'Enter'){
        handleSearch();
        renderHomePageHTML()
    }
    });

    //rendering the pagination, based on the new parameters, such as pageTracker, or search params
    renderPaginationHTML(paginationParams, renderHomePageHTML);
};


