import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Link } from "react-router-dom";
import "../styles/Landingpage.css";


ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const LandingPage = () => {
  // Static chart data for demonstration
  const staticChartData = {
    labels: ['Tanks', 'Aircraft', 'Helicopters', 'Naval'],
    datasets: [
      {
        label: "Vehicle Distribution",
        data: [10, 5, 3, 2],
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)"
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)"
        ],
        borderWidth: 1,
      }
    ]
  };

  const chartOptions = {
    maintainAspectRatio: false,  
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: { boxWidth: 20 },
      },
      datalabels: {
        color: '#ffffff',
        formatter: (value, context) => {
          return context.chart.data.labels[context.dataIndex];
        },
      },
    },
  };

  return (
    <div className="landing-container">
  
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
          <h3>Welcome to ThunderStats</h3>
          <p>
            ThunderStats is your ultimate resource for in-depth vehicle analysis and performance tracking in War Thunder.
            Designed for players who want to make data-driven decisions, this platform provides precise vehicle comparisons,
            historical stat tracking, and curated rankings to help you better understand in-game mechanics and balance changes.
          </p>
          <h4>Key Features</h4>
          <ul>
            <li>
              <strong>Vehicle Comparisons:</strong> Analyze two vehicles side by side, comparing key attributes such as speed, armor, firepower, and battle rating.
            </li>
            <li>
              <strong>Historical Data Tracking:</strong> View how a vehicle’s stats have evolved across game updates.
            </li>
            <li>
              <strong>Top Rankings &amp; Insights:</strong> Discover top-performing vehicles via curated leaderboards.
            </li>
          </ul>
          <p>
            Whether you're a competitive player looking to optimize your lineup or a history enthusiast exploring vehicle performance,
            ThunderStats provides the tools you need to make informed decisions on the battlefield.
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
  );
};

export default LandingPage;
