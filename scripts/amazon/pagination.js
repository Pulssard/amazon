import {PRODUCTS_PER_PAGE} from '../../data/products.js';
import { renderSpinner } from './spinner.js';

export function renderPaginationHTML(isSearchParam,modifiedProductsList,numberOfPages,pageTracker,renderHomePageHTML) {
    let html = '';

    if(isSearchParam){
      numberOfPages = Math.ceil(modifiedProductsList.length/PRODUCTS_PER_PAGE);
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
        renderSpinner();
        pageTracker = +pageNum.textContent;
        const newUrl = `index.html?page=${pageTracker}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
        renderPaginationHTML();
        renderHomePageHTML();
      });
    });
  };