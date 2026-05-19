import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Chip,
  Avatar,
  Fade,
} from "@mui/material";

import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

import axios from "axios";

function Attendance() {

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

  // =========================================
  // DATE + LOCATION
  // =========================================

  useEffect(() => {

    const d = new Date();

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

    const now = new Date();

    // FIXED FORMAT

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

    // FRONTEND STATUS

    if (type === "IN") {

      const startTime = now.toISOString();

      setPunchInTime(startTime);

      setStatus("Punched In");

      localStorage.setItem(
        "attendanceStatus",
        "Punched In"
      );

      localStorage.setItem(
        "punchInTime",
        startTime
      );

      localStorage.removeItem("punchOutTime");

    } else {

      setPunchOutTime(timeStr);

      setStatus("Punched Out");

      localStorage.setItem(
        "attendanceStatus",
        "Punched Out"
      );

      localStorage.setItem(
        "punchOutTime",
        timeStr
      );
    }

    // API CALL

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

      alert(`Successfully Punched ${type}`);

    } catch (error) {

      console.error(error.response?.data || error.message);

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
          "linear-gradient(135deg,#020617,#0f172a,#1e293b,#111827)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        p: 2,
        position: "relative",
      }}
    >

      {/* GLOW EFFECTS */}

      <Box
        sx={{
          position: "absolute",
          width: "300px",
          height: "300px",
          background: "#38bdf8",
          borderRadius: "50%",
          filter: "blur(120px)",
          top: "-100px",
          left: "-100px",
          opacity: 0.4,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: "300px",
          height: "300px",
          background: "#8b5cf6",
          borderRadius: "50%",
          filter: "blur(120px)",
          bottom: "-100px",
          right: "-100px",
          opacity: 0.4,
        }}
      />

      <Fade in timeout={1000}>

        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: "500px",
            borderRadius: "35px",
            p: {
              xs: 3,
              sm: 5,
            },
            background:
              "rgba(255,255,255,0.08)",
            backdropFilter: "blur(25px)",
            border:
              "1px solid rgba(255,255,255,0.15)",
            boxShadow:
              "0 10px 60px rgba(0,0,0,0.5)",
            textAlign: "center",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
          }}
        >

          {/* TOP BADGE */}

          <Chip
            icon={<WorkspacePremiumIcon />}
            label="Smart Attendance System"
            sx={{
              mb: 3,
              background:
                "linear-gradient(135deg,#06b6d4,#3b82f6)",
              color: "#fff",
              fontWeight: "bold",
              px: 1,
            }}
          />

          {/* AVATAR */}

          <Avatar
            sx={{
              width: 90,
              height: 90,
              margin: "auto",
              mb: 2,
              background:
                "linear-gradient(135deg,#38bdf8,#8b5cf6)",
              fontSize: "34px",
              fontWeight: "bold",
              boxShadow:
                "0 0 30px rgba(56,189,248,0.8)",
            }}
          >
            A
          </Avatar>

          {/* TITLE */}

          <Typography
            sx={{
              fontSize: {
                xs: "30px",
                sm: "38px",
              },
              fontWeight: 900,
              letterSpacing: 1,
              mb: 1,
            }}
          >
            Attendance
          </Typography>

          <Typography
            sx={{
              opacity: 0.8,
              mb: 4,
              fontSize: {
                xs: "13px",
                sm: "15px",
              },
            }}
          >
            {today}
          </Typography>

          {/* TIMER */}

          <Box
            sx={{
              width: {
                xs: "220px",
                sm: "260px",
              },
              height: {
                xs: "220px",
                sm: "260px",
              },
              borderRadius: "50%",
              margin: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg,#06b6d4,#3b82f6,#8b5cf6)",
              boxShadow:
                "0 0 45px rgba(59,130,246,0.8)",
              mb: 4,
              border:
                "8px solid rgba(255,255,255,0.15)",
              animation: "pulse 2s infinite",
            }}
          >

            <Box>

              <AccessTimeFilledIcon
                sx={{
                  fontSize: 45,
                  mb: 1,
                }}
              />

              <Typography
                sx={{
                  fontSize: {
                    xs: "32px",
                    sm: "42px",
                  },
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
              mb: 4,
              px: 2,
              py: 2.8,
              fontSize: "16px",
              fontWeight: "bold",
              background:
                status === "Punched In"
                  ? "linear-gradient(135deg,#22c55e,#16a34a)"
                  : status === "Punched Out"
                  ? "linear-gradient(135deg,#ef4444,#dc2626)"
                  : "#475569",
              color: "#fff",
              boxShadow:
                "0 5px 20px rgba(0,0,0,0.3)",
            }}
          />

          {/* LOCATION */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
              mb: 4,
              opacity: 0.9,
              px: 1,
            }}
          >

            <LocationOnIcon />

            <Typography
              sx={{
                fontSize: {
                  xs: "12px",
                  sm: "14px",
                },
              }}
            >
              {location}
            </Typography>

          </Box>

          {/* BUTTONS */}

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
          >

            <Button
              fullWidth
              variant="contained"
              startIcon={<LoginIcon />}
              disabled={status === "Punched In"}
              onClick={() => handlePunch("IN")}
              sx={{
                py: 1.8,
                borderRadius: "18px",
                fontSize: "16px",
                fontWeight: "bold",
                background:
                  "linear-gradient(135deg,#06b6d4,#3b82f6)",
                boxShadow:
                  "0 5px 25px rgba(59,130,246,0.5)",
                transition: "0.3s",

                "&:hover": {
                  transform: "translateY(-4px) scale(1.02)",
                },

                "&.Mui-disabled": {
                  background: "#475569",
                  color: "#cbd5e1",
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
                py: 1.8,
                borderRadius: "18px",
                fontSize: "16px",
                fontWeight: "bold",
                background:
                  "linear-gradient(135deg,#ef4444,#f43f5e)",
                boxShadow:
                  "0 5px 25px rgba(244,63,94,0.5)",
                transition: "0.3s",

                "&:hover": {
                  transform: "translateY(-4px) scale(1.02)",
                },

                "&.Mui-disabled": {
                  background: "#475569",
                  color: "#cbd5e1",
                },
              }}
            >
              Punch Out
            </Button>

          </Stack>

          {/* INFO */}

          <Box
            sx={{
              mt: 4,
              pt: 3,
              borderTop:
                "1px solid rgba(255,255,255,0.1)",
            }}
          >

            {punchInTime && (

              <Typography
                sx={{
                  mb: 1,
                  fontSize: "14px",
                  opacity: 0.9,
                }}
              >
                🟢 Punch In :
                {" "}
                {new Date(
                  punchInTime
                ).toLocaleTimeString()}
              </Typography>
            )}

            {punchOutTime && (

              <Typography
                sx={{
                  fontSize: "14px",
                  opacity: 0.9,
                }}
              >
                🔴 Punch Out :
                {" "}
                {punchOutTime}
              </Typography>
            )}

          </Box>

        </Paper>

      </Fade>

    </Box>
  );
}

export default Attendance;