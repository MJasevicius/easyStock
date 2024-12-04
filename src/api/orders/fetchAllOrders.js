import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const fetchAllOrders = async () => {
    try {
        const orders = await axios.get(`${BASE_URL}/orders/info`);
        console.log(JSON.stringify(orders.data, null, 2));
        
        return orders.data;
    } catch (error) {
        console.error('Error fetching orders:', error.message);
        throw error;
    }
};
