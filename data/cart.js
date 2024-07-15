export let cart = JSON.parse(localStorage.getItem('cart'));

if(!cart){
    cart = [{
    id : 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
    quantity : 2
    
},
{
    id : '15b6fc6f-327a-4ec4-896f-486349e85a3d',
    quantity : 1
}];
}


function save_storage(){
    localStorage.setItem('cart', JSON.stringify(cart));
}


export function cart_quantity(productId){

    let matchingItem;
  
    cart.forEach((item) => {
        if (productId === item.productId) {
        matchingItem = item;
        }
    });

    if (matchingItem) {
        matchingItem.quantity += 1;
    } else {
        cart.push({
        productId: productId,
        quantity: 1
        });
    }

    save_storage();
}

export function removeProduct(itemId){
    const newCart = [];

    cart.forEach((products) => {
        if(products.id !== itemId){
            newCart.push(products);
        }
    });
    cart = newCart;

    save_storage();
}