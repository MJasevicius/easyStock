import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

const deleteProduct = async(productID) => {
    try{
        const request = await axios.delete(`${BASE_URL}/products/${productID}`);
        return request.data;
    } catch (error){
        console.error('Error deleting product:', error.message);
        throw error;
    }
}
