import React from 'react';
import Pie from "../components/pie";
import Important from "../components/important"
import Bar from '../components/bar';
import Order from '../components/order';
import InventoryList from '../components/inventoryList';

const Home = () => {
    return (
        <>
        <div className="container">
            Pagrindinis
        </div>
        <div className='container'>
            

            <div className="home-column">
                <Pie />
                <Important />
            </div>
            <div className="home-column middle-column">
                <Bar />
                <Order />
            </div>
            <div className="home-column inventory-list">
                <InventoryList />
            </div>
        </div>
        </>
        
    );
}

export default Home;
