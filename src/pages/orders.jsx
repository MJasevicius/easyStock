import React, {useState} from 'react';
import Order from '../components/order';
import InventoryList from '../components/inventoryList';

const Orders = () => {
    const [orderProducts, setOrderProducts] = useState([]);
    const [refresher, setRefresher] = useState(0);

    const handleAddToOrder = (selectedProducts) => {
        setOrderProducts((prev) => {
            const productIds = new Set(prev.map((product) => product.id));
            const newProducts = selectedProducts.filter(
                (product) => !productIds.has(product.id)
            );
            return [...prev, ...newProducts];
        });
    };

    const clearOrderProducts = () => {
        setOrderProducts([])
    }

    const removeProducts = (productsToRemove) => {
        setOrderProducts((prev) =>
            prev.filter(
                (orderProduct) =>
                    !productsToRemove.some((product) => {

                        return product.id === orderProduct.id})
            )
        );
        
    };

    const refreshInventory = () => {
        setRefresher(refresher ? 0 : 1)
    };

    return (
        <>
            <div className="container">
            Užsakymai
            </div>
            <div className='container flex-center'>
                <div className="home-column inventory-list">
                    <Order 
                        products={orderProducts} 
                        refreshInventory={refreshInventory} 
                        clearOrderProducts={clearOrderProducts}
                        removeProducts={removeProducts}/>
                </div>
                <div className="home-column ">
                    <InventoryList 
                        enableAddToOrder={true} 
                        onAddToOrder={handleAddToOrder} 
                        refresher={refresher}/>
                </div>
            </div>
        </>
    );
}

export default Orders;
