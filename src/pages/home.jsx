import React from 'react';
import Pie from "../components/pie";
import Important from "../components/important"
import Bar from '../components/bar';

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
            <div className="home-column">
                <Bar />
            </div>
        </div>
        </>
        
    );
}

export default Home;
