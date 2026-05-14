import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Paper, Divider, Stack } from "@mui/material";
import axios from "axios";

function Attendance() {
  const [status, setStatus] = useState(localStorage.getItem("attendanceStatus") || "Not Punched In");
  const [punchInTime, setPunchInTime] = useState(localStorage.getItem("punchInTime") || null);
  const [punchOutTime, setPunchOutTime] = useState(localStorage.getItem("punchOutTime") || null);
  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  const [location, setLocation] = useState("Fetching location...");
  const [today, setToday] = useState("");

  // 1. Initialize Date and Location
  useEffect(() => {
    const d = new Date();
    setToday(d.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          setLocation(res.data.display_name.split(',').slice(0, 2).join(', '));
        } catch (err) {
          setLocation("Location detected");
        }
      }, () => setLocation("Location access denied"));
    }
  }, []);

  // 2. Live Timer Logic
  useEffect(() => {
    let interval;
    if (status === "Punched In" && punchInTime) {
      interval = setInterval(() => {
        const start = new Date(punchInTime);
        const now = new Date();
        const diff = now - start;

        const h = Math.floor(diff / 3600000).toString().padStart(2, "0");
        const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, "0");
        const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, "0");
        setElapsedTime(`${h}:${m}:${s}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, punchInTime]);

  // 3. Punch Logic (This is login system-Punch)
  const handlePunch = async (type) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString();
    const dateStr = now.toISOString().split("T")[0];
    const empId = localStorage.getItem("employeeId");
  
    if (!empId) {
        alert("Login session expired! Please login again.");
        return;
    }

    if (type === "IN") {
      const startTime = now.toISOString();
      setPunchInTime(startTime);
      setStatus("Punched In");
      localStorage.setItem("attendanceStatus", "Punched In");
      localStorage.setItem("punchInTime", startTime);
      localStorage.removeItem("punchOutTime");
    } else {
      setPunchOutTime(timeStr);
      setStatus("Punched Out");
      localStorage.setItem("attendanceStatus", "Punched Out");
      localStorage.setItem("punchOutTime", timeStr);
    }

    // Backend API Call
    try {
      const response = await axios.post("https://pmb.finance/api/attendance/", {
        employee_id: empId,
        type: type, // "IN" or "OUT"
        time: timeStr,
        date: dateStr,
        location: location
      });
      
      console.log("Success:", response.data);
      alert(`Successfully Punched ${type}`);
    } catch (error) {
      console.error("Error details:", error.response?.data || error.message);
      alert(`Error: ${error.response?.data?.message || "Check Console/Django Terminal"}`);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Paper sx={{ p: 4, borderRadius: "25px", background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(15px)", boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.2)", width: "100%", maxWidth: "500px", textAlign: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>{today}</Typography>
        <Typography variant="body2" sx={{ mb: 2, color: "#64748b" }}>📍 {location}</Typography>
        <Typography variant="h4" sx={{ my: 2, fontWeight: 'bold' }}>{elapsedTime}</Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>Status: <strong>{status}</strong></Typography>

        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
          <Button variant="contained" disabled={status === "Punched In"} onClick={() => handlePunch("IN")} sx={{ background: "#38bdf8" }}>Punch In</Button>
          <Button variant="contained" disabled={status !== "Punched In"} onClick={() => handlePunch("OUT")} sx={{ background: "#f43f5e" }}>Punch Out</Button>
        </Stack>
      </Paper>
    </Box>
  );
}

export default Attendance;