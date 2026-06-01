// SERVICES.JSX

import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  Container,
  Button,
} from "@mui/material";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Services() {
  const navigate = useNavigate();

  const services = [
    

    {
      title: "Finance Services",
      desc: "Business loans, OD limits, funding and financial growth solutions.",
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 55 }} />,
      color: "#7c3aed",
      path: "/finance-services",
    },
    {
      title: "Software & IT Solutions",
      desc: "Modern software, websites, apps and AI powered digital solutions.",
      icon: <LaptopMacIcon sx={{ fontSize: 55 }} />,
      color: "#2563eb",
      path: "/software-services",
    },

    {
      title: "Consultancy Services",
      desc: "Professional business consultancy and startup growth strategy.",
      icon: <BusinessCenterIcon sx={{ fontSize: 55 }} />,
      color: "#06b6d4",
      path: "/consultancy-services",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#020617,#050816,#0f172a)",
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
          background: "#7c3aed",
          borderRadius: "50%",
          filter: "blur(180px)",
          opacity: 0.15,
          top: -100,
          left: -100,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: 350,
          height: 350,
          background: "#2563eb",
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
              color: "#7c3aed",
              fontWeight: 700,
              letterSpacing: 4,
              mb: 2,
            }}
          >
            OUR SERVICES
          </Typography>

          <Typography
            variant="h2"
            sx={{
              color: "#fff",
              fontWeight: 900,
              mb: 3,
              fontSize: { xs: "2.8rem", md: "5rem" },
              lineHeight: 1.1,
            }}
          >
            Powerful
            <span
              style={{
                background:
                  "linear-gradient(90deg,#00c6ff,#7c3aed)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {" "}
              Business Solutions
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
            Explore our premium software, finance and consultancy
            services with modern UI/UX and futuristic business
            solutions.
          </Typography>
        </Box>

        {/* SERVICE CARDS */}
        <Grid container spacing={5}>
          {services.map((service, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.2,
                }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    background:
                      "linear-gradient(145deg,rgba(17,25,40,0.95),rgba(10,15,35,0.95))",
                    borderRadius: "35px",
                    p: 5,
                    position: "relative",
                    overflow: "hidden",
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                    transition: "0.4s",
                    height: "100%",

                    "&:hover": {
                      transform: "translateY(-15px)",
                      boxShadow:
                        "0 0 45px rgba(124,58,237,0.35)",
                    },
                  }}
                >
                  {/* ICON */}
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: "30px",
                      background: service.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      mb: 4,
                      boxShadow:
                        "0 15px 35px rgba(0,0,0,0.25)",
                    }}
                  >
                    {service.icon}
                  </Box>

                  {/* TITLE */}
                  <Typography
                    variant="h4"
                    sx={{
                      color: "#fff",
                      fontWeight: 800,
                      mb: 3,
                      lineHeight: 1.3,
                    }}
                  >
                    {service.title}
                  </Typography>

                  {/* DESCRIPTION */}
                  <Typography
                    sx={{
                      color: "#94a3b8",
                      lineHeight: 1.9,
                      mb: 5,
                      fontSize: "1rem",
                    }}
                  >
                    {service.desc}
                  </Typography>

                  {/* BUTTON */}
                  <Button
                    onClick={() =>
                      navigate(service.path)
                    }
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      background:
                        "linear-gradient(90deg,#2563eb,#7c3aed)",
                      color: "#fff",
                      px: 4,
                      py: 1.5,
                      borderRadius: "14px",
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: "1rem",

                      "&:hover": {
                        background:
                          "linear-gradient(90deg,#1d4ed8,#6d28d9)",
                      },
                    }}
                  >
                    Click To Explore
                  </Button>

                  {/* GLOW EFFECT */}
                  <Box
                    sx={{
                      position: "absolute",
                      width: 180,
                      height: 180,
                      background: service.color,
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

export default Services;