import React, { useEffect, useState } from "react"
import { Box, Button } from "@mui/material"
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator"
import { Email, VpnKey, LibraryBooks, Add } from "@mui/icons-material"

import axios from "axios"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useHistory } from "react-router"
import "./Register.css"

export default function Register() {
  const history = useHistory()
  const [addUser, setUsers] = useState({
    email_address: "",
    first_name: "",
    last_name: "",
    password: "",
    repeatPassword: "",
    showPassword: false
  })
  const [loaduserEmail, SetLoadUserEmail] = useState([])

  ValidatorForm.addValidationRule("isEmailPresent", (value) => {
    const chekmail = loaduserEmail.filter((res) => res.email === value)
    if (chekmail.length > 0) {
      return false
    }
    return true
  })

  ValidatorForm.addValidationRule("isPasswordMatch", (value) => {
    if (value !== password) {
      return false
    }
    return true
  })

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const rawResponse = await axios.get("/LoginStatus")
        const data = rawResponse.data
        if (data.message) {
          history.push("/Register")
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

  useEffect(() => {
    const load = async () => {
      try {
        const rawResponse = await axios.get("/userEmails")
        SetLoadUserEmail(rawResponse.data)
      } catch (err) {
        console.log(err.message)
        toast.error("There was a problem getting userEmails server")
      }
    }
    load()
  }, [])

  const inputChangedHandler = (e) => {
    const state = addUser
    state[e.target.name] = e.target.value
    setUsers({ ...state })
  }

  const onFormSubmitted = async (e) => {
    e.preventDefault()
    try {
      const result = await axios.post("/signUp", {
        fname: first_name,
        lname: last_name,
        email: email_address,
        password: password
      })
      const details = result.data

      if (details.affectedRows) {
        toast.success("Sign Up Successful!", {
          autoClose: 2000
        })
        setTimeout(() => {
          history.push("/Display")
        }, 2000)
      } else {
        const error = new Error()
        error.message = "Something went wrong."
        throw error
      }
    } catch (err) {
      if (err.response.status === 500) {
        toast.error("There was a problem with the Registeration server")
      } else {
        toast.error(err.message)
      }
    }
  }
  const { email_address, first_name, last_name, password, repeatPassword } =
    addUser

  return (
    // Register Form

    <div className="Register-container">
      <Box style={{ marginTop: "30px" }}>
        <h2>Sign Up </h2>
        <ValidatorForm onSubmit={onFormSubmitted}>
          <Box sx={{ display: "flex", alignItems: "flex-end" }}>
            <LibraryBooks sx={{ mr: 1, my: 0.5 }} />
            <TextValidator
              style={{ marginTop: "7px" }}
              id="first_name"
              label="first_name*"
              type="text"
              name="first_name"
              onChange={inputChangedHandler}
              value={first_name}
              validators={["required"]}
              errorMessages={["Please enter First Name"]}
              // InputLabelProps={{
              //   style: { color: "white" }
              // }}
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "flex-end" }}>
            <LibraryBooks sx={{ mr: 1, my: 0.5 }} />
            <TextValidator
              style={{ marginTop: "7px" }}
              id="last_name"
              label="last_name*"
              type="text"
              name="last_name"
              onChange={inputChangedHandler}
              value={last_name}
              validators={["required"]}
              errorMessages={["Please enter Last Name"]}
              // InputLabelProps={{
              //   style: { color: "white" }
              // }}
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "flex-end" }}>
            <Email sx={{ mr: 1, my: 0.5 }} />
            <TextValidator
              id="email_address"
              label="Email Adress*"
              type="text"
              name="email_address"
              onChange={inputChangedHandler}
              value={email_address}
              validators={["required", "isEmail", "isEmailPresent"]}
              errorMessages={[
                "Please enter Email",
                "email is not valid",
                "Email already exists"
              ]}
              // InputLabelProps={{
              //   style: { color: "white" }
              // }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "flex-end" }}>
            <VpnKey sx={{ mr: 1, my: 0.5 }} />
            <TextValidator
              style={{ marginTop: "7px" }}
              id="password"
              label="Password*"
              type="password"
              name="password"
              onChange={inputChangedHandler}
              value={password}
              validators={["required"]}
              errorMessages={["Password Cannot be empty"]}
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "flex-end" }}>
            <VpnKey sx={{ mr: 1, my: 0.5 }} />
            <TextValidator
              style={{ marginTop: "7px" }}
              id="repeatPassword"
              label="Re-Type Password"
              type="password"
              name="repeatPassword"
              onChange={inputChangedHandler}
              value={repeatPassword}
              validators={["isPasswordMatch", "required"]}
              errorMessages={["Password mismatch", "Re-Type Password"]}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              padding: 3,
              justifyContent: "center"
            }}
          >
            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              size="large"
              endIcon={<Add />}
            >
              Register
            </Button>
          </Box>
        </ValidatorForm>
      </Box>
    </div>
  )
}
