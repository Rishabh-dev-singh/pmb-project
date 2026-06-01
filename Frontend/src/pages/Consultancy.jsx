import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  Container,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";

import { motion } from "framer-motion";

// Icons
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import CampaignIcon from "@mui/icons-material/Campaign";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ComputerIcon from "@mui/icons-material/Computer";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

// Dialog Transition
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Consultancy() {
  const [open, setOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const handleOpen = (service) => {
    setSelectedService(service);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedService(null);
  };

  const services = [
    {
      title: "NBFC LENDING",
      icon: <BusinessCenterIcon sx={{ fontSize: 40 }} />,
      color: "#06b6d4",
      description:
        "NBFC (Non-Banking Financial Company) Lending provides businesses and individuals with customized loan products, acting as a faster and more flexible alternative to traditional banks.",
      features: [
        "Faster Loan Processing & Approvals",
        "Flexible Credit Policies & Eligibility Criteria",
        "Term Loans, Working Capital & Machinery Loans",
        "Minimal Documentation Process"
      ]
    },
    {
      title: "PROJECT FINANCING",
      icon: <CampaignIcon sx={{ fontSize: 40 }} />,
      color: "#7c3aed",
      description:
        "Project Financing is the long-term financing of infrastructure and industrial projects based entirely on the projected cash flows of the project rather than the balance sheets of its sponsors.",
      features: [
        "Non-recourse or Limited Recourse Financing",
        "Risk Identification & Allocation",
        "Customized Repayment Schedules based on Cash Flow",
        "Capital Structuring for Mega Projects"
      ]
    },
    {
      title: "COMPANY RATING",
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      color: "#2563eb",
      description:
        "Company Rating involves evaluating the financial health and creditworthiness of a business. A good credit rating helps in building trust among investors, suppliers, and financial institutions.",
      features: [
        "Assessment of Financial Stability",
        "Helps in Securing Loans at Lower Interest Rates",
        "Enhances Market Reputation & Investor Trust",
        "Detailed Credit Risk Analysis"
      ]
    },
    {
      title: "BULK FUNDING",
      icon: <AccountBalanceIcon sx={{ fontSize: 40 }} />,
      color: "#0ea5e9",
      description:
        "Bulk Funding is designed for large-scale corporate needs, expansions, or acquisitions. It involves raising massive amounts of capital through syndication, institutional investors, or private equity.",
      features: [
        "High-Value Capital Generation",
        "Syndicated Loans from Multiple Lenders",
        "Funding for Business Acquisitions & Mergers",
        "Strategic Debt & Equity Structuring"
      ]
    },
    {
      title: "IT CONSULTANCY",
      icon: <ComputerIcon sx={{ fontSize: 40 }} />,
      color: "#10b981",
      description:
        "IT Consultancy helps businesses leverage modern technologies like AI/ML, Cloud Computing, and Custom Software Development to optimize their operations and drive digital transformation.",
      features: [
        "Digital Transformation & Automation",
        "Custom CRM, ERP & Web Application Development",
        "AI/ML Integration & Data Analytics",
        "Scalable Cloud Architecture & Security"
      ]
    },
    {
      title: "STARTUP GUIDANCE",
      icon: <RocketLaunchIcon sx={{ fontSize: 40 }} />,
      color: "#f59e0b",
      description:
        "Strategic mentoring and actionable advice for early-stage companies to validate their ideas, create solid business models, and prepare for seed or series funding rounds.",
      features: [
        "Business Model Validation & Strategy",
        "Pitch Deck Creation & Financial Projections",
        "Go-To-Market (GTM) Strategy Formulation",
        "Guidance on Legal & Compliance Structures"
      ]
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#020617,#081028,#0f172a)",
        py: { xs: 6, md: 8 },
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
        <Box textAlign="center" mb={6}>
          <Typography
            sx={{
              color: "#06b6d4",
              fontWeight: 700,
              letterSpacing: 3,
              mb: 1,
            }}
          >
            CONSULTANCY SERVICES
          </Typography>

          <Typography
            variant="h2"
            sx={{
              color: "#fff",
              fontWeight: 900,
              mb: 1.5,
              fontSize: { xs: "2.2rem", md: "3.5rem" },
            }}
          >
            Business
            <span
              style={{
                background: "linear-gradient(90deg,#06b6d4,#7c3aed)",
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
              maxWidth: "750px",
              mx: "auto",
              lineHeight: 1.7,
              fontSize: "1rem",
            }}
          >
            Premium consultancy solutions designed to help businesses scale faster
            with strategic planning, financial management, and professional guidance.
          </Typography>
        </Box>

        {/* SERVICES GRID */}
        <Grid container spacing={4}>
          {services.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: "flex" }}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
                style={{ display: "flex", flex: 1, width: "100%" }}
              >
                <Card
                  sx={{
                    background:
                      "linear-gradient(145deg,rgba(17,25,40,0.95),rgba(10,15,35,0.95))",
                    borderRadius: "24px",
                    p: { xs: 3, md: 4 },
                    textAlign: "center",
                    border: "1px solid rgba(255,255,255,0.08)",
                    position: "relative",
                    overflow: "hidden",
                    transition: "0.4s",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: `0 0 35px ${item.color}40`,
                      borderColor: `${item.color}50`,
                    },
                  }}
                >
                  <Box sx={{ width: "100%" }}>
                    {/* ICON */}
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: "20px",
                        background: item.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        mx: "auto",
                        mb: 3,
                        boxShadow: "0 12px 25px rgba(0,0,0,0.25)",
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
                        mb: 2,
                        fontSize: { xs: "1.2rem", md: "1.4rem" },
                      }}
                    >
                      {item.title}
                    </Typography>
                  </Box>

                  {/* BUTTON */}
                  <Button
                    onClick={() => handleOpen(item)}
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      mt: 2,
                      background: "rgba(255,255,255,0.05)",
                      color: "#fff",
                      px: 3,
                      py: 1.2,
                      borderRadius: "12px",
                      textTransform: "none",
                      fontWeight: 700,
                      border: "1px solid rgba(255,255,255,0.1)",
                      width: "100%",
                      "&:hover": {
                        background: item.color,
                        borderColor: item.color,
                      },
                    }}
                  >
                    View Details
                  </Button>

                  {/* GLOW */}
                  <Box
                    sx={{
                      position: "absolute",
                      width: 150,
                      height: 150,
                      background: item.color,
                      borderRadius: "50%",
                      filter: "blur(100px)",
                      opacity: 0.12,
                      top: -50,
                      right: -50,
                    }}
                  />
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* MODAL / DIALOG BOX FOR DETAILS */}
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: "linear-gradient(145deg, #0f172a, #020617)",
            border: `1px solid ${selectedService?.color}50`,
            borderRadius: "24px",
            color: "#fff",
            boxShadow: `0 0 60px ${selectedService?.color}30`,
          },
        }}
      >
        {selectedService && (
          <>
            <DialogTitle sx={{ m: 0, p: 3, display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: "12px",
                  background: selectedService.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                {React.cloneElement(selectedService.icon, { sx: { fontSize: 28 } })}
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {selectedService.title}
              </Typography>
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  position: "absolute",
                  right: 16,
                  top: 16,
                  color: "#94a3b8",
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            
            <DialogContent sx={{ p: 3, pt: 0 }}>
              <Typography sx={{ color: "#cbd5e1", lineHeight: 1.8, mb: 3, fontSize: "1.05rem" }}>
                {selectedService.description}
              </Typography>
              
              <Typography sx={{ color: selectedService.color, fontWeight: 700, mb: 1 }}>
                Key Offerings & Benefits:
              </Typography>
              
              <List sx={{ pt: 0 }}>
                {selectedService.features.map((feature, idx) => (
                  <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36, color: selectedService.color }}>
                      <CheckCircleOutlineIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={feature} 
                      primaryTypographyProps={{ sx: { color: "#f8fafc", fontSize: "0.95rem" } }} 
                    />
                  </ListItem>
                ))}
              </List>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default Consultancy;