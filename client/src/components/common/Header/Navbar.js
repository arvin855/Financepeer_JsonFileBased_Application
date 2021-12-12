import React, { useState, useEffect } from "react"
import "./Navbar.css"
import { Link, NavLink } from "react-router-dom"
import {
  Chip,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Tooltip
} from "@mui/material"

import { Logout, UploadFile } from "@mui/icons-material"
import axios from "axios"
import { useHistory } from "react-router"

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null)
  const [userData, setUserdata] = useState({
    email: "",
    id: 0
  })
  const [fname, setfname] = useState("")

  const [loginStatus, setloginStatus] = useState(false)

  const open = Boolean(anchorEl)
  const history = useHistory()
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const rawResponse = await axios.get("/LoginStatus")
        const data = rawResponse.data
        if (data.message) {
          history.push("/Login")
        } else {
          setUserdata(data)
          setloginStatus(true)
        }
      } catch (err) {
        console.log(err.message)
        // toast.error("There was a problem log server")
      }
    }
    checkLoggedIn()
  }, [history])

  const Logout1 = () => {
    axios.get("/Logout").then((response) => {
      setTimeout(() => history.go(0), 200)
    })
  }

  return (
    <>
      <div className="HeaderMain">
        <div className="HeaderLeft">
          <NavLink exact to="/Display" className="upward">
            Financepeer-jsonFileBased - Application
          </NavLink>
        </div>
        <div className="HeaderRight">
          {!loginStatus ? null : (
            <>
              <Box className="dropdown1">
                <Tooltip title="Account settings">
                  <Chip
                    onClick={handleClick}
                    size="Large"
                    sx={{ ml: 2 }}
                    label={`${userData.email}`}
                    color="primary"
                  />
                </Tooltip>
              </Box>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1
                    },
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0
                    }
                  }
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <>
                  <Link style={{ textDecoration: "none" }} to="/Upload_file">
                    <MenuItem>
                      <ListItemIcon>
                        <UploadFile />
                      </ListItemIcon>
                      Upload File
                    </MenuItem>
                  </Link>
                  <Divider />{" "}
                </>

                <MenuItem onClick={Logout1}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </div>
      </div>
    </>
  )
}
