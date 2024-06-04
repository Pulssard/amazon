import { calculatePagesNumber } from '../utils/pages.js';

export function renderPaginationHTML({isSearchParam,modifiedProductsList,numberOfPages,pageTracker}, renderHomePageHTML) {
    let html = '';

    if(isSearchParam){
      numberOfPages = calculatePagesNumber(modifiedProductsList)//if the product is being searched, redeclare the number of pages(based on the modified list => sliced, or searched product) 
    }
    
    for(let i=1; i<=numberOfPages; i++){//dynamically rendering the amount of pages, and if the pageTracker=== i, the the page-items is given the active class
      html += `
      <li class="page-item" style="cursor:pointer"><a class="page-link ${pageTracker === i ? 'active' : ''}" >${i}</a></li>
      `;
    }
    document.querySelector('.pagination').innerHTML = html;
    
    document.querySelectorAll('.page-item')
    .forEach(pageNum => {
      pageNum.addEventListener('click', async function(){
        document.querySelector('.main').scrollIntoView({behavior:'smooth'});//scrolls to the top of the page, after the page was changed
        pageTracker = +pageNum.textContent;
        const newUrl = `index.html?page=${pageTracker}`;
        window.history.pushState({ path: newUrl }, '', newUrl);//setting the page parameter in the url
        renderHomePageHTML(pageTracker);//re-rendering the home page, based on the current pagetracker value(chosen page);
      });
    });
  };