import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Divider,
  Card,
  CardContent,
  Stack
} from "@mui/material";
import {
  VerifiedUser,
  LocationOn,
  Receipt
} from "@mui/icons-material";

import MdImg from "../assets/MD_img.jpeg";
import BusinessHead from "../assets/Bussiness_Head.png";
import ItHead from "../assets/IT_Head.png";
import LegalHead from "../assets/Legel_Head.jpeg";
import FinanceHead from "../assets/CFO.jpeg";
import ChoiceImg from "../assets/Choice.jpeg";

function About() {
  const primaryColor = "#0f4c81"; // Modern Corporate Blue
  const secondaryColor = "#4caf50"; // Agri Green

  const sectionTitleStyle = {
    fontWeight: 800,
    color: primaryColor,
    mb: 3,
    position: "relative",
    display: "inline-block",
    "&::after": {
      content: '""',
      display: "block",
      width: "60px",
      height: "4px",
      backgroundColor: secondaryColor,
      mt: 1,
      borderRadius: "2px"
    }
  };

  return (
    <Box sx={{ bgcolor: "#f4f7f6", pb: 10 }}>
      
      {/* ================= HERO SECTION ================= */}

      <Box
        sx={{
          background: `linear-gradient(135deg, ${primaryColor}, #1e3c72)`,
          color: "white",
          py: { xs: 8, md: 12 },
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              mb: 2,
              fontSize: { xs: "2.5rem", md: "4rem" },
              letterSpacing: "1px"
            }}
          >
            PMB AGRI & <span style={{ color: "#81c784" }}>LEASING</span>
          </Typography>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 300,
              maxWidth: "800px",
              mx: "auto",
              opacity: 0.9,
              lineHeight: 1.6,
              px: 2
            }}
          >
            Empowering Financial Growth & Promoting Sustainable Organic Living
          </Typography>

          {/* GSTIN Badge UPAR */}
          <Box
            sx={{
              mt: 3.5,
              display: "inline-flex",
              alignItems: "center",
              gap: 1.5,
              px: { xs: 2.5, sm: 3.5 },
              py: 1,
              borderRadius: "50px",
              bgcolor: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.35)",
              boxShadow: "0 6px 20px rgba(0,0,0,0.15)"
            }}
          >
            <VerifiedUser sx={{ color: "#81c784", fontSize: { xs: "1.2rem", sm: "1.4rem" } }} />
            <Typography
              sx={{
                fontSize: { xs: "0.85rem", sm: "1rem" },
                fontWeight: 700,
                letterSpacing: "1px",
                color: "#fff"
              }}
            >
              GSTIN :{" "}
              <span style={{ color: "#a5d6a7", fontWeight: 800, letterSpacing: "1.5px" }}>
                08NDJPS3328N1ZL
              </span>
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: { xs: 4, md: 6 } }}>
        
        {/* ================= COMPANY REGISTRATION & ADDRESS ================= */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 3 },
            mb: 4.5,
            borderRadius: "18px",
            bgcolor: "#fff",
            border: "1px solid rgba(15, 76, 129, 0.12)",
            boxShadow: "0 8px 25px rgba(0,0,0,0.04)"
          }}
        >
          <Grid container spacing={3} alignItems="center">
            {/* GSTIN Box */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    bgcolor: "rgba(15, 76, 129, 0.08)",
                    p: 1.5,
                    borderRadius: "14px",
                    color: primaryColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Receipt sx={{ fontSize: 32 }} />
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px" }}
                  >
                    GST Identification Number
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: primaryColor, letterSpacing: "1px", mt: 0.3 }}>
                    08NDJPS3328N1ZL
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Address Box */}
            <Grid item xs={12} md={8}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  pl: { md: 3 },
                  borderLeft: { md: "2px solid #eef2f6" }
                }}
              >
                <Box
                  sx={{
                    bgcolor: "rgba(76, 175, 80, 0.1)",
                    p: 1.5,
                    borderRadius: "14px",
                    color: secondaryColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mt: 0.5
                  }}
                >
                  <LocationOn sx={{ fontSize: 32 }} />
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px" }}
                  >
                    Registered Company Address
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, color: "#2d3748", lineHeight: 1.6, mt: 0.3 }}
                  >
                    PLOT NO - A64, Building NO: Sanjeevani city, Mohanpura watika road, Jaipur, Rajasthan – 303905
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* ================= ABOUT US & STATS SECTION ================= */}

        <Grid container spacing={4}>
          
          {/* Left: About Us Text */}
          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: "16px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
                height: "100%"
              }}
            >
              <Typography variant="h4" sx={sectionTitleStyle}>
                About Us
              </Typography>

              <Typography sx={{ fontSize: "1.05rem", color: "#555", lineHeight: 1.8, mb: 3 }}>
                We are a dynamic and customer-focused organization committed to providing comprehensive financial solutions And Software Services to individuals and businesses across India.
              </Typography>

              <Typography sx={{ fontSize: "1.05rem", color: "#555", lineHeight: 1.8, mb: 4 }}>
                With strong industry knowledge and partnerships with leading banks, we assist in securing:
                <br /><br />
                <strong style={{ color: primaryColor, fontSize: "1.1rem" }}>
                  Business Loans, Term Loans, OD Limits, Cash Credit Limits, Solar Loan, Loan Against Property, Home Loans, NBFC Landing and Machinery Loans.
                </strong>
              </Typography>

              <Divider sx={{ my: 4 }} />

              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ borderLeft: `4px solid ${secondaryColor}`, pl: 2 }}>
                    <Typography sx={{ fontWeight: 800, color: primaryColor, fontSize: "1.1rem" }}>
                      Our Mission
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.6 }}>
                      To empower businesses with transparent financial solutions while encouraging healthier lifestyles.
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ borderLeft: `4px solid ${secondaryColor}`, pl: 2 }}>
                    <Typography sx={{ fontWeight: 800, color: primaryColor, fontSize: "1.1rem" }}>
                      Our Vision
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.6 }}>
                      To become India's trusted platform bridging financial services and sustainable living.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Right: Stats */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3} sx={{ height: "100%", justifyContent: "center" }}>
              {[
                ["150+", "Banking & NBFC Partners"],
                ["1200+", "Trusted Customers"],
                ["1 Lac – 50Cr+", "Loans Approved"],
                ["100%", "Customer Satisfaction"]
              ].map((item, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 3,
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
                    borderRight: `4px solid ${primaryColor}`,
                    transition: "transform 0.3s ease",
                    "&:hover": { transform: "translateX(-5px)" }
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 900, color: primaryColor }}>
                    {item[0]}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#666", textAlign: "right", maxWidth: "120px" }}>
                    {item[1]}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Grid>

        </Grid>

        {/* ================= LEADERSHIP SECTION ================= */}

        <Box sx={{ mt: 10 }}>
          <Typography variant="h3" align="center" sx={{ fontWeight: 900, color: primaryColor, mb: 6, fontSize: { xs: "2rem", md: "3rem" } }}>
            Our Leadership
          </Typography>

          <Grid container spacing={4}>
            
            {/* --- MD CARD (Responsive Layout for Mobile) --- */}
            <Grid item xs={12}>
              <Card 
                sx={{ 
                  display: "flex", 
                  flexDirection: { xs: "column", md: "row" }, 
                  borderRadius: "20px", 
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  overflow: "hidden",
                  bgcolor: "#fff"
                }}
              >
                {/* Image Side - Fixed for Mobile */}

                <Box 
                  sx={{ 
                    flex: { xs: "none", md: "0 0 35%" }, 
                    bgcolor: primaryColor, 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center", 
                    justifyContent: "center",
                    p: { xs: 4, md: 4 },
                    color: "#fff"
                  }}
                >
                  <Box 
                    component="img"
                    src={MdImg} 
                    alt="Managing Director"
                    sx={{ 
                      width: { xs: 150, md: 180 }, 
                      height: { xs: 150, md: 180 }, 
                      borderRadius: "50%",
                      objectFit: "cover",
                      objectPosition: "top center", 
                      border: "5px solid rgba(255,255,255,0.2)", 
                      mb: 2 
                    }}  
                  />
                  <Typography variant="h5" sx={{ fontWeight: 800, textAlign: "center", fontSize: { xs: "1.3rem", md: "1.5rem" } }}>
                    Mr. Manvendra Singh
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#a5d6a7", letterSpacing: 1, textTransform: "uppercase", mt: 1, fontWeight: 600, textAlign: "center" }}>
                    Founder & Managing Director
                  </Typography>
                </Box>

                {/* Content Side - Responsive Text & Padding */}

                <Box sx={{ flex: 1, p: { xs: 2.5, sm: 4, md: 5 } }}>
                  <Typography sx={{ fontSize: { xs: "0.95rem", md: "1rem" }, lineHeight: 1.8, color: "#444", textAlign: { xs: "left", md: "justify" }, mb: 4 }}>
                    Our Managing Director is a young and visionary entrepreneur who strongly believes that the true strength of any organization lies in its people. He values every team member as an important contributor to the company’s growth, success, and long-term vision. His leadership is built on trust, transparency, innovation, and collective progress.
                    <br /><br />
                    With a vision to make modern financial services more accessible across India, he is focused on building strong partnerships with leading lenders and financial institutions to expand the company’s reach and create better financial opportunities for individuals and businesses.
                    <br /><br />
                    His objective is not only to achieve business growth, but also to establish a reliable and customer-centric platform that empowers people to achieve their goals with confidence. Through innovation, strong values, and long-term relationships, he continues to lead the company towards sustainable growth and excellence.
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Typography sx={{ fontWeight: 700, color: primaryColor, display: "flex", alignItems: "center", gap: 1 }}>
                        📍 Registered Address
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.8, lineHeight: 1.6 }}>
                        Plot No - A64, Sanjeevani City <br />
                        Mohanpura Watika Road <br />
                        Jaipur, Rajasthan – 303905
                      </Typography>

                      <Typography sx={{ fontWeight: 700, color: primaryColor, display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
                        🏢 Corporate Office
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.8, lineHeight: 1.6 }}>
                        605, Okay Plus Square, Patel Marg <br />
                        Mansarover, Jaipur, Rajasthan – 302020
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography sx={{ fontWeight: 700, color: primaryColor, display: "flex", alignItems: "center", gap: 1 }}>
                          🏛️ GSTIN
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 700, color: primaryColor, letterSpacing: "0.5px" }}>
                          08NDJPS3328N1ZL
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography sx={{ fontWeight: 700, color: primaryColor, display: "flex", alignItems: "center", gap: 1 }}>
                          📞 Phone
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          +91 9784863800
                        </Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: primaryColor, display: "flex", alignItems: "center", gap: 1 }}>
                          ✉ Email
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          info@pmb.finance
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Card>
            </Grid>

            {/* --- OTHER LEADERS (Uniform Grid Layout) --- */}
            
            {[
              {
                name: "Mr. Atar Singh",
                role: "Business Head",
                img: BusinessHead,
                desc: "A seasoned banking and financial services professional with over 20 years of experience across the Banking and NBFC sectors, specializing in business growth, strategic partnerships, and operational excellence. Known for building strong client relationships, driving sustainable expansion, and delivering innovative financial solutions with a results-oriented approach."
              },
              {
                name: "Mr. Rishabh Dev Singh",
                role: "IT Head",
                img: ItHead,
                desc: "Experienced Software and AI/ML Engineer with strong expertise in software development, artificial intelligence, machine learning, and modern technologies. Holds a Master's Degree in Computer Science with excellent academic performance and has successfully worked on multiple software and AI-driven projects. Passionate about building scalable systems, innovative products, and modern technology solutions while leading technical excellence and digital transformation."
              },
              {
                name: "Ms. Santosh Soni Advocate",              
                role: "Head of Legal & Compliance",
                img: LegalHead,
                desc: "Experienced legal and compliance professional with strong expertise in corporate law, regulatory compliance, contract management, and legal advisory services. Responsible for overseeing legal affairs, contracts, and compliance frameworks across the organization. Known for ensuring transparent and legally compliant operations while safeguarding the company's interests. Committed to upholding high standards of corporate governance."
              },
              {
                name: "Mr. T. C. Sharma",
                role: "Head of Finance & Accounts",
                img: FinanceHead,
                desc: "Accomplished Finance and Accounts professional with over 18 years of experience across manufacturing, banking, NBFC, and financial services sectors. Expertise in financial reporting, GST compliance, taxation, audit management, budgeting, MIS reporting, inventory control, and business finance. Proven track record of driving financial excellence, regulatory compliance, operational efficiency, and strategic decision-making."
              },
              {
                name: "Mr. Aditya Singhal",
                role: "Independent Director",
                img: ChoiceImg,
                desc: "Serves as an Independent Director, bringing a thoughtful and objective approach to the Board. He contributes valuable perspectives to strategic planning, governance, and effective decision-making. His professional experience and strong analytical approach support the organisation in achieving its long-term objectives. As an Independent Director, he is committed to promoting transparency, responsible governance, and sustainable growth."
              }
            ].map((leader, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  sx={{ 
                    height: "100%", 
                    display: "flex", 
                    flexDirection: "column",
                    borderRadius: "16px",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
                    transition: "0.3s ease",
                    "&:hover": { transform: "translateY(-8px)", boxShadow: "0 12px 30px rgba(0,0,0,0.1)" }
                  }}
                >
                  <Box sx={{ bgcolor: "#fff", display: "flex", justifyContent: "center", pt: 4, pb: 2 }}>
                    <Box 
                      component="img"
                      src={leader.img} 
                      alt={leader.name}
                      sx={{ 
                        width: 130, 
                        height: 130, 
                        borderRadius: "50%",
                        objectFit: "cover",
                        objectPosition: "top center",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                        border: "3px solid #fff" 
                      }} 
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1, textAlign: "center", bgcolor: "#fff", pt: 0, px: { xs: 2, md: 3 } }}>
                    <Typography sx={{ fontWeight: 800, color: primaryColor, fontSize: "1.2rem", mb: 0.5 }}>
                      {leader.name}
                    </Typography>
                    <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: secondaryColor, letterSpacing: 1, textTransform: "uppercase", mb: 2 }}>
                      {leader.role}
                    </Typography>
                    <Divider sx={{ mb: 2, mx: "auto", width: "40px", borderColor: "#ddd" }} />
                    <Typography sx={{ fontSize: "0.9rem", color: "#666", lineHeight: 1.7, textAlign: { xs: "left", md: "justify" } }}>
                      {leader.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}

          </Grid>
        </Box>

      </Container>
    </Box>
  );
}

export default About;

