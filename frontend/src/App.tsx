import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Marketplace, MyPlans, MySubscriptions, CreatePlan } from "./pages";

function App() {
  useEffect(() => {
    console.log("🚀 App mounted");
    console.log("📝 Environment Variables:");
    console.log("  VITE_RPC_URL:", import.meta.env.VITE_RPC_URL);
    console.log("  VITE_PROGRAM_ID:", import.meta.env.VITE_PROGRAM_ID);
    console.log("  All env:", import.meta.env);
  }, []);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Marketplace />} />
        <Route path="/my-plans" element={<MyPlans />} />
        <Route path="/my-subscriptions" element={<MySubscriptions />} />
        <Route path="/create" element={<CreatePlan />} />
      </Routes>
    </div>
  );
}

export default App;
