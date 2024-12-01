import React, {useState} from 'react';
import Order from '../components/order';
import InventoryList from '../components/inventoryList';

const Orders = () => {
    const [orderProducts, setOrderProducts] = useState([]);

    const handleAddToOrder = (selectedProducts) => {
        setOrderProducts((prev) => {
            const productIds = new Set(prev.map((product) => product.id));
            const newProducts = selectedProducts.filter(
                (product) => !productIds.has(product.id)
            );
            return [...prev, ...newProducts];
        });
    };
    return (
        <>
            <div className="container">
            Užsakymai
            </div>
            <div className='container flex-center'>
                <div className="home-column inventory-list">
                    <Order products={orderProducts} />
                </div>
                <div className="home-column ">
                    <InventoryList enableAddToOrder={true} onAddToOrder={handleAddToOrder} />
                </div>
            </div>
        </>
    );
}

export default Orders;
