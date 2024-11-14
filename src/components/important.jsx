import React, { useState} from 'react';
import drawer from '../assets/svg/drawer.svg';
import buttonCross from "../assets/svg/button-cross.svg";
import buttonMoreOptions from "../assets/svg/button-more-options.svg";
import buttonSuccess from "../assets/svg/button-success.svg";
import ImportantModal from './importantModal';

const mockData = [
    {
        ID: "0001", 
        location: "A12",
        remaining: 15,
        unit: "kg",
        alert: 20, 
        photo: "abc"
    },
    {
        ID: "0002", 
        location: "A12",
        remaining: 150,
        unit: "kg",
        alert: 200, 
        photo: "abc"
    },
    {
        ID: "0001", 
        location: "A12",
        remaining: 15,
        unit: "kg",
        alert: 20, 
        photo: "abc"
    },
    {
        ID: "0002", 
        location: "A12",
        remaining: 150,
        unit: "kg",
        alert: 200, 
        photo: "abc"
    },
    {
        ID: "0001", 
        location: "A12",
        remaining: 15,
        unit: "kg",
        alert: 20, 
        photo: "abc"
    },
    {
        ID: "0002", 
        location: "A12",
        remaining: 150,
        unit: "kg",
        alert: 200, 
        photo: "abc"
    },
    {
        ID: "0001", 
        location: "A12",
        remaining: 15,
        unit: "kg",
        alert: 20, 
        photo: "abc"
    },
    {
        ID: "0002", 
        location: "A12",
        remaining: 150,
        unit: "kg",
        alert: 200, 
        photo: "abc"
    },
    {
        ID: "0001", 
        location: "A12",
        remaining: 15,
        unit: "kg",
        alert: 20, 
        photo: "abc"
    },
    {
        ID: "0002", 
        location: "A12",
        remaining: 150,
        unit: "kg",
        alert: 200, 
        photo: "abc"
    },
    {
        ID: "0001", 
        location: "A12",
        remaining: 15,
        unit: "kg",
        alert: 20, 
        photo: "abc"
    },
    {
        ID: "0002", 
        location: "A12",
        remaining: 150,
        unit: "kg",
        alert: 200, 
        photo: "abc"
    },
];

// Sample mock data for demonstration
const mockData2 = [
    { ID: 1, location: 'Vilnius', remaining: 10, unit: 'kg', alert: 5, photo: 'photo1.jpg' },
    { ID: 2, location: 'Kaunas', remaining: 15, unit: 'kg', alert: 10, photo: 'photo2.jpg' },
    { ID: 3, location: 'Klaipėda', remaining: 20, unit: 'kg', alert: 12, photo: 'photo3.jpg' }
];

const Important = () => {
    const [showInput, setShowInput] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDrawerClick = () => {
        setIsModalOpen(true); // Open the modal when drawer button is clicked
    };

    const handleMoreOptionsClick = (index) => {
        setShowInput((prev) => (prev === index ? null : index));
    };

    const closeModal = () => {
        setIsModalOpen(false); // Close the modal
    };

    return (
        <div className="main-container important">
            <div className="important-row">
                <div className="title-small padding-0">
                    Atkrepkite dėmesį
                </div>
                <img 
                    className='svg clickable hover-darken' 
                    src={drawer} 
                    alt="archyvas"
                    onClick={handleDrawerClick} // Open modal on click
                />
            </div>
            <hr />

            {mockData.map((item, index) => (
                <React.Fragment key={index}>
                    <div className="important-row">
                        <div className="row-title">
                            #{item.ID} / {item.location} liko {item.remaining}{item.unit} <br />
                            Įspėjimo riba - {item.alert}{item.unit}
                        </div>
                        <img src={item.photo} alt="" className='img-preview'/>
                        <div className="buttons">
                            <img src={buttonCross} alt="" className='img-preview hover-darken clickable'/>
                            <img 
                                src={buttonMoreOptions} 
                                alt="" 
                                className='img-preview hover-darken clickable'
                                onClick={() => handleMoreOptionsClick(index)}
                            />
                            <img src={buttonSuccess} alt="" className='img-preview hover-darken clickable'/>
                        </div>
                    </div>

                    {showInput === index && (
                        <div className="alert-input-container">
                            <label>Nauja Įspėjimo riba:</label>
                            <input type="text" placeholder="Įveskite skaičių" className="alert-input"/>
                            <button className="save-button">Išsaugoti</button>
                        </div>
                    )}
                    <hr />
                </React.Fragment>
            ))}

            {isModalOpen && (
                <ImportantModal alerts={mockData2} onClose={closeModal} />
            )}
        </div>
    );
};

export default Important;
