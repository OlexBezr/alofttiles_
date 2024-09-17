// disable scale on iphone
if (/iPhone/.test(navigator.userAgent) && !window.MSStream)
{
    jQuery(document).on("focus", "input, textarea, select", function()
    {
        jQuery('meta[name=viewport]').remove();
        jQuery('head').append('<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">');
    });

    jQuery(document).on("blur", "input, textarea, select", function()
    {
        jQuery('meta[name=viewport]').remove();
        jQuery('head').append('<meta name="viewport" content="width=device-width, initial-scale=1">');
    });
}
// card-product - color variations
document.addEventListener("DOMContentLoaded", function() {
  if(document.querySelector('.product-card .color-variations-wrapper') && window.innerWidth <= 480) {
    document.querySelectorAll('.color-variations-wrapper').forEach( (color_variations) => {
      if(color_variations.querySelector('.show-more-colors')) {
        
        let count = 0
        let count_remmoved = 0
        let count_show_more = parseInt(color_variations.querySelector('.show-more-colors span').innerHTML)
        color_variations.querySelectorAll('.color-variation').forEach(color_var => {
          if(count >= 3) {
            count_remmoved+=1
            color_var.style.display = 'none'
          }
          count+=1
        })
        color_variations.querySelector('.show-more-colors span').innerHTML = (count_show_more + count_remmoved) + ' more'
      }
    })
  }
});


function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

var dispatchCustomEvent = function dispatchCustomEvent(eventName) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var detail = {
    detail: data
  };
  var event = new CustomEvent(eventName, data ? detail : null);
  document.dispatchEvent(event);
};

/**
 *  @class
 *  @function Quantity
 */
if (!customElements.get('quantity-selector')) {
  class QuantityInput extends HTMLElement {
    constructor() {
      super();
      this.id = this.getAttribute('data-id');
      this.input = this.querySelector('.qty');
      this.step = this.input.getAttribute('step');
      this.productType = this.getAttribute('data-type-product') ? this.getAttribute('data-type-product') : ''; 
      this.changeEvent = new Event('change', {
        bubbles: true
      });
      // Create buttons
      this.subtract = this.querySelector('.minus');
      this.add = this.querySelector('.plus');

      // Add functionality to buttons
      this.subtract.addEventListener('click', () => this.change_quantity(-1 * this.step));
      this.add.addEventListener('click', () => this.change_quantity(1 * this.step));
      // if (this.productType === 'Sample') {
      //   if(this.input.value > 2) {
      //     this.input.value = 2;
      //     this.input.dispatchEvent(this.changeEvent);
      //   }
      // }
    }
    connectedCallback() {
      this.classList.add('buttons_added');
    }
    change_quantity(change) {
      // Get current value
      let quantity = Number(this.input.value);

      // Ensure quantity is a valid number
      if (isNaN(quantity)) quantity = 1;

      // Check for min & max
      if (this.input.getAttribute('min') > (quantity + change)) {
        return;
      }
      if (this.input.getAttribute('max')) {
        if (this.input.getAttribute('max') < (quantity + change)) {
          return;
        }
      }
      // Change quantity
      quantity += change;

      let errorQuantityWrapper = document.querySelector('[data-error-for="'+this.getAttribute('data-id')+'"]')
      
      if(quantity >= 3 && this.productType === 'Sample') {
        errorQuantityWrapper.querySelector('.product-quantity-message-wrapper').style.display = 'block'
        quantity = 2
       function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        async function wait(ms, _this) {
          await sleep(ms);
          quantity = Math.max(quantity, 1);
          console.log(_this)
          _this.input.value = quantity;
    
          _this.input.dispatchEvent(_this.changeEvent);
        }
        wait(3000, this)
        return;
      }else if(this.productType === 'Sample') {
        errorQuantityWrapper.querySelector('.product-quantity-message-wrapper').style.display = 'none'
      }

      // Ensure quantity is always a number
      quantity = Math.max(quantity, 1);

      // Output number
      this.input.value = quantity;

      this.input.dispatchEvent(this.changeEvent);
    }
  }
  customElements.define('quantity-selector', QuantityInput);
}

