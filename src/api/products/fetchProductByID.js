import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

const fetchProductByID = async(productID) => {
    try{
        const singleProduct = await axios.get(`${BASE_URL}/products/${productID}`);
        return singleProduct.data
    } catch (error){
        console.error('Error fetching product:', error.message);
        throw error;
    }
}
