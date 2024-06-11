

export function renderToastHTML(messageType = 'alert'){
    const toastGrid = document.querySelector('.toaster');
    const existingAlert = document.querySelector(`.${messageType}`);
    
    if (existingAlert) {
      clearTimeout(existingAlert.timeoutId);
      existingAlert.timeoutId = setTimeout(() => {
          existingAlert.classList.remove('show');
          setTimeout(() => existingAlert.remove(), 300);
      }, 3000);
      return;
    }
    

      let icon = 'fa-exclamation-circle';
      let text = 'Invalid quantity. Please choose from 1 to 99!'
      if(messageType === 'info') {
        icon = 'fa-exclamation-triangle';
        text = 'Product has been removed from cart!'
      }
      if(messageType === 'success') {
        icon = 'fa-check';
        text = "Product has been added to cart!"
      }
        const html = `<div class="toast ${messageType}" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <i class="fas ${icon} fa-lg me-2"></i>
          <strong class="me-auto">${messageType[0].toUpperCase() + messageType.slice(1)}</strong>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close">
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'><path d='M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z'/></svg>
          </button>
        </div>
        <div class="toast-body">
          ${text}
        </div>
      </div>`;
    
        toastGrid.insertAdjacentHTML("afterbegin", html);
    
        const newMessage = document.querySelector('.toast');
    
        setTimeout(() => {
            newMessage.classList.add('show');
        }, 10);
    
        document.querySelector('.btn-close').addEventListener('click', e => {
          e.target.closest('.toast').classList.remove('show');
          setTimeout(() => {
            e.target.closest('.toast').remove();
          },300)
        });
    
        newMessage.timeoutId = setTimeout(() => {
          newMessage.classList.remove('show');
          setTimeout(() => newMessage.remove(), 300);
      }, 3000);
    };