import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import Inventory from "./pages/inventory.jsx";
import Header from "./components/header";
import Orders from "./pages/orders.jsx";

function App() {
  const root = document.documentElement;
  
  window.addEventListener('resize', () => {
    root.style.setProperty('--screen-x', `${window.innerWidth}px`);
    root.style.setProperty('--screen-y', `${window.innerHeight}px`);
  });

  root.style.setProperty('--screen-x', `${window.innerWidth}px`);
  root.style.setProperty('--screen-y', `${window.innerHeight}px`);


  return (
    <BrowserRouter>
      <Header />
      <Routes>
          <Route index element={<Home />} />
          <Route path="inv" element={<Inventory />} />
          <Route path="orders" element={<Orders />} />
          {/* <Route path="*" element={<NoPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