/**
 *  @class
 *  @function ArrowSubMenu
 */
class ArrowSubMenu {

  constructor(self) {
    this.submenu = self.parentNode.querySelector('.sub-menu');
    this.arrow = self;
    // Add functionality to buttons
    self.addEventListener('click', (e) => this.toggle_submenu(e));
  }

  toggle_submenu(e) {
    e.preventDefault();
    let submenu = this.submenu;

    if (!submenu.classList.contains('active')) {
      submenu.classList.add('active');

    } else {
      submenu.classList.remove('active');
      this.arrow.blur();
    }
  }
}
let arrows = document.querySelectorAll('.thb-arrow');
arrows.forEach((arrow) => {
  new ArrowSubMenu(arrow);
});

/**
 *  @class
 *  @function ProductCard
 */
if (!customElements.get('product-card')) {
  class ProductCard extends HTMLElement {
    constructor() {
      super();
      this.swatches = this.querySelector('.product-card-swatches');
      this.image = this.querySelector('.product-featured-image-link .product-primary-image');
      this.quick_add = this.querySelector('.product-card--add-to-cart-button-simple');
    }
    connectedCallback() {
      if (this.swatches) {
        this.enableSwatches();
      }
      if (this.quick_add) {
        this.enableQuickView();
      }
    }
    enableSwatches() {
      let swatch_list = this.swatches.querySelectorAll('.product-card-swatch'),
        org_srcset = this.image ? this.image.dataset.srcset : '',
        active = this.swatches.querySelector('.product-card-swatch.active');


      swatch_list.forEach((swatch, index) => {

        swatch.addEventListener('mouseover', () => {

          [].forEach.call(swatch_list, function(el) {
            el.classList.remove('active');
          });
          if (this.image) {
            if (swatch.dataset.srcset) {
              this.image.setAttribute('srcset', swatch.dataset.srcset);
            } else {
              this.image.setAttribute('srcset', org_srcset);
            }
          }

          swatch.classList.add('active');
        });
        swatch.addEventListener('click', function(evt) {
          window.location.href = this.dataset.href;
          evt.preventDefault();
        });
      });
    }
    enableQuickView() {
      this.quick_add.addEventListener('click', this.quickAdd.bind(this));
    }

    quickAdd(evt) {
      evt.preventDefault();
      if (this.quick_add.disabled) {
        return;
      }
      this.quick_add.classList.add('loading');
      this.quick_add.setAttribute('aria-disabled', true);

      const config = {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/javascript'
        }
      };

      let formData = new FormData(this.form);

      formData.append('id', this.quick_add.dataset.productId);
      formData.append('quantity', 1);
      formData.append('sections', this.getSectionsToRender().map((section) => section.section));
      formData.append('sections_url', window.location.pathname);

      config.body = formData;

      fetch(`${theme.routes.cart_add_url}`, config)
        .then((response) => response.json())
        .then((response) => {
          if (response.status) {
            return;
          }
          this.renderContents(response);

          dispatchCustomEvent('cart:item-added', {
            product: response.hasOwnProperty('items') ? response.items[0] : response
          });
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          this.quick_add.classList.remove('loading');
          this.quick_add.removeAttribute('aria-disabled');
        });

      return false;
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
        document.body.classList.add('open-cc');
        document.getElementById('Cart-Drawer').classList.add('active');

        dispatchCustomEvent('cart-drawer:open');
      }

    }
    getSectionInnerHTML(html, selector = '.shopify-section') {
      return new DOMParser()
        .parseFromString(html, 'text/html')
        .querySelector(selector).innerHTML;
    }
  }
  customElements.define('product-card', ProductCard);
}

/**
 *  @class
 *  @function PanelClose
 */
class PanelClose extends HTMLElement {

