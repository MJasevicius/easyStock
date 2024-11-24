import { addProductsToOrder } from "../orders/addProductsToOrder.js"
import { createOrder } from "../orders/createOrder.js"

const newOrder = async(orderData, products) => {
    const order = await createOrder(orderData);
    if (order.success){
        const productsRequest = await addProductsToOrder(order.id, products)
        if (productsRequest.data){
            return "Success"
        }
    }
}