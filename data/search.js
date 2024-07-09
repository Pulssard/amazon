
export function handleSearch(){//handles the search function
    const searchParam = $('.search-bar').val().toLowerCase();//getting the value from the input

    if(searchParam){
      const newUrl = `index.html?search=${searchParam}`;
      window.history.pushState({ path: newUrl }, '', newUrl);//setting the value as search param
    }
};