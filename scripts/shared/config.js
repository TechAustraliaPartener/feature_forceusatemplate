const Shopify = window.Shopify;

const config = {
  SELECTORS: {
    PREFIX: '.js-de-',
    get CART() {
      return `${this.PREFIX}cart`;
    },
    get CHECKOUT_INPUT() {
      return `${this.PREFIX}checkout`;
    },
    get LOGOUT() {
      return `${this.PREFIX}logout`;
    },
    get CART_COUNT() {
      return `${this.PREFIX}cart-count`;
    },
    get CUSTOMER_ID() {
      return `${this.PREFIX}cid`;
    },
    CHECKOUT: {
      get STEP() {
        return Shopify && Shopify.Checkout && Shopify.Checkout.step;
      },
      get PAGE() {
        return Shopify && Shopify.Checkout && Shopify.Checkout.page;
      },
      get IS_CONTACT_INFO_STEP() {
        // @see https://help.shopify.com/en/themes/development/layouts/checkout/#shopify-checkout-step
        return this.STEP === 'contact_information';
      },
      get IS_STOCK_PROBLEMS_PAGE() {
        // @see https://help.shopify.com/en/themes/development/layouts/checkout/#shopify-checkout-page
        return this.PAGE === 'stock_problems';
      },
      URLS: {
        ROOT_URL: '/',
        get CART_URL() {
          return `${this.ROOT_URL}cart`;
        }
      },
      TEXT: {
        CART_TEXT: 'Cart'
      },
      CLASSES: {
        BREADCRUMBS: {
          BC_ROOT: 'breadcrumb',
          get PREFIX() {
            return `${this.BC_ROOT}__`;
          },
          get BC_LINK() {
            return `${this.PREFIX}link`;
          },
          get BC_ITEM() {
            return `${this.PREFIX}item`;
          },
          get BC_ITEM_COMPLETED() {
            return `${this.BC_ITEM}--completed`;
          },
          get BC_CHEVRON_ICON() {
            return `${this.PREFIX}chevron-icon`;
          }
        },
        STEPS: {
          STEP_ROOT: 'step',
          get PREFIX() {
            return `${this.STEP_ROOT}__`;
          },
          get STEP_FOOTER() {
            return `${this.PREFIX}footer`;
          },
          get STEP_FOOTER_PREVIOUS_LINK() {
            return `${this.STEP_FOOTER}__previous-link`;
          }
        },
        LOGO: 'logo'
      },
      ATTRIBUTES: {
        BREADCRUMBS: {
          DATA_TREKKIE_ID: {
            TREKKIE_NAME: 'data-trekkie-id',
            get TREKKIE_VALUE() {
              return `${
                config.SELECTORS.CHECKOUT.CLASSES.BREADCRUMBS.BC_ROOT
              }_cart_link`;
            }
          }
        }
      }
    }
  },
  STOREFRONT_API: {
    HEADER_NAME: 'X-Shopify-Storefront-Access-Token',
    KEY: process.env.STOREFRONT_API_KEY
  }
};

export default config;
