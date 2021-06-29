/* global CartJS, Shopify */

import $ from 'jquery';
import Vue from 'vue/dist/vue.esm.js';
import * as carouselSwiper from '../product-page/carousel-swiper';

Vue.config.errorHandler = (err, vm, info) => {
  var cart = CartJS.cart || window.vars.cartPayload;
  var logCart = {
    attributes: cart.attributes,
    item_count: cart.item_count,
    token: cart.token,
    items: cart.items.map(item => {
      return {
        title: item.title,
        handle: item.handle,
        product_id: item.product_id,
        variant_id: item.variant_id,
        variant_options: item.variant_options,
        url: item.url,
      }
    })
  }

  console.log('Vue error', err);
  Rollbar.error("Vue error", {
    'err': err,
    'cart': JSON.stringify(logCart)
  }, function (err, data) {
    if (err) {
      console.log("Error while reporting error to Rollbar: ", err);
    } else {
      console.log("Error successfully reported to Rollbar. UUID:", data.result.uuid);
    }
  });
  if (window.location.pathname === '/cart') {
    console.log({
      'event': 'cart_clear',
      'cart': CartJS.cart || window.vars.cartPayload,
      'err': err,
      'vm': vm,
      'info': info
    });
    Rollbar.error("Cart clear triggered", {
      'cart': JSON.stringify(logCart),
      'err': err,
      'vm': vm,
      'info': info
    }, function (err, data) {
      if (err) {
        console.log("Error while reporting error to Rollbar: ", err);
      } else {
        console.log("Error successfully reported to Rollbar. UUID:", data.result.uuid);
      }
      CartJS.clear({
        success: function () {
          window.location.reload();
        }
      });
    });
  }
}

let cartInit = false;
let invInit = false;

const storesSort = window.masterStores.map(a => a.name);

const emptyLoc = name => {
  let empty = {
    available: 0,
    distance: 0,
    id: "0",
    inStock: 0,
    name: name,
    pickupOption: false
  };
  return empty;
}

const emptyInventoryItem = window.masterStores.map(store => {
  return emptyLoc(store.name);
});

const emptyDelivery = {
  name: 'Delivery',
  ready: 'Unavailable for delivery',
  available: 0,
  inStock: 0,
  availability: {
    class: 'out',
    text: 'Out of Stock'
  },
  hours: '2-6 day delivery in Metro areas'
};

function addMasterStoresData(inventoryItem, item) {
  inventoryItem.locations = inventoryItem.locations.filter(loc => {
    return storesSort.indexOf(loc.name) !== -1;
  });

  var locs = inventoryItem.locations;
  var onlineInventoryLocs = locs.filter(loc => window.onlineInventoryStores.indexOf(loc.name) !== -1);
  var onlineInventoryItem;

  if (onlineInventoryLocs.length > 0) {
    var totalAvailable = onlineInventoryLocs.map(loc => loc.available).reduce((a, b) => a + b, 0);

    onlineInventoryItem = {
      name: 'Delivery',
      available: totalAvailable,
      inStock: totalAvailable > 0 ? 1 : 0,
      hours: '2-6 day delivery in Metro areas',
      availability: {
        class: totalAvailable > 2 ? 'in' : (totalAvailable > 0 ? 'low' : 'out'),
        text: totalAvailable > 2 ? 'In Stock' : (totalAvailable > 0 ? 'Low Stock' : 'Out of Stock')
      },
      ready: totalAvailable > 0 ? 'Available for delivery' : 'Unavailable for delivery'
    }
  } else {
    onlineInventoryItem = {
      name: 'Delivery',
      ready: 'Unavailable for delivery',
      available: 0,
      inStock: 0,
      availability: {
        class: 'out',
        text: 'Out of Stock'
      },
      hours: '2-6 day delivery in Metro areas'
    }
  }

  inventoryItem.delivery = onlineInventoryItem;

  console.log(inventoryItem, item);
  const duplicateStores = window.masterStores.filter(loc => {
    return loc.duplicate;
  });

  duplicateStores.forEach(loc => {
    const alreadyAdded = inventoryItem.locations.find(obj => {
      return obj.name === loc.name;
    });

    if (!alreadyAdded) {
      const thisLoc = inventoryItem.locations.find(obj => {
        return obj.name === loc.duplicate;
      });

      if (thisLoc && (thisLoc.name !== 'Genesis' || item.grams <= 22000)) {
        const duplicateLoc = JSON.parse(JSON.stringify(thisLoc));
        duplicateLoc.name = loc.name;
        inventoryItem.locations.push(duplicateLoc);
      }
    }
  });

  for (var i = window.masterStores.length - 1; i >= 0; i--) {
    const masterLoc = window.masterStores[i];

    let alreadyAdded = inventoryItem.locations.find(obj => {
      return obj.name === masterLoc.name;
    });

    if (!alreadyAdded) {
      inventoryItem.locations.push(emptyLoc(masterLoc.name));
    }
  }

  //inventoryItem.locations = inventoryItem.locations.filter(loc => window.ccStores.indexOf(loc.name) !== -1);
}

