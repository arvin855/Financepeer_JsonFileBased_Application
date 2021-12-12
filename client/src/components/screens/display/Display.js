import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import axios from "axios"
import { useHistory } from "react-router-dom"
// import MaterialTable from "material-table"
import "./Display.css"
import { makeStyles } from "@material-ui/core/styles"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material"

const custStyle = makeStyles((theme) => ({
  table: {
    justifyContent: "center"
  },
  tableContainer: {
    borderRaduis: 15,
    margin: "10px 10px",
    maxWidth: 1220,
    alignItems: "ceneter !important",
    justifyContent: "center !important"
  },
  tableHeadCell: {
    fontWeight: "bold  !important",
    backgroundColor: theme.palette.primary.dark,
    color:
      "theme.palette.getContrastText(theme.palette.primary.dark) !important",
    alignItems: "center !important"
  },
  tableRows: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0
    }
  }
}))

function Display() {
  const usecust = custStyle()
  let history = useHistory()
  const [count, setcount] = useState(0)
  const [jdata, setjdata] = useState([])

  useEffect(() => {
    const checkcount = async () => {
      try {
        const rawResponse = await axios.get("/jdatacount")
        const data = rawResponse.data
        setcount(data[0].count)
      } catch (err) {
        console.log(err.message)
        toast.error("There was a problem display server")
      }
    }
    checkcount()
  }, [])
  useEffect(() => {
    const getjdata = async () => {
      try {
        const rawResponse = await axios.get("/jdata")
        const data = rawResponse.data
        setjdata(data)
      } catch (err) {
        console.log(err.message)
        toast.error("There was a problem display server")
      }
    }
    getjdata()
  }, [])

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const rawResponse = await axios.get("/LoginStatus")
        const data = rawResponse.data
        if (data.message) {
          history.push("/Login")
        }
      } catch (err) {
        console.log(err.message)
        toast.error("There was a problem display server")
      }
    }
    checkLoggedIn()
  }, [history])

  // const col = [
  //   {
  //     title: "ID",
  //     field: "id"
  //   },
  //   {
  //     title: "User_Id",
  //     field: "userId"
  //   },
  //   {
  //     title: "Title",
  //     field: "title"
  //   },
  //   {
  //     title: "Body",
  //     field: "body"
  //   }
  // ]
  return (
    <div>
      <h1 style={{ marginTop: "15px" }}>Data Present in Database = {count}</h1>
      {count === 0 ? (
        <>
          <h3>No data present</h3>
        </>
      ) : (
        <>
          {/* <div className="tabelData">
            <MaterialTable
              title="Jdata Table"
              data={jdata}
              columns={col}
              options={{
                search: false,
                paging: false
              }}
            />
          </div> */}
          <div className="tabelData">
            <TableContainer
              component={Paper}
              className={usecust.tableContainer}
            >
              <Table
                className={usecust.table}
                sx={{ minWidth: 650 }}
                aria-label="simple table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell className={usecust.tableHeadCell}>ID</TableCell>
                    <TableCell className={usecust.tableHeadCell}>
                      User_Id
                    </TableCell>
                    <TableCell className={usecust.tableHeadCell}>
                      Title
                    </TableCell>
                    <TableCell className={usecust.tableHeadCell}>
                      Body
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jdata.map((row) => (
                    <TableRow
                      className={usecust.tableRows}
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.userId}</TableCell>
                      <TableCell>{row.title}</TableCell>
                      <TableCell>{row.body}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </>
      )}
    </div>
  )
}

export default Display
