import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../styles/Comparisonpage.css";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Fetch all vehicles from API
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

function ComparisonPage() {
  const [vehicles, setVehicles] = useState([]);
  const [vehicle1, setVehicle1] = useState("");
  const [vehicle2, setVehicle2] = useState("");
  const [vehicle1Details, setVehicle1Details] = useState(null);
  const [vehicle2Details, setVehicle2Details] = useState(null);

  // Fetch all vehicles on component mount
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

  return (
    <div className="comparison-container">
      <header className="comparison-header">
        <h1>ThunderStats VEHICLE COMPARISON</h1>
      </header>

      <div className="comparison-selection">
        <div className="vehicle-panel">
          <h2>Craft Name</h2>
          <img className="vehicle-image" src={getVehicleImage(vehicle1Details)} alt="Vehicle 1" />
          <div className="selection-row">
            <label>Nation:</label>
            <select>
              <option>Select</option>
              <option>USA</option>
              <option>Germany</option>
              <option>Russia</option>
            </select>
          </div>
          <div className="selection-row">
            <label>Vehicle Type:</label>
            <select>
              <option>Select</option>
              <option>Tank</option>
              <option>Plane</option>
            </select>
          </div>
          <div className="selection-row">
            <label>Premium:</label>
            <select>
              <option>Select</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
          <div className="selection-row">
            <label>Realistic BR:</label>
            <input type="text" placeholder="Enter BR" />
          </div>
          <div className="selection-row">
            <label>Rank:</label>
            <input type="text" placeholder="Enter Rank" />
          </div>
          <div className="selection-row">
            <label>Select Vehicle:</label>
            <select value={vehicle1} onChange={(e) => setVehicle1(e.target.value)}>
              <option value="">Choose Craft</option>
              {vehicles.map((v) => (
                <option key={v.identifier} value={v.identifier}>
                  {v.identifier} ({v.country})
                </option>
              ))}
            </select>
          </div>
        </div>

        {vehicle1Details && vehicle2Details && (
          <div className="comparison-chart">
            <h2>Speed Comparison</h2>
            <Bar
              key={JSON.stringify(vehicle1Details) + JSON.stringify(vehicle2Details)}
              data={{
                labels: ["Max Speed"],
                datasets: [
                  {
                    label: vehicle1Details.identifier,
                    data: [vehicle1Details.max_speed],
                    backgroundColor: "rgba(54, 162, 235, 0.5)",
                  },
                  {
                    label: vehicle2Details.identifier,
                    data: [vehicle2Details.max_speed],
                    backgroundColor: "rgba(255, 99, 132, 0.5)",
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "top" }, tooltip: { enabled: true } },
              }}
              style={{ maxWidth: "300px", height: "250px", margin: "0 auto" }}
            />
          </div>
        )}

        <div className="vehicle-panel">
          <h2>Craft Name</h2>
          <img className="vehicle-image" src={getVehicleImage(vehicle2Details)} alt="Vehicle 2" />
          <div className="selection-row">
            <label>Nation:</label>
            <select>
              <option>Select</option>
              <option>USA</option>
              <option>Germany</option>
              <option>Russia</option>
            </select>
          </div>
          <div className="selection-row">
            <label>Vehicle Type:</label>
            <select>
              <option>Select</option>
              <option>Tank</option>
              <option>Plane</option>
            </select>
          </div>
          <div className="selection-row">
            <label>Premium:</label>
            <select>
              <option>Select</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
          <div className="selection-row">
            <label>Realistic BR:</label>
            <input type="text" placeholder="Enter BR" />
          </div>
          <div className="selection-row">
            <label>Rank:</label>
            <input type="text" placeholder="Enter Rank" />
          </div>
          <div className="selection-row">
            <label>Select Vehicle:</label>
            <select value={vehicle2} onChange={(e) => setVehicle2(e.target.value)}>
              <option value="">Choose Craft</option>
              {vehicles.map((v) => (
                <option key={v.identifier} value={v.identifier}>
                  {v.identifier} ({v.country})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComparisonPage;
