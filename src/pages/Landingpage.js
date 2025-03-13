import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Link } from "react-router-dom";
import "../styles/Landingpage.css";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const LandingPage = () => {
  const staticChartData = {
    labels: ["Tanks", "Aircraft", "Helicopters", "Naval"],
    datasets: [
      {
        label: "Vehicle Distribution",
        data: [10, 5, 3, 2],
        backgroundColor: [
          "rgba(124, 179, 66, 0.8)",   // Bright Military Green for Tanks
          "rgba(244, 67, 54, 0.8)",    // Bright Red for Aircraft
          "rgba(255, 152, 0, 0.8)",    // Bright Orange for Helicopters
          "rgba(0, 188, 212, 0.8)",    // Bright Aqua for Naval
        ],
        borderColor: [
          "rgba(124, 179, 66, 1)",
          "rgba(244, 67, 54, 1)",
          "rgba(255, 152, 0, 1)",
          "rgba(0, 188, 212, 1)",
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          "rgba(139, 195, 74, 1)",   // Hover Bright Green
          "rgba(229, 57, 53, 1)",    // Hover Bright Red
          "rgba(255, 167, 38, 1)",   // Hover Bright Orange
          "rgba(0, 229, 255, 1)",    // Hover Bright Aqua
        ],
      }
    ]
  };
  
  
  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "right",
        labels: { 
          color: "#FFFFFF", /* White text for contrast */
          font: { size: 14, weight: "bold" }
        },
      },
      datalabels: {
        color: "#FFF", /* Bright white text */
        font: { size: 16, weight: "bold" },
        textStrokeColor: "#000", /* Black outline for readability */
        textStrokeWidth: 2, /* Makes text pop */
      },
    },
    elements: {
      arc: {
        borderWidth: 2,
        borderColor: "#222", /* Keeps contrast high */
        hoverBorderColor: "#FFFFFF", /* Bright hover effect */
        hoverBorderWidth: 3, /* Slight thickness increase on hover */
      },
    },
  };
  
  return (
    <div className="landing-container">
      <div className="pattern-box"></div> {/* Pattern behind everything */}
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
          <div className="header-frame">
            <div className="header-text">
              <h1>ThunderStats</h1>
              <h2>The War Thunder Research Command Center</h2>
            </div>
          </div>
          <div className="navbar-frame">
            <nav className="navbar">
              <ul className="nav-links">
                <li><Link to="/compare">COMPARE</Link></li>
                <li><Link to="/timeline">TIMELINE</Link></li>
              </ul>
            </nav>
          </div>
        </div>
  
        <section className="content-frame">
  <div className="text-frame">
    <h3>Welcome to ThunderStats: The War Thunder Research Command Center</h3>
    <p>
      ThunderStats is your ultimate resource for in-depth vehicle analysis and performance tracking in War Thunder. Designed for players who want to make data-driven decisions, this platform provides precise vehicle comparisons, historical stat tracking, and curated rankings to help you better understand in-game mechanics and balance changes.
    </p>
    <h4>Key Features:</h4>
    <ul>
      <li>
        <strong>Vehicle Comparisons:</strong> Analyze two vehicles side by side, comparing key attributes such as speed, armor, firepower, and battle rating.
      </li>
      <li>
        <strong>Historical Data Tracking:</strong> View how a vehicle’s stats have evolved across game updates, including BR adjustments, penetration changes, and performance tweaks.
      </li>
      <li>
        <strong>Top Rankings & Insights:</strong> Discover the fastest tanks, most powerful weapons, and top-performing aircraft through curated leaderboards and statistical breakdowns.
      </li>
    </ul>
    <p>
      Whether you're a competitive player looking to optimize your lineup or a history enthusiast exploring vehicle performance, ThunderStats provides the tools you need to make informed decisions on the battlefield.
    </p>
  </div>

  <div className="chart-frame">
    <h3>Distribution of Vehicles in Tech Tree</h3>
    <div className="chart-container">
      <Doughnut data={staticChartData} options={chartOptions} />
    </div>
  </div>
</section>

      </div>
    </div>
  );
  
};

export default LandingPage;
