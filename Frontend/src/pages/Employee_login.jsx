import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Container,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function EmployeeLogin() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    employeeId: "",
    password: "",
  });

  const BASE_URL = "https://pmb.finance";

  const handleChange = (e) => {
    setErrorMsg("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.employeeId || !formData.password) {
      setErrorMsg("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/api/login/`, {
        emp_id: formData.employeeId,
        password: formData.password,
      });

      // 🔥 DEBUG (MOST IMPORTANT)
      console.log("FULL API RESPONSE:", res.data);

      // 🔥 SAFE CONDITION (fix)
      if (res.data.status === "success" || res.data.emp_id) {

        localStorage.setItem("emp_id", res.data.emp_id);
        localStorage.setItem("name", res.data.name);
        localStorage.setItem("department", res.data.department);
        localStorage.setItem("designation", res.data.designation);

        alert(`Welcome ${res.data.name} ✅`);

        navigate("/employee-dashboard");

      } else {
        setErrorMsg(res.data.message || "Invalid credentials ❌");
      }

    } catch (error) {
      console.error("LOGIN ERROR:", error);
      setErrorMsg("Server Error / Network Issue ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      <Container
        maxWidth="lg"
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            width: "100%",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: 5,
            bgcolor: "#fff",
          }}
        >

          {/* LEFT */}
          <Box
            sx={{
              flex: 1,
              bgcolor: "#0d47a1",
              color: "#fff",
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              p: 5,
            }}
          >
            <Typography variant="h3" fontWeight="bold">
              PMB Portal
            </Typography>
            <Typography sx={{ mt: 2 }}>
              Secure Login 🔒
            </Typography>
          </Box>

          {/* RIGHT */}
          <Box sx={{ flex: 1, p: 4 }}>
            <Typography variant="h4" mb={3}>
              Employee Login
            </Typography>

            {/* ERROR */}
            {errorMsg && (
              <Typography color="error" sx={{ mb: 2 }}>
                {errorMsg}
              </Typography>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                label="Employee ID"
                name="employeeId"
                fullWidth
                required
                sx={{ mb: 2 }}
                value={formData.employeeId}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">🪪</InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                required
                sx={{ mb: 3 }}
                value={formData.password}
                onChange={handleChange}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} /> : "Login"}
              </Button>
            </form>
          </Box>

        </Box>
      </Container>
    </Box>
  );
}

export default EmployeeLogin;