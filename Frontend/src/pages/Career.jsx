import Navbar from "../components/Navbar"
import {
Box,
Typography,
TextField,
MenuItem,
Card,
CardContent,
Button,
Grid
} from "@mui/material"
import { useState } from "react"

function Career(){


const jobs = [
{
id:1,
title:"Loan Sales Executive",
location:"Jaipur",
type:"Full Time"
},
{
id:2,
title:"Customer Support Executive",
location:"Delhi",
type:"Part Time"
},
{
id:3,
title:"Finance Intern",
location:"Remote",
type:"Internship"
}
]

const [search,setSearch] = useState("")
const [jobType,setJobType] = useState("")

const filteredJobs = jobs.filter((job)=>{

return(
job.title.toLowerCase().includes(search.toLowerCase()) &&
(jobType === "" || job.type === jobType)
)

})

return(

<Box>


<Box
sx={{
minHeight:"90vh",
background:"#f4f7fb",
p:4
}}
>

<Typography
variant="h4"
sx={{textAlign:"center",mb:4,fontWeight:600}}
>
Job Openings
</Typography>

{/* Search + Filter */}

<Box
sx={{
display:"flex",
justifyContent:"center",
gap:2,
mb:4,
flexWrap:"wrap"
}}
>

<TextField
label="Search Job"
onChange={(e)=>setSearch(e.target.value)}
/>

<TextField
select
label="Job Type"
onChange={(e)=>setJobType(e.target.value)}
sx={{width:200}}
>

<MenuItem value="">All</MenuItem>
<MenuItem value="Full Time">Full Time</MenuItem>
<MenuItem value="Part Time">Part Time</MenuItem>
<MenuItem value="Internship">Internship</MenuItem>

</TextField>

</Box>

{/* Job Cards */}

<Grid container spacing={3} justifyContent="center">

{filteredJobs.map((job)=>(

<Grid item xs={12} md={6} lg={4} key={job.id}>

<Card
sx={{
borderRadius:"12px",
boxShadow:"0 8px 20px rgba(0,0,0,0.1)",
transition:"0.3s",
"&:hover":{
transform:"translateY(-5px)"
}
}}
>

<CardContent>

<Typography variant="h6" sx={{mb:1,fontWeight:600}}>
{job.title}
</Typography>

<Typography sx={{mb:1}}>
Location: {job.location}
</Typography>

<Typography sx={{mb:2}}>
Type: {job.type}
</Typography>

<Button variant="contained" fullWidth>
Apply Now
</Button>

</CardContent>

</Card>

</Grid>

))}

</Grid>

</Box>

</Box>

)

}

export default Career