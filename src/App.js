import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import FrontPage from "./pages/FrontPage";
import CommunityDashboard from "./pages/CommunityDashboard";
import ContributionReputation from "./pages/ContributionReputation";
import ClaimEmergency from "./pages/ClaimEmergency";
import FairPayoutSelection from "./pages/FairPayoutSelection";
import PayoutConfirmation from "./pages/PayoutConfirmation";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/front" element={<FrontPage />} />
      <Route path="/dashboard" element={<CommunityDashboard />} />
      <Route path="/contribution" element={<ContributionReputation />} />
      <Route path="/claim" element={<ClaimEmergency />} />
      <Route path="/selection" element={<FairPayoutSelection />} />
      <Route path="/confirmation" element={<PayoutConfirmation />} />
    </Routes>
  );
}

export default App;
