import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Landingpage"; // Your Landing Page
import ComparisonPage from "./pages/Comparisonpage"; // Comparison Page

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Ensure Landing Page opens first */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Comparison Page */}
        <Route path="/compare" element={<ComparisonPage />} />
      </Routes>
    </Router>
  );
};

export default App;
