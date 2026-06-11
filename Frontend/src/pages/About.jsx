import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Divider,
  Stack,
  Card
} from "@mui/material";

import MdImg from "../assets/MD_img.jpeg";
import BusinessHead from "../assets/Bussiness_Head.png";
import ItHead from "../assets/IT_Head.png";
import LegalHead from "../assets/Legel_Head.jpeg";
function About() {

  const sectionTitleStyle = {
    fontWeight: 800,
    color: "#1a237e",
    mb: 3,
    position: "relative",
    display: "inline-block",
    "&::after": {
      content: '""',
      display: "block",
      width: "50px",
      height: "4px",
      backgroundColor: "#4caf50",
      mt: 1
    }
  };

  return (
    <Box sx={{ bgcolor: "#f8f9fa" }}>

      {/* HERO */}

      <Box
        sx={{
          background: "linear-gradient(135deg,#1a237e,#0d47a1)",
          color: "white",
          pt: { xs: 12, md: 16 },
          pb: { xs: 10, md: 14 },
          textAlign: "center"
        }}
      >
        <Container maxWidth="lg">

          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              mb: 2,
              fontSize: { xs: "2.4rem", md: "4rem" }
            }}
          >
            PMB AGRI & <span style={{ color: "#81c784" }}>LEASING</span>
          </Typography>

          <Typography
            variant="h6"
            sx={{
              opacity: 0.9,
              fontWeight: 300,
              maxWidth: "800px",
              mx: "auto"
            }}
          >
            Empowering Financial Growth & Promoting Sustainable Organic Living
          </Typography>

        </Container>
      </Box>


      <Container sx={{ mt: -6, pb: 10 }}>

        <Grid container spacing={4}>

          <Grid item xs={12} md={7}>

            <Paper
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: 5,
                boxShadow: "0 10px 40px rgba(0,0,0,0.05)"
              }}
            >

              <Typography variant="h4" sx={sectionTitleStyle}>
                About Us
              </Typography>

              <Typography sx={{ fontSize: 18, color: "#444", lineHeight: 1.8, mb: 3 }}>
                We are a dynamic and customer-focused organization committed to providing comprehensive financial solutions And 
                Software Services to individuals and businesses across India
                .
              </Typography>

              <Typography sx={{ fontSize: 18, color: "#444", lineHeight: 1.8, mb: 4 }}>
                With strong industry knowledge and partnerships with leading banks, we assist in securing:
                
                <b>Business Loans, Term Loans, OD Limits, Cash Credit Limits,Solar Loan, Loan Against Property,
                Home Loans, NBFC Landing and Machinery Loans.</b>
                <b></b>
              </Typography>

              <Divider sx={{ my: 4 }} />

              <Grid container spacing={3}>

                <Grid item xs={12} sm={6}>
                  <Typography sx={{ fontWeight: "bold", color: "#1a237e" }}>
                    Our Mission
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    To empower businesses with transparent financial solutions while encouraging healthier lifestyles.
                  </Typography>
                </Grid>                <Grid item xs={12} sm={6}>
                  <Typography sx={{ fontWeight: "bold", color: "#1a237e" }}>
                    Our Vision
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    To become India's trusted platform bridging financial services and sustainable living.
                  </Typography>
                </Grid>

              </Grid>

            </Paper>

          </Grid>


          {/* MANAGING DIRECTOR */}

          <Grid item xs={12} md={5}>

            <Stack spacing={4}>

              <Paper
                sx={{
                  p: 4,
                  borderRadius: 5,
                  background: "linear-gradient(135deg,#ffffff,#f8faff)",
                  boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
                  borderLeft: "6px solid #1a237e"
                }}
              >

                <Typography
                  variant="overline"
                  sx={{
                    color: "#1a237e",
                    fontWeight: 800,
                    letterSpacing: 2
                  }}
                >
                  Managing Director
                </Typography>

                <Typography variant="h4" sx={{ fontWeight: 900, mt: 1 }}>
                  Mr. Manvendra Singh
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ fontWeight: 700, color: "#555" }}>
                    📍 Office Address
                  </Typography>

                  <Typography variant="body2" sx={{ mt: 1 }}>
                    605, Okay Plus Square <br />
                    Patel Marg, Mansarover <br />
                    Jaipur, Rajasthan – 302020 <br />
                    India
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ fontWeight: 700, color: "#555" }}>
                    📞 Phone
                  </Typography>

                  <Typography variant="body2">
                    +91 9784863800
                  </Typography>
                </Box>

                <Box>
                  <Typography sx={{ fontWeight: 700, color: "#555" }}>
                    ✉ Email
                  </Typography>

                  <Typography variant="body2">
                    info@pmb.finance
                  </Typography>
                </Box>

              </Paper>

            </Stack>

          </Grid>

        </Grid>


        {/* COMPANY STATS */}

        <Box sx={{ mt: 10 }}>

          <Typography
            variant="h4"
            align="center"
            sx={{ fontWeight: 800, color: "#1a237e", mb: 6 }}
          >
            Our Achievements
          </Typography>

          <Grid container spacing={4} justifyContent="center">

            {[
              ["150+", "Banking & NBFC Partners"],
              ["1200+", "Trusted Customers"],
              ["1 Lac – 50Cr+", "Loans Approved"],
              ["100%", "Customer Satisfaction"]
            ].map((item, index) => (

              <Grid item xs={6} md={3} key={index}>

                <Paper
                  sx={{
                    p: 4,
                    textAlign: "center",
                    borderRadius: 4,
                    background: "linear-gradient(135deg,#ffffff,#f1f5ff)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    transition: "0.3s",

                    "&:hover": {
                      transform: "translateY(-6px)"
                    }
                  }}
                >

                  <Typography variant="h4" sx={{ fontWeight: 900, color: "#1a237e" }}>
                    {item[0]}
                  </Typography>

                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {item[1]}
                  </Typography>

                </Paper>

              </Grid>

            ))}

          </Grid>

        </Box>



        {/* LEADERSHIP SECTION */}

        <Box sx={{ mt: 12 }}>

          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: 900,
              color: "#1a237e",
              mb: 6,
              fontSize: { xs: "2rem", md: "2.5rem" }
            }}
          >
            Our Leadership
          </Typography>

          <Grid
            container
            spacing={4}
            justifyContent="center"
            alignItems="stretch"
          >

            {/* MD CARD */}

            <Grid item xs={12} sm={10} md={5} lg={4}>

              <Card
                sx={{
                  p: 3,
                  borderRadius: "24px",

                  background:
                    "linear-gradient(135deg,#1a237e,#3949ab)",

                  color: "#fff",

                  textAlign: "center",

                  boxShadow: "0 15px 40px rgba(0,0,0,0.18)",

                  transition: "0.3s ease",

                  "&:hover": {
                    transform: "translateY(-6px)"
                  }
                }}
              >

                {/* IMAGE */}

                <Box
                  component="img"
                  src={MdImg}
                  alt="Managing Director"
                  sx={{
                    width: { xs: 140, md: 160 },
                    height: { xs: 140, md: 160 },

                    borderRadius: "50%",

                    objectFit: "cover",
                    objectPosition: "top center",

                    border: "4px solid rgba(255,255,255,0.25)",

                    boxShadow: "0 10px 25px rgba(0,0,0,0.25)",

                    mb: 2.5
                  }}
                />

                {/* NAME */}

                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: "1.5rem"
                  }}
                >
                  Mr. Manvendra Singh
                </Typography>

                {/* ROLE */}

                <Typography
                  sx={{
                    fontSize: "0.78rem",
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    color: "#c5cae9",
                    mb: 2
                  }}
                >
                  Founder & Managing Director
                </Typography>

                <Divider
                  sx={{
                    borderColor: "rgba(255,255,255,0.15)",
                    mb: 2
                  }}
                />

                {/* TEXT */}

               <Typography
                  sx={{
                    fontSize: "0.92rem",
                    lineHeight: 1.9,
                    color: "rgba(255,255,255,0.92)",
                    textAlign: "justify"
                  }}
                >
                  Our Managing Director is a young and visionary entrepreneur who
                  strongly believes that the true strength of any organization lies in
                  its people. He values every team member as an important contributor to
                  the company’s growth, success, and long-term vision. His leadership is
                  built on trust, transparency, innovation, and collective progress.
                  <br /><br />
                  With a vision to make modern financial services more accessible across
                  India, he is focused on building strong partnerships with leading
                  lenders and financial institutions to expand the company’s reach and
                  create better financial opportunities for individuals and businesses.
                  <br /><br />
                  His objective is not only to achieve business growth, but also to
                  establish a reliable and customer-centric platform that empowers
                  people to achieve their goals with confidence. Through innovation,
                  strong values, and long-term relationships, he continues to lead the
                  company towards sustainable growth and excellence.
                </Typography>

              </Card>

            </Grid>


            {/* COMBINED BUSINESS HEAD & IT HEAD PARENT CARD */}

            <Grid item xs={12} sm={12} md={7} lg={8}>

              <Card
                sx={{
                  p: 2,
                  borderRadius: "24px",
                  background: "linear-gradient(135deg,#00695c,#26a69a)",
                  color: "#fff",
                  boxShadow: "0 15px 40px rgba(0,0,0,0.18)"
                }}
              >
                
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: "stretch",
                    gap: 1
                  }}
                >

                  {/* LEFT SIDE: BUSINESS HEAD (INDIVIDUAL CARD) */}
                  <Card
                    sx={{
                      flex: 1,
                      p: 3,
                      borderRadius: "18px",
                      background: "rgba(255,255,255,0.03)",
                      color: "#fff",
                      textAlign: "center",
                      boxShadow: "none",
                      transition: "0.3s ease",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        background: "rgba(255,255,255,0.09)",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
                      }
                    }}
                  >

                    {/* IMAGE */}
                    <Box
                      component="img"
                      src={BusinessHead}
                      alt="Business Head"
                      sx={{
                        width: { xs: 140, md: 160 },
                        height: { xs: 140, md: 160 },
                        borderRadius: "50%",
                        objectFit: "cover",
                        objectPosition: "top center",
                        border: "4px solid rgba(255,255,255,0.25)",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
                        mb: 2.5
                      }}
                    />

                    {/* NAME */}
                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: "1.5rem"
                      }}
                    >
                      Mr. Atar Singh
                    </Typography>

                    {/* ROLE */}
                    <Typography
                      sx={{
                        fontSize: "0.78rem",
                        letterSpacing: 1.5,
                        textTransform: "uppercase",
                        color: "#b2dfdb",
                        mb: 2
                      }}
                    >
                      Business Head
                    </Typography>

                    <Divider
                      sx={{
                        borderColor: "rgba(255,255,255,0.15)",
                        mb: 2
                      }}
                    />

                    {/* TEXT */}
                    <Typography
                      sx={{
                        fontSize: "0.92rem",
                        lineHeight: 1.8,
                        color: "rgba(255,255,255,0.92)",
                        textAlign: "justify"
                      }}
                    >
                     A seasoned banking and financial services professional with over 20 years of 
                     experience across the Banking and NBFC sectors, specializing in business growth,
                     strategic partnerships, and operational excellence. Known for building strong client relationships, 
                     driving sustainable expansion, and delivering innovative financial solutions with a results-oriented approach.
                    </Typography>

                  </Card>

                  {/* MIDDLE DIVIDER LINE */}
                  <Divider 
                    orientation="vertical" 
                    flexItem 
                    sx={{ 
                      borderColor: "rgba(255,255,255,0.2)", 
                      display: { xs: "none", md: "block" },
                      mx: 1 
                    }} 
                  />
                  <Divider 
                    orientation="horizontal" 
                    flexItem 
                    sx={{ 
                      borderColor: "rgba(255,255,255,0.2)", 
                      display: { xs: "block", md: "none" },
                      my: 1 
                    }} 
                  />

                  {/* RIGHT SIDE: IT HEAD (INDIVIDUAL CARD) */}
                  <Card
                    sx={{
                      flex: 1,
                      p: 3,
                      borderRadius: "18px",
                      background: "rgba(255,255,255,0.03)",
                      color: "#fff",
                      textAlign: "center",
                      boxShadow: "none",
                      transition: "0.3s ease",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        background: "rgba(255,255,255,0.09)",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
                      }
                    }}
                  >

                    {/* IMAGE */}
                    <Box
                      component="img"
                      src={ItHead}
                      alt="IT Head"
                      sx={{
                        width: { xs: 140, md: 160 },
                        height: { xs: 140, md: 160 },
                        borderRadius: "50%",
                        objectFit: "cover",
                        objectPosition: "top center",
                        border: "4px solid rgba(255,255,255,0.25)",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
                        mb: 2.5
                      }}
                    />

                    {/* NAME */}
                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: "1.5rem"
                      }}
                    >
                      Mr. Rishabh Dev Singh
                    </Typography>

                    {/* ROLE */}
                    <Typography
                      sx={{
                        fontSize: "0.78rem",
                        letterSpacing: 1.5,
                        textTransform: "uppercase",
                        color: "#b2dfdb",
                        mb: 2
                      }}
                    >
                      IT Head
                    </Typography>

                    <Divider
                      sx={{
                        borderColor: "rgba(255,255,255,0.15)",
                        mb: 2
                      }}
                    />

                    {/* TEXT */}
                    <Typography
                      sx={{
                        fontSize: "0.92rem",
                        lineHeight: 1.8,
                        color: "rgba(255,255,255,0.92)",
                        textAlign: "justify"
                      }}
                    >
                     Experienced Software and AI/ML Engineer with strong
                     expertise in software development, artificial intelligence,
                     machine learning, and modern technologies. Holds a
                     Master's Degree in Computer Science with excellent
                     academic performance and has successfully worked on
                     multiple software and AI-driven projects. Passionate about
                     building scalable systems, innovative products, and
                     modern technology solutions while leading technical
                     excellence and digital transformation.
                    </Typography>

                  </Card>
 <Divider
  orientation="vertical"
  flexItem
  sx={{
    borderColor: "rgba(255,255,255,0.2)",
    display: { xs: "none", md: "block" },
    mx: 1
  }}
