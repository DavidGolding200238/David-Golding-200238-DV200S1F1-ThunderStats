import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Link } from "react-router-dom";
import "../styles/Comparisonpage.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

async function fetchAllVehicles() {
  try {
    const response = await fetch("https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles");
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

const getVehicleImage = (vehicle) => {
  if (!vehicle || !vehicle.images) return "https://via.placeholder.com/200";
  return (
    vehicle.images.image ||
    vehicle.images.preview_image ||
    vehicle.images.image_2 ||
    vehicle.images.image_3 ||
    vehicle.images.thumbnail ||
    "https://via.placeholder.com/200"
  );
};

function VehiclePanel({ vehicle, vehicles, onSelectChange }) {
  return (
    <div className="comparison-vehicle-panel">
      <h2 className="comparison-craft-name">
        {vehicle ? vehicle.identifier : "Craft Name"}
      </h2>
      <div className="comparison-top-row">
        <div className="comparison-nation">
          <p><strong>Country:</strong> {vehicle ? vehicle.country : "N/A"}</p>
        </div>
        <div className="comparison-select-vehicle">
          <label>Select Vehicle:</label>
          <select value={vehicle ? vehicle.identifier : ""} onChange={onSelectChange}>
            <option value="">Choose Craft</option>
            {vehicles.map((v) => (
              <option key={v.identifier} value={v.identifier}>
                {v.identifier} ({v.country})
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="comparison-vehicle-image-wrapper">
        <img className="comparison-vehicle-image" src={getVehicleImage(vehicle)} alt="Vehicle" />
      </div>
      <div className="comparison-info">
        <p><strong>Type:</strong> {vehicle ? vehicle.type : "N/A"}</p>
        <p><strong>Premium:</strong> {vehicle ? (vehicle.premium ? "Yes" : "No") : "N/A"}</p>
        <p><strong>BR:</strong> {vehicle ? vehicle.realistic_br : "N/A"}</p>
        <p><strong>Rank:</strong> {vehicle ? vehicle.rank : "N/A"}</p>
      </div>
    </div>
  );
}



function ComparisonPage() {
  const [vehicles, setVehicles] = useState([]);
  const [vehicle1, setVehicle1] = useState("");
  const [vehicle2, setVehicle2] = useState("");
  const [vehicle1Details, setVehicle1Details] = useState(null);
  const [vehicle2Details, setVehicle2Details] = useState(null);

  useEffect(() => {
    async function loadVehicles() {
      const data = await fetchAllVehicles();
      setVehicles(data);
    }
    loadVehicles();
  }, []);

  useEffect(() => {
    setVehicle1Details(vehicles.find((v) => v.identifier === vehicle1) || null);
    setVehicle2Details(vehicles.find((v) => v.identifier === vehicle2) || null);
  }, [vehicle1, vehicle2, vehicles]);

  return (
    <div className="comparison-container">
      <div className="comparison-tactical-border">
        <div className="comparison-horizontal top-left"></div>
        <div className="comparison-horizontal top-right"></div>
        <div className="comparison-horizontal bottom-left"></div>
        <div className="comparison-horizontal bottom-right"></div>
        <div className="comparison-vertical top-left"></div>
        <div className="comparison-vertical top-right"></div>
        <div className="comparison-vertical bottom-left"></div>
        <div className="comparison-vertical bottom-right"></div>
      </div>
      <header className="comparison-header">
        <div className="comparison-header-thunderstats">
          <h1>ThunderStats</h1>
        </div>
        <div className="comparison-header-vehicle">
          <h2>Vehicle Comparison</h2>
        </div>
      </header>
      <div className="comparison-navbar-frame">
        <nav className="comparison-navbar">
          <ul className="comparison-nav-links">
            <li><Link to="/">HOME</Link></li>
            <li><Link to="/timeline">TIMELINE</Link></li>
          </ul>
        </nav>
      </div>
      <div className="comparison-filters">
        <div className="comparison-filter">
          <label>Vehicle Type</label>
          <select>
            <option>All</option>
            <option>Tank</option>
            <option>Plane</option>
            <option>Helicopter</option>
            <option>Naval</option>
          </select>
        </div>
        <div className="comparison-filter">
          <label>BR Settings</label>
          <select>
            <option>Arcade</option>
            <option>Realistic</option>
            <option>Simulator</option>
          </select>
        </div>
      </div>
      <div className="comparison-cards-frame">
        <div className="comparison-selection">
          <VehiclePanel vehicle={vehicle1Details} vehicles={vehicles} onSelectChange={(e) => setVehicle1(e.target.value)} />
          <div className="comparison-chart">
            <h2>Speed Comparison</h2>
            <Bar
  data={{
    labels: ["Max Speed"],
    datasets: [
      {
        label: "Vehicle 1",
        data: [50],  // Static value for Vehicle 1
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
      {
        label: "Vehicle 2",
        data: [60],  // Static value for Vehicle 2
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  }}
  options={{
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" }, tooltip: { enabled: true } },
  }}
  style={{ maxWidth: "500px", height: "400px", margin: "0 auto" }}
/>

          </div>
          <VehiclePanel vehicle={vehicle2Details} vehicles={vehicles} onSelectChange={(e) => setVehicle2(e.target.value)} />
        </div>
      </div>
    </div>
  );
}

export default ComparisonPage;