function supplementCart(cart) {
  console.log(cart, invInit);

  for (let i = cart.items.length - 1; i >= 0; i--) {
    const item = cart.items[i];

    if (
      invInit[item.product_id] &&
      invInit[item.product_id].product.variants[item.variant_id]
    ) {
      const invItem =
        invInit[item.product_id].product.variants[item.variant_id].inventoryItem;
      addMasterStoresData(invItem, item);
      item.delivery = invItem.delivery;
      item.locations = invItem.locations;
    } else {
      console.log(i, 'No locations info for ' + item.title);

      Rollbar.warning("Empty Inventory Item assigned", {
        'title': item.title,
        'product_id': item.product_id,
        'variant_id': item.variant_id,
        'url': item.url
      });

      item.locations = JSON.parse(JSON.stringify(emptyInventoryItem));
      item.delivery = emptyDelivery;
    }
  }

  return cart;
}

/**
 * Attach listeners to open collapse elements
 */
const initCartDisplay = cart => {
  let { favStore, deliveryOption } = window.vars || {};
  CartJS.setAttributes({
    'delivery_mode': deliveryOption,
    'pickup_location': deliveryOption !== 'Delivery' ? favStore?.street1 : 'none'
  }, {
    'error': function() {
      location.reload();
    }
  });

  window.cartDisplay = new Vue({
    el: '#cartDisplay',
    data: {
      cart: supplementCart(JSON.parse(JSON.stringify(cart))),
      masterStores: window.masterStores,
      pickupStores: window.masterStores.filter(loc => window.ccStores.indexOf(loc.name) !== -1),
      favStore: window.vars.favStore || {},
      deliveryOption: window.vars.deliveryOption,
      override: false
    },
    methods: {
      changeWholeData(newData, part) {
        const changeData = part ? this.$data[part] : this.$data;
        Object.keys(changeData).forEach(key => (changeData[key] = null));
        Object.entries(newData).forEach(entry =>
          Vue.set(changeData, entry[0], entry[1])
        );

        if (this.$data.override) {
          // TODO: Remove timeout and lock onto re-render
          setTimeout(function () {
            $('.checkout-btn').click();
          }, 300);
        }
      },
      money(price) {
        return `$${(price / 100).toFixed(2)}`;
      },
      updateQuantity(lineIndex, newQty) {
        console.log(lineIndex, newQty);
        CartJS.updateItem(lineIndex, newQty);
      },
      setFavStore(event) {
        const masterStore = window.masterStores.find(obj => {
          return obj.id === event.target.value;
        });

        if (masterStore) {
          localStorage.setItem('favoritedStore', JSON.stringify(masterStore));
          window.vars.favStore = JSON.parse(
            localStorage.getItem('favoritedStore')
          );
          this.changeWholeData(window.vars.favStore, 'favStore');

          localStorage.setItem('deliveryOption', 'Click & Collect');
          window.vars.deliveryOption =
            localStorage.getItem('deliveryOption') || 'Delivery';
          this.$data.deliveryOption = window.vars.deliveryOption;
        }
      },
      setDeliveryOption(event) {
        const app = this;

        localStorage.setItem('deliveryOption', event.target.value);
        window.vars.deliveryOption =
          localStorage.getItem('deliveryOption') || 'Delivery';
        this.$data.deliveryOption = window.vars.deliveryOption;

        const checkoutBtn = $('[name="checkout"]');
        checkoutBtn.prop('disabled', true);
        CartJS.setAttributes({
          'delivery_mode': window.vars.deliveryOption,
          'pickup_location': app.deliveryOption !== 'Delivery' ? app.favStore?.street1 : 'none'
        }, {
          'success': function() {
            checkoutBtn.prop('disabled', false);
          },
          'error': function() {
            location.reload();
          }
        });
      },
      checkAvailability(item) {
        const app = this;

        if (!item.locations) {
          return 'out';
        }

        let checkLoc = item.delivery;

        if (app.deliveryOption !== 'Delivery') {
          checkLoc = item.locations.find(obj => {
            return obj.name === app.favStore.name;
          });
        }

        return checkLoc.inStock > 0 ? 'in' : 'out';
      },
      currentMax(item) {
        // Let availabilities = item.locations.map(a => a.available);
        // return Math.max(checkLoc);

        const app = this;

        let checkLoc = item.delivery;

        if (app.deliveryOption !== 'Delivery') {
          checkLoc = item.locations.find(obj => {
            return obj.name === app.favStore.name;
          });
        }

        return checkLoc.available;
      },
      deliveryMax(item) {
        // Let availabilities = item.locations.map(a => a.available);
        // return Math.max(checkLoc);

        const app = this;

        let checkLoc = item.delivery;
        console.log('Delivery', checkLoc.available);
        return checkLoc.available;
      },
      favStoreMax(item) {
        // Let availabilities = item.locations.map(a => a.available);
        // return Math.max(checkLoc);

        const app = this;

        let checkLoc = item.locations.find(obj => {
          return obj.name === app.favStore.name;
        });
        console.log('favStore', checkLoc.available);
        return checkLoc ? checkLoc.available : 0;
      },
      availabilityMessages(item) {
        var messages = [];
        const app = this;

        const delivery = item.delivery;
        var deliveryMessage = `<div class="${delivery.inStock ? (item.quantity <= delivery.available ? 'available' : 'low') : 'unavailable'}"><p>${delivery.inStock ? (item.quantity <= delivery.available ? 'Available' : 'Not all items available') : 'Unavailable'} for delivery</p></div>`;
        messages.push(deliveryMessage);

        if (app.favStore && app.favStore.name) {
          const favStoreInventory = item.locations.find(obj => {
            return obj.name === app.favStore.name;
          });
          var ccMessage = `<div class="${favStoreInventory.inStock ? (item.quantity <= favStoreInventory.available ? 'available' : 'low') : 'unavailable'}"><p>${favStoreInventory.inStock ? (item.quantity <= favStoreInventory.available ? 'Available' : 'Not all items available') : 'Unavailable'} for click & collect</p></div>`;
          messages.push(ccMessage);
        }

        return messages.join('');
      },
      cartModificationsMessage() {
        const app = this;
        const items = app.$data.cart.items;
        let itemsToRemove = 0;

        for (let i = items.length - 1; i >= 0; i--) {
          const item = items[i];

          let checkLoc = item.delivery;

          if (app.deliveryOption !== 'Delivery') {
            checkLoc = item.locations.find(obj => {
              return obj.name === app.favStore.name;
            });
          }

          if (checkLoc.inStock < 1) {
            itemsToRemove++;
          }
        }

        if (itemsToRemove > 0) {
          return `${itemsToRemove} ${itemsToRemove > 1 ? 'items' : 'item'
            } unavailable for ${app.deliveryOption
            } will be removed from your cart`;
        }

        return '';
      },
      prepareCart(event) {
        const app = this;

        if (app.override) {
          return true;
        }

        const updateCartPayload = {};

        for (let i = app.cart.items.length - 1; i >= 0; i--) {
          const item = app.cart.items[i];
          const currentMax = app.currentMax(item);
          if (item.quantity > currentMax) {
            updateCartPayload[item.variant_id] = currentMax;
          }
        }

        if (JSON.stringify(updateCartPayload) === '{}') {
          return true;
        }
        event.preventDefault();

        CartJS.updateItemQuantitiesById(updateCartPayload, {
          success() {
            app.$data.override = true;
          }
        });

        return false;
      }
    }
  });
  $('.de-u-fade').addClass('in');
  $('#cartSpinner').addClass('de-u-hidden');
};

