import React from 'react';
import Order from '../components/order';
import InventoryList from '../components/inventoryList';

const Orders = () => {
    return (
        <>
            <div className="container">
            Užsakymai
            </div>
            <div className='container flex-center'>
                <div className="home-column inventory-list">
                    <Order />
                </div>
                <div className="home-column ">
                <InventoryList />
                </div>
            </div>
        </>
    );
}

export default Orders;
