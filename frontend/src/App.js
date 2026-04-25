import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "@/pages/Home";
import BookingConfirmation from "@/pages/BookingConfirmation";
import Admin from "@/pages/Admin";

function App() {
  useEffect(() => {
    document.title = "Krishn Tour and Travels — Ahmedabad Cabs";
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Toaster richColors position="top-right" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking/:id" element={<BookingConfirmation />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
