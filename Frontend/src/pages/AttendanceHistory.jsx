import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  CircularProgress,
  Button,
  Box,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx-js-style";
import api from "../api";

// --- Helper Functions ---

const parseTime = (timeStr) => {
  if (!timeStr) return null;
  // Handle full ISO string
  let d = new Date(timeStr);
  if (!isNaN(d)) return d;
  // Handle standard HH:mm:ss string
  d = new Date(`1970-01-01T${timeStr}`);
  if (!isNaN(d)) return d;
  return null;
};

const calculateWorkingHours = (punchIn, punchOut) => {
  const inTime = parseTime(punchIn);
  const outTime = parseTime(punchOut);

  if (!inTime || !outTime) return "-";

  const diffMs = outTime - inTime;
  if (diffMs < 0) return "-"; // Safety check for invalid intervals

  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return `${diffHrs}h ${diffMins}m`;
};

const checkLateStatus = (punchIn) => {
  const inTime = parseTime(punchIn);
  if (!inTime) return "-";

  const hours = inTime.getHours();
  const minutes = inTime.getMinutes();

  // 10:00 AM logic
  if (hours > 10 || (hours === 10 && minutes > 0)) {
    return "Late";
  }
  return "On Time";
};

const checkAttendanceStatus = (punchIn) => {
  return punchIn ? "Present" : "Absent";
};

// --- Main Component ---

function AttendanceHistory({ employeeId, role }) {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = async () => {
    try {
      const res = await api.get(
        `attendance/list/?employee_id=${employeeId}&role=${role}`
      );
      setAttendance(res.data);
    } catch (err) {
      console.error("Attendance Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [employeeId, role]);

  const downloadExcel = () => {
    if (attendance.length === 0) {
      alert("No attendance data available.");
      return;
    }

    const headers = [
      "SR",
      "Employee ID",
      "Employee Name",
      "Date",
      "Punch In",
      "Punch Out",
      "Working Hours",
      "Late Status",
      "Attendance Status",
    ];

    const rows = attendance.map((row, index) => [
      index + 1,
      row.employee__employee_id || "-",
      row.employee__first_name || "-",
      row.date || "-",
      row.punch_in || "-",
      row.punch_out || "-",
      calculateWorkingHours(row.punch_in, row.punch_out),
      checkLateStatus(row.punch_in),
      checkAttendanceStatus(row.punch_in),
    ]);

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([]);

    // 1. Add Company Title (Row 1)
    XLSX.utils.sheet_add_aoa(ws, [["Company Attendance Report"]], { origin: "A1" });
    
    // 2. Add Headers (Row 2)
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A2" });
    
    // 3. Add Data (Row 3 onwards)
    XLSX.utils.sheet_add_aoa(ws, rows, { origin: "A3" });

    // --- Styling Options ---
    
    // Merge Title cells
    ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }];
    
    // Format Title
    if (ws["A1"]) {
      ws["A1"].s = {
        font: { bold: true, sz: 14 },
        alignment: { horizontal: "center", vertical: "center" },
      };
    }

    // Freeze Headers (top 2 rows)
    ws["!freeze"] = { ySplit: 2, topLeftCell: "A3", activePane: "bottomRight", state: "frozen" };

    // Apply borders and center alignment to all data cells
    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let R = 1; R <= range.e.r; ++R) { // Start from R=1 (Row 2)
      for (let C = 0; C <= range.e.c; ++C) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cellRef]) ws[cellRef] = { t: "s", v: "" };
        
        ws[cellRef].s = {
          alignment: { horizontal: "center", vertical: "center" },
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          },
        };

        // Bold Headers
        if (R === 1) {
          ws[cellRef].s.font = { bold: true };
          ws[cellRef].s.fill = { fgColor: { rgb: "F0F0F0" } };
        }
      }
    }

    // Auto-adjust column widths
    ws["!cols"] = [
      { wch: 5 },  // SR
      { wch: 15 }, // Emp ID
      { wch: 20 }, // Emp Name
      { wch: 12 }, // Date
      { wch: 12 }, // Punch In
      { wch: 12 }, // Punch Out
      { wch: 15 }, // Work Hours
      { wch: 12 }, // Late Status
      { wch: 18 }, // Attendance Status
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    XLSX.writeFile(wb, "Attendance_Report.xlsx");
  };

  return (
    <Paper sx={{ mt: 3, p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Attendance History
        </Typography>

        <Button
          variant="contained"
          color="success"
          startIcon={<DownloadIcon />}
          onClick={downloadExcel}
        >
          Download Attendance
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ textAlign: "center", py: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>SR</b></TableCell>

                {role === "manager" && (
                  <>
                    <TableCell><b>Employee ID</b></TableCell>
                    <TableCell><b>Employee Name</b></TableCell>
                  </>
                )}

                <TableCell><b>Date</b></TableCell>
                <TableCell><b>Punch In</b></TableCell>
                <TableCell><b>Punch Out</b></TableCell>
                <TableCell><b>Working Hours</b></TableCell>
                <TableCell><b>Late Status</b></TableCell>
                <TableCell><b>Attendance Status</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {attendance.length > 0 ? (
                attendance.map((row, index) => (
                  <TableRow key={row.id || index}>
                    <TableCell>{index + 1}</TableCell>

                    {role === "manager" && (
                      <>
                        <TableCell>{row.employee__employee_id || "-"}</TableCell>
                        <TableCell>{row.employee__first_name || "-"}</TableCell>
                      </>
                    )}

                    <TableCell>{row.date || "-"}</TableCell>
                    <TableCell>{row.punch_in || "-"}</TableCell>
                    <TableCell>{row.punch_out || "-"}</TableCell>
                    <TableCell>{calculateWorkingHours(row.punch_in, row.punch_out)}</TableCell>
                    <TableCell>{checkLateStatus(row.punch_in)}</TableCell>
                    <TableCell>{checkAttendanceStatus(row.punch_in)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={role === "manager" ? 11 : 9}
                    align="center"
                  >
                    No Attendance Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}

export default AttendanceHistory;