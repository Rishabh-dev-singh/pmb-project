import React, {
  useState,
  useEffect,
  Suspense
} from "react";

import {
  Box,
  Grid,
  Paper,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  CssBaseline,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  useTheme
} from "@mui/material";

import {
  Dashboard as DashIcon,
  Assignment,
  Calculate,
  AddCircle,
  ListAlt,
  Edit as EditIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon
} from "@mui/icons-material";

import { useNavigate, useLocation } from "react-router-dom";

import Attendance from "./Attendance";

const EMI = React.lazy(() => import("./EMI"));

function EmployeeDashboard() {

  const [activePanel, setActivePanel] = useState("overview");
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [empMap, setEmpMap] = useState({}); // NEW STATE FOR EMPLOYEE NAMES

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [employeeData, setEmployeeData] = useState({
    name: "",
    id: "",
    designation: "",
    department: ""
  });

  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/employee-login");
      return;
    }
  }, [navigate]);

  // LOAD USER DATA & FETCH EMPLOYEE LIST
  useEffect(() => {
    setEmployeeData({
      name: localStorage.getItem("employeeName") || "Employee",
      id: localStorage.getItem("employeeId") || "N/A",
      designation: localStorage.getItem("designation") || "N/A",
      department: localStorage.getItem("department") || "N/A",
    });

    // FETCH EMPLOYEE NAMES FOR MAPPING
    fetch("https://pmb.finance/api/employees/")
      .then((res) => res.json())
      .then((data) => {
        const map = {};
        data.forEach((emp) => {
          map[emp.employee_id] = emp.first_name;
        });
        setEmpMap(map);
      })
      .catch((err) => console.error("Error fetching employees map:", err));

    fetchLeads();
  }, []);

  // PROFILE MENU
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // FETCH LEADS
  const fetchLeads = () => {
    const employeeId = localStorage.getItem("employeeId");
    const superUsers = ["3800", "3801", "3802", "3803"];
    let url = "";

    if (superUsers.includes(employeeId)) {
      url = "https://pmb.finance/api/leads/?role=manager";
    } else {
      url = `https://pmb.finance/api/leads/?owner=${encodeURIComponent(employeeId)}&role=employee`;
    }

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed To Fetch Leads");
        }
        return res.json();
      })
      .then((data) => {
        setLeads(data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    if (location.state?.refresh) {
      fetchLeads();
    }
  }, [location]);

  const formatAmount = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    if (num >= 10000000) return (num / 10000000).toFixed(2) + " Cr";
    if (num >= 100000) return (num / 100000).toFixed(2) + " Lakh";
    if (num >= 1000) return (num / 1000).toFixed(2) + " Thousand";
    return num;
  };

  // UPDATE STATUS
  const updateStatus = async (lead, newStatus) => {
    if (!newStatus) return;

    const confirmChange = window.confirm(
      `Progress change kare?\n\nFrom: ${lead.progress}\nTo: ${newStatus}`
    );

    if (!confirmChange) return;

    try {
      const res = await fetch(
        `https://pmb.finance/api/leads/${lead.id}/update/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            progress: newStatus,
            updated_by: "Rishabh",
            updated_at: new Date().toISOString()
          })
        }
      );

      if (res.ok) {
        alert("✅ Progress updated");
        setLeads((prev) =>
          prev.map((l) =>
            l.id === lead.id
              ? {
                  ...l,
                  progress: newStatus
                }
              : l
          )
        );
      } else {
        alert("❌ Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server error");
    }
  };

  // EDIT LEAD
  const handleEdit = (lead) => {
    navigate("/add-lead", {
      state: { lead }
    });
  };

  // FILTER LEADS
  const filteredLeads = leads.filter(
    (l) =>
      l.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      l.mobile?.includes(search)
  );

  // DOWNLOAD 
  const downloadExcel = () => {
    const headers = [
      "SR",
      "Name",
      "Mobile",
      "Address",
      "Owner",
      "Amount",
      "Progress"
    ];

    const rows = filteredLeads.map((l, i) => [
      i + 1,
      l.fullName,
      l.mobile,
      l.location,
      l.owner,
      formatAmount(l.requiredLoanAmount),
      l.progress
    ]);

    let csv =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((e) => e.join(","))
        .join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "leads.csv";
    link.click();
  };

  // CARD STYLE
  const card = {
    p: { xs: 2, md: 3 },
    borderRadius: "20px",
    background: "rgba(255,255,255,0.7)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)"
  };

  const menuItems = [
    { text: "Overview", icon: <DashIcon />, id: "overview" },
    { text: "Leads", icon: <ListAlt />, id: "leads" },
    { text: "Attendance", icon: <Assignment />, id: "attendance" },
    { text: "EMI", icon: <Calculate />, id: "emi" }
  ];

  return (
    <Box sx={{ display: "flex", bgcolor: "#eef2ff", minHeight: "100vh" }}>
      <CssBaseline />

      {/* SIDEBAR */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        sx={{
          width: { xs: 70, md: 240 },
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: { xs: 70, md: 240 },
            boxSizing: "border-box",
            bgcolor: "#020617",
            color: "#fff",
            borderRight: "1px solid rgba(255,255,255,0.05)"
          }
        }}
      >
        {/* LOGO */}
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography
            sx={{
              color: "#38bdf8",
              fontWeight: "bold",
              fontSize: { xs: "11px", md: "20px" },
              lineHeight: 1.3
            }}
          >
            PMB CRM SOFTWARE
          </Typography>
        </Box>

        {/* MENU */}
        <List>
          {menuItems.map((item) => (
            <ListItem
              key={item.id}
              onClick={() => {
                setActivePanel(item.id);
                if (item.id === "leads") {
                  fetchLeads();
                }
                if (isMobile) {
                  setMobileOpen(false);
                }
              }}
              sx={{
                cursor: "pointer",
                mx: 1,
                mb: 1,
                borderRadius: "14px",
                transition: "0.25s ease",
                justifyContent: { xs: "center", md: "flex-start" },
                bgcolor: activePanel === item.id ? "rgba(56,189,248,0.15)" : "transparent",
                "&:hover": { bgcolor: "rgba(56,189,248,0.10)" }
              }}
            >
              <ListItemIcon
                sx={{
                  color: activePanel === item.id ? "#38bdf8" : "#94a3b8",
                  minWidth: { xs: "auto", md: "42px" }
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{ display: { xs: "none", md: "block" } }}
                primaryTypographyProps={{
                  fontSize: "15px",
                  fontWeight: activePanel === item.id ? "600" : "400"
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* MAIN */}
      <Box sx={{ flexGrow: 1, width: "100%", overflow: "hidden" }}>
        
        {/* TOP HEADER */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: { xs: 1.5, md: 2 },
            bgcolor: "#fff",
            boxShadow: 1
          }}
        >
          {isMobile && (
            <IconButton onClick={() => setMobileOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
          <Box sx={{ ml: "auto" }}>
            <IconButton onClick={handleMenuClick}>
              <Avatar sx={{ bgcolor: "#38bdf8" }}>
                {employeeData.name.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Box>

          {/* PROFILE MENU */}
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <Box sx={{ px: 2, py: 1, minWidth: "220px" }}>
              <Typography fontWeight="bold" sx={{ mb: 1 }}>
                {employeeData.name}
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Typography variant="body2">
                <strong>ID:</strong> {employeeData.id}
              </Typography>
              <Typography variant="body2">
                <strong>DEPARTMENT:</strong> {employeeData.department}
              </Typography>
              <Typography variant="body2">
                <strong>DESIGNATION:</strong> {employeeData.designation}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>

        {/* CONTENT */}
        <Box sx={{ p: { xs: 1.5, md: 4 } }}>
          
          {/* OVERVIEW */}
          {activePanel === "overview" && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Paper
                  sx={{
                    ...card,
                    minHeight: "120px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    textAlign: "center"
                  }}
                  onClick={() => navigate("/add-lead")}
                >
                  <AddCircle sx={{ fontSize: 50 }} />
                  <Typography>Add New Lead</Typography>
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* LEADS */}
          {activePanel === "leads" && (
            <Paper sx={card}>
              <Typography
                variant="h5"
                sx={{ mb: 2, fontSize: { xs: "20px", md: "30px" } }}
              >
                Lead Tracker
              </Typography>

              <Button
                variant="contained"
                onClick={downloadExcel}
                fullWidth={isMobile}
                sx={{ mb: 2, background: "#16a34a" }}
              >
                Download Your Lead
              </Button>

              <TextField
                label="Search by name or mobile"
                fullWidth
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ mb: 2 }}
              />

              <TableContainer sx={{ overflowX: "auto" }}>
                <Table sx={{ minWidth: 1000 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>SR</TableCell>
                      <TableCell>Customer Name</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>Address</TableCell>
                      <TableCell>Created By</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Edit</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredLeads.map((l, i) => (
                      <TableRow key={l.id}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>{l.fullName}</TableCell>
                        <TableCell>{l.mobile}</TableCell>
                        <TableCell>{l.location}</TableCell>

                        {/* UPDATED OWNER CELL TO SHOW ID + NAME */}
                        <TableCell>
                          {l.owner} {empMap[l.owner] ? <span style={{ color: "#16a34a", fontWeight: "600" }}>({empMap[l.owner]})</span> : ""}
                        </TableCell>

                        <TableCell>{formatAmount(l.requiredLoanAmount)}</TableCell>
                        <TableCell>
                          <select
                            value={l.progress || ""}
                            onChange={(e) => updateStatus(l, e.target.value)}
                            style={{
                              padding: "8px",
                              borderRadius: "8px",
                              minWidth: "170px"
                            }}
                          >
                            <option value="">Select</option>
                            <option>PIPELINE</option>
                            <option>DOCUMENT LIST SEND</option>
                            <option>DOCUMENT RECIEVED</option>
                            <option>QUERY</option>
                            <option>DEDUPE CHECK</option>
                            <option>DEDUPE DONE</option>
                            <option>LOGIN</option>
                            <option>IN PROGRESS</option>
                            <option>UNDER WRITING</option>
                            <option> PD INITIATE</option>
                            <option>PD DONE</option>
                            <option>TECHNICAL INITIATE</option>
                            <option>TECHNICAL DONE</option>
                            <option>VALUATION INITIATE</option>
                            <option>VALUATION DONE</option>
                            <option>UNDER SANCTION</option>
                            <option>SANCTION</option>
                            <option>DOC KIT ASIGN</option>
                            <option>REJECT</option>
                            <option>DISBURSEMENT</option>
                          </select>
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleEdit(l)}>
                            <EditIcon color="primary" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {/* ATTENDANCE */}
          {activePanel === "attendance" && <Attendance />}

          {/* EMI */}
          {activePanel === "emi" && (
            <Suspense
              fallback={
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "300px"
                  }}
                >
                  <Typography
                    sx={{
                      color: "#38bdf8",
                      fontSize: "22px",
                      fontWeight: "bold",
                      textAlign: "center"
                    }}
                  >
                    Loading EMI Calculator...
                  </Typography>
                </Box>
              }
            >
              <EMI />
            </Suspense>
          )}

        </Box>
      </Box>
    </Box>
  );
}

export default EmployeeDashboard;