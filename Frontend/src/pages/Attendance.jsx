import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Chip,
  Fade,
} from "@mui/material";

import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";

import axios from "axios";

function Attendance() {

  // =========================================
  // QUOTES
  // =========================================

  const quotes = [

    "Success doesn’t come from what you do occasionally, it comes from what you do consistently.",

    "Small daily improvements are the key to long-term success.",

    "Discipline and dedication create extraordinary results.",

    "Every working day is another opportunity to grow stronger.",

    "Hard work today builds a successful tomorrow.",

    "Great employees are the foundation of a great company.",
  ];

  // =========================================
  // STATES
  // =========================================

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

  // =========================================
  // DATE + GREETING + LOCATION
  // =========================================

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

  // =========================================
  // LIVE TIMER
  // =========================================

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

  // =========================================
  // PUNCH FUNCTION
  // =========================================

  const handlePunch = async (type) => {

    // TEMPORARY FRONTEND SECURITY

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

    const empId = localStorage.getItem("employeeId");

    if (!empId) {

      alert("Login session expired!");

      return;
    }

    // =========================================
    // PUNCH IN
    // =========================================

    if (type === "IN") {

      const startTime = now.toISOString();

      setPunchInTime(startTime);

      setStatus("Punched In");

      setQuote(
        quotes[Math.floor(Math.random() * quotes.length)]
      );

      localStorage.setItem(
        "attendanceStatus",
        "Punched In"
      );

      localStorage.setItem(
        "punchInTime",
        startTime
      );

      localStorage.removeItem("punchOutTime");

      alert("Good Morning ☀️\nSuccessfully Punched In");

    } else {

      // =========================================
      // PUNCH OUT
      // =========================================

      setPunchOutTime(timeStr);

      setStatus("Punched Out");

      setQuote(
        quotes[Math.floor(Math.random() * quotes.length)]
      );

      localStorage.setItem(
        "attendanceStatus",
        "Punched Out"
      );

      localStorage.setItem(
        "punchOutTime",
        timeStr
      );

      alert("Good Job 🎉\nSuccessfully Punched Out");
    }

    // =========================================
    // API CALL
    // =========================================

    try {

      const response = await axios.post(
        "https://pmb.finance/api/attendance/",
        {
          employee_id: empId,
          type: type,
          time: timeStr,
          date: dateStr,
          location: location,
        }
      );

      console.log(response.data);

    } catch (error) {

      console.error(
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
        "Server Error"
      );
    }
  };

  // =========================================
  // UI
  // =========================================

  return (

    <Box
      sx={{
        minHeight: "100vh",

        background:
          "radial-gradient(circle at top left, #1d4ed8 0%, #020617 55%)",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        p: 2,

        overflow: "hidden",

        position: "relative",
      }}
    >

      {/* BACKGROUND GLOW */}

      <Box
        sx={{
          position: "absolute",
          width: "220px",
          height: "220px",
          background: "#2563eb",
          borderRadius: "50%",
          filter: "blur(110px)",
          top: "-60px",
          left: "-60px",
          opacity: 0.35,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: "220px",
          height: "220px",
          background: "#7c3aed",
          borderRadius: "50%",
          filter: "blur(110px)",
          bottom: "-60px",
          right: "-60px",
          opacity: 0.30,
        }}
      />

      <Fade in timeout={700}>

        <Paper
          elevation={0}
          sx={{
            width: "100%",

            maxWidth: "340px",

            borderRadius: "24px",

            p: 3,

            background:
              "rgba(15,23,42,0.82)",

            backdropFilter: "blur(18px)",

            border:
              "1px solid rgba(255,255,255,0.08)",

            boxShadow:
              "0 12px 40px rgba(0,0,0,0.45)",

            textAlign: "center",

            color: "#fff",

            overflow: "hidden",

            position: "relative",
          }}
        >

          {/* GREETING */}

          <Typography
            sx={{
              fontSize: "14px",
              opacity: 0.8,
              mb: 1,
            }}
          >
            {greeting}
          </Typography>

          {/* BADGE */}

          <Chip
            label="Smart Attendance"
            sx={{
              mb: 2,

              height: "32px",

              fontWeight: "bold",

              background:
                "linear-gradient(135deg,#0ea5e9,#2563eb)",

              color: "#fff",

              fontSize: "12px",
            }}
          />

          {/* TITLE */}

          <Typography
            sx={{
              fontSize: "34px",

              fontWeight: 900,

              lineHeight: 1,

              background:
                "linear-gradient(90deg,#ffffff,#cbd5e1)",

              WebkitBackgroundClip: "text",

              WebkitTextFillColor: "transparent",

              mb: 1,
            }}
          >
            Attendance
          </Typography>

          {/* DATE */}

          <Typography
            sx={{
              opacity: 0.7,

              fontSize: "13px",

              mb: 3,
            }}
          >
            {today}
          </Typography>

          {/* TIMER */}

          <Box
            sx={{
              width: "165px",

              height: "165px",

              borderRadius: "50%",

              margin: "auto",

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              background:
                "linear-gradient(135deg,#0ea5e9,#2563eb,#7c3aed)",

              boxShadow:
                `
                0 0 35px rgba(37,99,235,0.45),
                inset 0 0 18px rgba(255,255,255,0.15)
                `,

              border:
                "5px solid rgba(255,255,255,0.10)",

              mb: 3,
            }}
          >

            <Box>

              <AccessTimeFilledIcon
                sx={{
                  fontSize: 28,
                  mb: 1,
                }}
              />

              <Typography
                sx={{
                  fontSize: "32px",

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

              height: "36px",

              fontWeight: "bold",

              background:
                status === "Punched In"
                  ? "linear-gradient(135deg,#22c55e,#16a34a)"
                  : status === "Punched Out"
                  ? "linear-gradient(135deg,#ef4444,#dc2626)"
                  : "#334155",

              color: "#fff",

              fontSize: "13px",
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

            <LocationOnIcon
              sx={{
                fontSize: 16,
              }}
            />

            <Typography
              sx={{
                fontSize: "11px",
              }}
            >
              {location}
            </Typography>

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
                py: 1.2,

                borderRadius: "12px",

                fontSize: "14px",

                fontWeight: "bold",

                textTransform: "none",

                background:
                  "linear-gradient(135deg,#06b6d4,#2563eb)",

                boxShadow:
                  "0 8px 18px rgba(37,99,235,0.35)",

                transition: "0.3s",

                "&:hover": {
                  transform: "translateY(-2px)",
                },

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
                py: 1.2,

                borderRadius: "12px",

                fontSize: "14px",

                fontWeight: "bold",

                textTransform: "none",

                background:
                  "linear-gradient(135deg,#ef4444,#f43f5e)",

                boxShadow:
                  "0 8px 18px rgba(244,63,94,0.35)",

                transition: "0.3s",

                "&:hover": {
                  transform: "translateY(-2px)",
                },

                "&.Mui-disabled": {
                  background: "#334155",
                  color: "#94a3b8",
                },
              }}
            >
              Punch Out
            </Button>

          </Stack>

          {/* QUOTE */}

          <Box
            sx={{
              mt: 3,

              p: 2,

              borderRadius: "14px",

              background:
                "rgba(255,255,255,0.05)",

              border:
                "1px solid rgba(255,255,255,0.06)",
            }}
          >

            <Typography
              sx={{
                fontSize: "12px",

                lineHeight: 1.7,

                color: "#cbd5e1",

                fontStyle: "italic",
              }}
            >
              {quote}
            </Typography>

          </Box>

          {/* COMPANY */}

          <Typography
            sx={{
              mt: 2.5,

              fontSize: "10px",

              letterSpacing: 1.5,

              fontWeight: "bold",

              opacity: 0.7,

              color: "#93c5fd",

              textTransform: "uppercase",
            }}
          >
            PMB AGRI AND LEASING CORPORATION
          </Typography>

        </Paper>

      </Fade>

    </Box>
  );
}

export default Attendance;