import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  Container,
  Button,
} from "@mui/material";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import CampaignIcon from "@mui/icons-material/Campaign";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

function Consultancy() {

  const navigate = useNavigate();

  const services = [
    {
      title: "NBFC LANDING",
      icon: <BusinessCenterIcon sx={{ fontSize: 45 }} />,
      color: "#06b6d4",
      path: "/business-consultancy",
    },

    {
      title: "PROJECT FINANCING",
      icon: <CampaignIcon sx={{ fontSize: 45 }} />,
      color: "#7c3aed",
      path: "/marketing-strategy",
    },

    {
      title: "COMPANY RATING",
      icon: <TrendingUpIcon sx={{ fontSize: 45 }} />,
      color: "#2563eb",
      path: "/startup-growth",
    },

    {
      title: "BULK FUNDING",
      icon: <SupportAgentIcon sx={{ fontSize: 45 }} />,
      color: "#0ea5e9",
      path: "/support-services",
    },
    {
      title: "IT CONSULTANCY",
      icon: <SupportAgentIcon sx={{ fontSize: 45 }} />,
      color: "#0ea5e9",
      path: "/support-services",
    },
    {
      title: "STARTUP GUIDANCE",
      icon: <SupportAgentIcon sx={{ fontSize: 45 }} />,
      color: "#0ea5e9",
      path: "/support-services",
    },
   
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#020617,#081028,#0f172a)",
        py: 10,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* BACKGROUND GLOW */}
      <Box
        sx={{
          position: "absolute",
          width: 400,
          height: 400,
          background: "#06b6d4",
          borderRadius: "50%",
          filter: "blur(180px)",
          opacity: 0.12,
          top: -100,
          left: -100,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: 350,
          height: 350,
          background: "#7c3aed",
          borderRadius: "50%",
          filter: "blur(180px)",
          opacity: 0.12,
          bottom: -100,
          right: -100,
        }}
      />

      <Container maxWidth="xl">
        {/* HEADING */}
        <Box textAlign="center" mb={10}>
          <Typography
            sx={{
              color: "#06b6d4",
              fontWeight: 700,
              letterSpacing: 4,
              mb: 2,
            }}
          >
            CONSULTANCY SERVICES
          </Typography>

          <Typography
            variant="h2"
            sx={{
              color: "#fff",
              fontWeight: 900,
              mb: 3,
              fontSize: { xs: "2.7rem", md: "5rem" },
            }}
          >
            Business
            <span
              style={{
                background:
                  "linear-gradient(90deg,#06b6d4,#7c3aed)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {" "}
              Consultancy
            </span>
          </Typography>

          <Typography
            sx={{
              color: "#94a3b8",
              maxWidth: "850px",
              mx: "auto",
              lineHeight: 1.9,
              fontSize: "1.1rem",
            }}
          >
            Premium consultancy solutions designed to help
            businesses scale faster with strategic planning,
            growth marketing and professional guidance.
          </Typography>
        </Box>

        {/* SERVICES GRID */}
        <Grid container spacing={5}>
          {services.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    background:
                      "linear-gradient(145deg,rgba(17,25,40,0.95),rgba(10,15,35,0.95))",
                    borderRadius: "32px",
                    p: 5,
                    textAlign: "center",
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                    position: "relative",
                    overflow: "hidden",
                    transition: "0.4s",
                    height: "100%",

                    "&:hover": {
                      transform: "translateY(-12px)",
                      boxShadow:
                        "0 0 45px rgba(124,58,237,0.35)",
                    },
                  }}
                >
                  {/* ICON */}
                  <Box
                    sx={{
                      width: 95,
                      height: 95,
                      borderRadius: "28px",
                      background: item.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      mx: "auto",
                      mb: 4,
                      boxShadow:
                        "0 15px 35px rgba(0,0,0,0.25)",
                    }}
                  >
                    {item.icon}
                  </Box>

                  {/* TITLE */}
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#fff",
                      fontWeight: 800,
                      mb: 3,
                    }}
                  >
                    {item.title}
                  </Typography>

                  {/* BUTTON */}
                  <Button
                    onClick={() =>
                      navigate(item.path)
                    }
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      mt: 2,
                      background:
                        "linear-gradient(90deg,#06b6d4,#7c3aed)",
                      color: "#fff",
                      px: 4,
                      py: 1.5,
                      borderRadius: "14px",
                      textTransform: "none",
                      fontWeight: 700,

                      "&:hover": {
                        background:
                          "linear-gradient(90deg,#0891b2,#6d28d9)",
                      },
                    }}
                  >
                    Explore
                  </Button>

                  {/* GLOW */}
                  <Box
                    sx={{
                      position: "absolute",
                      width: 180,
                      height: 180,
                      background: item.color,
                      borderRadius: "50%",
                      filter: "blur(120px)",
                      opacity: 0.15,
                      top: -60,
                      right: -60,
                    }}
                  />
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default Consultancy;