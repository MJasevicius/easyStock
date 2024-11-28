import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const searchProducts = async (query) => {
    try {
        const products = await axios.get(`${BASE_URL}/products/search?q=${query}`);
        return products.data;
    } catch (error) {
        console.error('Error fetching products:', error.message);
        throw error;
    }
}

(async () => {
    try {
        const results = await searchProducts("Warehouse");
        console.log(results);
    } catch (error) {
        console.error('Error during search:', error.message);
    }
})();
