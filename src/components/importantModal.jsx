import React, {useState} from 'react';
import buttonCross from "../assets/svg/button-cross.svg";
import buttonMoreOptions from "../assets/svg/button-more-options.svg";
import buttonSuccess from "../assets/svg/button-success.svg";

const ImportantModal = ({ onClose, alerts }) => {
    const [showInput, setShowInput] = useState(null); // To manage input visibility per alert

    const handleMoreOptionsClick = (index) => {
        setShowInput((prev) => (prev === index ? null : index)); // Toggle input visibility
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Svarbūs Įspėjimai</h2>
                    <button className="close-button" onClick={onClose}>X</button>
                </div>
                <div className="modal-body">
                    {alerts.map((alert, index) => (
                        <div key={index} className="modal-alert-row">
                            <div className='important-row'>
                                <div className="row-title">
                                    #{alert.ID} / {alert.location} - Liko: {alert.remaining}{alert.unit}
                                    <br />
                                    Įspėjimo riba - {alert.alert}{alert.unit}
                                </div>
                                <img src={alert.photo} alt="" className="img-preview" />
                                <div className="buttons">
                                    <img 
                                        src={buttonCross} 
                                        alt="Close" 
                                        className="img-preview hover-darken clickable" 
                                        onClick={() => console.log('Close clicked')} 
                                    />
                                    <img 
                                        src={buttonMoreOptions} 
                                        alt="More options" 
                                        className="img-preview hover-darken clickable" 
                                        onClick={() => handleMoreOptionsClick(index)} 
                                    />
                                    <img 
                                        src={buttonSuccess} 
                                        alt="Success" 
                                        className="img-preview hover-darken clickable" 
                                        onClick={() => console.log('Success clicked')} 
                                    />
                                </div>
                            </div>

                            {showInput === index && (
                                <div className="alert-input-container">
                                    <label>Nauja Įspėjimo riba:</label>
                                    <input 
                                        type="text" 
                                        placeholder="Įveskite skaičių" 
                                        className="alert-input"
                                    />
                                    <button className="save-button">Išsaugoti</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


export default ImportantModal;
