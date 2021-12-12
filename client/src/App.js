import "./App.css"
import React from "react"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Axios from "axios"
import Navbar from "./components/common/Header/Navbar"
import Login from "./components/common/login/Login"
import Register from "./components/common/register/Register"
import Uploadfile from "./components/screens/upload/Uploadfile"
import Display from "./components/screens/display/Display"

function App() {
  Axios.defaults.withCredentials = true
  return (
    <>
      <ToastContainer closeOnClick pauseOnHover position="top-center" />
      <Router>
        <Navbar />
        <Switch>
          <Route path="/Display" component={Display} />
          <Route path="/Login" component={Login} />
          <Route path="/Register" component={Register} />
          <Route path="/Upload_file" component={Uploadfile} />
        </Switch>
      </Router>
    </>
  )
}

export default App
