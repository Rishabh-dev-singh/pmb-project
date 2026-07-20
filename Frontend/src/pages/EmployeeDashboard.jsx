import React, { useState, useEffect, Suspense } from "react";
import {
  Box, Grid, Paper, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText,
  TextField, CssBaseline, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, IconButton, Button, Avatar, Menu, MenuItem, Divider, useMediaQuery,
  useTheme, ThemeProvider, createTheme, Dialog, DialogTitle, DialogContent,
  DialogActions, Tooltip, Select, FormControl, Chip
} from "@mui/material";

import {
  Dashboard as DashIcon, Assignment, AssignmentTurnedIn, Calculate, AddCircle,
  ListAlt, Edit as EditIcon, Logout as LogoutIcon, Menu as MenuIcon,
  MenuOpen as MenuOpenIcon, DarkMode, LightMode, AccountCircle
} from "@mui/icons-material";

import { useNavigate, useLocation } from "react-router-dom";
import jsPDF from "jspdf";

import Attendance from "./Attendance";
import AttendanceHistory from "./AttendanceHistory";
import api from "../api"; 

const EMI = React.lazy(() => import("./EMI"));

function EmployeeDashboard() {
  const [activePanel, setActivePanel] = useState("overview");
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  
  // FILTERS
  const [filterEmployee, setFilterEmployee] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [empMap, setEmpMap] = useState({});

  // PRODUCTIVITY STATE
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [productivityList, setProductivityList] = useState([]); 
  const [productivity, setProductivity] = useState({
    total_calls: '', connected_calls: '', interested_customers: '', followup_customers: '', remark: ''
  });

  // LABOUR REQUIREMENTS STATE
  const [labourRequirements, setLabourRequirements] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // USER ROLE & DATA STATE
  const [employeeData, setEmployeeData] = useState({
    name: "Loading...", id: "", designation: "", department: "", role: "employee" 
  });

  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // THEME SETUP
  const appTheme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      background: {
        default: darkMode ? "#0b0f19" : "#f4f6f8",
        paper: darkMode ? "#1e293b" : "#ffffff",
      },
      text: {
        primary: darkMode ? "#f8fafc" : "#111827",
        secondary: darkMode ? "#94a3b8" : "#6b7280",
      }
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    }
  });

  const card = {
    p: { xs: 2, md: 3 },
    borderRadius: "16px",
    background: darkMode ? "#1e293b" : "#ffffff",
    boxShadow: darkMode ? "0 4px 6px -1px rgba(0,0,0,0.5)" : "0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.025)",
    border: darkMode ? "1px solid #334155" : "1px solid #e5e7eb"
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        const profileRes = await api.get('profile/');
        const userData = profileRes.data;
        
        const superUsers = ["3800", "3801", "3802", "3803"];
        const userRole = superUsers.includes(String(userData.id)) ? "manager" : "employee";

        setEmployeeData({
          name: userData.name || "Employee", 
          id: userData.id || "N/A", 
          designation: userData.designation || "N/A", 
          department: userData.department || "N/A", 
          role: userRole 
        });

        const empRes = await api.get('employees/');
        const map = {};
        empRes.data.forEach((emp) => { map[emp.employee_id] = emp.first_name; });
        setEmpMap(map);

        fetchLeads(userData.id);
        fetchProductivity(userData.id, userRole); 
        fetchLabourRequirements(); // Dashboard load hote hi fetch karlo

      } catch (err) {
        console.error("Authentication Error:", err);
        navigate("/employee-login"); 
      }
    };
    initializeDashboard();
  }, [navigate]);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  
  const handleLogout = async () => {
    try { await api.post('logout/'); } catch (e) { console.error("Logout Error:", e); }
    navigate("/");
  };

  const fetchLeads = async (empId = employeeData.id) => {
    if (!empId) return;
    const superUsers = ["3800", "3801", "3802", "3803"];
    let url = superUsers.includes(empId) ? "leads/?role=manager" : `leads/?owner=${encodeURIComponent(empId)}&role=employee`;
    try {
      const res = await api.get(url);
      setLeads(res.data);
    } catch (err) { console.error("Failed To Fetch Leads:", err); }
  };

  const fetchProductivity = async (empId = employeeData.id, role = employeeData.role) => {
    if (!empId) return;
    try {
      const res = await api.get(`productivity/?employee_id=${encodeURIComponent(empId)}&role=${role}`);
      setProductivityList(res.data);
    } catch (err) { console.error("Failed To Fetch Productivity:", err); }
  };

  const fetchLabourRequirements = async () => {
    try {
      const res = await api.get('submit-requirement/');
      console.log("Labour API Data:", res.data);
      setLabourRequirements(res.data);
    } catch (err) {
      console.error("Failed To Fetch Labour Requirements:", err);
    }
  };

  useEffect(() => {
    if (location.state?.refresh) { 
      fetchLeads(); 
      fetchProductivity(); 
      fetchLabourRequirements();
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

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "-";
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  };

  const updateStatus = async (lead, newStatus) => {
    if (!newStatus) return;
    if (!window.confirm(`Progress change kare?\n\nFrom: ${lead.progress}\nTo: ${newStatus}`)) return;
    try {
      const res = await api.put(`leads/${lead.id}/update/`, { progress: newStatus, updated_by: employeeData.name, updated_at: new Date().toISOString() });
      if (res.status === 200 || res.status === 201) {
        alert("✅ Progress updated");
        setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, progress: newStatus } : l)));
      } else alert("❌ Update failed");
    } catch (err) { alert("❌ Server error"); }
  };

  const updateLabourStatus = async (reqId, newStatus) => {
    if (!newStatus) return;
    if (!window.confirm(`Is requirement ka status '${newStatus}' update karein?`)) return;

    try {
      const res = await api.patch(`submit-requirement/${reqId}/`, {
        status: newStatus,
        accepted_by: employeeData.name 
      });

      if (res.status === 200 || res.status === 204 || res.status === 201) {
        fetchLabourRequirements(); 
      } else {
        alert("❌ Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server error");
    }
  };

  const getLabourStatusColor = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "accepted") return { bg: "#e0f2fe", text: "#0369a1", border: "#bae6fd" };
    if (s === "request completed") return { bg: "#dcfce7", text: "#15803d", border: "#bbf7d0" };
    if (s === "payment accepted") return { bg: "#f3e8ff", text: "#7e22ce", border: "#e9d5ff" };
    return { bg: "#fef9c3", text: "#a16207", border: "#fef08a" };
  };

  const handleEdit = (lead) => navigate("/add-lead", { state: { lead } });

  const handleProductivitySubmit = async () => {
    if (!productivity.total_calls) return alert("Please enter Total Calls.");
    try {
      const payload = { ...productivity, employee_id: employeeData.id };
      const res = await api.post('productivity/', payload);
      if (res.status === 200 || res.status === 201) {
        alert("✅ Productivity Saved successfully!");
        fetchProductivity(); 
        setProductivity({ total_calls: '', connected_calls: '', interested_customers: '', followup_customers: '', remark: '' });
        setOpenUpdateDialog(false);
      } else alert("❌ Failed to save record.");
    } catch (err) { alert("❌ Server error while saving productivity."); }
  };

  const filteredLeads = leads.filter((l) => {
    const matchesSearch = l.fullName?.toLowerCase().includes(search.toLowerCase()) || l.mobile?.includes(search);
    const matchesEmployee = filterEmployee ? l.owner === filterEmployee : true;
    const matchesStatus = filterStatus ? l.progress === filterStatus : true;
    return matchesSearch && matchesEmployee && matchesStatus;
  });  

  const downloadExcel = () => {
    const headers = ["SR", "Customer Name", "Contact", "Loan Amount", "Created By", "Bank Name", "RM Name", "Status", "Lead Date"];
    const rows = filteredLeads.map((l, i) => {
      const creatorName = empMap[l.owner] ? ` (${empMap[l.owner]})` : "";
      return [i + 1, `"${l.fullName || ""}"`, `"${l.mobile || ""}"`, `"${formatAmount(l.requiredLoanAmount) || ""}"`, `"${l.owner || ""}${creatorName}"`, `"${l.bankName || "-"}"`, `"${l.rmName || "-"}"`, `"${l.progress || ""}"`, `"${formatDate(l.created_at)}"`];
    });
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "leads_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const menuItems = [
    { text: "Overview", icon: <DashIcon />, id: "overview" },
    { text: "Leads", icon: <ListAlt />, id: "leads" },
    { text: "Labour Reqs", icon: <Assignment />, id: "labour_reqs" }, 
    { text: "Productivity", icon: <AssignmentTurnedIn />, id: "productivity" },
    { text: "Attendance", icon: <Assignment />, id: "attendance" },
    { text: "EMI", icon: <Calculate />, id: "emi" }
  ];

  const sidebarWidth = sidebarOpen ? 260 : 75;

  return (
    <ThemeProvider theme={appTheme}>
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
        <CssBaseline />

        {/* SIDEBAR */}
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={() => setMobileOpen(false)}
          sx={{
            width: isMobile ? 260 : sidebarWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: isMobile ? 260 : sidebarWidth,
              boxSizing: "border-box",
              bgcolor: "#0f172a",
              color: "#f8fafc",
              borderRight: "1px solid rgba(255,255,255,0.08)",
              overflowX: "hidden"
            }
          }}
        >
          <Box sx={{ p: 3, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "72px" }}>
            {sidebarOpen ? (
              <Typography sx={{ color: "#38bdf8", fontWeight: "800", letterSpacing: "1px", fontSize: "18px" }}>
                PMB ENTERPRISE
              </Typography>
            ) : (
              <Typography sx={{ color: "#38bdf8", fontWeight: "bold", fontSize: "22px" }}>P</Typography>
            )}
          </Box>
          <Divider sx={{ bgcolor: "rgba(255,255,255,0.08)", mb: 2 }} />

          <List sx={{ px: 1.5 }}>
            {menuItems.map((item) => (
              <ListItem
                key={item.id}
                onClick={() => {
                  if (item.id === "labour_reqs") {
                    const allowedIds = ["3801", "3803", "3810", "3812"]; 
                    if (!allowedIds.includes(String(employeeData.id))) {
                      alert("YOU HAVE NOT ACCESS PLEASE CONTACT IT DEPARTMENT");
                      return; 
                    }
                    fetchLabourRequirements();
                  }
                  setActivePanel(item.id);
                  if (item.id === "leads") fetchLeads();
                  if (item.id === "productivity") fetchProductivity();
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  cursor: "pointer", mb: 1, borderRadius: "10px", transition: "all 0.2s",
                  justifyContent: sidebarOpen ? "flex-start" : "center",
                  bgcolor: activePanel === item.id ? "rgba(56,189,248,0.15)" : "transparent",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.05)" }
                }}
              >
                <ListItemIcon sx={{ color: activePanel === item.id ? "#38bdf8" : "#94a3b8", minWidth: sidebarOpen ? "42px" : "auto", justifyContent: "center" }}>
                  {item.icon}
                </ListItemIcon>
                {sidebarOpen && (
                  <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: "14px", fontWeight: activePanel === item.id ? "600" : "500" }} />
                )}
              </ListItem>
            ))}
          </List>
        </Drawer>

        {/* MAIN CONTAINER */}
        <Box sx={{ flexGrow: 1, width: `calc(100% - ${sidebarWidth}px)`, height: "100vh", overflowY: "auto" }}>
          
          {/* HEADER */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: { xs: 1.5, md: 2.5 }, bgcolor: "background.paper", boxShadow: 1, position: "sticky", top: 0, zIndex: 1100 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton onClick={() => isMobile ? setMobileOpen(true) : setSidebarOpen(!sidebarOpen)} sx={{ color: "text.primary" }}>
                {sidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
              </IconButton>
              <Typography sx={{ ml: 2, fontWeight: "700", fontSize: "18px", display: { xs: "none", sm: "block" } }}>
                Welcome, {employeeData.name}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button variant="contained" onClick={() => setOpenUpdateDialog(true)} sx={{ borderRadius: "8px", textTransform: "none", background: "#6366f1", "&:hover": { background: "#4f46e5" }, display: { xs: "none", sm: "flex" }, fontWeight: "600" }}>
                + Update Productivity
              </Button>
              <IconButton onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? <LightMode sx={{ color: "#fbbf24" }} /> : <DarkMode sx={{ color: "#3b82f6" }} />}
              </IconButton>
              <Avatar onClick={handleMenuClick} sx={{ bgcolor: "#38bdf8", cursor: "pointer", fontWeight: "bold" }}>
                {employeeData.name.charAt(0).toUpperCase()}
              </Avatar>
            </Box>
            
            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
              <Box sx={{ px: 2, py: 1.5, minWidth: "200px" }}>
                <Typography fontWeight="700">{employeeData.name}</Typography>
                <Typography variant="body2" color="text.secondary">{employeeData.designation}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="caption" display="block">ID: {employeeData.id}</Typography>
                <Typography variant="caption" display="block">Dept: {employeeData.department}</Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: "#ef4444", fontWeight: "600" }}>
                <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} /> Sign Out
              </MenuItem>
            </Menu>
          </Box>

          {/* DYNAMIC PANELS RENDERING */}
          <Box sx={{ p: { xs: 2, md: 4 } }}>
            
            {/* 1. OVERVIEW */}
            {activePanel === "overview" && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <Paper sx={{ ...card, minHeight: "120px", display: "flex", flexDirection: "column", gap: 1, justifyContent: "center", alignItems: "center", cursor: "pointer", textAlign: "center" }} onClick={() => navigate("/add-lead")}>
                    <AddCircle sx={{ fontSize: 50, color: "#38bdf8" }} />
                    <Typography fontWeight="bold">Add New Lead</Typography>
                  </Paper>
                </Grid>
              </Grid>
            )}

            {/* 2. LEADS */}
            {activePanel === "leads" && (
              <Paper sx={card}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>Lead Tracker</Typography>
                <Box sx={{ display: "flex", gap: 2, mb: 2, flexDirection: { xs: "column", sm: "row" } }}>
                  <Button variant="contained" onClick={downloadExcel} sx={{ background: "#16a34a", "&:hover": { background: "#15803d" } }}>
                    Download Your Lead
                  </Button>
                </Box>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, mb: 2 }}>
                  <TextField label="Search by name or mobile" fullWidth value={search} onChange={(e) => setSearch(e.target.value)} />
                  <TextField select label="Filter by Status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} sx={{ minWidth: '200px' }}>
                    <MenuItem value="">All Status</MenuItem>
                    <MenuItem value="PIPELINE">PIPELINE</MenuItem>
                    <MenuItem value="LOGIN">LOGIN</MenuItem>
                    <MenuItem value="SANCTION">SANCTION</MenuItem>
                    <MenuItem value="DISBURSEMENT">DISBURSEMENT</MenuItem>
                    <MenuItem value="REJECT">REJECT</MenuItem>
                  </TextField>
                </Box>
                <TableContainer>
                  <Table sx={{ minWidth: 1000 }}>
                    <TableHead>
                      <TableRow>
                        {["SR", "Customer Name", "Contact", "Loan Amount", "Created By", "Bank Name", "Status", "Lead Date", "Edit"].map((h) => (
                          <TableCell key={h} sx={{ fontWeight: "bold" }}>{h}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredLeads.map((l, i) => (
                        <TableRow key={l.id}>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell>{l.fullName}</TableCell>
                          <TableCell>{l.mobile}</TableCell>
                          <TableCell>{formatAmount(l.requiredLoanAmount)}</TableCell>
                          <TableCell>{l.owner}</TableCell>
                          <TableCell>{l.bankName || "-"}</TableCell>
                          <TableCell>
                            <select value={l.progress || ""} onChange={(e) => updateStatus(l, e.target.value)} style={{ padding: "6px", borderRadius: "6px" }}>
                              <option value="">Select</option>
                              <option>PIPELINE</option><option>LOGIN</option><option>SANCTION</option><option>DISBURSEMENT</option><option>REJECT</option>
                            </select>
                          </TableCell>
                          <TableCell>{formatDate(l.created_at)}</TableCell>
                          <TableCell><IconButton onClick={() => handleEdit(l)}><EditIcon color="primary" /></IconButton></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}

            {/* 3. LABOUR REQS */}
            {activePanel === "labour_reqs" && (
              <Paper sx={card}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Assignment color="primary" /> Enterprise Labour Requirements
                </Typography>

                {labourRequirements.length === 0 ? (
                  <Typography sx={{ color: "text.secondary", textAlign: "center", py: 5 }}>
                    Abhi tak koi labour requirement available nahi hai.
                  </Typography>
                ) : (
                  <TableContainer>
                    <Table sx={{ minWidth: 900 }}>
                      <TableHead sx={{ bgcolor: darkMode ? "#334155" : "#f1f5f9" }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>SR</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Company Name</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Full Name</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Required Role</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Headcount</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Deployment Date</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Handled By</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Status Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {labourRequirements.map((req, index) => {
                          const statusStyle = getLabourStatusColor(req.status);
                          return (
                            <TableRow key={req.id} hover>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell sx={{ fontWeight: "600" }}>{req.company_name || req.companyName || "N/A"}</TableCell>
                              <TableCell>{req.full_name || req.fullName || "N/A"}</TableCell>
                              <TableCell><Chip label={req.required_role || req.requiredRole || "-"} size="small" /></TableCell>
                              <TableCell>{req.headcount || "0"}</TableCell>
                              <TableCell>{req.deployment_date || req.deploymentDate || "-"}</TableCell>
                              
                              <TableCell>
                                <Typography sx={{ fontSize: "13px", fontWeight: "600", color: req.accepted_by ? "#10b981" : "text.secondary" }}>
                                  {req.accepted_by || "Unassigned"}
                                </Typography>
                              </TableCell>

                              <TableCell>
                                <FormControl size="small" sx={{ minWidth: 160 }}>
                                  <Select
                                    value={req.status || "Pending"}
                                    onChange={(e) => updateLabourStatus(req.id, e.target.value)}
                                    sx={{
                                      bgcolor: statusStyle.bg,
                                      color: statusStyle.text,
                                      fontWeight: "600",
                                      fontSize: "13px",
                                      borderRadius: "8px",
                                    }}
                                  >
                                    <MenuItem value="Pending">Pending</MenuItem>
                                    <MenuItem value="Accepted">Accepted</MenuItem>
                                    <MenuItem value="Request Completed">Request Completed</MenuItem>
                                    <MenuItem value="Payment Accepted">Payment Accepted</MenuItem>
                                  </Select>
                                </FormControl>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>
            )}

            {/* 4. PRODUCTIVITY */}
            {activePanel === "productivity" && (
              <Paper sx={card}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>Daily Productivity Logs</Typography>
                {productivityList.length === 0 ? (
                   <Typography sx={{ color: "text.secondary", textAlign: "center", py: 5 }}>No productivity logs found.</Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead sx={{ bgcolor: darkMode ? "#334155" : "#f1f5f9" }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>SR</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                          <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Total Calls</TableCell>
                          <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Connected</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Interested Customers</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Remark</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {productivityList.map((row, index) => (
                          <TableRow key={row.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{row.date}</TableCell>
                            <TableCell align="center">{row.total_calls}</TableCell>
                            <TableCell align="center">{row.connected_calls}</TableCell>
                            <TableCell>{row.interested_customers || "-"}</TableCell>
                            <TableCell>{row.remark || "-"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>
            )}

            {/* 5. ATTENDANCE */}
            {activePanel === "attendance" && (
              <>
                <Attendance employeeId={employeeData.id} />
                <AttendanceHistory employeeId={employeeData.id} role={employeeData.role} />
              </>
            )}

            {/* 6. EMI */}
            {activePanel === "emi" && (
              <Suspense fallback={<Typography sx={{ textAlign: "center", py: 5 }}>Loading EMI Calculator...</Typography>}>
                <EMI />
              </Suspense>
            )}

          </Box>
        </Box>

        {/* PRODUCTIVITY DIALOG */}
        <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)} fullWidth maxWidth="md">
          <DialogTitle sx={{ fontWeight: "bold" }}>Update Daily Productivity</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Total Calls" type="number" value={productivity.total_calls} onChange={(e) => setProductivity({...productivity, total_calls: e.target.value})} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Connected Calls" type="number" value={productivity.connected_calls} onChange={(e) => setProductivity({...productivity, connected_calls: e.target.value})} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Interested Customers" multiline rows={3} value={productivity.interested_customers} onChange={(e) => setProductivity({...productivity, interested_customers: e.target.value})} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Remarks" multiline rows={2} value={productivity.remark} onChange={(e) => setProductivity({...productivity, remark: e.target.value})} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenUpdateDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleProductivitySubmit} sx={{ background: "#6366f1" }}>Submit</Button>
          </DialogActions>
        </Dialog>

      </Box>
    </ThemeProvider>
  ); 
}

export default EmployeeDashboard;