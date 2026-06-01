import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  Container,
  Button,
  Paper,
  Dialog,
  DialogContent,
  IconButton,
  Slide
} from "@mui/material";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import SecurityIcon from "@mui/icons-material/Security";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// Smooth slide transition for the Modal
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Finance_Services() {
  const [selectedService, setSelectedService] = useState(null);
  const navigate = useNavigate();

  const handleOpenModal = (service) => {
    setSelectedService(service);
  };

  const handleCloseModal = () => {
    setSelectedService(null);
  };

  const handleInquiryRedirect = () => {
    navigate("/inquiry");
  };

  const services = [
    {
      title: "SECURED LOANS",
      desc: "Backed by collateral, offering higher loan amounts, longer repayment tenures, and lower interest rates.",
      extendedDesc: "Secured loans require an asset (commercial property, residential real estate, or liquid assets like FDs) to be pledged as collateral. Because the risk to the lender is minimal, these loans provide access to substantial capital at highly competitive interest rates. They are ideal for major expansions, real estate acquisition, or long-term investments. In the event of non-repayment, the lender retains the right to liquidate the pledged asset to recover dues.",
      icon: <SecurityIcon sx={{ fontSize: 35 }} />,
      color: "#2563eb",
      glow: "rgba(37,99,235,.4)"
    },
    {
      title: "UNSECURED LOANS",
      desc: "Collateral free credit lines based on business strength, cash flow, and financial history.",
      extendedDesc: "Unsecured business loans do not require you to pledge any physical or financial assets. Approvals are strictly based on your company's CIBIL score, financial history, and cash flow analysis. While they typically carry slightly higher interest rates and shorter tenures than secured loans, they offer rapid disbursement (often within 24-48 hours). This makes them the perfect instrument for urgent working capital needs or inventory purchases.",
      icon: <TrendingUpIcon sx={{ fontSize: 35 }} />,
      color: "#7c3aed",
      glow: "rgba(124,58,237,.4)"
    },
    {
      title: "MACHINERY LOANS",
      desc: "Equipment financing for business expansion where the machinery acts as the primary collateral.",
      extendedDesc: "Machinery and equipment finance is a 'self-securing' loan—the equipment you purchase serves as the primary collateral, meaning you usually do not need to pledge additional real estate. Lenders typically fund up to 80-100% of the machinery's value. This facility preserves your working capital while allowing you to scale production, upgrade technology, and claim tax benefits on machinery depreciation under the Income Tax Act.",
      icon: <PrecisionManufacturingIcon sx={{ fontSize: 35 }} />,
      color: "#06b6d4",
      glow: "rgba(6,182,212,.4)"
    }
  ];

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg,#020617,#081124,#0f172a)",
        minHeight: "100vh",
        overflow: "hidden",
        position: "relative",
        color: "#fff",
        fontFamily: "'Poppins', sans-serif"
      }}
    >
      {/* Background Glow Effects */}
      <Box sx={{ position: "absolute", width: 500, height: 500, background: "#2563eb", filter: "blur(200px)", opacity: 0.15, left: -150, top: "10%", borderRadius: "50%", pointerEvents: 'none' }} />
      <Box sx={{ position: "absolute", width: 500, height: 500, background: "#06b6d4", filter: "blur(200px)", opacity: 0.12, right: -150, bottom: "30%", borderRadius: "50%", pointerEvents: 'none' }} />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, py: 10, overflow: "hidden" }}>
        
        {/* HEADER */}
        <Box textAlign="center" mb={10}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Typography variant="h2" fontWeight={900} sx={{ fontSize: { xs: "3rem", md: "4rem" }, letterSpacing: "-1px", color: "#fff" }}>
              Premium <span style={{ color: "#06b6d4" }}>Financial</span> Solutions
            </Typography>
            <Typography sx={{ mt: 2, color: "#94a3b8", maxWidth: "700px", mx: "auto", fontSize: "1.1rem" }}>
              Empowering your enterprise with tailored credit lines, seamless processing, and competitive interest rates to accelerate your business growth.
            </Typography>
          </motion.div>
        </Box>

        {/* CARDS GRID */}
        <Grid container spacing={{ xs: 4, md: 6 }} justifyContent="center" alignItems="stretch">
          {services.map((item, index) => (
            <Grid item xs={12} sm={6} lg={4} key={index} sx={{ display: "flex" }}>
              <motion.div
                style={{ width: "100%", display: "flex", height: "100%" }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    width: "100%",
                    minHeight: "430px",
                    display: "flex",
                    flexDirection: "column",
                    p: 4,
                    borderRadius: "24px",
                    background: "linear-gradient(145deg,rgba(15,23,42,.85),rgba(2,6,23,.95))",
                    border: "1px solid rgba(255,255,255,.05)",
                    backdropFilter: "blur(20px)",
                    transition: ".4s",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: `0 20px 50px ${item.glow}`,
                      borderColor: item.color
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: "18px",
                      background: `linear-gradient(135deg,${item.color},#0f172a)`,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mx: "auto",
                      mb: 3,
                      boxShadow: `0px 10px 25px ${item.glow}`,
                      border: `1px solid rgba(255,255,255,0.1)`
                    }}
                  >
                    {item.icon}
                  </Box>
                  
                  <Typography variant="h5" fontWeight={800} textAlign="center" mb={2} sx={{ color: "#fff" }}>
                    {item.title}
                  </Typography>
                  
                  <Typography sx={{ color: "#94a3b8", flexGrow: 1, textAlign: "center", mb: 4, lineHeight: 1.7 }}>
                    {item.desc}
                  </Typography>
                  
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleOpenModal(item)}
                    sx={{
                      mt: "auto",
                      color: item.color,
                      borderColor: item.color,
                      fontWeight: "bold",
                      borderRadius: "10px",
                      py: 1.2,
                      transition: "0.3s ease",
                      "&:hover": {
                        background: item.color,
                        color: "#fff",
                        boxShadow: `0px 5px 20px ${item.glow}`
                      }
                    }}
                  >
                    Learn More
                  </Button>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* PREMIUM DIALOG / MODAL */}
        <Dialog
          open={Boolean(selectedService)}
          onClose={handleCloseModal}
          TransitionComponent={Transition}
          PaperProps={{
            sx: {
              background: "rgba(15, 23, 42, 0.95)",
              backdropFilter: "blur(25px)",
              borderRadius: "24px",
              border: `1px solid ${selectedService ? selectedService.color : 'rgba(255,255,255,0.1)'}`,
              boxShadow: selectedService ? `0px 15px 50px ${selectedService.glow}` : 'none',
              color: "#fff",
              maxWidth: "550px",
              width: "100%"
            }
          }}
        >
          {selectedService && (
            <DialogContent sx={{ p: { xs: 4, md: 5 }, position: "relative" }}>
              <IconButton
                onClick={handleCloseModal}
                sx={{
                  position: "absolute",
                  right: 16,
                  top: 16,
                  color: "#94a3b8",
                  "&:hover": { color: "#fff", background: "rgba(255,255,255,0.1)" }
                }}
              >
                <CloseIcon />
              </IconButton>
              
              <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                <Box
                  sx={{
                    width: 65,
                    height: 65,
                    borderRadius: "16px",
                    background: `linear-gradient(135deg, ${selectedService.color}, #0f172a)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    boxShadow: `0px 10px 30px ${selectedService.glow}`,
                    mb: 2
                  }}
                >
                  {React.cloneElement(selectedService.icon, { sx: { fontSize: 32 } })}
                </Box>
                
                <Typography variant="h5" fontWeight={900} mb={2} sx={{ color: "#fff" }}>
                  {selectedService.title}
                </Typography>
                
                <Box sx={{ height: '3px', width: '50px', background: selectedService.color, borderRadius: '2px', mb: 3 }} />

                <Typography sx={{ color: "#cbd5e1", fontSize: "0.95rem", lineHeight: 1.8, textAlign: "justify" }}>
                  {selectedService.extendedDesc}
                </Typography>
              </Box>
            </DialogContent>
          )}
        </Dialog>

        {/* INQUIRY SECTION (FORM REMOVED) */}
        <Box mt={12}>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }} viewport={{ once: true }}>
            <Grid container spacing={5} justifyContent="center">
              <Grid item xs={12} md={8}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 5, md: 6 },
                    background: "linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(30, 41, 59, 0.4) 100%)",
                    borderRadius: "32px",
                    border: '1px solid rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(15px)',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Background decorative glow inside the card */}
                  <Box sx={{ position: 'absolute', width: 250, height: 250, background: '#2563eb', filter: 'blur(120px)', opacity: 0.15, top: -60, right: -60 }} />
                  <Box sx={{ position: 'absolute', width: 250, height: 250, background: '#06b6d4', filter: 'blur(120px)', opacity: 0.1, bottom: -60, left: -60 }} />

                  <Typography variant="h3" fontWeight={900} color="#fff" mb={2} sx={{ fontSize: { xs: '2rem', md: '2.8rem' } }}>
                    Ready to Accelerate Your Growth?
                  </Typography>
                  
                  <Typography color="#94a3b8" mb={5} sx={{ maxWidth: '600px', mx: 'auto', lineHeight: 1.8, fontSize: '1.05rem' }}>
                    Our dedicated financial experts are here to build the ideal customized credit facility or loan solution tailored specifically for your business goals.
                  </Typography>
                  
                  {/* REQUESTED INQUIRY BUTTON */}
                  <Button
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    onClick={handleInquiryRedirect}
                    sx={{
                      py: 2,
                      px: 6,
                      borderRadius: "14px",
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      textTransform: 'none',
                      background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
                      boxShadow: '0px 8px 25px rgba(37, 99, 235, 0.4)',
                      transition: '0.3s ease',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #1d4ed8, #6d28d9)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0px 12px 30px rgba(37, 99, 235, 0.6)'
                      }
                    }}
                  >
                    Click Here for Inquiry
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </motion.div>
        </Box>

      </Container>
    </Box>
  );
}

export default Finance_Services;