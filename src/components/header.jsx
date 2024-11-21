import { Link } from "react-router-dom";
import { useState } from "react";

import moon from "../assets/svg/moon.svg";
import bellDark from "../assets/svg/bell-dark.svg";
import bellLight from "../assets/svg/bell-light.svg";
import sun from "../assets/svg/sun.svg"

const Header = ({version}) => {
    const body = document.getElementById("body");
    const [darkMode, setDarkMode] = useState(body.classList.contains("dark-mode"))

    const toggleMode = () => {
        body.classList.toggle("dark-mode")
        setDarkMode(body.classList.contains("dark-mode"))
    }

    return (
        <div className='header'>
            <div className="header-container">
                easyStock {version}
            </div>

            <div className="header-container">
                <Link to="/" className="hover-darken clickable">Pagrindinis</Link>
                <Link to="inv" className="hover-darken clickable">Inventorius</Link>
                <Link to="orders" className="hover-darken clickable">Užsakymai</Link>
                <div className="hover-darken clickable">Analizė</div>
            </div>

            <div className="header-container">
            
            {darkMode ? <img src={sun} onClick={toggleMode} alt="moon" className="svg moon hover-darken clickable"/> :  <img src={moon} onClick={toggleMode} alt="moon" className="svg moon hover-darken clickable"/> }
            {darkMode ? <img src={bellDark} alt="bell" className="svg bell hover-darken clickable"/> :  <img src={bellLight} alt="bell" className="svg bell hover-darken clickable"/> }

            </div>

        </div>
    );
}

export default Header;