  constructor() {
    super();
    let cc = document.querySelector('.click-capture');

    // Add functionality to buttons
    this.addEventListener('click', (e) => this.close_panel(e));
    document.addEventListener('keyup', (e) => {
      if (e.code) {
        if (e.code.toUpperCase() === 'ESCAPE') {
          document.querySelectorAll('.side-panel').forEach((panel) => {
            panel.classList.remove('active');
            document.body.classList.remove('open-cc');
          });
        }
      }
    });
    cc.addEventListener('click', (e) => {
      document.body.classList.remove('open-cc');
      if (document.querySelector('.side-panel.active')) {
        document.querySelector('.side-panel.active').classList.remove('active');
      }
    });
  }

  close_panel(e) {
    e.preventDefault();
    let panel = e.target.closest('.side-panel');
    panel.classList.remove('active');
    document.body.classList.remove('open-cc');
  }
}
customElements.define('side-panel-close', PanelClose);

/**
 *  @class
 *  @function CartDrawer
 */
class CartDrawer {

  constructor() {
    this.container = document.getElementById('Cart-Drawer');

    if (!this.container) {
      return;
    }
    let _this = this,
      button = document.getElementById('cart-drawer-toggle'),
      quantities = this.container.querySelectorAll('.quantity input'),
      removes = this.container.querySelectorAll('.remove');

    if (!button) {
      return;
    }
    // Add functionality to buttons
    button.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.classList.add('open-cc');
      this.container.classList.add('active');
      this.container.focus();

      dispatchCustomEvent('cart-drawer:open');
    });


    this.debouncedOnChange = debounce((event) => {
      this.onChange(event);
    }, 300);

    this.container.addEventListener('change', this.debouncedOnChange.bind(this));

    this.notesToggle();
    this.removeProductEvent();
    // Terms checkbox
    this.termsCheckbox();
  }
  onChange(event) {
    if (event.target.classList.contains('qty')) {
      this.updateQuantity(event.target.dataset.index, event.target.value);
    }
    this.removeProductEvent();
  }
  removeProductEvent() {
    let removes = this.container.querySelectorAll('.remove');

    removes.forEach((remove) => {
      remove.addEventListener('click', (event) => {
        this.updateQuantity(event.target.dataset.index, '0');

        event.preventDefault();
      });
    });
  }
  getSectionsToRender() {
    return [{
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
  getSectionInnerHTML(html, selector) {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector).innerHTML;
  }
  termsCheckbox() {
    let terms_checkbox = this.container.querySelector('#CartDrawerTerms'),
      checkout_button = this.container.querySelector('.button.checkout');

    if (terms_checkbox && checkout_button) {
      terms_checkbox.setCustomValidity(theme.strings.requiresTerms);
      checkout_button.addEventListener('click', function(e) {
        if (!terms_checkbox.checked) {
          terms_checkbox.reportValidity();
          terms_checkbox.focus();
          e.preventDefault();
        }
      });
    }
  }
  notesToggle() {
    let notes_toggle = document.getElementById('order-note-toggle');

    if (!notes_toggle) {
      return;
    }

    notes_toggle.addEventListener('click', (event) => {
      notes_toggle.nextElementSibling.classList.add('active');
    });
    notes_toggle.nextElementSibling.querySelectorAll('.button, .order-note-toggle__content-overlay').forEach((el) => {
      el.addEventListener('click', (event) => {
        notes_toggle.nextElementSibling.classList.remove('active');
        this.saveNotes();
      });
    });
  }
  saveNotes() {
    fetch(`${theme.routes.cart_update_url}.js`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': `application/json`
      },
      body: JSON.stringify({
        'note': document.getElementById('mini-cart__notes').value
      })
    });
  }
  updateQuantity(line, quantity) {
    this.container.querySelector(`#CartDrawerItem-${line}`).classList.add('thb-loading');
    const body = JSON.stringify({
      line,
      quantity,
      sections: this.getSectionsToRender().map((section) => section.section),
      sections_url: window.location.pathname
    });
    dispatchCustomEvent('line-item:change:start', {
      quantity: quantity
    });
    fetch(`${theme.routes.cart_change_url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': `application/json`
        },
        ...{
          body
        }
      })
      .then((response) => {
        return response.text();
      })
      .then((state) => {
        const parsedState = JSON.parse(state);


        this.getSectionsToRender().forEach((section => {
          const elementToReplace = document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);

          elementToReplace.innerHTML = this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);

        }));

        this.removeProductEvent();
        this.notesToggle();
        this.termsCheckbox();

        dispatchCustomEvent('line-item:change:end', {
          quantity: quantity,
          cart: parsedState
        });
        if (this.container.querySelector(`#CartDrawerItem-${line}`).length) {
          this.container.querySelector(`#CartDrawerItem-${line}`).classList.remove('thb-loading');
        }
      });
  }
}

