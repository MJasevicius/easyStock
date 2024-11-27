import { addProductsToOrder } from "../orders/addProductsToOrder.js"
import { createOrder } from "../orders/createOrder.js"

export const newOrder = async(orderData, products) => {
    const order = await createOrder(orderData);
    if (order.success){
        const productsRequest = await addProductsToOrder(order.id, products)
        // console.log(productsRequest);
        
        if (productsRequest.message){
            return "Success"
        }
    }
}

// const orderData = {
//     comment: "This is a test order.",
//     client: "John Doe",
//     client_code: "JD123",
//     client_pvm_code: "LT56789",
//     keep_in_inventory: true,
//     discount: 10
// };

// const products = [
//     {
//         item_id: 1,
//         price: 10,
//         count: 2
//     },
//     {
//         item_id: 1,
//         price: 13,
//         count: 1
//     },
//     {
//         item_id: 2,
//         price: 2,
//         count: 12
//     },
// ]

// console.log(await newOrder(orderData, products));