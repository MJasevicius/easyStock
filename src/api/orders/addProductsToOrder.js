import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const addProductsToOrder = async(orderID,products) => {
    const requestBody = {
        "items": products
    }

    try{
        const request = await axios.post(`${BASE_URL}/orders/${orderID}/items`, requestBody)
        return request.data
    } catch (error){
        console.error('Error adding products to order:', error.message);
        throw error;
    }
}

// products = [{
//     item_id,
//     price,
//     count
// }]

 