/**
 *  @class
 *  @function QuickView
 */
if (!customElements.get('quick-view')) {
  class QuickView extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.cc = document.querySelector('.click-capture');
      this.drawer = document.getElementById('Product-Drawer');
      this.body = document.body;

      this.addEventListener('click', this.setupEventListener.bind(this));
      this.cc.addEventListener('click', this.setupCCEventListener.bind(this));

    }
    setupCCEventListener(e) {
      this.body.classList.remove('open-cc');
      this.drawer.classList.remove('active');
      this.drawer.querySelector('#Product-Drawer-Content').innerHTML = '';
    }
    setupEventListener(e) {
      e.preventDefault();
      let productHandle = this.dataset.productHandle,
        href = `${theme.routes.root_url}/products/${productHandle}?view=quick-view`;

      // remove double `/` in case shop might have /en or language in URL
      href = href.replace('//', '/');
      if (!href || !productHandle) {
        return;
      }
      if (this.classList.contains('loading')) {
        return;
      }
      this.classList.add('loading');
      fetch(href, {
          method: 'GET'
        })
        .then((response) => {
          this.classList.remove('loading');
          return response.text();
        })
        .then(text => {
          const sectionInnerHTML = new DOMParser()
            .parseFromString(text, 'text/html')
            .querySelector('#Product-Drawer-Content').innerHTML;

          this.renderQuickview(sectionInnerHTML, href, productHandle);

        });
    }
    renderQuickview(sectionInnerHTML, href, productHandle) {
      if (sectionInnerHTML) {

        this.drawer.querySelector('#Product-Drawer-Content').innerHTML = sectionInnerHTML;

        let js_files = this.drawer.querySelector('#Product-Drawer-Content').querySelectorAll('script');

        if (js_files.length > 0) {
          var head = document.getElementsByTagName('head')[0];
          js_files.forEach((js_file, i) => {
            let script = document.createElement('script');
            script.src = js_file.src;
            head.appendChild(script);
          });
        }

        setTimeout(() => {
          new ProductQuickSlider();
          if (Shopify && Shopify.PaymentButton) {
            Shopify.PaymentButton.init();
          }
          if (window.ProductModel) {
            window.ProductModel.loadShopifyXR();
          }
        }, 300);



        this.body.classList.add('open-cc');
        this.drawer.classList.add('active');
        this.drawer.querySelector('.side-panel-close').focus();

        dispatchCustomEvent('quick-view:open', {
          productUrl: href,
          productHandle: productHandle
        });
      }
    }
  }
  customElements.define('quick-view', QuickView);
}

/**
 *  @class
 *  @function ModalDialog
 */
class ModalDialog extends HTMLElement {
  constructor() {
    super();
    this.querySelector('[id^="ModalClose-"]').addEventListener(
      'click',
      this.hide.bind(this)
    );
    this.addEventListener('keyup', (event) => {
      if (event.code.toUpperCase() === 'ESCAPE') this.hide();
    });
    if (this.classList.contains('media-modal')) {
      this.addEventListener('pointerup', (event) => {
        if (event.pointerType === 'mouse' && !event.target.closest('product-model')) this.hide();
      });
    } else {
      this.addEventListener('click', (event) => {
        if (event.target.nodeName === 'MODAL-DIALOG') this.hide();
      });
    }
  }

