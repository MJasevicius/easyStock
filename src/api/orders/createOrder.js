import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

const createOrder = async(orderData) => {
    const {
        comment, 
        client, 
        client_code, 
        client_pvm_code, 
        keep_in_inventory, 
        discount
    } = orderData

    const requestBody = {
        comment: comment || "",
        client: client || "",
        client_code: client_code || "",
        client_pvm_code: client_pvm_code || "",
        keep_in_inventory: keep_in_inventory || "",
        discount: discount || 0
    } 
    try{
       const request = await axios.post(`${BASE_URL}/orders`, requestBody);
       return request.data      
    } catch (error){
        console.error('Error creating order:', error.message);
        throw error;
    }
}
