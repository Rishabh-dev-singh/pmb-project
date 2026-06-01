import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Paper,
  TextField,
  MenuItem,
  Collapse
} from "@mui/material";
import { motion } from "framer-motion";

// Assets imports 
import Software from "../assets/Software.png";
import WebApp from "../assets/Web App.png";
import Website from "../assets/website.png";
import AIML from "../assets/AI_ML.png";
import Game from "../assets/Game.png";
import Automation from "../assets/Automation.png";

function Software_Services() {

  // 1. Dropdown State
  const [expandedIndex, setExpandedIndex] = useState(null);

  // 2. Form Data State (Django backend ke variables ke hisaab se)
  const [formData, setFormData] = useState({
    full_name: "",
    mobile: "",
    email: "",
    service_type: ""
  });

  const handleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // 3. Handle Form Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 4. API Submit Function (pmb.finance domain ke sath)
  const handleSubmit = async () => {
    // Basic validation
    if (!formData.full_name || !formData.mobile) {
      alert("Please fill out your name and phone number.");
      return;
    }

    try {
      const response = await fetch("https://pmb.finance/api/software-inquiry/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (result.status === "success") {
        alert("Application Submitted Successfully!");
        // Form clear kar do success hone par
        setFormData({ full_name: "", mobile: "", email: "", service_type: "" });
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Submission failed", error);
      alert("Something went wrong. Please check your connection and try again.");
    }
  };

  const services = [
    {
      title: "Software Development",
      desc: "Enterprise software solutions engineered for peak performance, robust scalability, and intuitive user experiences that drive business growth.",
      extendedDesc: "Our custom software development goes beyond just writing code. We analyze your core business logic to architect tailored ERPs, CRMs, and enterprise tools that integrate seamlessly into your existing ecosystem. We focus on agile methodologies, ensuring zero downtime, military-grade security, and an infrastructure built to handle massive scale and future expansions effortlessly.",
      image: Software,
      color: "#2563eb"
    },
    {
      title: "Web Application",
      desc: "Build powerful, secure, and lightning-fast web applications using modern frameworks that deliver native-like experiences in any browser.",
      extendedDesc: "We specialize in decoupled architectures using modern tech stacks like React, Node.js, and Django. Our Progressive Web Apps (PWAs) offer lightning-fast load times, offline capabilities, and dynamic data rendering. From secure payment gateways to real-time sync, we ensure your web applications are perfectly optimized for both high performance and maximum user retention.",
      image: WebApp,
      color: "#7c3aed"
    },
    {
      title: "Website Development",
      desc: "Craft a stunning digital storefront with our world-class UI/UX design and SEO-optimized development to turn visitors into loyal customers.",
      extendedDesc: "A website should be your strongest sales asset. We build premium, pixel-perfect websites with advanced SEO optimization, fluid animations, and responsive designs. From intuitive navigation structures to strategic call-to-actions (CTAs), our designs are heavily focused on Conversion Rate Optimization (CRO) to maximize your lead generation and brand authority.",
      image: Website,
      color: "#06b6d4"
    },
    {
      title: "AI / ML Solutions",
      desc: "Leverage cutting-edge Artificial Intelligence and Machine Learning to unlock predictive insights, automate decisions, and gain a competitive edge.",
      extendedDesc: "Transform raw data into actionable intelligence. We build predictive models, Natural Language Processing (NLP) chatbots, and computer vision systems tailored to your industry. Whether it's analyzing customer behavior, forecasting sales, or automating complex decision-making processes, our AI models are trained to optimize your operations and drastically reduce human error.",
      image: AIML,
      color: "#8b5cf6"
    },
    {
      title: "Game Development",
      desc: "Bring your vision to life with captivating 2D & 3D games, featuring immersive gameplay, high-fidelity graphics, and cross-platform compatibility.",
      extendedDesc: "Using industry-leading engines like Unity and Unreal, we create immersive digital worlds. Our end-to-end game development covers everything from conceptual storytelling and character design to advanced physics and multiplayer networking. We optimize rendering for high frame rates across PC, consoles, and mobile devices to guarantee an addictive and seamless player experience.",
      image: Game,
      color: "#ec4899"
    },
    {
      title: "Automation Tools",
      desc: "Maximize productivity and reduce errors with custom automation systems that streamline workflows, connect APIs, and optimize daily operations.",
      extendedDesc: "Stop wasting time on repetitive manual tasks. We engineer powerful automation scripts, data-scraping bots, and API integrations that connect your disparate software systems. Our bespoke automation tools run silently 24/7, handling heavy data processing, automated reporting, and CRM syncing, allowing your core team to focus strictly on scaling the business.",
      image: Automation,
      color: "#0ea5e9"
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
      {/* BACKGROUND GLOW EFFECTS */}
      <Box
        sx={{
          position: "absolute",
          width: 500,
          height: 500,
          background: "#7c3aed",
          filter: "blur(180px)",
          opacity: .12,
          left: -150,
          top: -100,
          borderRadius: "50%",
          pointerEvents: 'none'
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 500,
          height: 500,
          background: "#06b6d4",
          filter: "blur(180px)",
          opacity: .1,
          right: -100,
          bottom: -100,
          borderRadius: "50%",
          pointerEvents: 'none'
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>

        {/* SERVICES SECTION */}
        <Box py={8}>
          <Typography variant="h2" textAlign="center" fontWeight={900} mb={10} sx={{ fontSize: { xs: '3rem', md: '4.5rem' } }}>
            Our <span style={{ color: '#06b6d4' }}>Expertise</span>
          </Typography>

          {services.map((item, index) => {
            const isExpanded = expandedIndex === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: .6 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <Grid
                  container
                  spacing={4}
                  alignItems="center"
                  direction={index % 2 === 0 ? "row" : "row-reverse"}
                  sx={{
                    mb: 5,
                    p: { xs: 3, md: 4 },
                    background: "rgba(255,255,255,.02)",
                    borderRadius: "24px",
                    border: '1px solid rgba(255,255,255,0.05)',
                    backdropFilter: "blur(20px)",
                    transition: '0.4s ease',
                    '&:hover': {
                      background: "rgba(255,255,255,.04)",
                      borderColor: item.color,
                      boxShadow: `0px 10px 30px rgba(0,0,0,0.2)`
                    }
                  }}
                >
                  <Grid item xs={12} md={8}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 900,
                        fontSize: { xs: "1.8rem", md: "2.5rem" },
                        color: '#fff',
                        letterSpacing: '-1px'
                      }}
                    >
                      {item.title}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 2,
                        color: "#94a3b8",
                        fontSize: '1rem',
                        lineHeight: 1.8,
                        maxWidth: '700px'
                      }}
                    >
                      {item.desc}
                    </Typography>

                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <Box 
                        sx={{
                           mt: 2, 
                           p: 2.5, 
                           background: 'rgba(0,0,0,0.2)', 
                           borderRadius: '12px',
                           borderLeft: `3px solid ${item.color}`
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#e2e8f0",
                            fontSize: '0.95rem',
                            lineHeight: 1.8,
                            maxWidth: '700px'
                          }}
                        >
                          {item.extendedDesc}
                        </Typography>
                      </Box>
                    </Collapse>

                    <Button
                      variant="text"
                      onClick={() => handleExpand(index)}
                      sx={{
                        mt: 2,
                        fontWeight: 'bold',
                        color: item.color,
                        padding: '6px 0',
                        fontSize: '1rem',
                        '&:hover': {
                          background: 'transparent',
                          letterSpacing: '1px',
                          color: '#fff'
                        }
                      }}
                    >
                      {isExpanded ? "Show Less -" : "Learn More +"}
                    </Button>
                  </Grid>

                  <Grid item xs={12} md={4} display="flex" justifyContent="center">
                    <Box
                      sx={{
                        width: { xs: 140, md: 170 },
                        height: { xs: 140, md: 170 },
                        borderRadius: '50%',
                        overflow: 'hidden', 
                        border: `3px solid rgba(255,255,255,0.1)`,
                        boxShadow: `0px 10px 25px rgba(0,0,0,0.3)`,
                        transition: '0.4s ease',
                        '&:hover': {
                          borderColor: item.color,
                          transform: 'scale(1.05)'
                        }
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{
                          width: "100%",
                          height: '100%',
                          objectFit: 'cover',
                          display: "block",
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </motion.div>
            );
          })}
        </Box>

        {/* CONTACT & FORM SECTION */}
        <Box py={8} mb={5}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h2"
              textAlign="center"
              fontWeight={900}
              mb={8}
              sx={{ fontSize: { xs: '2.5rem', md: '4rem' } }}
            >
              Ready to <span style={{ color: '#ec4899' }}>Elevate</span> Your Business?
            </Typography>

            <Grid container spacing={5} justifyContent="center">
              
              {/* Form Grid */}
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
                  <Typography variant="h5" color="#fff" fontWeight="bold" mb={4}>Request a Free Consultation</Typography>

                  <Grid container spacing={3}>
                    {/* FORM INPUTS CONNECTED TO STATE */}
                    <Grid item xs={12} sm={6}>
                      <TextField 
                        fullWidth 
                        label="Your Name" 
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        variant="outlined" 
                        sx={inputStyle} 
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField 
                        fullWidth 
                        label="Phone Number" 
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        variant="outlined" 
                        sx={inputStyle} 
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField 
                        fullWidth 
                        label="Business Email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        variant="outlined" 
                        sx={inputStyle} 
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        fullWidth
                        label="Interested Service"
                        name="service_type"
                        value={formData.service_type}
                        onChange={handleChange}
                        variant="outlined"
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
                        <MenuItem value="Website">Website Development</MenuItem>
                        <MenuItem value="Software">Custom Software</MenuItem>
                        <MenuItem value="AI">AI Solutions</MenuItem>
                        <MenuItem value="Game">Game Dev</MenuItem>
                        <MenuItem value="Automation">Automation Tools</MenuItem>
                      </TextField>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={handleSubmit} // Triggers the API fetch
                        sx={{
                          mt: 2,
                          py: 2,
                          borderRadius: "12px",
                          fontWeight: 'bold',
                          fontSize: '1.1rem',
                          background: 'linear-gradient(90deg, #06b6d4, #2563eb)',
                          boxShadow: '0px 8px 20px rgba(6, 182, 212, 0.3)',
                          '&:hover': {
                            background: 'linear-gradient(90deg, #0891b2, #1d4ed8)',
                          }
                        }}
                      >
                        Submit Inquiry
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Contact Info Grid */}
              <Grid item xs={12} md={5}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 6,
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
                  <Box sx={{ position: 'absolute', width: 200, height: 200, background: '#ec4899', filter: 'blur(100px)', opacity: 0.1, top: -50, right: -50 }} />

                  <Typography variant="h4" fontWeight={900} color="#fff" mb={2}>
                    Let's Talk
                  </Typography>
                  <Typography color="#94a3b8" mb={4} lineHeight={1.8}>
                    Have questions or a project idea? Reach out directly. Our experts are ready to engineer your custom solution.
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography color="#94a3b8" fontSize="0.85rem" textTransform="uppercase" letterSpacing={1}>
                        Contact Numbers
                      </Typography>
                      <Typography fontSize={{ xs: '1.2rem', md: "1.4rem" }} fontWeight={800} color="#fff" sx={{ mt: 0.5 }}>
                        +91 9784863800
                      </Typography>
                      <Typography fontSize={{ xs: '1.2rem', md: "1.4rem" }} fontWeight={800} color="#fff" sx={{ mt: 0.5 }}>
                        +91 9752632735
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography color="#94a3b8" fontSize="0.85rem" textTransform="uppercase" letterSpacing={1}>
                        Email Us
                      </Typography>
                      <Typography
                        fontSize={{ xs: '1.5rem', md: "1.8rem" }}
                        fontWeight={800}
                        color="#06b6d4"
                        sx={{ wordBreak: 'break-word', mt: 0.5 }}
                      >
                        support@pmb.finance
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
  )
}

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
  '& .MuiSelect-icon': {
    color: '#94a3b8'
  }
};

export default Software_Services;