import { Box, Typography, Button, Stack } from "@mui/material";
import { keyframes } from "@mui/system";
import { Link } from "react-router-dom";
import hero from "../assets/hero.png";

const fadeUp = keyframes`
from { opacity:0; transform: translateY(40px); }
to { opacity:1; transform: translateY(0); }
`;

function Home() {

return (

<Box sx={{ width: "100%", overflow: "hidden" }}>

<Box
sx={{
position: "relative",
width: "100%",
minHeight: "calc(100vh - 70px)",
backgroundImage: `url(${hero})`,
backgroundSize: "cover",
backgroundPosition: "center",
display: "flex",
alignItems: "center",
px: { xs: 3, md: 10 },
color: "white"
}}
>

{/* Overlay */}

<Box
sx={{
position: "absolute",
top: 0,
left: 0,
width: "100%",
height: "100%",
background:
"linear-gradient(to right, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0.3) 60%, transparent)"
}}
/>

{/* CONTENT */}

<Box
sx={{
position: "relative",
zIndex: 1,
maxWidth: "650px"
}}
>

<Typography
sx={{
letterSpacing: "6px",
fontWeight: 400,
fontSize: { xs: "14px", md: "16px" },
opacity: 0.9,
animation: `${fadeUp} 0.8s ease forwards`
}}
>
WELCOME TO
</Typography>


<Typography
variant="h2"
sx={{
fontWeight: 800,
fontSize: { xs: "2.5rem", md: "4rem" },
lineHeight: 1.2,
mt: 1,
animation: `${fadeUp} 1s ease 0.3s both`,
textShadow: "0px 5px 25px rgba(0,0,0,0.5)"
}}
>

PMB AGRI & <br />

<span style={{ color: "#4caf50" }}>
LEASING CORPORATION
</span>

</Typography>


<Typography
sx={{
mt: 2,
fontSize: { xs: "15px", md: "18px" },
color: "#e0e0e0",
animation: `${fadeUp} 1s ease 0.6s both`
}}
>

Empowering Financial Growth & Promoting Sustainable Organic Living

</Typography>


{/* BUTTONS */}

<Stack
direction={{ xs: "column", sm: "row" }}
spacing={2}
mt={4}
sx={{
animation: `${fadeUp} 1s ease 0.9s both`
}}
>

<Button
component={Link}
to="/inquiry"
variant="contained"
size="large"
sx={{
background: "linear-gradient(45deg,#4caf50,#2e7d32)",
borderRadius: "30px",
px: 4,
fontWeight: 600,
textTransform: "none"
}}
>

Submit Inquiry

</Button>


<Button
component={Link}
to="/about"
variant="outlined"
size="large"
sx={{
borderColor: "white",
color: "white",
borderRadius: "30px",
px: 4,
fontWeight: 600,
textTransform: "none"
}}
>

Learn More

</Button>

</Stack>

</Box>

</Box>

</Box>

);

}

export default Home;