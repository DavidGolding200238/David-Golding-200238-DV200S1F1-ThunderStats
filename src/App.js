import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ComparisonPage from "./pages/Comparisonpage"; // Import Comparison Page

const App = () => {
  return (
    <Router>
      <div>
        {/* Landing Page */}
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <h1>Welcome to ThunderStats</h1>
                <Link to="/compare">
                  <button>Go to Comparison Page</button>
                </Link>
              </div>
            }
          />
          <Route path="/compare" element={<ComparisonPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