  connectedCallback() {
    if (this.moved) return;
    this.moved = true;
    document.body.appendChild(this);
  }

  show(opener) {
    this.openedBy = opener;
    document.body.classList.add('overflow-hidden');
    this.setAttribute('open', '');
  }

  hide() {
    document.body.classList.remove('overflow-hidden');
    this.removeAttribute('open');
    this.querySelectorAll('.js-youtube').forEach((video) => {
      video.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
    });
    this.querySelectorAll('.js-vimeo').forEach((video) => {
      video.contentWindow.postMessage('{"method":"pause"}', '*');
    });
    this.querySelectorAll('video').forEach((video) => video.pause());
  }
}
customElements.define('modal-dialog', ModalDialog);

class ModalOpener extends HTMLElement {
  constructor() {
    super();

    const button = this.querySelector('button');

    if (!button) return;
    button.addEventListener('click', () => {
      const modal = document.querySelector(this.getAttribute('data-modal'));
      if (modal) modal.show(button);
    });
  }
}
customElements.define('modal-opener', ModalOpener);

/**
 *  @class
 *  @function ProductRecommendations
 */
class ProductRecommendations extends HTMLElement {
  constructor() {
    super();

  }
  fetchProducts() {
    fetch(this.dataset.url)
      .then(response => response.text())
      .then(text => {
        const html = document.createElement('div');
        html.innerHTML = text;
        const recommendations = html.querySelector('product-recommendations');

        if (recommendations && recommendations.innerHTML.trim().length) {
          this.innerHTML = recommendations.innerHTML;
        }

        this.classList.add('product-recommendations--loaded');
      })
      .catch(e => {
        console.error(e);
      });
  }
  connectedCallback() {
    this.fetchProducts();
  }
}

customElements.define('product-recommendations', ProductRecommendations);

/**
 *  @class
 *  @function Localization
 */
class Localization {
  constructor() {
    let _this = this;
    // resize on initial load
    document.querySelectorAll(".thb-localization-forms").forEach((localization) => {
      localization.addEventListener("change", (e) => {
        localization.querySelector('form').submit();
      });
    });
  }
}



/**
 *  @class
 *  @function SelectWidth
 */
class SelectWidth {
  constructor() {
    let _this = this;
    // resize on initial load
    document.querySelectorAll(".resize-select").forEach(_this.resizeSelect);

    // delegated listener on change
    document.body.addEventListener("change", (e) => {
      if (e.target.matches(".resize-select") && e.target.offsetParent !== null) {
        _this.resizeSelect(e.target);
      }
    });
    window.addEventListener('resize.resize-select', function() {
      document.querySelectorAll(".resize-select").forEach(_this.resizeSelect);
    });
  }

  resizeSelect(sel) {
    let tempOption = document.createElement('option');
    tempOption.textContent = sel.selectedOptions[0].textContent;

    let tempSelect = document.createElement('select');
    tempSelect.style.visibility = "hidden";
    tempSelect.style.position = "fixed";
    tempSelect.appendChild(tempOption);

    sel.after(tempSelect);
    if (tempSelect.clientWidth > 0) {
      sel.style.width = `${+tempSelect.clientWidth + 12}px`;
    }
    tempSelect.remove();
  }
}

/**
 *  @class
 *  @function CollapsibleRow
 */
