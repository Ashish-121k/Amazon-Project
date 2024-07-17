import {cart} from '../../data/cart.js';
import { delivery_option } from '../../data/deliveryOption.js';
import {products} from '../../data/products.js';
import { formatCurrency } from '../../utility/money.js';


export function renderPaymentSummary(){

    let productPrice = 0;
    let shippingCharge = 0;
    let totalPriceBeforeTax = 0;
    let estimatedTax = 0;
    let totalPrice = 0;

    cart.forEach((item) => {
        let matchingProduct;

        products.forEach((product) => {
            if(product.id === item.id){
                matchingProduct = product;
            }
        });

        productPrice = productPrice + matchingProduct.priceCents * item.quantity;

        let matchingId;
        delivery_option.forEach((deliveryOption) => {
            if(deliveryOption.id === item.deliveryId){
                matchingId = deliveryOption;
            }
        }); 

        shippingCharge = shippingCharge + matchingId.deliveryPrice

        totalPriceBeforeTax = totalPriceBeforeTax + productPrice + shippingCharge;
    });

    estimatedTax = totalPriceBeforeTax * 0.1;

    totalPrice = totalPriceBeforeTax + estimatedTax;

    let html = 
            `   <div class="payment-summary-title">
                    Order Summary
                </div>

                <div class="payment-summary-row">
                <div>Items (3):</div>
                <div class="payment-summary-money">$${formatCurrency(productPrice)}</div>
                </div>

                <div class="payment-summary-row">
                <div>Shipping &amp; handling:</div>
                <div class="payment-summary-money">$${formatCurrency(shippingCharge)}</div>
                </div>

                <div class="payment-summary-row subtotal-row">
                <div>Total before tax:</div>
                <div class="payment-summary-money">$${formatCurrency(totalPriceBeforeTax)}</div>
                </div>

                <div class="payment-summary-row">
                <div>Estimated tax (10%):</div>
                <div class="payment-summary-money">$${formatCurrency(estimatedTax)}</div>
                </div>

                <div class="payment-summary-row total-row">
                <div>Order total:</div>
                <div class="payment-summary-money">$${formatCurrency(totalPrice)}</div>
                </div>

                <button class="place-order-button button-primary">
                Place your order
                </button>
            `;

    document.querySelector('.js-payment-summary')
    .innerHTML = html;
}
