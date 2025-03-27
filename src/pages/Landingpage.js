import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Global.css";
import { fetchAllVehiclesPaginated } from "../api/WarthunderApi";

const CustomDonutChart = ({ data }) => {
  if (!data) return null;

  const dataset = data.datasets[0];
  const counts = dataset.data;
  const colors = dataset.backgroundColor;
  const total = counts.reduce((sum, count) => sum + count, 0);

  const radius = 90;             // Scaled up radius
  const center = 120;            // Center of the canvas
  const circumference = 2 * Math.PI * radius;

  let cumulative = 0;
  const segments = counts.map((count, index) => {
    const percentage = total ? count / total : 0;
    const dash = percentage * circumference;
    const rotation = (cumulative / total) * 360;
    cumulative += count;
    return {
      dash,
      rotation,
      color: colors[index],
      label: data.labels[index],
      value: count,
    };
  });

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <svg viewBox="0 0 240 240" width="420" height="420">
        <g transform={`rotate(-90 ${center} ${center})`}>
          {segments.map((seg, index) => (
            <circle
              key={index}
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke={seg.color}
              strokeWidth="36"
              strokeDasharray={`${seg.dash} ${circumference}`}
              strokeDashoffset="0"
              transform={`rotate(${seg.rotation} ${center} ${center})`}
            />
          ))}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#1e252c"
            strokeWidth="36"
            strokeDasharray={`${circumference}`}
            strokeDashoffset="0"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to={circumference}
              dur="1s"
              fill="freeze"
            />
          </circle>
        </g>
        <text
          x={center}
          y={center}
          textAnchor="middle"
          dy="0.35em"
          fill="#fff"
          fontSize="22"
          fontWeight="bold"
        >
          {total}
        </text>
      </svg>

    
      <div style={{ marginLeft: "32px", color: "#fff", fontSize: "18px" }}>
        {segments.map((seg, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: seg.color,
                marginRight: "10px",
              }}
            ></div>
            <span>
              {seg.label}: {seg.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const LandingPage = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getTankCategory = (vehicleType) => {
    if (!vehicleType) return null;
    const type = vehicleType.toLowerCase();
    if (type.includes("spaa")) return "SPAA";
    if (type.includes("light")) return "Light";
    if (type.includes("medium")) return "Medium";
    if (type.includes("tank destroyer") || type.includes("tank_destroyer"))
      return "Tank Destroyer";
    if (type.includes("heavy")) return "Heavy";
    return null;
  };

  useEffect(() => {
    async function loadVehicles() {
      const vehicles = await fetchAllVehiclesPaginated();
      const tankVehicles = vehicles.filter(
        (v) => getTankCategory(v.vehicle_type) !== null
      );
      let counts = {
        Light: 0,
        Medium: 0,
        "Tank Destroyer": 0,
        SPAA: 0,
        Heavy: 0,
      };

      tankVehicles.forEach((v) => {
        const cat = getTankCategory(v.vehicle_type);
        if (cat && counts.hasOwnProperty(cat)) {
          counts[cat] += 1;
        }
      });

      const dynamicData = {
        labels: ["Light", "Medium", "Tank Destroyer", "SPAA", "Heavy"],
        datasets: [
          {
            label: "Tank Distribution",
            data: [
              counts["Light"],
              counts["Medium"],
              counts["Tank Destroyer"],
              counts["SPAA"],
              counts["Heavy"],
            ],
            backgroundColor: [
              "rgba(124, 179, 66, 0.8)",
              "rgba(244, 67, 54, 0.8)",
              "rgba(255, 152, 0, 0.8)",
              "rgba(0, 188, 212, 0.8)",
              "rgba(156, 39, 176, 0.8)",
            ],
          },
        ],
      };

      setChartData(dynamicData);
      setLoading(false);
    }
    loadVehicles();
  }, []);

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
          <div className="header-frame">
            <div className="header-text">
              <h1 style={{ fontSize: "4rem" }}>ThunderStats</h1>
              <h2 style={{ fontSize: "2rem" }}>
                The War Thunder Research Command Center
              </h2>
            </div>
          </div>
          <div className="navbar-frame">
            <nav className="navbar">
              <ul className="nav-links" style={{ fontSize: "1.25rem" }}>
                <li>
                  <Link to="/compare">COMPARE</Link>
                </li>
                <li>
                  <Link to="/timeline">TIMELINE</Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <section className="content-frame">
          <div className="text-frame" style={{ fontSize: "1.2rem", lineHeight: "1.8" }}>
            <h3 style={{ fontSize: "1.75rem" }}>
              Welcome to ThunderStats: The War Thunder Research Command Center
            </h3>
            <p>
              ThunderStats is your ultimate resource for in-depth vehicle analysis and performance tracking in War Thunder. Designed for players who want to make data-driven decisions, this platform provides precise vehicle comparisons, historical stat tracking, and curated rankings to help you better understand in-game mechanics and balance changes.
            </p>
            <h4 style={{ fontSize: "1.5rem" }}>Key Features:</h4>
            <ul>
              <li>
                <strong>Vehicle Comparisons:</strong> Analyze vehicles side by side, comparing key attributes such as speed, armor, firepower, and battle rating.
              </li>
              <li>
                <strong>Historical Data Tracking:</strong> View how a vehicle’s stats have evolved across game updates.
              </li>
              <li>
                <strong>Top Rankings & Insights:</strong> Discover the fastest tanks, most powerful weapons, and top-performing aircraft through curated leaderboards.
              </li>
            </ul>
          </div>
          <div className="chart-frame">
  <div style={{ marginTop: "-200px" }}>
    <h3 style={{ marginBottom: "20px", fontSize: "1.75rem" }}>
      Distribution of Tank Types in Tech Tree
    </h3>
    <div className="chart-container">
      {loading ? (
        <p>Loading chart data...</p>
      ) : chartData ? (
        <CustomDonutChart data={chartData} />
      ) : (
        <p>No data available</p>
      )}
    </div>
  </div>
</div>

        </section>
      </div>
    </div>
  );
};

export default LandingPage;
