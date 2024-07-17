import { cart, removeProduct , updateDeliveryOption} from '../../data/cart.js';
import { products } from '../../data/products.js';
import { formatCurrency } from '../../utility/money.js';
import { delivery_option } from '../../data/deliveryOption.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { renderPaymentSummary } from './paymentSummary.js';


export function renderOrderSummary(){
  let cartHTML = '';

  cart.forEach((item) => {

      const productId = item.id;

      let matchingProduct;

      products.forEach((product) => {
          if(productId === product.id){
              matchingProduct = product;
          }
      });

      const deliveryoptionID = item.deliveryId;

      let matchingId;
      delivery_option.forEach((option) => {
        if(option.id === deliveryoptionID){
          matchingId = option;
        }
      })

      const today = dayjs();
      const deliveryDate = today.add(matchingId.deliveryDays, 'days');
      const dateString = deliveryDate.format('dddd MMMM D');
    

      if(matchingProduct){
    
        cartHTML +=
        `
            <div class= "cart-item-container 
            js-cart-item-container-${matchingProduct.id}" >
                <div class="delivery-date">
                  Delivery date: ${dateString}
                </div>
    
                <div class="cart-item-details-grid">
                  <img class="product-image"
                    src="${matchingProduct.image}">
    
                  <div class="cart-item-details">
                    <div class="product-name">
                    ${matchingProduct.name}
                    </div>
                    <div class="product-price">
                      $${formatCurrency(matchingProduct.priceCents)}
                    </div>
                    <div class="product-quantity">
                      <span>
                        Quantity: <span class="quantity-label">${item.quantity}</span>
                      </span>
                      <span class="update-quantity-link link-primary">
                        Update
                      </span>
                      <span class="delete-quantity-link link-primary js-delete" data-product-id = "${matchingProduct.id}">
                        Delete
                      </span>
                    </div>
                  </div>
    
                  <div class="delivery-options">
                    <div class="delivery-options-title">
                      Choose a delivery option:
                    </div>
                      ${deliveryOptionHTML(matchingProduct, item)}         
                  </div>
                </div>
              </div>
        `
      }
    
  });
  document.querySelector('.js-order-summary')
  .innerHTML = cartHTML;


  document.querySelectorAll('.js-delete')
  .forEach((link) => {
      link.addEventListener('click', () => {
          const itemId = link.dataset.productId;
          removeProduct(itemId);
        
          const container = document.querySelector(`.js-cart-item-container-${itemId}`);
          container.remove();

          renderPaymentSummary();
      });     

  });


  function deliveryOptionHTML(matchingProduct,item){

    let html = '';
    delivery_option.forEach((option) => {

      const today = dayjs();
      const deliveryDate = today.add(option.deliveryDays, 'days');
      const dateString = deliveryDate.format('dddd MMMM D');
    
      const deliveryprice = option.deliveryPrice === 0 ? 'FREE' : `$${formatCurrency(option.deliveryPrice)} - `;

      const ischecked = option.id === item.deliveryId;
    html +=
    `
      <div class="delivery-option js-delivery-option-update"
        data-product-id = "${matchingProduct.id}"
        data-delivery-optionid = "${option.id}">
        <input type="radio"
          ${ischecked ?'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${deliveryprice} Shipping
            </div>
          </div>
      </div>
    `   
    })
    return html;   
  }

  document.querySelectorAll('.js-delivery-option-update')
  .forEach((element) => {
    element.addEventListener('click', () => {
      const productId = element.dataset.productId;
      const deliveryOptionid = element.dataset.deliveryOptionid;
      updateDeliveryOption(productId, deliveryOptionid);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}