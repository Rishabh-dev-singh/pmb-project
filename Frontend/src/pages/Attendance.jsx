import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Chip,
  Fade,
  Grid,
} from "@mui/material";

import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";

import axios from "axios";

// NEW: Accept employeeId as a prop
function Attendance({ employeeId }) {
  const quotes = [
    "Success doesn’t come from what you do occasionally, it comes from what you do consistently.",
    "Small daily improvements are the key to long-term success.",
    "Discipline and dedication create extraordinary results.",
    "Every working day is another opportunity to grow stronger.",
    "Hard work today builds a successful tomorrow.",
    "Great employees are the foundation of a great company.",
  ];

  const [status, setStatus] = useState(
    localStorage.getItem("attendanceStatus") || "Not Punched In"
  );

  const [punchInTime, setPunchInTime] = useState(
    localStorage.getItem("punchInTime") || null
  );

  const [punchOutTime, setPunchOutTime] = useState(
    localStorage.getItem("punchOutTime") || null
  );

  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  const [location, setLocation] = useState("Fetching location...");
  const [today, setToday] = useState("");
  const [quote, setQuote] = useState(
    quotes[Math.floor(Math.random() * quotes.length)]
  );
  const [greeting, setGreeting] = useState("Welcome");

  useEffect(() => {
    const d = new Date();
    const hour = d.getHours();

    if (hour < 12) {
      setGreeting("Good Morning ☀️");
    } else if (hour < 17) {
      setGreeting("Good Afternoon 🌤️");
    } else {
      setGreeting("Good Evening 🌙");
    }

    setToday(
      d.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const res = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            setLocation(
              res.data.display_name
                .split(",")
                .slice(0, 2)
                .join(", ")
            );
          } catch (err) {
            setLocation("Location detected");
          }
        },
        () => {
          setLocation("Location access denied");
        }
      );
    }
  }, []);

  // ---------------------------------------------------------------------------
  // NEW FIX: Synchronize attendance state from backend on component load.
  // Overrides localStorage if there's an active/finished punch in the database.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const syncAttendance = async () => {
      const currentEmpId = employeeId || localStorage.getItem("employeeId");
      if (!currentEmpId) return;

      const now = new Date();
      // Use exact format expected by API (YYYY-MM-DD)
      const dateStr = now.toISOString().split("T")[0];

      try {
        const res = await axios.get(
          `https://pmb.finance/api/attendance/today/?employee_id=${currentEmpId}&date=${dateStr}`
        );

        if (res.data && res.data.status === "success") {
          const { punch_in, punch_out } = res.data;

          // Helper to convert backend format "09:10:25 AM" to local ISO string for timer compatibility
          const convertToISO = (time12h) => {
            if (!time12h) return null;
            const [time, modifier] = time12h.split(" ");
            let [hours, minutes, seconds] = time.split(":");
            hours = parseInt(hours, 10);
            
            if (hours === 12 && modifier === "AM") hours = 0;
            if (hours < 12 && modifier === "PM") hours += 12;

            const d = new Date();
            d.setHours(hours, parseInt(minutes, 10), parseInt(seconds, 10), 0);
            return d.toISOString();
          };

          if (punch_in && !punch_out) {
            // User is currently punched in but hasn't punched out yet
            const isoPunchIn = convertToISO(punch_in);
            setStatus("Punched In");
            setPunchInTime(isoPunchIn);
            
            // Sync local storage to match backend truth
            localStorage.setItem("attendanceStatus", "Punched In");
            localStorage.setItem("punchInTime", isoPunchIn);
            localStorage.removeItem("punchOutTime");
            
          } else if (punch_in && punch_out) {
            // User has completed their shift for today
            const isoPunchIn = convertToISO(punch_in);
            setStatus("Punched Out");
            setPunchInTime(isoPunchIn);
            setPunchOutTime(punch_out);
            
            // Sync local storage to match backend truth
            localStorage.setItem("attendanceStatus", "Punched Out");
            localStorage.setItem("punchInTime", isoPunchIn);
            localStorage.setItem("punchOutTime", punch_out);
          }
        } else if (res.data && res.data.status === "not_found") {
          // No record for today, ensure state resets to "Not Punched In" 
          setStatus("Not Punched In");
          setPunchInTime(null);
          setPunchOutTime(null);
          
          localStorage.setItem("attendanceStatus", "Not Punched In");
          localStorage.removeItem("punchInTime");
          localStorage.removeItem("punchOutTime");
        }
      } catch (err) {
        console.error("Attendance sync error:", err);
      }
    };

    syncAttendance();
  }, [employeeId]);
  // ---------------------------------------------------------------------------

  useEffect(() => {
    let interval;
    if (status === "Punched In" && punchInTime) {
      interval = setInterval(() => {
        const start = new Date(punchInTime);
        const now = new Date();
        const diff = now - start;

        const h = Math.floor(diff / 3600000)
          .toString()
          .padStart(2, "0");

        const m = Math.floor((diff % 3600000) / 60000)
          .toString()
          .padStart(2, "0");

        const s = Math.floor((diff % 60000) / 1000)
          .toString()
          .padStart(2, "0");

        setElapsedTime(`${h}:${m}:${s}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, punchInTime]);

  const handlePunch = async (type) => {
    if (
      type === "IN" &&
      localStorage.getItem("attendanceStatus") === "Punched In"
    ) {
      alert("Already punched in");
      return;
    }

    if (
      type === "OUT" &&
      localStorage.getItem("attendanceStatus") === "Punched Out"
    ) {
      alert("Already punched out");
      return;
    }

    const now = new Date();

    const timeStr = now.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const dateStr = now.toISOString().split("T")[0];

    // FIX: Get ID from props first, fallback to localStorage
    const currentEmpId = employeeId || localStorage.getItem("employeeId");

    if (!currentEmpId) {
      alert("Employee ID not found! Please ensure you are logged in properly or refresh the dashboard.");
      return;
    }

    if (type === "IN") {
      const startTime = now.toISOString();
      setPunchInTime(startTime);
      setStatus("Punched In");
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
      
      localStorage.setItem("attendanceStatus", "Punched In");
      localStorage.setItem("punchInTime", startTime);
      localStorage.removeItem("punchOutTime");
      
      alert("Good Morning ☀️\nSuccessfully Punched In");
    } else {
      setPunchOutTime(timeStr);
      setStatus("Punched Out");
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
      
      localStorage.setItem("attendanceStatus", "Punched Out");
      localStorage.setItem("punchOutTime", timeStr);
      
      alert("Good Job 🎉\nSuccessfully Punched Out");
    }

    try {
      await axios.post("https://pmb.finance/api/attendance/", {
        employee_id: currentEmpId, // Pass the fixed ID to backend
        type: type,
        time: timeStr,
        date: dateStr,
        location: location,
      });
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.message || "Server Error");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top left, #2563eb 0%, #020617 60%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        overflow: "hidden",
      }}
    >
      <Fade in timeout={700}>
        <Grid
          container
          spacing={3}
          sx={{
            width: "100%",
            maxWidth: "1050px",
            alignItems: "stretch",
            justifyContent: "center",
          }}
        >
          {/* ATTENDANCE CARD */}
          <Grid item xs={12} md={5}>
            <Paper
              elevation={0}
              sx={{
                height: "100%",
                borderRadius: "28px",
                p: 3,
                background: "rgba(15,23,42,0.82)",
                backdropFilter: "blur(18px)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
                textAlign: "center",
                color: "#fff",
              }}
            >
              <Typography sx={{ fontSize: "15px", opacity: 0.8, mb: 1 }}>
                {greeting}
              </Typography>

              <Chip
                label="Smart Attendance"
                sx={{
                  mb: 2,
                  height: "32px",
                  fontWeight: "bold",
                  background: "linear-gradient(135deg,#0ea5e9,#2563eb)",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />

              <Typography
                sx={{
                  fontSize: "42px",
                  fontWeight: 900,
                  background: "linear-gradient(90deg,#ffffff,#cbd5e1)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                Attendance
              </Typography>

              <Typography sx={{ opacity: 0.7, fontSize: "13px", mb: 3 }}>
                {today}
              </Typography>

              {/* TIMER */}
              <Box
                sx={{
                  width: "185px",
                  height: "185px",
                  borderRadius: "50%",
                  margin: "auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "linear-gradient(135deg,#0ea5e9,#2563eb,#7c3aed)",
                  boxShadow: `0 0 35px rgba(37,99,235,0.45), inset 0 0 18px rgba(255,255,255,0.15)`,
                  border: "5px solid rgba(255,255,255,0.10)",
                  mb: 3,
                }}
              >
                <Box>
                  <AccessTimeFilledIcon sx={{ fontSize: 28, mb: 1 }} />
                  <Typography
                    sx={{
                      fontSize: "36px",
                      fontWeight: "bold",
                      letterSpacing: 2,
                    }}
                  >
                    {elapsedTime}
                  </Typography>
                </Box>
              </Box>

              {/* STATUS */}
              <Chip
                label={status}
                sx={{
                  mb: 3,
                  px: 1,
                  height: "38px",
                  fontWeight: "bold",
                  background:
                    status === "Punched In"
                      ? "linear-gradient(135deg,#22c55e,#16a34a)"
                      : status === "Punched Out"
                      ? "linear-gradient(135deg,#ef4444,#dc2626)"
                      : "#334155",
                  color: "#fff",
                  fontSize: "14px",
                }}
              />

              {/* LOCATION */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  mb: 3,
                  opacity: 0.8,
                }}
              >
                <LocationOnIcon sx={{ fontSize: 17 }} />
                <Typography sx={{ fontSize: "12px" }}>{location}</Typography>
              </Box>

              {/* BUTTONS */}
              <Stack spacing={1.5}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<LoginIcon />}
                  disabled={status === "Punched In"}
                  onClick={() => handlePunch("IN")}
                  sx={{
                    py: 1.3,
                    borderRadius: "14px",
                    fontSize: "15px",
                    fontWeight: "bold",
                    textTransform: "none",
                    background: "linear-gradient(135deg,#06b6d4,#2563eb)",
                    boxShadow: "0 8px 18px rgba(37,99,235,0.35)",
                    "&:hover": { transform: "translateY(-2px)" },
                    "&.Mui-disabled": {
                      background: "#334155",
                      color: "#94a3b8",
                    },
                  }}
                >
                  Punch In
                </Button>

                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<LogoutIcon />}
                  disabled={status !== "Punched In"}
                  onClick={() => handlePunch("OUT")}
                  sx={{
                    py: 1.3,
                    borderRadius: "14px",
                    fontSize: "15px",
                    fontWeight: "bold",
                    textTransform: "none",
                    background: "linear-gradient(135deg,#ef4444,#f43f5e)",
                    boxShadow: "0 8px 18px rgba(244,63,94,0.35)",
                    "&:hover": { transform: "translateY(-2px)" },
                    "&.Mui-disabled": {
                      background: "#334155",
                      color: "#94a3b8",
                    },
                  }}
                >
                  Punch Out
                </Button>
              </Stack>
            </Paper>
          </Grid>

          {/* QUOTE CARD */}
          <Grid item xs={12} md={5}>
            <Paper
              elevation={0}
              sx={{
                height: "100%",
                borderRadius: "28px",
                p: 4,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                background: "linear-gradient(145deg, rgba(37,99,235,0.18), rgba(124,58,237,0.18))",
                backdropFilter: "blur(18px)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
                color: "#fff",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  mb: 3,
                  color: "#93c5fd",
                  textTransform: "uppercase",
                  letterSpacing: 2,
                }}
              >
                Motivation
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: "28px", md: "34px" },
                  fontWeight: 800,
                  lineHeight: 1.5,
                  color: "#fff",
                  mb: 4,
                }}
              >
                “{quote}”
              </Typography>

              <Typography
                sx={{
                  fontSize: "13px",
                  color: "#cbd5e1",
                  opacity: 0.8,
                  mt: "auto",
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                }}
              >
                PMB AGRI AND LEASING CORPORATION
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Fade>
    </Box>
  );
}

export default Attendance;