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
  TextField,
  MenuItem,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx-js-style";
import api from "../api";

// --- Helper Functions ---

const parseTime = (timeStr) => {
  if (!timeStr) return null;

  let d = new Date(timeStr);
  if (!isNaN(d)) return d;

  d = new Date(`1970-01-01T${timeStr}`);
  if (!isNaN(d)) return d;

  return null;
};

const calculateWorkingHours = (
  punchIn,
  punchOut,
  lunchStart,
  lunchEnd
) => {
  const inTime = parseTime(punchIn);
  const outTime = parseTime(punchOut);

  if (!inTime || !outTime) return "-";

  let diffMs = outTime - inTime;

  if (diffMs < 0) return "-";

  // Lunch time minus only when both lunch punches exist
  const lunchIn = parseTime(lunchStart);
  const lunchOut = parseTime(lunchEnd);

  if (lunchIn && lunchOut) {
    const lunchDiff = lunchOut - lunchIn;

    if (lunchDiff >= 0) {
      diffMs = Math.max(0, diffMs - lunchDiff);
    }
  }

  const diffHrs = Math.floor(
    diffMs / (1000 * 60 * 60)
  );

  const diffMins = Math.floor(
    (diffMs % (1000 * 60 * 60)) / (1000 * 60)
  );

  return `${diffHrs}h ${diffMins}m`;
};

const checkLateStatus = (punchIn) => {
  const inTime = parseTime(punchIn);

  if (!inTime) return "-";

  const hours = inTime.getHours();
  const minutes = inTime.getMinutes();
  const seconds = inTime.getSeconds();

  // 10:10 AM cutoff
  if (
    hours > 10 ||
    (
      hours === 10 &&
      (
        minutes > 10 ||
        (minutes === 10 && seconds > 0)
      )
    )
  ) {
    return "Late";
  }

  return "On Time";
};

const checkAttendanceStatus = (
  punchIn,
  punchOut,
  lunchStart,
  lunchEnd,
  backendStatus
) => {
  // Backend status is preferred
  if (backendStatus) {
    return backendStatus;
  }

  // No Punch In OR no Punch Out = Absent
  if (!punchIn || !punchOut) {
    return "Absent";
  }

  const inTime = parseTime(punchIn);
  const outTime = parseTime(punchOut);

  if (!inTime || !outTime) {
    return "Absent";
  }

  let diffMs = outTime - inTime;

  if (diffMs < 0) {
    return "Absent";
  }

  // Lunch minus
  const lunchIn = parseTime(lunchStart);
  const lunchOut = parseTime(lunchEnd);

  if (lunchIn && lunchOut) {
    const lunchDiff = lunchOut - lunchIn;

    if (lunchDiff >= 0) {
      diffMs = Math.max(
        0,
        diffMs - lunchDiff
      );
    }
  }

  const totalMinutes = Math.floor(
    diffMs / (1000 * 60)
  );

  // 10:10 AM ke baad Punch In
  const inHour = inTime.getHours();
  const inMinute = inTime.getMinutes();
  const inSecond = inTime.getSeconds();

  const isLate =
    inHour > 10 ||
    (
      inHour === 10 &&
      (
        inMinute > 10 ||
        (inMinute === 10 && inSecond > 0)
      )
    );

  // Late OR less than 8 hours = Half Day
  if (isLate || totalMinutes < 480) {
    return "Half Day";
  }

  return "Present";
};

const getMonthName = (dateValue) => {
  if (!dateValue) return "-";

  const parts = String(dateValue).split("-");

  if (parts.length >= 2) {
    const monthIndex =
      Number(parts[1]) - 1;

    if (
      monthIndex >= 0 &&
      monthIndex < 12
    ) {
      return new Date(
        2000,
        monthIndex,
        1
      ).toLocaleString("en-US", {
        month: "long",
      });
    }
  }

  const d = new Date(dateValue);

  if (!isNaN(d)) {
    return d.toLocaleString("en-US", {
      month: "long",
    });
  }

  return "-";
};

// --- Main Component ---

