import React, { useState, useEffect, useRef, useCallback } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import axios from "axios";

const BASE_URL = "http://localhost:3000";



const Pie = () => {
  const [activeProducts, setActiveProducts] = useState(0)
  const [notMissing, setNotMissing] = useState(0)
  const [nearlyMissing, setNearlyMissing] = useState(0)
  const [criticalLevel, setCriticalLevel] = useState(0)
  const [missing, setMissing] = useState(0)
  const [innerRadius, setInnerRadius] = useState(55);
  const [isTitleVisible, setIsTitleVisible] = useState(true);
  const [pieTitle, setPieTitle] = useState("Produktas")
  const chartRef = useRef(null);
  const timeoutRef = useRef(null);
  const isMouseOverChart = useRef(false);

  let PIE_CHART_DATA = [
    { id: 0, value: notMissing, label: 'Prekių netrūksta' },
    // { id: 1, value: nearlyMissing, label: 'Prekių gali trūkti' },
    { id: 2, value: criticalLevel, label: 'Prekių trūksta' },
    { id: 3, value: missing, label: 'Prekių nebėra' }
  ];

  const handleMouseEnter = useCallback(() => {
    setInnerRadius(0);
    setIsTitleVisible(false);
    isMouseOverChart.current = true; 
  }, []);

  const handleMouseLeave = useCallback(() => {
    setInnerRadius(55);
    isMouseOverChart.current = false;
    timeoutRef.current = setTimeout(() => {
      if (!isMouseOverChart.current) {
        setIsTitleVisible(true);
      }
    }, 250);
  }, []);

  const getPieTitle = (productsTotal) => {
    const lastDigit = productsTotal % 10;
    const lastTwoDigits = productsTotal % 100;
  
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return "Produktų";
    }
  
    switch (lastDigit) {
      case 1:
        return "Produktas";
      case 2:
      case 3:
      case 4:
        return "Produktai";
      default:
        return "Produktų";
    }
  };

  useEffect(() => {
    const chartElement = chartRef.current;
    if (chartElement) {
      const svgGroupElement = chartElement.querySelector('g');
      if (svgGroupElement) {
        svgGroupElement.addEventListener("mouseover", handleMouseEnter);
        svgGroupElement.addEventListener("mouseout", handleMouseLeave);
        return () => {
          svgGroupElement.removeEventListener("mouseover", handleMouseEnter);
          svgGroupElement.removeEventListener("mouseout", handleMouseLeave);
          clearTimeout(timeoutRef.current);
        };
      }
    }
  }, [chartRef, handleMouseEnter, handleMouseLeave]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/products`);
        const products = response.data;
        const productsTotal = products.length;
        setActiveProducts(productsTotal);

        setPieTitle(getPieTitle(productsTotal))


  
        const notMissing = products.filter(
          (product) => product.count > product.alert_level
        ).length;
  
        const nearlyMissing = products.filter(
          (product) => product.count > product.alert_level && product.count < product.alert_level * 1.25
        ).length;
  
        const criticalLevel = products.filter(
          (product) => product.count > 0 && product.count <= product.alert_level
        ).length;
  
        const missing = products.filter(
          (product) => product.count === 0
        ).length;
  
        setNotMissing(notMissing);
        setNearlyMissing(nearlyMissing);
        setCriticalLevel(criticalLevel);
        setMissing(missing);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };
  
    fetchProducts();
  }, []);
  

  return (
    <div className="main-container">
      <div className="title-small">
        Prekių likutis
      </div>
      <PieChart className="center-vertical"
        ref={chartRef}
        series={[
          {
            data: PIE_CHART_DATA,
            innerRadius: innerRadius,
            cx: 100,
            startAngle: -40,
            paddingAngle: 2,
            highlightScope: { fade: 'global', highlight: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
          },
        ]}
        width={370}
        height={160}
      />
      {isTitleVisible && (
        <div className="piechart-title">
          <div className="products-number">
            {activeProducts}
          </div>
          {pieTitle}
        </div>
      )}
    </div>
  );
};

export default Pie;
