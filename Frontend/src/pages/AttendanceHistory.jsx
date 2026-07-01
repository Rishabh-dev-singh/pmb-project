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
import api from "../api";

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

  const downloadCSV = () => {
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
      "Lunch Start",
      "Lunch End",
      "Punch Out",
    ];

    const rows = attendance.map((row, index) => [
      index + 1,
      row.employee__employee_id || "",
      row.employee__first_name || "",
      row.date || "",
      row.punch_in || "-",
      row.lunch_start || "-",
      row.lunch_end || "-",
      row.punch_out || "-",
    ]);

    const csv =
      "\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Attendance_Report.csv";
    link.click();
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
          onClick={downloadCSV}
        >
          Download Excel
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
                <TableCell><b>Lunch Start</b></TableCell>
                <TableCell><b>Lunch End</b></TableCell>
                <TableCell><b>Punch Out</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {attendance.length > 0 ? (
                attendance.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell>{index + 1}</TableCell>

                    {role === "manager" && (
                      <>
                        <TableCell>{row.employee__employee_id}</TableCell>
                        <TableCell>{row.employee__first_name}</TableCell>
                      </>
                    )}

                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.punch_in || "-"}</TableCell>
                    <TableCell>{row.lunch_start || "-"}</TableCell>
                    <TableCell>{row.lunch_end || "-"}</TableCell>
                    <TableCell>{row.punch_out || "-"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={role === "manager" ? 8 : 6}
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