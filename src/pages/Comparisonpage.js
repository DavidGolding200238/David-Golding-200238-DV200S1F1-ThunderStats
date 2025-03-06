import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import '../styles/Comparisonpage.css';

// Fetch all vehicles from API
async function fetchAllVehicles() {
    try {
        const response = await fetch('https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles');
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        return [];
    }
}

// Fetch historical BR data for a vehicle
async function fetchVehicleHistory(vehicleId) {
    try {
        const response = await fetch(`https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles/${vehicleId}/history`);
        if (!response.ok) throw new Error('Failed to fetch vehicle history');
        return await response.json();
    } catch (error) {
        console.error('Error fetching vehicle history:', error);
        return [];
    }
}

function ComparisonPage() {
    const [vehicles, setVehicles] = useState([]);
    const [vehicle1, setVehicle1] = useState('');
    const [vehicle2, setVehicle2] = useState('');
    const [vehicle1Details, setVehicle1Details] = useState(null);
    const [vehicle2Details, setVehicle2Details] = useState(null);
    const [brMode, setBrMode] = useState('realisticBr'); // Default BR mode
    const [vehicle1History, setVehicle1History] = useState([]);
    const [vehicle2History, setVehicle2History] = useState([]);

    // Fetch all vehicles on component mount
    useEffect(() => {
        async function loadVehicles() {
            const data = await fetchAllVehicles();
            setVehicles(data);
        }
        loadVehicles();
    }, []);

    // Fetch details and history for selected vehicles
    useEffect(() => {
        async function loadVehicleDetails() {
            if (vehicle1) {
                const details = vehicles.find(v => v.identifier === vehicle1);
                setVehicle1Details(details);
                if (details) {
                    const history = await fetchVehicleHistory(vehicle1);
                    setVehicle1History(history);
                }
            }
            if (vehicle2) {
                const details = vehicles.find(v => v.identifier === vehicle2);
                setVehicle2Details(details);
                if (details) {
                    const history = await fetchVehicleHistory(vehicle2);
                    setVehicle2History(history);
                }
            }
        }
        loadVehicleDetails();
    }, [vehicle1, vehicle2, vehicles]);

    // Function to get the appropriate vehicle image
    const getVehicleImage = (vehicle) => {
        if (!vehicle || !vehicle.images) return null;
        return (
            vehicle.images.image ||
            vehicle.images.preview_image ||
            vehicle.images.image_2 ||
            vehicle.images.image_3 ||
            vehicle.images.thumbnail ||
            null
        );
    };

    return (
        <div className="comparison-container">
            <h1>Vehicle Comparison</h1>

            {/* BR Selection Dropdown */}
            <div className="br-mode-selector">
                <label>Select Battle Rating Mode:</label>
                <select value={brMode} onChange={(e) => setBrMode(e.target.value)}>
                    <option value="arcadeBr">Arcade BR</option>
                    <option value="realisticBr">Realistic BR</option>
                    <option value="simulatorBr">Simulator BR</option>
                </select>
            </div>

            <div className="comparison-selection">
                {/* Vehicle 1 Selection */}
                <div className="vehicle-section">
                    <h2>Vehicle 1</h2>
                    <select value={vehicle1} onChange={(e) => setVehicle1(e.target.value)}>
                        <option value="">Select a Vehicle</option>
                        {vehicles.map((v) => (
                            <option key={v.identifier} value={v.identifier}>
                                {v.identifier} ({v.country})
                            </option>
                        ))}
                    </select>
                    <div className="vehicle-image">
                        {vehicle1Details ? (
                            <img
                                src={getVehicleImage(vehicle1Details)}
                                alt={vehicle1Details.identifier}
                                style={{ width: '500px', height: 'auto', borderRadius: '15px', border: '4px solid #ddd' }}
                            />
                        ) : (
                            <p>No Image Available</p>
                        )}
                    </div>
                </div>

                {/* Vehicle 2 Selection */}
                <div className="vehicle-section">
                    <h2>Vehicle 2</h2>
                    <select value={vehicle2} onChange={(e) => setVehicle2(e.target.value)}>
                        <option value="">Select a Vehicle</option>
                        {vehicles.map((v) => (
                            <option key={v.identifier} value={v.identifier}>
                                {v.identifier} ({v.country})
                            </option>
                        ))}
                    </select>
                    <div className="vehicle-image">
                        {vehicle2Details ? (
                            <img
                                src={getVehicleImage(vehicle2Details)}
                                alt={vehicle2Details.identifier}
                                style={{ width: '500px', height: 'auto', borderRadius: '15px', border: '4px solid #ddd' }}
                            />
                        ) : (
                            <p>No Image Available</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Bar Chart for Comparison */}
            {vehicle1Details && vehicle2Details && (
                <div className="comparison-chart">
                    <Bar
                        data={{
                            labels: ['Battle Rating', 'Max Speed', 'Repair Cost'],
                            datasets: [
                                {
                                    label: vehicle1Details.identifier,
                                    data: [vehicle1Details[brMode], vehicle1Details.max_speed, vehicle1Details.repair_cost_sl],
                                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                                },
                                {
                                    label: vehicle2Details.identifier,
                                    data: [vehicle2Details[brMode], vehicle2Details.max_speed, vehicle2Details.repair_cost_sl],
                                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                },
                            ],
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { position: 'top' },
                                tooltip: { enabled: true },
                            },
                        }}
                        style={{ maxWidth: '700px', height: '400px', margin: '0 auto' }}
                    />
                </div>
            )}

            {/* Line Chart for BR Progression */}
            {vehicle1History.length > 0 && (
                <div className="comparison-chart">
                    <h2>Battle Rating Progression Over Time</h2>
                    <Line
                        data={{
                            labels: vehicle1History.map(entry => entry.version),
                            datasets: [{
                                label: vehicle1Details.identifier,
                                data: vehicle1History.map(entry => entry[brMode]),
                                fill: false,
                                borderColor: 'rgba(54, 162, 235, 0.5)',
                                tension: 0.1
                            }]
                        }}
                    />
                </div>
            )}
        </div>
    );
}

export default ComparisonPage;
