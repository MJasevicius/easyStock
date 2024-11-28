import axios from 'axios';
const BASE_URL = 'http://localhost:3000';

export const updateProduct = async (productID, productData) => {
    const {
        location,
        name,
        photo,
        unit,
        price,
        count,
        alert_level,
    } = productData;

    const requestBody = {
        location,
        name,
        photo: photo || '',
        unit,
        price: price !== undefined ? Number(price) : undefined,
        count: count !== undefined ? Number(count) : undefined,
        alert_level: alert_level !== undefined ? Number(alert_level) : undefined,
    };

    const filteredRequestBody = Object.fromEntries(
        Object.entries(requestBody).filter(([_, value]) => value !== undefined)
    );

    try {
        const response = await axios.put(`${BASE_URL}/products/${productID}`, filteredRequestBody);
        console.log('Product updated successfully:', response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error updating product:', error.response.data);
            throw new Error(error.response.data.message || 'Error updating product');
        } else if (error.request) {
            console.error('Error with the request:', error.request);
            throw new Error('No response from the server');
        } else {
            console.error('Error updating product:', error.message);
            throw error;
        }
    }
};
