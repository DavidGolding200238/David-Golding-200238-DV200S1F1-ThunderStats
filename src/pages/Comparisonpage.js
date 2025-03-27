import React, { useState, useEffect } from "react";
import { Bar, Radar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  ArcElement, 
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import { Link } from "react-router-dom";
import "../styles/Global.css";
import { fetchAllVehiclesPaginated, fetchVehicleDetails } from "../api/WarthunderApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);



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

const getVehicleSpeed = (vehicle) => {
  if (vehicle) {
    if (vehicle.engine && Number(vehicle.engine.max_speed_rb_sb) > 0) {
      const speed = Number(vehicle.engine.max_speed_rb_sb);
      console.log(`${vehicle.identifier} engine speed:`, speed);
      return speed;
    }
    if (vehicle.aerodynamics && Number(vehicle.aerodynamics.max_speed_at_altitude) > 0) {
      const speed = Number(vehicle.aerodynamics.max_speed_at_altitude);
      console.log(`${vehicle.identifier} aero speed:`, speed);
      return speed;
    }
  }
  return 0;
};

const getVehicleMass = (vehicle) =>
  vehicle && vehicle.mass ? Number(vehicle.mass) : 0;
const getVehicleCost = (vehicle) =>
  vehicle && vehicle.value ? Number(vehicle.value) : 0;
const getVehicleRepairCost = (vehicle) =>
  vehicle && vehicle.repair_cost_arcade ? Number(vehicle.repair_cost_arcade) : 0;
const getVehicleCrewCount = (vehicle) =>
  vehicle && vehicle.crew_total_count ? Number(vehicle.crew_total_count) : 0;
const getVehicleResearch = (vehicle) =>
  vehicle && vehicle.req_exp ? Number(vehicle.req_exp) : 0;

// Helper for radar: Convert Mass from kg to tons.
const getMetricValue = (vehicle, metric) => {
  if (!vehicle) return 0;
  if (metric === "Mass") return getVehicleMass(vehicle) / 1000;
  if (metric === "Repair") return getVehicleRepairCost(vehicle);
  if (metric === "Crew") return getVehicleCrewCount(vehicle);
  if (metric === "Research") return getVehicleResearch(vehicle);
  return 0;
};

const normalizeMetric = (value, metric) => {
  const maxValues = {
    mass: 10000,
    repair: 2000,
    crew: 10,
    research: 10000
  };
  const max = maxValues[metric] || 1;
  return (value / max) * 10;
};

// --------------------- UI Components ---------------------

// VehiclePanel now uses the ground battle checkbox (isGroundBattle) and selectedBR to decide which BR to display.
function VehiclePanel({ vehicle, vehicles, onSelectChange, selectedBR, isGroundBattle }) {
  const displayBR = (() => {
    if (!vehicle) return "N/A";
    const type = vehicle.vehicle_type ? vehicle.vehicle_type.toLowerCase() : "";
    if (type === "fighter" || type === "plane") {
      if (isGroundBattle) {
        if (selectedBR === "Arcade") {
          return vehicle.arcade_br;
        } else if (selectedBR === "Realistic") {
          return vehicle.realistic_ground_br;
        } else if (selectedBR === "Simulator") {
          return vehicle.simulator_ground_br;
        }
      } else {
        if (selectedBR === "Arcade") {
          return vehicle.arcade_br;
        } else if (selectedBR === "Realistic") {
          return vehicle.realistic_br;
        } else if (selectedBR === "Simulator") {
          return vehicle.simulator_br;
        }
      }
    } else {
      if (selectedBR === "Arcade") {
        return vehicle.arcade_br;
      } else if (selectedBR === "Realistic") {
        return vehicle.realistic_br;
      } else if (selectedBR === "Simulator") {
        return vehicle.simulator_br;
      }
    }
    return "N/A";
  })();

  return (
    <div className="comparison-vehicle-panel">
      <h2 className="comparison-craft-name">
        {vehicle ? vehicle.identifier : "Craft Name"}
      </h2>
      <div className="comparison-top-row">
        <div className="comparison-nation">
          <p>
            <strong>Country:</strong> {vehicle ? vehicle.country : "N/A"}
          </p>
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
        <p><strong>Tier:</strong> {vehicle ? vehicle.era : "N/A"}</p>
        <p><strong>Type:</strong> {vehicle ? vehicle.vehicle_type : "N/A"}</p>
        <p><strong>Premium:</strong> {vehicle ? (vehicle.is_premium ? "Yes" : "No") : "N/A"}</p>
        <p><strong>BR:</strong> {vehicle ? displayBR : "N/A"}</p>
      </div>
    </div>
  );
}

// --------------------- Main Comparison Page Component ---------------------

function ComparisonPage() {
  const [vehicles, setVehicles] = useState([]);
  const [vehicle1, setVehicle1] = useState("");
  const [vehicle2, setVehicle2] = useState("");
  const [vehicle1Details, setVehicle1Details] = useState(null);
  const [vehicle2Details, setVehicle2Details] = useState(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState("All");
  const [selectedNation1, setSelectedNation1] = useState("All");
  const [selectedNation2, setSelectedNation2] = useState("All");
  const [selectedBR, setSelectedBR] = useState("Arcade");
  const [isGroundBattle, setIsGroundBattle] = useState(false);
  const [selectedChart, setSelectedChart] = useState("speed");
  // New states for search queries on each card.
  const [searchQuery1, setSearchQuery1] = useState("");
  const [searchQuery2, setSearchQuery2] = useState("");
  
  // New states for radar chart options
  const allMetrics = ["Mass", "Repair", "Crew", "Research"];
  const [selectedMetrics, setSelectedMetrics] = useState(allMetrics);
  const [useNormalized, setUseNormalized] = useState(true);

  // Load vehicles using the API module's parallel paginated fetch.
  useEffect(() => {
    async function loadVehicles() {
      const data = await fetchAllVehiclesPaginated();
      console.log("Total Vehicles Loaded:", data.length);
      setVehicles(data);
    }
    loadVehicles();
  }, []);

  // Fetch detailed data when a vehicle is selected.
  useEffect(() => {
    async function loadVehicle1Details() {
      if (vehicle1) {
        const details = await fetchVehicleDetails(vehicle1);
        setVehicle1Details(details);
      } else {
        setVehicle1Details(null);
      }
    }
    loadVehicle1Details();
  }, [vehicle1]);

  useEffect(() => {
    async function loadVehicle2Details() {
      if (vehicle2) {
        const details = await fetchVehicleDetails(vehicle2);
        setVehicle2Details(details);
      } else {
        setVehicle2Details(null);
      }
    }
    loadVehicle2Details();
  }, [vehicle2]);

  // Compute list of nations from vehicles.
  const nations =
    vehicles.length > 0
      ? ["All", ...Array.from(new Set(vehicles.map(v => v.country.toLowerCase())))]
      : ["All"];

  // Updated search filtering: normalize the identifier by replacing underscores with spaces and using a regex.
  const normalizeString = (str) => str.replace(/_/g, " ").toLowerCase();

  // Filter vehicles for card 1.
  const aircraftTypes = ["fighter", "bomber", "interceptor", "jet", "strike_aircraft", "attacker", "assault"];
const navalTypes = ["ship", "boat", "destroyer", "frigate", "naval", "heavy_cruiser", "coastal_ship"];

const filteredVehicles1 = vehicles.filter(v => {
  const typeLower = v.vehicle_type ? v.vehicle_type.toLowerCase() : "";
  const subTypesLower = v.vehicle_sub_types ? v.vehicle_sub_types.map(s => s.toLowerCase()) : [];

  const typeMatch =
    selectedVehicleType === "All" ||
    (
      selectedVehicleType === "Plane" &&
      (aircraftTypes.includes(typeLower) || subTypesLower.some(s => aircraftTypes.includes(s)))
    ) ||
    (
      selectedVehicleType === "Naval" &&
      (navalTypes.includes(typeLower) || subTypesLower.some(s => navalTypes.includes(s)))
    ) ||
    (
      typeLower.includes(selectedVehicleType.toLowerCase()) ||
      subTypesLower.includes(selectedVehicleType.toLowerCase())
    );

  const nationMatch =
    selectedNation1 === "All" ||
    (v.country && v.country.toLowerCase() === selectedNation1.toLowerCase());

  const normalizedId = normalizeString(v.identifier);
  const normalizedQuery = normalizeString(searchQuery1);
  const searchMatch = normalizedQuery === "" || new RegExp("\\b" + normalizedQuery).test(normalizedId);

  return typeMatch && nationMatch && searchMatch;
});

  // Filter vehicles for card 2.
  const filteredVehicles2 = vehicles.filter(v => {
    const typeLower = v.vehicle_type ? v.vehicle_type.toLowerCase() : "";
    const subTypesLower = v.vehicle_sub_types ? v.vehicle_sub_types.map(s => s.toLowerCase()) : [];
  
    const typeMatch =
      selectedVehicleType === "All" ||
      (
        selectedVehicleType === "Plane" &&
        (aircraftTypes.includes(typeLower) || subTypesLower.some(s => aircraftTypes.includes(s)))
      ) ||
      (
        selectedVehicleType === "Naval" &&
        (navalTypes.includes(typeLower) || subTypesLower.some(s => navalTypes.includes(s)))
      ) ||
      (
        typeLower.includes(selectedVehicleType.toLowerCase()) ||
        subTypesLower.includes(selectedVehicleType.toLowerCase())
      );
  
    const nationMatch =
      selectedNation2 === "All" ||
      (v.country && v.country.toLowerCase() === selectedNation2.toLowerCase());
  
    const normalizedId = normalizeString(v.identifier);
    const normalizedQuery = normalizeString(searchQuery2);
    const searchMatch = normalizedQuery === "" || new RegExp("\\b" + normalizedQuery).test(normalizedId);
  
    return typeMatch && nationMatch && searchMatch;
  });

  const handleVehicleTypeChange = (e) => {
    const type = e.target.value;
    setSelectedVehicleType(type);
    if (type !== "All") {
      if (!vehicles.find(v => v.identifier === vehicle1 && v.vehicle_type.toLowerCase().includes(type.toLowerCase()))) {
        setVehicle1("");
      }
      if (!vehicles.find(v => v.identifier === vehicle2 && v.vehicle_type.toLowerCase().includes(type.toLowerCase()))) {
        setVehicle2("");
      }
    }
  };

  // Handle toggling a metric for the radar chart.
  const handleMetricToggle = (metric) => {
    if (selectedMetrics.includes(metric)) {
      setSelectedMetrics(selectedMetrics.filter(m => m !== metric));
    } else {
      setSelectedMetrics([...selectedMetrics, metric]);
    }
  };

  //  radar chart data.
  const radarData1 = vehicle1Details
    ? selectedMetrics.map(metric =>
        useNormalized
          ? normalizeMetric(getMetricValue(vehicle1Details, metric), metric.toLowerCase())
          : getMetricValue(vehicle1Details, metric)
      )
    : [];
  const radarData2 = vehicle2Details
    ? selectedMetrics.map(metric =>
        useNormalized
          ? normalizeMetric(getMetricValue(vehicle2Details, metric), metric.toLowerCase())
          : getMetricValue(vehicle2Details, metric)
      )
    : [];

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
          <select value={selectedVehicleType} onChange={handleVehicleTypeChange}>
            <option value="All">All</option>
            <option value="Tank">Tank</option>
            <option value="Helicopter">Helicopter</option>
            <option value="Plane">Plane</option>
            <option value="Naval">Naval</option>
            <option value="Battlecruiser">Battlecruiser</option>
          </select>
        </div>
        <div className="comparison-filter">
          <label>BR Settings</label>
          <select value={selectedBR} onChange={(e) => setSelectedBR(e.target.value)}>
            <option value="Arcade">Arcade</option>
            <option value="Realistic">Realistic</option>
            <option value="Simulator">Simulator</option>
          </select>
        </div>
        <div className="comparison-filter">
          <label>
            <input type="checkbox" checked={isGroundBattle} onChange={(e) => setIsGroundBattle(e.target.checked)} />
            Ground Battle
          </label>
        </div>
      </div>

      <div className="comparison-cards-frame">
        <div className="comparison-selection">
          <div className="card-container">
            {/* Card 1 */}
            <div className="card-top-bar">
              <div className="nation-filter">
                <label>Select Nation:</label>
                <select value={selectedNation1} onChange={(e) => setSelectedNation1(e.target.value)}>
                  {nations.map((nation) => (
                    <option key={nation} value={nation}>
                      {nation.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="search-bar">
                <label>Search:</label>
                <input type="text" placeholder="Search for a tank..." value={searchQuery1} onChange={(e) => setSearchQuery1(e.target.value)} />
              </div>
            </div>
            <VehiclePanel
              vehicle={vehicle1Details}
              vehicles={filteredVehicles1}
              onSelectChange={(e) => setVehicle1(e.target.value)}
              selectedBR={selectedBR}
              isGroundBattle={isGroundBattle}
            />
          </div>

          <div className="comparison-chart">
            {selectedChart === "speed" && (
              <>
                <h2 style={{ color: "white", textAlign: "center" }}></h2>
                {vehicle1Details && vehicle2Details ? (
                  <Bar
                    data={{
                      labels: ["Speed"],
                      datasets: [
                        {
                          label: "Vehicle 1",
                          data: [getVehicleSpeed(vehicle1Details)],
                          backgroundColor: "rgba(255, 99, 132, 0.8)", 
                          borderColor: "#FF6384",
                          borderWidth: 2
                        },
                        {
                          label: "Vehicle 2",
                          data: [getVehicleSpeed(vehicle2Details)],
                          backgroundColor: "rgba(255, 205, 86, 0.8)", 
                          borderColor: "#FFCD56",
                          borderWidth: 2
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: "top", labels: { color: "white" } },
                        tooltip: { enabled: true }
                      },
                      scales: {
                        x: { ticks: { color: "white" }, grid: { color: "white" } },
                        y: { ticks: { color: "white" }, grid: { color: "white" } }
                      }
                    }}
                    style={{ maxWidth: "500px", height: "400px", margin: "0 auto" }}
                  />
                ) : (
                  <p style={{ color: "white", textAlign: "center" }}>
                    Please select two vehicles with valid detailed data to display the speed chart.
                  </p>
                )}
              </>
            )}

            {selectedChart === "mass" && (
              <>
                <h2 style={{ color: "white", textAlign: "center" }}></h2>
                {vehicle1Details && vehicle2Details ? (
                  <Pie
                    key={vehicle1 + vehicle2}
                    data={{
                      labels: [
                        vehicle1Details.identifier || "Vehicle 1",
                        vehicle2Details.identifier || "Vehicle 2"
                      ],
                      datasets: [
                        {
                          data: [getVehicleMass(vehicle1Details), getVehicleMass(vehicle2Details)],
                          backgroundColor: [
                            "rgba(255, 99, 132, 0.8)", 
                            "rgba(255, 205, 86, 0.8)"  
                          ],
                          borderColor: [
                            "#FF6384",
                            "#FFCD56"
                          ],
                          borderWidth: 2
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: "top", labels: { color: "white" } },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              const value = context.raw;
                              const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                              const percent = ((value / total) * 100).toFixed(1);
                              return `${context.label}: ${value} kg (${percent}%)`;
                            }
                          }
                        }
                      }
                    }}
                    style={{ maxWidth: "500px", height: "400px", margin: "0 auto" }}
                  />
                ) : (
                  <p style={{ color: "white", textAlign: "center" }}>
                    Please select two vehicles with valid data to show the pie chart.
                  </p>
                )}
              </>
            )}

            {selectedChart === "cost" && (
              <>
                <h2 style={{ color: "white", textAlign: "center" }}></h2>
                {vehicle1Details && vehicle2Details ? (
                  <Bar
                    data={{
                      labels: ["Cost"],
                      datasets: [
                        {
                          label: "Vehicle 1",
                          data: [getVehicleCost(vehicle1Details)],
                          backgroundColor: "rgba(255, 99, 132, 0.8)",
                          borderColor: "#FF6384",
                          borderWidth: 2
                        },
                        {
                          label: "Vehicle 2",
                          data: [getVehicleCost(vehicle2Details)],
                          backgroundColor: "rgba(255, 205, 86, 0.8)",
                          borderColor: "#FFCD56",
                          borderWidth: 2
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: "top", labels: { color: "white" } },
                        tooltip: { enabled: true }
                      },
                      scales: {
                        x: { ticks: { color: "white" }, grid: { color: "white" } },
                        y: { ticks: { color: "white" }, grid: { color: "white" } }
                      }
                    }}
                    style={{ maxWidth: "500px", height: "400px", margin: "0 auto" }}
                  />
                ) : (
                  <p style={{ color: "white", textAlign: "center" }}>
                    Please select two vehicles with valid detailed data to display the cost chart.
                  </p>
                )}
              </>
            )}

{selectedChart === "overall" && (
  <>
    
    {vehicle1Details && vehicle2Details ? (
      <>
        {(() => {
          
          const normalizedData1 = [];
          const normalizedData2 = [];
          const rawData1 = [];
          const rawData2 = [];

          selectedMetrics.forEach(metric => {
            const raw1 = getMetricValue(vehicle1Details, metric);
            const raw2 = getMetricValue(vehicle2Details, metric);
           
            const maxForMetric = Math.max(raw1, raw2, 1);
            normalizedData1.push((raw1 / maxForMetric) * 10);
            normalizedData2.push((raw2 / maxForMetric) * 10);
            rawData1.push(raw1);
            rawData2.push(raw2);
          });

          return (
            <Radar
              data={{
                labels: selectedMetrics,
                datasets: [
                  {
                    label: "Vehicle 1",
                    data: normalizedData1,
                    backgroundColor: "rgba(255, 99, 132, 0.3)",
                    borderColor: "#FF6384",
                    pointBackgroundColor: "#FF6384",
                    pointRadius: 8,
                    pointHoverRadius: 10,
                    fill: true
                  },
                  {
                    label: "Vehicle 2",
                    data: normalizedData2,
                    backgroundColor: "rgba(255, 205, 86, 0.3)",
                    borderColor: "#FFCD56",
                    pointBackgroundColor: "#FFCD56",
                    pointRadius: 8,
                    pointHoverRadius: 10,
                    fill: true
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  r: {
                    beginAtZero: true,
                    min: 0,
                    max: 10, 
                    ticks: {
                      display: true,
                      stepSize: 2,
                      color: "white"
                    },
                    grid: {
                      color: "white",
                      circular: true
                    },
                    pointLabels: {
                      color: "white",
                      font: { size: 16 }
                    },
                    angleLines: {
                      color: "white"
                    }
                  }
                },
                plugins: {
                  legend: {
                    position: "top",
                    labels: { color: "white", font: { size: 14 } }
                  },
                  tooltip: {
                    backgroundColor: "rgba(40, 40, 40, 0.95)",
                    titleColor: "#ffffff",
                    bodyColor: "#ffffff",
                    borderColor: "#ffffff",
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12,
                    callbacks: {
                      label: function (context) {
                        const metric = selectedMetrics[context.dataIndex];
                        let unit = "";
                        if (metric === "Mass") unit = " tons";
                        else if (metric === "Repair") unit = " credits";
                        else if (metric === "Crew") unit = " persons";
                        else if (metric === "Research") unit = " exp";

                        // Use the raw values for the tooltip.
                        let rawValue;
                        if (context.datasetIndex === 0) {
                          rawValue = rawData1[context.dataIndex];
                        } else {
                          rawValue = rawData2[context.dataIndex];
                        }
                        return context.dataset.label + ": " + rawValue.toFixed(2) + unit;
                      }
                    }
                  }
                }
              }}
              style={{ maxWidth: "500px", height: "400px", margin: "0 auto" }}
            />
          );
        })()}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: "20px",
            color: "white"
          }}
        >
          {allMetrics.map((metric) => (
            <label key={metric}>
              <input
                type="checkbox"
                checked={selectedMetrics.includes(metric)}
                onChange={() => handleMetricToggle(metric)}
              />
              {metric}
            </label>
          ))}
        </div>
      </>
    ) : (
      <p style={{ color: "white", textAlign: "center" }}>
        Please select two vehicles with valid detailed data to display the radar chart.
      </p>
    )}
  </>
)}




            <div className="chart-selector" style={{ textAlign: "center", marginBottom: "20px" }}>
              <button onClick={() => setSelectedChart("speed")}>Speed</button>
              <button onClick={() => setSelectedChart("mass")}>Mass</button>
              <button onClick={() => setSelectedChart("cost")}>Cost</button>
              <button onClick={() => setSelectedChart("overall")}>Overall Specs</button>
            </div>
          </div>

          <div className="card-container">
            {/* Card 2 */}
            <div className="card-top-bar">
              <div className="nation-filter">
                <label>Select Nation:</label>
                <select value={selectedNation2} onChange={(e) => setSelectedNation2(e.target.value)}>
                  {nations.map((nation) => (
                    <option key={nation} value={nation}>
                      {nation.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="search-bar">
                <label>Search:</label>
                <input type="text" placeholder="Search for a tank..." value={searchQuery2} onChange={(e) => setSearchQuery2(e.target.value)} />
              </div>
            </div>
            <VehiclePanel
              vehicle={vehicle2Details}
              vehicles={filteredVehicles2}
              onSelectChange={(e) => setVehicle2(e.target.value)}
              selectedBR={selectedBR}
              isGroundBattle={isGroundBattle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComparisonPage;
