import axios from 'axios';
const BASE_URL = 'http://localhost:3000';

const createProduct = async (productData) => {
    const {
        location,
        name,
        photo,
        unit,
        price,
        count,
        alert_level,
        more_info = [] 
    } = productData;

    if (!name || !location || !unit || !price || !count || !alert_level) {
        throw new Error('Missing required fields');
    }

    const requestBody = {
        location,
        name,
        photo: photo || '',
        unit,
        price: Number(price),
        count: Number(count),
        alert_level: Number(alert_level),
        more_info 
    };

    try {
        const response = await axios.post(`${BASE_URL}/products`, requestBody);
        console.log('Product created successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating product:', error.message);
        throw error;
    }
};

// const newProduct = {
//     location: "Warehouse A",
//     name: "New Product",
//     photo: "product-photo.jpg",
//     unit: "pieces",
//     price: 29.99,
//     count: 100,
//     alert_level: 10,
//     more_info: ["Info 1", "Info 2", "Info 3", "Info 4", "Info 5"]
// };
