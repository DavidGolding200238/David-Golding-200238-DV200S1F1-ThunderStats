import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Link } from "react-router-dom";
import "../styles/Global.css";
import { fetchAllVehiclesPaginated, fetchVehicleDetails } from "../api/WarthunderApi";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TimelinePage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [liveVehicleData, setLiveVehicleData] = useState(null);
  const [versionOptions, setVersionOptions] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState("BR");

  useEffect(() => {
    async function loadVersionOptions() {
      try {
        const response = await fetch("https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles/stats");
        if (!response.ok) throw new Error("Failed to fetch vehicle stats");
        const stats = await response.json();
        setVersionOptions(stats.versions || []);
      } catch (err) {
        console.error("Error fetching version options:", err);
      }
    }
    loadVersionOptions();
  }, []);

  useEffect(() => {
    async function loadVehicles() {
      const data = await fetchAllVehiclesPaginated();
      setVehicles(data);
      setFilteredVehicles(data);
    }
    loadVehicles();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = vehicles.filter((v) => v.identifier.toLowerCase().includes(query));
    setFilteredVehicles(filtered);
  }, [searchQuery, vehicles]);

  useEffect(() => {
    async function loadLiveData() {
      if (!selectedVehicle) {
        setLiveVehicleData(null);
        setHistoricalData([]);
        return;
      }
      const data = await fetchVehicleDetails(selectedVehicle);
      setLiveVehicleData(data);
    }
    loadLiveData();
  }, [selectedVehicle]);

  useEffect(() => {
    async function loadHistoricalData() {
      if (!selectedVehicle || versionOptions.length === 0) {
        setHistoricalData([]);
        return;
      }
      const responses = await Promise.all(
        versionOptions.map((v) => fetchVehicleDetails(selectedVehicle, v))
      );
      const mapped = responses.map((data, index) => ({
        version: versionOptions[index],
        realistic_br: data ? data.realistic_br : null,
        repair_cost: data ? data.repair_cost_realistic : null,
        era: data ? data.era : null
      }));
      setHistoricalData(mapped);
    }
    loadHistoricalData();
  }, [selectedVehicle, versionOptions]);

  let datasets = [];
  if (selectedDataset === "BR") {
    datasets.push({ label: "Historical Realistic BR", data: historicalData.map(item => item.realistic_br), fill: false, borderColor: "rgba(75, 192, 192, 1)", tension: 0.1, pointRadius: 4, spanGaps: true });
  } else if (selectedDataset === "Repair") {
    datasets.push({ label: "Historical Repair Costs", data: historicalData.map(item => item.repair_cost), fill: false, borderColor: "rgba(192, 75, 192, 1)", tension: 0.1, pointRadius: 4, spanGaps: true });
  } else if (selectedDataset === "Rank") {
    datasets.push({ label: "Historical Rank Changes", data: historicalData.map(item => item.era), fill: false, borderColor: "rgba(192, 192, 75, 1)", tension: 0.1, pointRadius: 4, spanGaps: true });
  }

  const lineChartData = {
    labels: historicalData.map(item => item.version),
    datasets: datasets
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: { label: (context) => `${context.dataset.label}: ${context.parsed.y}` },
        bodyFont: { size: 14 },
        titleFont: { size: 16 }
      },
      legend: {
        position: "top",
        labels: { color: "#e0e0e0", font: { size: 16 } }
      },
      title: {
        display: true,
        text: "Historical Data Progression",
        color: "#e0e0e0",
        font: { size: 20 }
      }
    },
    scales: {
      x: { ticks: { color: "#e0e0e0", font: { size: 14 } } },
      y: { ticks: { color: "#e0e0e0", font: { size: 14 } } }
    }
  };

  return (
    <div className="landing-container">
      <div className="pattern-box"></div>
      <div className="tactical-border">
        <div className="horizontal top-left"></div>
        <div className="horizontal top-right"></div>
        <div className="horizontal bottom-left"></div>
        <div className="horizontal bottom-right"></div>
        <div className="vertical top-left"></div>
        <div className="vertical top-right"></div>
        <div className="vertical bottom-left"></div>
        <div className="vertical bottom-right"></div>
      </div>
      <div className="landing-content">
        <div className="header-container">
          <div className="timeline-frame">
            <div className="timeline-text">
              <h1>Time line</h1>
            </div>
          </div>
          <div className="navbar-frame">
            <nav className="navbar">
              <ul className="nav-links">
                <li><Link to="/">HOME</Link></li>
                <li><Link to="/compare">COMPARE</Link></li>
              </ul>
            </nav>
          </div>
        </div>
        <section className="timeline-content-frame" style={{ display: "flex", gap: "20px" }}>
          <div className="text-frame" style={{ flex: 0.5 }}>
            <h3>Live Data</h3>
            <div className="card-top-bar">
              <div className="search-bar">
                <label>Search:</label>
                <input type="text" placeholder="Search for a craft..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
            </div>
            <div className="comparison-vehicle-panel">
              <h2 className="comparison-craft-name">{selectedVehicle || "Craft Name"}</h2>
              <div className="comparison-top-row">
                <div className="comparison-nation">
                  <p><strong>Country:</strong> {liveVehicleData?.country || "N/A"}</p>
                </div>
                <div className="comparison-select-vehicle">
                  <label>Select Vehicle:</label>
                  <select value={selectedVehicle} onChange={(e) => setSelectedVehicle(e.target.value)}>
                    <option value="">Choose Craft</option>
                    {filteredVehicles.map((v) => (
                      <option key={v.identifier} value={v.identifier}>{v.identifier} ({v.country})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="comparison-vehicle-image-wrapper">
                <img className="comparison-vehicle-image" src={liveVehicleData?.images?.image || liveVehicleData?.images?.preview_image || "https://via.placeholder.com/200"} alt="Vehicle" />
              </div>
              <div className="comparison-info">
                <p><strong>Type:</strong> {liveVehicleData?.vehicle_type || "N/A"}</p>
                <p><strong>Premium:</strong> {liveVehicleData?.is_premium ? "Yes" : "No"}</p>
                <p><strong>BR (Live):</strong> {liveVehicleData?.realistic_br || "N/A"}</p>
                <p><strong>Rank:</strong> {liveVehicleData?.era || "N/A"}</p>
                <p><strong>Repair Cost (Live):</strong> {liveVehicleData?.repair_cost_realistic || "N/A"}</p>
              </div>
            </div>
          </div>
          <div className="text-frame" style={{ flex: 1.5 }}>
            <h3>Historical Data</h3>
            <div className="radio-container" style={{ marginBottom: "10px" }}>
              <label style={{ marginRight: "10px" }}>
                <input type="radio" name="dataset" value="BR" checked={selectedDataset === "BR"} onChange={(e) => setSelectedDataset(e.target.value)} /> BR Changes
              </label>
              <label style={{ marginRight: "10px" }}>
                <input type="radio" name="dataset" value="Repair" checked={selectedDataset === "Repair"} onChange={(e) => setSelectedDataset(e.target.value)} /> Repair Costs
              </label>
              <label>
                <input type="radio" name="dataset" value="Rank" checked={selectedDataset === "Rank"} onChange={(e) => setSelectedDataset(e.target.value)} /> Rank Changes
              </label>
            </div>
            <div className="card-container">
              <div className="chart-container2" style={{ position: "relative", height: "600px", width: "1200px" }}>
                {historicalData.length > 0 ? (
                  <Line data={lineChartData} options={lineChartOptions} />
                ) : (
                  <div style={{ color: "#e0e0e0", textAlign: "center", lineHeight: "600px" }}>
                    No historical data available.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TimelinePage;
