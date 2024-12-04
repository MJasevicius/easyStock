import React, { useEffect, useState } from "react";
import drawer from "../assets/svg/drawer.svg";
import buttonMoreOptions from "../assets/svg/button-more-options.svg";
import buttonSuccess from "../assets/svg/button-success.svg";
import ImportantModal from "./importantModal";
import axios from "axios";
import { updateProduct } from "../api/products/updateProduct";
import { json } from "react-router-dom";

const BASE_URL = "http://localhost:3000";

const Important = () => {
  const [showInput, setShowInput] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [criticalLevel, setCriticalLevel] = useState([]);
  const [stagnant, setStagnant] = useState([])
  const [inputValues, setInputValues] = useState({});

  const handleDrawerClick = () => {
    setIsModalOpen(true);
  };

  const handleMoreOptionsClick = (index) => {
    setShowInput((prev) => (prev === index ? null : index));
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/products`);
        const products = response.data;
        const now = new Date();
        const sixMonthBeforeNow = new Date(now).setMonth(now.getMonth() - 6);

        const criticalLevel = products.filter(
          (product) => product.count <= product.alert_level
        );

        const stagnantProducts = products.filter((product) => {
          const updatedAtDate = new Date(product.updated_at);
          return updatedAtDate < sixMonthBeforeNow; 
        });

        // console.log(`Stagnant: ${JSON.stringify(stagnantProducts)}`);
        

        setCriticalLevel(criticalLevel);
        setStagnant(stagnantProducts);
        console.log(stagnant);
        
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="main-container important">
      <div className="important-row">
        <div className="title-small padding-0">Atkrepkite dėmesį</div>
        {/* <img
          className="svg clickable hover-darken"
          src={drawer}
          alt="archyvas"
          onClick={handleDrawerClick}
        /> */}
      </div>
      <hr />
      

      {criticalLevel.map((item, index) => (
        <React.Fragment key={index}>
          <div className="important-row">
            <div className="row-title">
              #{item.id} / {item.location} liko {item.count}
              {item.unit} <br />
              Įspėjimo riba - {item.alert_level}
              {item.unit}
            </div>
            <img src={item.photo} alt="" className="img-preview" />
            <div className="buttons">
              <img
                src={buttonMoreOptions}
                alt=""
                className="img-preview hover-darken clickable"
                onClick={() => handleMoreOptionsClick(index)}
              />
              <img
                src={buttonSuccess}
                alt=""
                className="img-preview hover-darken clickable"
                onClick={() =>
                  setCriticalLevel((prev) => {
                    const updatedList = [...prev];
                    updatedList.splice(index, 1);
                    return updatedList;
                  })
                }
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
                value={inputValues[item.id] || ""}
                onChange={(e) =>
                  setInputValues((prev) => ({
                    ...prev,
                    [item.id]: e.target.value,
                  }))
                }
              />
              <button
                className="save-button"
                onClick={async () => {
                  const newValue = inputValues[item.id];
                  if (!isNaN(newValue) && newValue.trim() !== "") {
                    try {
                      await updateProduct(item.id, { alert_level: newValue });
                      setCriticalLevel((prev) =>
                        prev.map((product) =>
                          product.id === item.id
                            ? { ...product, alert_level: newValue }
                            : product
                        )
                      );
                    } catch (error) {
                      alert("Nepavyko atnaujinti įspėjimo ribos!");
                      console.error(error);
                    }
                  } else {
                    alert("Įspėjimo riba turi būti skaičius!");
                  }
                }}
              >
                Išsaugoti
              </button>
            </div>
          )}
          <hr />
        </React.Fragment>
      ))}

    {stagnant.map((item, index) => (
            <React.Fragment key={index}>
              <div className="important-row">
                <div className="row-title">
                  #{item.id} / {item.location} neparduotas jau virš 6 mėnesių!
                </div>
                <img src={item.photo} alt="" className="img-preview" />
              </div>
              <hr />

            </React.Fragment>
          ))}
      {isModalOpen && <ImportantModal alerts={criticalLevel} onClose={closeModal} />}
    </div>
  );
};

export default Important;
