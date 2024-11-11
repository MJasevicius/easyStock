import { Link } from "react-router-dom";

import moon from "../assets/svg/moon.svg"
import bell from "../assets/svg/bell.svg"

const Header = ({version}) => {
    return (
        <div className='header'>
            <div className="header-container">
                easyStock {version}
            </div>

            <div className="header-container">
                <Link to="/" className="hover-darken clickable">Pagrindinis</Link>
                <Link to="inv" className="hover-darken clickable">Inventorius</Link>
                <div className="hover-darken clickable">Užsakymai</div>
                <div className="hover-darken clickable">Analizė</div>
            </div>

            <div className="header-container">
            <img src={moon} alt="moon" className="svg moon hover-darken clickable"/>
            <img src={bell} alt="bell" className="svg bell hover-darken clickable"/>
            </div>

        </div>
    );
}

export default Header;
