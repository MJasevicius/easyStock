import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const fetchAllOrders = async() => {
    try{
        const orders = await axios.get(`${BASE_URL}/orders/info`);
        return JSON.stringify(orders.data, null, 2)
    } catch (error){
        console.error('Error fetching products:', error.message);
        throw error;
    }
}
console.log(await fetchAllOrders());
