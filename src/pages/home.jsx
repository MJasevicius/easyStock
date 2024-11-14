import React from 'react';
import Pie from "../components/pie";
import Important from "../components/important"

const Home = () => {
    return (
        <div className='container'>
            Pagrindinis

            <div className="home-column">
                <Pie />
                <Important />
            </div>
        </div>
    );
}

export default Home;
