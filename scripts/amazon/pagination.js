import { calculatePagesNumber } from '../utils/pages.js';

export function renderPaginationHTML({isSearchParam,modifiedProductsList,numberOfPages,pageTracker,filterProd}, renderHomePageHTML) {
    let html = '';

    if(isSearchParam){
      numberOfPages = calculatePagesNumber(modifiedProductsList)//if the product is being searched, redeclare the number of pages(based on the modified list => sliced, or searched product) 
    }
    
    for(let i=1; i<=numberOfPages; i++){//dynamically rendering the amount of pages, and if the pageTracker=== i, the the page-items is given the active class
      html += `
      <li class="page-item" style="cursor:pointer"><a class="page-link ${pageTracker === i ? 'active' : ''}" >${i}</a></li>
      `;
    }
    $('.pagination').html(html);
    
    $('.page-item')
    .each(function() {
      $(this).on('click', async () => {
        //scrolls to the top of the page, after the page was changed
        window.scrollTo({
          top: 0,
          behavior: 'smooth' // Smooth scrolling
      });
      
        //Update the page tracker value
        pageTracker = $(this).text();
        
        //setting the page parameter in the url
        const newUrl = `index.html?page=${pageTracker}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
        
        //re-rendering the home page, based on the current pagetracker value(chosen page);
        renderHomePageHTML(+pageTracker,filterProd);
      });
    });
  };