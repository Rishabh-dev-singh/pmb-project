import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  Container,
  Button,
  Paper,
  TextField,
  MenuItem,
  Dialog,
  DialogContent,
  IconButton,
  Slide
} from "@mui/material";

import { motion } from "framer-motion";

import SecurityIcon from "@mui/icons-material/Security";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import CloseIcon from "@mui/icons-material/Close";

// Smooth slide transition for the Modal
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Finance_Services() {
  const [selectedService, setSelectedService] = useState(null);

  const handleOpenModal = (service) => {
    setSelectedService(service);
  };

  const handleCloseModal = () => {
    setSelectedService(null);
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
              background: "rgba(15, 23, 42, 0.95)", // Dark background
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

        {/* APPLICATION FORM & CONTACT */}
        <Box mt={15}>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }} viewport={{ once: true }}>
            <Typography variant="h2" textAlign="center" fontWeight={900} mb={8} sx={{ fontSize: { xs: '2.5rem', md: '4rem' }, color: "#fff" }}>
              Start Your <span style={{ color: '#2563eb' }}>Application</span>
            </Typography>

            <Grid container spacing={5} justifyContent="center">
              {/* Form Section */}
              <Grid item xs={12} md={7}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 4, md: 6 },
                    background: "rgba(15, 23, 42, 0.4)",
                    borderRadius: "24px",
                    border: '1px solid rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <Typography variant="h5" color="#fff" fontWeight="bold" mb={4}>Request Loan Consultation</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Full Name" variant="outlined" sx={inputStyle} /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Phone Number" variant="outlined" sx={inputStyle} /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Required Amount (₹)" variant="outlined" sx={inputStyle} /></Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField 
                        select 
                        fullWidth 
                        label="Loan Facility" 
                        variant="outlined" 
                        defaultValue="" 
                        sx={inputStyle}
                        SelectProps={{
                          MenuProps: {
                            PaperProps: {
                              sx: {
                                bgcolor: '#0f172a', 
                                color: '#fff',
                                '& .MuiMenuItem-root:hover': {
                                  bgcolor: 'rgba(255,255,255,0.1)'
                                }
                              }
                            }
                          }
                        }}
                      >
                        <MenuItem value="Secured">Secured Loan</MenuItem>
                        <MenuItem value="Unsecured">Unsecured Business Loan</MenuItem>
                        <MenuItem value="Machinery">Machinery Finance</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        fullWidth
                        sx={{
                          mt: 2, py: 2, borderRadius: "12px", fontWeight: 'bold', fontSize: '1.1rem',
                          background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
                          boxShadow: '0px 8px 20px rgba(37, 99, 235, 0.3)',
                          '&:hover': { background: 'linear-gradient(90deg, #1d4ed8, #6d28d9)' }
                        }}
                      >
                        Submit Application
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Contact Info Section */}
              <Grid item xs={12} md={5}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 4, md: 6 },
                    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                    borderRadius: "24px",
                    height: "100%",
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.05)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <Box sx={{ position: 'absolute', width: 200, height: 200, background: '#06b6d4', filter: 'blur(100px)', opacity: 0.1, top: -50, right: -50 }} />
                  
                  <Typography variant="h4" fontWeight={900} color="#fff" mb={2}>Talk to an Expert</Typography>
                  <Typography color="#94a3b8" mb={4} lineHeight={1.8}>
                    Our financial advisors are ready to help you structure the perfect credit line for your business requirements.
                  </Typography>
                  
                  <Grid container spacing={3}>
                    {/* Contact Number Block */}
                    <Grid item xs={12}>
                      <Typography color="#94a3b8" fontSize="0.85rem" textTransform="uppercase" letterSpacing={1}>
                        Contact Number
                      </Typography>
                      <Typography fontSize={{ xs: '1.2rem', md: "1.4rem" }} fontWeight={800} color="#fff" sx={{ mt: 0.5 }}>
                        +91 9784863800
                      </Typography>
                    </Grid>

                    {/* Emails Block */}
                    <Grid item xs={12}>
                      <Typography color="#94a3b8" fontSize="0.85rem" textTransform="uppercase" letterSpacing={1} mb={1}>
                        Support Emails
                      </Typography>
                      
                      <Typography fontSize={{ xs: '1.1rem', md: "1.3rem" }} fontWeight={700} color="#06b6d4" sx={{ wordBreak: 'break-word', mb: 0.5 }}>
                        info@pmb.finance
                      </Typography>
                      <Typography fontSize={{ xs: '1.1rem', md: "1.3rem" }} fontWeight={700} color="#06b6d4" sx={{ wordBreak: 'break-word', mb: 0.5 }}>
                        support@pmb.finance
                      </Typography>
                      <Typography fontSize={{ xs: '1.1rem', md: "1.3rem" }} fontWeight={700} color="#06b6d4" sx={{ wordBreak: 'break-word' }}>
                        atarsingh@pmb.finance
                      </Typography>
                    </Grid>
                  </Grid>

                </Paper>
              </Grid>
            </Grid>
          </motion.div>
        </Box>

      </Container>
    </Box>
  );
}

// Global Text Field Styles
const inputStyle = {
  '& label': { color: '#94a3b8' },
  '& label.Mui-focused': { color: '#06b6d4' },
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
    '&.Mui-focused fieldset': { borderColor: '#06b6d4' },
    borderRadius: '12px',
    backgroundColor: 'rgba(0,0,0,0.2)' 
  },
  '& .MuiSelect-icon': { color: '#94a3b8' }
};

export default Finance_Services;