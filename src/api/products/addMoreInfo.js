import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

const addMoreInfo = async(productID, moreInfo) => {
    const requestBody = {
        info1: moreInfo[0] || "Not provided",
        info2: moreInfo[1] || "Not provided",
        info3: moreInfo[2] || "Not provided",
        info4: moreInfo[3] || "Not provided",
        info5: moreInfo[4] || "Not provided"
    }

    try{
        const request = await axios.post(`${BASE_URL}/products/${productID}/more-info`, requestBody)
        return request.data;
        
    } catch (error){
        console.error('Error adding more info:', error.message);
        throw error;
    }
}
