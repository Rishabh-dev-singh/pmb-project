import Navbar from "../components/Navbar";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
} from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import EmailIcon from "@mui/icons-material/Email";

function Career() {
  return (
    <Box>
     

      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f766e 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          py: 6,
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={10}
            sx={{
              borderRadius: "30px",
              p: { xs: 4, md: 8 },
              textAlign: "center",
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(10px)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Top Glow */}
            <Box
              sx={{
                position: "absolute",
                top: -80,
                right: -80,
                width: 220,
                height: 220,
                background: "rgba(22,163,74,0.18)",
                borderRadius: "50%",
                filter: "blur(50px)",
              }}
            />

            {/* Icon */}
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg,#16a34a,#0f766e)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                mb: 4,
                boxShadow: "0 15px 35px rgba(22,163,74,0.35)",
              }}
            >
              <WorkOutlineIcon
                sx={{
                  fontSize: 50,
                  color: "#fff",
                }}
              />
            </Box>

            {/* Heading */}
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: "#0f172a",
                mb: 3,
                fontSize: { xs: "2.2rem", md: "3.2rem" },
                lineHeight: 1.2,
              }}
            >
              We Are Looking For
              <br />
              Exceptional Talent
            </Typography>

            {/* Description */}
            <Typography
              sx={{
                fontSize: "1.1rem",
                color: "#475569",
                lineHeight: 1.9,
                mb: 5,
                maxWidth: "760px",
                margin: "0 auto",
              }}
            >
              Join{" "}
              <Box
                component="span"
                sx={{
                  fontWeight: 900,
                  color: "#16a34a",
                  fontSize: "1.25rem",
                  letterSpacing: "1px",
                  textShadow:
                    "0 0 12px rgba(22,163,74,0.45)",
                }}
              >
                PMB AGRI & LEASING CORPORATION
              </Box>{" "}
              and become part of a fast-growing financial company
              where your ideas, dedication, and passion truly
              matter. We are searching for ambitious,
              hardworking, and creative professionals who want to
              build a successful future with us.
            </Typography>

            {/* Why Join */}
            <Box
              sx={{
                background:
                  "linear-gradient(135deg,#f8fafc,#ecfeff)",
                borderRadius: "24px",
                p: 4,
                mb: 5,
                border: "1px solid #d1fae5",
                boxShadow:
                  "0 10px 30px rgba(15,118,110,0.08)",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: "#0f766e",
                  mb: 3,
                }}
              >
                Why Join Us?
              </Typography>

              <Typography
                sx={{
                  color: "#475569",
                  lineHeight: 2.2,
                  fontSize: "1.05rem",
                  fontWeight: 500,
                }}
              >
                • Professional Growth Opportunities
                <br />
                • Friendly & Supportive Work Environment
                <br />
                • Career Development & Learning
                <br />
                • Competitive Salary & Benefits
                <br />
                • Opportunity To Work With Industry Experts
              </Typography>
            </Box>

            {/* Resume Section */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: "#0f172a",
                mb: 2,
              }}
            >
              Send Your Resume
            </Typography>

            <Typography
              sx={{
                color: "#64748b",
                mb: 4,
                fontSize: "1.05rem",
                lineHeight: 1.8,
              }}
            >
              Interested candidates can send their resume and
              professional details to our official email address.
            </Typography>

            {/* Email Button */}
            <Button
              variant="contained"
              startIcon={<EmailIcon />}
              href="mailto:info@pmb.finance"
              sx={{
                background:
                  "linear-gradient(135deg,#16a34a,#0f766e)",
                px: 5,
                py: 1.8,
                borderRadius: "16px",
                fontSize: "1rem",
                fontWeight: 800,
                textTransform: "none",
                boxShadow:
                  "0 15px 35px rgba(22,163,74,0.35)",
                transition: "0.35s",
                "&:hover": {
                  background:
                    "linear-gradient(135deg,#15803d,#115e59)",
                  transform: "translateY(-4px) scale(1.03)",
                },
              }}
            >
              info@pmb.finance
            </Button>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}

export default Career;

