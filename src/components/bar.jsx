import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

function valueFormatter(value) {
  return `${value}eur`;
}

const chartSetting = {
  width: 546,
  height: 250,
};

export default function Bar() {
  return (
    <div className="main-container">
        <BarChart
      dataset={[
        { Pardavimai: 59, Pajamos: 57, month: "Sau." },
        { Pardavimai: 50, Pajamos: 52, month: "Vas." },
        { Pardavimai: 47, Pajamos: 53, month: "Kov." },
        { Pardavimai: 54, Pajamos: 56, month: "Bal." },
        { Pardavimai: 57, Pajamos: 69, month: "Geg." },
        { Pardavimai: 60, Pajamos: 63, month: "Bir." },
        { Pardavimai: 59, Pajamos: 60, month: "Lie." },
        { Pardavimai: 65, Pajamos: 60, month: "Rugp." },
        { Pardavimai: 51, Pajamos: 51, month: "Rugs." },
        { Pardavimai: 60, Pajamos: 65, month: "Spal." },
        { Pardavimai: 67, Pajamos: 64, month: "Lap." },
        { Pardavimai: 61, Pajamos: 70, month: "Gruo." },
      ]}
      xAxis={[
        {
          scaleType: "band",
          dataKey: "month",
        },
      ]}
      series={[
        { dataKey: "Pardavimai", label: "Pardavimai", valueFormatter },
        { dataKey: "Pajamos", label: "Pajamos", valueFormatter },
      ]}
      {...chartSetting}
    />
    </div>
    
  );
}
