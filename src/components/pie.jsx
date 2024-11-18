import React, { useState, useEffect, useRef, useCallback } from "react";
import { PieChart } from "@mui/x-charts/PieChart";

const ACTIVE_PRODUCTS = 4521;

const PIE_CHART_DATA = [
  { id: 0, value: 10, label: 'Prekių netrūksta' },
  { id: 1, value: 15, label: 'Prekių gali trūkti' },
  { id: 2, value: 20, label: 'Prekių trūksta' },
  { id: 3, value: 3, label: 'Prekių nebėra' }
];

const Pie = () => {
  const [innerRadius, setInnerRadius] = useState(55);
  const [isTitleVisible, setIsTitleVisible] = useState(true);
  const chartRef = useRef(null);
  const timeoutRef = useRef(null);
  const isMouseOverChart = useRef(false);

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
            {ACTIVE_PRODUCTS}
          </div>
          Produktai
        </div>
      )}
    </div>
  );
};

export default Pie;