$(document).on('cart.ready', function (event, cart) {
  cartInit = cart;
  console.log('CART READY', event, cart);
  tryInit();
});

document.addEventListener('tomitLoaded', async () => {

  const { vars, tomitProductInventoryInfo } = window;
  const { getProductsInventoryInformation, getVariantInventory } = window.tomitProductInventoryInfo;
  const { tomitCartPayload, tomitCartVariants } = vars;

  const getVariantInventoryAndHandleErrors = async (vID) => {
    let response;
    try {
      response = await getVariantInventory(vID);
    } catch(err) {
      console.error('Error getting inventory', err);
      response = undefined;
    }

    return response;
  }

  console.log(1);
  let inventoryInfo = await getProductsInventoryInformation(tomitCartPayload);
  console.log(2, inventoryInfo);

  try {
    let missingInventoryVariants;
    const inventoryInfoVariants = Object.entries(inventoryInfo).map(([k, v]) => v?.product?.variants);
    let inventoryInfoVariantIDs = Object.entries(inventoryInfo).map(([k, v]) => Object.keys(v?.product?.variants));
    inventoryInfoVariantIDs = inventoryInfoVariantIDs.reduce((acc, val) => acc.concat(val), []);
    console.log(3, inventoryInfoVariantIDs);

    missingInventoryVariants = tomitCartVariants.filter(vID => inventoryInfoVariantIDs.indexOf(String(vID)) === -1);
    console.log(4, missingInventoryVariants);

    if (missingInventoryVariants.length > 0) {

      for (var i = missingInventoryVariants.length - 1; i >= 0; i--) {
        const missingInventoryVariant = missingInventoryVariants[i];

        let variantInventory = await getVariantInventoryAndHandleErrors(missingInventoryVariant);
        if (variantInventory === undefined) {
          return;
        }

        const [k, v] = Object.entries(variantInventory?.product?.variants)[0];
        console.log(5, tomitCartVariants, k);
        const variantIndex = tomitCartVariants.indexOf(parseInt(k));
        console.log(6, variantIndex);
        const inventoryProductID = tomitCartPayload[variantIndex];
        console.log(7, inventoryProductID);

        const inventoryProduct = inventoryInfo[String(inventoryProductID)];
        const inventoryProductVariants = inventoryProduct?.product?.variants;
        console.log(8, inventoryProduct);
        inventoryProductVariants[k] = v;
      }

    }
  } catch(err) {
    console.error('Error getting variant inventories', err);
  }

  invInit = inventoryInfo;
  console.log('INV READY', inventoryInfo);
  tryInit();
});

