/**
 *  @class
 *  @function ProductForm
 */
window.onload = function() {
  
  if (!customElements.get('product-form')) {
    customElements.define('product-form', class ProductForm extends HTMLElement {
      constructor() {
        super();
        this.form = this.querySelector('form');
        this.form.querySelector('[name=id]').disabled = false;
        this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
        this.cartNotification = document.querySelector('cart-notification');
        this.body = document.body;
  
        this.hideErrors = this.dataset.hideErrors === 'true';
      }
  
      onSubmitHandler(evt) {
        evt.preventDefault();
        if (!this.form.reportValidity()) {
          return;
        }
        const submitButton = this.querySelector('[type="submit"]');
        if (submitButton.classList.contains('loading')) return;
  
        this.handleErrorMessage();
  
        submitButton.setAttribute('aria-disabled', true);
        submitButton.classList.add('loading');
  
        const config = {
          method: 'POST',
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/javascript'
          }
        };
        const formData = new FormData(this.form);
        formData.append('sections', this.getSectionsToRender().map((section) => section.section));
        formData.append('sections_url', window.location.pathname);
        config.body = formData;
        fetch(`${theme.routes.cart_add_url}`, config)
          .then((response) => response.json())
          .then((response) => {
            if (response.status) {
              dispatchCustomEvent('product:variant-error', {
                source: 'product-form',
                productVariantId: formData.get('id'),
                errors: response.description,
                message: response.message
              });
              this.handleErrorMessage(response.description);
              return;
            }
           
            this.renderContents(response);
           if(response.quantity >= 3) {
              let errorQuantityWrapper = document.querySelector('[data-error-for="'+response.key+'"]')
              
              let quantityWrapper = document.querySelector('.quantity[data-id="'+response.key+'"]')

              if(errorQuantityWrapper) {
                errorQuantityWrapper.querySelector('.product-quantity-message-wrapper').style.display = 'block'
              }
              
              function sleep(ms) {
                  return new Promise(resolve => setTimeout(resolve, ms));
              }
              async function wait(ms) {
                await sleep(ms);
                quantityWrapper.querySelector('.qty').value = 1
                quantityWrapper.querySelector('.plus').click()
              }
              wait(3000)
              
            }
          })
          .catch((e) => {
            console.error(e);
          })
          .finally(() => {
            submitButton.classList.remove('loading');
            submitButton.removeAttribute('aria-disabled');
          });
      }
  
      getSectionsToRender() {
        return [{
          id: 'Cart',
          section: 'main-cart',
          selector: '.thb-cart-form'
        },
        {
          id: 'Cart-Drawer',
          section: 'cart-drawer',
          selector: '.cart-drawer'
        },
        {
          id: 'cart-drawer-toggle',
          section: 'cart-bubble',
          selector: '.thb-item-count'
        }];
      }
      renderContents(parsedState) {
        this.getSectionsToRender().forEach((section => {
          if (!document.getElementById(section.id)) {
            return;
          }
          const elementToReplace = document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);
          elementToReplace.innerHTML = this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);
          if (typeof CartDrawer !== 'undefined') {
            new CartDrawer();
     
          }
          if (typeof Cart !== 'undefined') {
            new Cart().renderContents(parsedState);
          }
        }));
  
  
        if (document.getElementById('Cart-Drawer')) {
          this.body.classList.add('open-cc');
          document.getElementById('Cart-Drawer').classList.add('active');
  
          dispatchCustomEvent('cart-drawer:open');
        }
  
        let product_drawer = document.getElementById('Product-Drawer');
        if (product_drawer && product_drawer.contains(this)) {
          product_drawer.classList.remove('active');
  
          if (!document.getElementById('Cart-Drawer')) {
            this.body.classList.remove('open-cc');
          }
        }
      }
      getSectionInnerHTML(html, selector = '.shopify-section') {
        return new DOMParser()
          .parseFromString(html, 'text/html')
          .querySelector(selector).innerHTML;
      }
      handleErrorMessage(errorMessage = false) {
        if (this.hideErrors) return;
        this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
        this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');
  
        this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);
  
        if (errorMessage) {
          this.errorMessage.textContent = errorMessage;
        }
      }
    });
  }
}
  