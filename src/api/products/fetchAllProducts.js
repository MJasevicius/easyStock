import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const fetchAllProducts = async() => {
    try{
        const products = await axios.get(`${BASE_URL}/products`);
        return products.data
    } catch (error){
        console.error('Error fetching products:', error.message);
        throw error;
    }
}