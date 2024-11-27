import {fetchAllProducts} from "../products/fetchAllProducts.js"

export const getAlerts = async() => {
    const products = await fetchAllProducts();
    let alerts = []
    products.forEach(product => {
        if (product.count < product.alert_level){
            alerts.push({
                id: product.id,
                location: product.location,
                remaining: product.count,
                alert_level: product.alert_level
            })
        }
    });
    return alerts      
}

console.log(await getAlerts());
