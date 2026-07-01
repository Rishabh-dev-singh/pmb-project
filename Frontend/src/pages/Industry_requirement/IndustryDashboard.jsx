import React from "react";
import { Box, Typography, Grid, Paper, Button, Card, CardContent } from "@mui/material";
import { AddCircleOutline, History, TrackChanges } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function IndustryDashboard() {
  const navigate = useNavigate();

  const menuItems = [
    { title: "Submit New Requirement", icon: <AddCircleOutline fontSize="large" />, path: "/submit-requirement", color: "#6366f1" },
    { title: "Requirement History", icon: <History fontSize="large" />, path: "/requirement-history", color: "#22c55e" },
    { title: "Track Request Status", icon: <TrackChanges fontSize="large" />, path: "/track-requests", color: "#f59e0b" },
  ];

  return (
    <Box sx={{ p: 4, minHeight: "80vh", backgroundColor: "#f8fafc" }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, color: "#0f3c6e" }}>
        Industry Dashboard
      </Typography>

      <Grid container spacing={3}>
        {menuItems.map((item, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card 
              onClick={() => navigate(item.path)}
              sx={{ 
                cursor: "pointer",
                borderRadius: "20px",
                transition: "0.3s",
                "&:hover": { transform: "translateY(-8px)", boxShadow: 6 }
              }}
            >
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                <Box sx={{ color: item.color, mb: 2 }}>{item.icon}</Box>
                <Typography variant="h6" fontWeight="600">{item.title}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
       
      {/* Summary Section Placeholder */}
      <Paper sx={{ mt: 5, p: 3, borderRadius: "20px" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Recent Activity</Typography>
        <Typography color="text.secondary">No recent requirements found. Start by submitting a new one!</Typography>
      </Paper>
    </Box>
  );
}

export default IndustryDashboard;