function AttendanceHistory({
  employeeId,
  role,
}) {
  const [attendance, setAttendance] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // Filters
  const [nameFilter, setNameFilter] =
    useState("");

  const [dateFilter, setDateFilter] =
    useState("");

  const [monthFilter, setMonthFilter] =
    useState("");

  const fetchAttendance = async () => {
    try {
      const res = await api.get(
        `attendance/list/?employee_id=${employeeId}&role=${role}`
      );

      setAttendance(res.data);
    } catch (err) {
      console.error(
        "Attendance Fetch Error:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [employeeId, role]);

  // Unique employee names
  const employeeNames = [
    ...new Set(
      attendance
        .map(
          (row) =>
            row.employee__first_name
        )
        .filter(Boolean)
    ),
  ].sort((a, b) =>
    a.localeCompare(b)
  );

  // -----------------------------------------
  // FILTERED ATTENDANCE
  // -----------------------------------------

  const filteredAttendance =
    attendance.filter((row) => {
      const rowName =
        (
          row.employee__first_name ||
          ""
        ).toLowerCase();

      const rowDate =
        row.date || "";

      const rowMonth =
        getMonthName(row.date);

      const nameMatch =
        !nameFilter ||
        rowName ===
          nameFilter.toLowerCase();

      const dateMatch =
        !dateFilter ||
        rowDate === dateFilter;

      const monthMatch =
        !monthFilter ||
        rowMonth === monthFilter;

      return (
        nameMatch &&
        dateMatch &&
        monthMatch
      );
    });

  // -----------------------------------------
  // DOWNLOAD EXCEL
  // -----------------------------------------

  const downloadExcel = () => {
    if (
      filteredAttendance.length === 0
    ) {
      alert(
        "No attendance data available for the selected filters."
      );

      return;
    }

    const headers = [
      "SR",
      "Employee ID",
      "Employee Name",
      "Date",
      "Month",
      "Punch In",
      "Punch Out",
      "Working Hours",
      "Late Status",
      "Attendance Status",
    ];

    // IMPORTANT:
    // Only currently filtered rows will be downloaded.
    const rows =
      filteredAttendance.map(
        (row, index) => [
          index + 1,

          row.employee__employee_id ||
            "-",

          row.employee__first_name ||
            "-",

          row.date || "-",

          row.month ||
            getMonthName(row.date),

          row.punch_in || "-",

          row.punch_out || "-",

          row.working_hours ||
            calculateWorkingHours(
              row.punch_in,
              row.punch_out,
              row.lunch_start,
              row.lunch_end
            ),

          row.late_status ||
            checkLateStatus(
              row.punch_in
            ),

          row.attendance_status ||
            checkAttendanceStatus(
              row.punch_in,
              row.punch_out,
              row.lunch_start,
              row.lunch_end
            ),
        ]
      );

    // Create workbook
    const wb =
      XLSX.utils.book_new();

    const ws =
      XLSX.utils.aoa_to_sheet([]);

    // Company title
    XLSX.utils.sheet_add_aoa(
      ws,
      [["Company Attendance Report"]],
      {
        origin: "A1",
      }
    );

    // Headers
    XLSX.utils.sheet_add_aoa(
      ws,
      [headers],
      {
        origin: "A2",
      }
    );

    // Filtered data
    XLSX.utils.sheet_add_aoa(
      ws,
      rows,
      {
        origin: "A3",
      }
    );

    // Merge title
    ws["!merges"] = [
      {
        s: {
          r: 0,
          c: 0,
        },
        e: {
          r: 0,
          c: headers.length - 1,
        },
      },
    ];

    // Title styling
    if (ws["A1"]) {
      ws["A1"].s = {
        font: {
          bold: true,
          sz: 14,
        },

        alignment: {
          horizontal: "center",
          vertical: "center",
        },
      };
    }

    // Freeze headers
    ws["!freeze"] = {
      ySplit: 2,
      topLeftCell: "A3",
      activePane: "bottomRight",
      state: "frozen",
    };

    // Borders + alignment
    const range =
      XLSX.utils.decode_range(
        ws["!ref"]
      );

    for (
      let R = 1;
      R <= range.e.r;
      ++R
    ) {
      for (
        let C = 0;
        C <= range.e.c;
        ++C
      ) {
        const cellRef =
          XLSX.utils.encode_cell({
            r: R,
            c: C,
          });

        if (!ws[cellRef]) {
          ws[cellRef] = {
            t: "s",
            v: "",
          };
        }

        ws[cellRef].s = {
          alignment: {
            horizontal: "center",
            vertical: "center",
          },

          border: {
            top: {
              style: "thin",
            },

            bottom: {
              style: "thin",
            },

            left: {
              style: "thin",
            },

            right: {
              style: "thin",
            },
          },
        };

        // Header bold
        if (R === 1) {
          ws[cellRef].s.font = {
            bold: true,
          };

          ws[cellRef].s.fill = {
            fgColor: {
              rgb: "F0F0F0",
            },
          };
        }
      }
    }

    // Column widths
    ws["!cols"] = [
      { wch: 5 },
      { wch: 15 },
      { wch: 20 },
      { wch: 12 },
      { wch: 14 },
      { wch: 12 },
      { wch: 12 },
      { wch: 15 },
      { wch: 12 },
      { wch: 18 },
    ];

    XLSX.utils.book_append_sheet(
      wb,
      ws,
      "Attendance"
    );

    XLSX.writeFile(
      wb,
      "Attendance_Report.xlsx"
    );
  };

  return (
    <Paper
      sx={{
        mt: 3,
        p: 3,
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent:
            "space-between",
          mb: 2,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
        >
          Attendance History
        </Typography>

        <Button
          variant="contained"
          color="success"
          startIcon={
            <DownloadIcon />
          }
          onClick={
            downloadExcel
          }
        >
          Download Attendance
        </Button>
      </Box>

      {/* -------------------------------- */}
      {/* FILTERS */}
      {/* -------------------------------- */}

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          mb: 2,
          alignItems: "center",
        }}
      >
        {/* NAME FILTER */}

        <TextField
          select
          label="Employee Name"
          value={nameFilter}
          onChange={(e) =>
            setNameFilter(
              e.target.value
            )
          }
          size="small"
          sx={{
            minWidth: 210,
          }}
        >
          <MenuItem value="">
            All Employees
          </MenuItem>

          {employeeNames.map(
            (name) => (
              <MenuItem
                key={name}
                value={name}
              >
                {name}
              </MenuItem>
            )
          )}
        </TextField>

        {/* DATE FILTER */}

        <TextField
          label="Date"
          type="date"
          value={dateFilter}
          onChange={(e) =>
            setDateFilter(
              e.target.value
            )
          }
          size="small"
          InputLabelProps={{
            shrink: true,
          }}
          sx={{
            minWidth: 170,
          }}
        />

        {/* MONTH FILTER */}

        <TextField
          select
          label="Month"
          value={monthFilter}
          onChange={(e) =>
            setMonthFilter(
              e.target.value
            )
          }
          size="small"
          sx={{
            minWidth: 170,
          }}
        >
          <MenuItem value="">
            All Months
          </MenuItem>

          {[
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].map(
            (month) => (
              <MenuItem
                key={month}
                value={month}
              >
                {month}
              </MenuItem>
            )
          )}
        </TextField>

        {/* CLEAR FILTERS */}

        {(
          nameFilter ||
          dateFilter ||
          monthFilter
        ) && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setNameFilter("");
              setDateFilter("");
              setMonthFilter("");
            }}
          >
            Clear Filters
          </Button>
        )}
      </Box>

      {/* -------------------------------- */}
      {/* TABLE */}
      {/* -------------------------------- */}

      {loading ? (
        <Box
          sx={{
            textAlign: "center",
            py: 5,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>SR</b>
                </TableCell>

                {role ===
                  "manager" && (
                  <>
                    <TableCell>
                      <b>
                        Employee ID
                      </b>
                    </TableCell>

                    <TableCell>
                      <b>
                        Employee Name
                      </b>
                    </TableCell>
                  </>
                )}

                <TableCell>
                  <b>Date</b>
                </TableCell>

                {/* NEW MONTH COLUMN */}

                <TableCell>
                  <b>Month</b>
                </TableCell>

                <TableCell>
                  <b>
                    Punch In
                  </b>
                </TableCell>

                <TableCell>
                  <b>
                    Punch Out
                  </b>
                </TableCell>

                <TableCell>
                  <b>
                    Working Hours
                  </b>
                </TableCell>

                <TableCell>
                  <b>
                    Late Status
                  </b>
                </TableCell>

                <TableCell>
                  <b>
                    Attendance Status
                  </b>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredAttendance.length >
              0 ? (
                filteredAttendance.map(
                  (row, index) => (
                    <TableRow
                      key={
                        row.id ||
                        index
                      }
                    >
                      <TableCell>
                        {index + 1}
                      </TableCell>

                      {role ===
                        "manager" && (
                        <>
                          <TableCell>
                            {row.employee__employee_id ||
                              "-"}
                          </TableCell>

                          <TableCell>
                            {row.employee__first_name ||
                              "-"}
                          </TableCell>
                        </>
                      )}

                      <TableCell>
                        {row.date ||
                          "-"}
                      </TableCell>

                      {/* MONTH */}

                      <TableCell>
                        {row.month ||
                          getMonthName(
                            row.date
                          )}
                      </TableCell>

                      <TableCell>
                        {row.punch_in ||
                          "-"}
                      </TableCell>

                      <TableCell>
                        {row.punch_out ||
                          "-"}
                      </TableCell>

                      <TableCell>
                        {row.working_hours ||
                          calculateWorkingHours(
                            row.punch_in,
                            row.punch_out,
                            row.lunch_start,
                            row.lunch_end
                          )}
                      </TableCell>

                      <TableCell>
                        {row.late_status ||
                          checkLateStatus(
                            row.punch_in
                          )}
                      </TableCell>

                      <TableCell>
                        {row.attendance_status ||
                          checkAttendanceStatus(
                            row.punch_in,
                            row.punch_out,
                            row.lunch_start,
                            row.lunch_end
                          )}
                      </TableCell>
                    </TableRow>
                  )
                )
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={
                      role ===
                      "manager"
                        ? 10
                        : 8
                    }
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