if (!customElements.get('collapsible-row')) {
  // https://css-tricks.com/how-to-animate-the-details-element/
  class CollapsibleRow extends HTMLElement {
    constructor() {
      super();

      this.details = this.querySelector('details');
      this.summary = this.querySelector('summary');
      this.content = this.querySelector('.collapsible__content');

      // Store the animation object (so we can cancel it if needed)
      this.animation = null;
      // Store if the element is closing
      this.isClosing = false;
      // Store if the element is expanding
      this.isExpanding = false;
    }
    connectedCallback() {
      this.setListeners();
    }
    setListeners() {
      this.querySelector('summary').addEventListener('click', (e) => this.onClick(e));
    }
    prepareAnimations() {
      let _this = this,
        summary_height = this.querySelector('summary').offsetHeight,
        content_height = this.querySelector('.collapsible__content').offsetHeight,
        initial_height = summary_height,
        final_height = summary_height + content_height;

      this.tl = false;
      this.tl = gsap.timeline({
        reversed: !_this.details.open,
        paused: true,
        inherit: false,
        ease: 'none',
        onStart: function() {
          _this.details.open = true;
          _this.details.style.overflow = 'hidden';
        },
        onReverseComplete: function() {
          _this.details.open = false;
          _this.details.style.overflow = '';
        }
      });

      this.tl
        .fromTo(_this.details, {
          height: function() {
            let h = Math.max(Math.max(initial_height, 0), 24);
            return h;
          },
          clearProps: 'height'
        }, {
          duration: 0.4,
          height: final_height,
          clearProps: 'height'
        });

      if (this.details.open) {
        this.tl.progress(1);
      }
    }
    instantClose() {
      this.tl.timeScale(10).reverse();
    }
    animateClose() {
      this.tl.timeScale(3).reverse();
    }
    animateOpen() {
      this.tl.timeScale(1).play();
    }
    onClick(e) {
      // Stop default behaviour from the browser
      e.preventDefault();
      // Add an overflow on the <details> to avoid content overflowing
      this.details.style.overflow = 'hidden';
      // Check if the element is being closed or is already closed
      if (this.isClosing || !this.details.open) {
        this.open();
        // Check if the element is being openned or is already open
      } else if (this.isExpanding || this.details.open) {
        this.shrink();
      }
    }
    shrink() {
      // Set the element as "being closed"
      this.isClosing = true;

      // Store the current height of the element
      const startHeight = `${this.details.offsetHeight}px`;
      // Calculate the height of the summary
      const endHeight = `${this.summary.offsetHeight}px`;

      // If there is already an animation running
      if (this.animation) {
        // Cancel the current animation
        this.animation.cancel();
      }

      // Start a WAAPI animation
      this.animation = this.details.animate({
        // Set the keyframes from the startHeight to endHeight
        height: [startHeight, endHeight]
      }, {
        duration: 250,
        easing: 'ease'
      });

      // When the animation is complete, call onAnimationFinish()
      this.animation.onfinish = () => this.onAnimationFinish(false);
      // If the animation is cancelled, isClosing variable is set to false
      this.animation.oncancel = () => this.isClosing = false;
    }

    open() {
      // Apply a fixed height on the element
      this.details.style.height = `${this.details.offsetHeight}px`;
      // Force the [open] attribute on the details element
      this.details.open = true;
      // Wait for the next frame to call the expand function
      window.requestAnimationFrame(() => this.expand());
    }

    expand() {
      // Set the element as "being expanding"
      this.isExpanding = true;
      // Get the current fixed height of the element
      const startHeight = `${this.details.offsetHeight}px`;
      // Calculate the open height of the element (summary height + content height)
      const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`;

      // If there is already an animation running
      if (this.animation) {
        // Cancel the current animation
        this.animation.cancel();
      }

      // Start a WAAPI animation
      this.animation = this.details.animate({
        // Set the keyframes from the startHeight to endHeight
        height: [startHeight, endHeight]
      }, {
        duration: 400,
        easing: 'ease-out'
      });
      // When the animation is complete, call onAnimationFinish()
      this.animation.onfinish = () => this.onAnimationFinish(true);
      // If the animation is cancelled, isExpanding variable is set to false
      this.animation.oncancel = () => this.isExpanding = false;
    }

    onAnimationFinish(open) {
      // Set the open attribute based on the parameter
      this.details.open = open;
      // Clear the stored animation
      this.animation = null;
      // Reset isClosing & isExpanding
      this.isClosing = false;
      this.isExpanding = false;
      // Remove the overflow hidden and the fixed height
      this.details.style.height = this.details.style.overflow = '';
    }
  }
  customElements.define('collapsible-row', CollapsibleRow);
}

/**
 *  @class
 *  @function ProductQuickSlider
 */
class ProductQuickSlider {
  constructor() {
    this.container = document.getElementById('Product-Quick-Slider');

    if (!this.container) {
      return;
    }

    const flkty = new Flickity(this.container, {
      contain: true,
      cellAlign: 'left',
      pageDots: false,
      freeScroll: true,
      initialIndex: '.is-initial-selected',
      prevNextButtons: false,
      cellSelector: '.product-quick-images__slide'
    });
    let scrollbar = document.querySelector('.product-quick-images__scrollbar>div');
    flkty.on('scroll', function(progress) {
      progress = Math.max(0, Math.min(1, progress));
      scrollbar.style.transform = 'scaleX(' + progress + ')';
    });

  }
}
if (typeof SelectWidth !== 'undefined') {
  new SelectWidth();
}
document.addEventListener('DOMContentLoaded', () => {

  if (typeof Localization !== 'undefined') {
    new Localization();
  }
  if (typeof CartDrawer !== 'undefined') {
    new CartDrawer();
  }

});

 // ---custom
if(document.querySelector('.bundle_add_button')) {
  $(document).on('click', '.bundle_add_button', function(e) {
    e.preventDefault()
    let button = this
    $(button).addClass('loading')
    let productIds = JSON.parse($(button).attr('data-list-products'));
    let cart;
    let currentIndex = 0;

    function update_cart(start=0) {
      $.ajax({
        type: 'GET',
        url: '/cart.js',
        dataType: 'json',
        success: function(response) {
          cart = response
          console.log(cart)
          if(start) {
            processProduct();
          }
        },
        error: function(xhr, status, error) {
          console.error('Error getting cart:', error);
        }
      });
    }
    // Функция для проверки количества товара в корзине
    function checkProductInCart(cart, productId) {
      for (let item of cart.items) {
        if (item.id == productId) {
          return item.quantity;
        }
      }
      return 0;
    }
    function addToCartAjax(productId, quantity) {
      return new Promise(function(resolve, reject) {
        $.ajax({
          type: 'POST',
          url: '/cart/add',
          data: {
            id: productId,
            quantity: quantity
          },
          success: function() {
            console.log('Product added to cart successfully.');
            resolve();
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error adding product to cart.');
            reject(textStatus);
          }
        });
      });
    }

    function processProduct() {
     
      if (currentIndex < productIds.length) {
        var productId = productIds[currentIndex];
        currentIndex++;
        const currentQuantity = checkProductInCart(cart, productId);
        let errorMessageWrapper = document.querySelector('.product-information .product-quantity-message-wrapper')
        if(errorMessageWrapper) {
          errorMessageWrapper.style.display = 'none'
        }
        if (currentQuantity < 2) {
          addToCartAjax(productId, 1)
            .then(processProduct)
            .catch(function(error) {
              console.error('Error in addToCartAjax:', error);
            });
        }
        else{
          if(errorMessageWrapper) {
            errorMessageWrapper.style.display = 'block'
          }
          processProduct()
        }
          
      } else {
       
         $.ajax({
          type: 'GET',
          url: '/',
          success: function(res) {
            let new_minicart =  new DOMParser().parseFromString(res, 'text/html').querySelector('#Cart-Drawer').innerHTML,
                count =  new DOMParser().parseFromString(res, 'text/html').querySelector('.thb-item-count').innerHTML;

            $('.thb-item-count').html(count)
            document.querySelector('#Cart-Drawer').innerHTML = new_minicart;
             new CartDrawer();
            
          },
        });
        $(button).removeClass('loading')
        
        console.log('All products added to cart successfully.');
      }
    }

    update_cart(1);
        
  })
}



// ---custom