function tryInit() {
  if (cartInit && invInit) {
    initCartDisplay(cartInit);
  }
}

$(document).on('cart.requestComplete', function (event, cart) {
  window.cartDisplay.changeWholeData(supplementCart(cart), 'cart');
  $('.js-de-cart__subtotal').text(Shopify.formatMoney(cart.total_price));
  $('.afterpay-info strong').text(Shopify.formatMoney(cart.total_price / 4));
  $('#CartCount').text(cart.item_count);
  if (window.vars.thresholdForGateways.afterpay.enabled && window.vars.thresholdForGateways.afterpay.threshold && cart) {
    displayPaymentGateway(cart.total_price, window.vars.thresholdForGateways.afterpay.threshold * 100, 'afterpay');
  }
  if (window.vars.thresholdForGateways.zipPay.enabled && window.vars.thresholdForGateways.zipPay.threshold && cart) {
    displayPaymentGateway(cart.total_price, window.vars.thresholdForGateways.zipPay.threshold * 100, 'zip-pay');
  }
});

function displayPaymentGateway(price, threshold, gateway) {
  const dNoneClassName = 'de-u-hidden';
  $(`.cart-${gateway}-info`).toggleClass(dNoneClassName, price < threshold);
  $(`.cart-${gateway}-disabled-info`).toggleClass(dNoneClassName, price >= threshold);
}


document.addEventListener('DOMContentLoaded', function() {
  console.log('hey...')
  carouselSwiper.init();
});
