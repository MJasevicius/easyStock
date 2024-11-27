import {fetchAllProducts} from "../products/fetchAllProducts.js"

export const getProductsStatus = async() => {
    const products = await fetchAllProducts();
    let notMissing = [];
    let nearlyMissing = [];
    let criticalLevel = [];
    let missing = []
    products.forEach(product => {
        const alertLevel = product.alert_level;
        const count = product.count;
        
        if (count > 1.25 * alertLevel){
            notMissing.push(product);
            return;
        }
        if (count > alertLevel){
            nearlyMissing.push(product);
            return;
        }
        if (count > 0){
            criticalLevel.push(product);
            return
        }
        if (count == 0) {
            missing.push(product)
        }
    })
    const arrays = {
        notMissing,
        nearlyMissing,
        criticalLevel,
        missing
    }
    return arrays
}