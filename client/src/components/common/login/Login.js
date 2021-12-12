import React, { useState, useEffect } from "react"
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator"

import { Box, Button, InputAdornment, IconButton } from "@mui/material"
import "./Login.css"
import axios from "axios"
import { Email, VpnKey, Visibility, VisibilityOff } from "@mui/icons-material"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { useHistory } from "react-router-dom"

export default function Login() {
  axios.defaults.withCredentials = true
  const [checkUser, setUsers] = useState({
    email_address: "",
    password: "",
    showPassword: false
  })
  let history = useHistory()

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const rawResponse = await axios.get("/LoginStatus")
        const data = rawResponse.data
        if (data.message) {
          history.push("/Login")
        } else {
          history.push("/Display")
        }
      } catch (err) {
        console.log(err.message)
        // toast.error("There was a problem display server")
      }
    }
    checkLoggedIn()
  }, [history])

  const inputChangedHandler = (e) => {
    const state = checkUser
    state[e.target.name] = e.target.value
    setUsers({ ...state })
  }
  const handleClickShowPassword = () => {
    setUsers({
      ...checkUser,
      showPassword: !checkUser.showPassword
    })
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  const onFormSubmitted = async (e) => {
    e.preventDefault()

    try {
      const checkLogin = await axios.post("/Login", {
        email: email_address,
        password: password
      })

      if (checkLogin.data.message) {
        toast.warning(checkLogin.data.message, {
          icon: "☹️"
        })
      } else {
        toast.success("Login Success", {
          icon: "🥳",
          autoClose: 1000
        })
        setTimeout(() => history.go(0), 1000)
      }
    } catch (err) {
      console.log(err)
      toast.error(err)
    }
  }

  const { email_address, password } = checkUser
  return (
    <>
      <div className="bg">
        <div className="Login-container">
          <Box style={{ marginTop: "-50px" }}>
            <h3>Please Enter </h3>
            <h3>Registered Email and Password</h3>
            <ValidatorForm onSubmit={onFormSubmitted}>
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <Email sx={{ mr: 1, my: 0.5 }} />
                <TextValidator
                  // style={{ marginTop: "20px", color: "white" }}
                  id="email_address"
                  label="Email Adress*"
                  type="text"
                  name="email_address"
                  onChange={inputChangedHandler}
                  value={email_address}
                  validators={["required", "isEmail"]}
                  errorMessages={["Please enter Email", "email is not valid"]}
                  // InputLabelProps={{
                  //   style: { color: "white" }
                  // }}
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <VpnKey sx={{ mr: 1, my: 0.5 }} />
                <TextValidator
                  style={{ marginTop: "20px" }}
                  id="password"
                  label="Password*"
                  type={checkUser.showPassword ? "text" : "password"}
                  name="password"
                  onChange={inputChangedHandler}
                  value={password}
                  validators={["required"]}
                  errorMessages={["Password Cannot be empty"]}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {checkUser.showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Box>

              <Box
                m={0} //margin
                sx={{
                  display: "flex",
                  padding: 3,
                  justifyContent: "center"
                }}
                style={{ marginTop: "-10px" }}
              >
                <Button type="submit" variant="contained" color="primary">
                  Login
                </Button>
              </Box>
              <Box
                m={0} //margin
                sx={{
                  display: "flex",
                  padding: 2
                }}
                style={{ marginTop: "-30px" }}
              >
                Don't have an Account?
                <Link to="/Register">Register Now!</Link>
              </Box>
              {/* <Button
            className="loginbtn"
            variant="contained"
            type="submit"
            size="small"
            color="primary"
          >
            LOGIN
          </Button> */}
            </ValidatorForm>
          </Box>
        </div>
      </div>
    </>
  )
}