/>

<Card
  sx={{
    flex: 1,
    p: 3,
    borderRadius: "18px",
    background: "rgba(255,255,255,0.03)",
    color: "#fff",
    textAlign: "center",
    boxShadow: "none",
    transition: "0.3s ease",
    "&:hover": {
      transform: "translateY(-6px)",
      background: "rgba(255,255,255,0.09)",
      boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
    }
  }}
>
  <Box
    component="img"
    src={LegalHead}
    alt="Legal Head"
    sx={{
      width: { xs: 140, md: 160 },
      height: { xs: 140, md: 160 },
      borderRadius: "50%",
      objectFit: "cover",
      objectPosition: "top center",
      border: "4px solid rgba(255,255,255,0.25)",
      boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
      mb: 2.5
    }}
  />

  <Typography
    sx={{
      fontWeight: 800,
      fontSize: "1.5rem"
    }}
  >
    Ms.Santosh Soni Advocate 
  </Typography>

  <Typography
    sx={{
      fontSize: "0.78rem",
      letterSpacing: 1.5,
      textTransform: "uppercase",
      color: "#b2dfdb",
      mb: 2
    }}
  >
    Head of Legal & Compliance
  </Typography>

  <Divider
    sx={{
      borderColor: "rgba(255,255,255,0.15)",
      mb: 2
    }}
  />

  <Typography
  sx={{
    fontSize: "0.92rem",
    lineHeight: 1.8,
    color: "rgba(255,255,255,0.92)",
    textAlign: "justify"
  }}
>
  Experienced legal and compliance professional with strong expertise in
  corporate law, regulatory compliance, contract management, and legal
  advisory services. Responsible for overseeing legal affairs,
  contracts, and compliance frameworks across the organization. Known
  for ensuring transparent and legally compliant operations while
  safeguarding the company's interests. Committed to upholding high
  standards of corporate governance, ethical practices, and operational
  integrity, contributing to the organization's credibility and
  sustainable growth.
</Typography>
</Card>

                </Box>
              </Card>

            </Grid>

          </Grid>

        </Box>

      </Container>

    </Box>
  );
}

export default About;

