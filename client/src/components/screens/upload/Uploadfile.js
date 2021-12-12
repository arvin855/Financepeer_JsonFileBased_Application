import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import "./Uploadfile.css"
import { ValidatorForm } from "react-material-ui-form-validator"
import axios from "axios"
import Progress from "./Progress"
import { Box, Button } from "@mui/material"
import { PhotoCamera } from "@mui/icons-material"
import { useHistory, Link } from "react-router-dom"
import xlsxsamplefile from "./sample_Template.xlsx"
import jsonsamplefile from "./jason _sample_Template.txt"
import { DownloadForOffline } from "@mui/icons-material"

function Uploadfile() {
  const [file, setFile] = useState("")
  const [filename, setFilename] = useState("Choose File")
  const [uploadPercentage, setUploadPercentage] = useState(0)
  let history = useHistory()

  const onChange = (e) => {
    setFile(e.target.files[0])
    setFilename(e.target.files[0].name)
  }

  const requiredfiletype = [
    "csv",
    "vnd.ms-excel",
    "vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "json"
  ]

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
        toast.error("There was a problem Upload server")
      }
    }
    checkLoggedIn()
  }, [])

  const onFormSubmitted = async (e) => {
    e.preventDefault()

    const type = file["type"].split("/")[1]
    const exe = file["name"].split(".")[1]

    if (requiredfiletype.includes(type)) {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("exe", exe)
      try {
        const res = await axios.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: (progressEvent) => {
            setUploadPercentage(
              parseInt(
                Math.round((progressEvent.loaded * 100) / progressEvent.total)
              )
            )
          }
        })

        const result = res.data
        console.log(result)
        if (result.ok) {
          // Clear percentage
          toast.success("File Uploaded successfully", {
            autoClose: 2000,
            pauseOnHover: true
          })
          setUploadPercentage(0)
        }
        if (result.message) {
          toast.error(`${result.message} `, {
            autoClose: 200000,
            pauseOnHover: true
          })
          // setTimeout(() => history.go(0), 20000)
        } else {
          const error = new Error()
          error.message = "Something went wrong."
          throw error
        }
      } catch (err) {
        if (err.response.status === 500) {
          toast.warning("There was a problem with the uploading server")
        } else {
          toast.warning(err.message)
        }
        setUploadPercentage(0)
      }
    } else {
      toast.warning("please upload json or excel file only", {
        icon: "☹️",
        autoClose: 10000
      })
    }

    // toast("submitted")

    // console.log(file["type"])
  }

  return (
    <>
      <div className="upload-container">
        <Box style={{ marginTop: "-80px" }}>
          <h1>Upload An File</h1>
          <h4>(Json || csv || xls || xlsx file only)</h4>
          <ValidatorForm onSubmit={onFormSubmitted}>
            <Box
              sx={{
                display: "flex",
                marginTop: "40px"
              }}
            >
              <div className="custom-file mb-4">
                <input
                  type="file"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/JSON"
                  className="custom-file-input"
                  id="file"
                  onChange={onChange}
                  required
                />
                <label className="custom-file-label">{filename}</label>
              </div>
            </Box>
            <h5 style={{ color: "purple", TextDecoration: "underline" }}>
              Note
            </h5>

            <h6 style={{ color: "purple" }}>
              Id field must be unique <br />
              Check sample templates for reference
            </h6>

            <Box
              sx={{
                display: "flex",
                marginTop: "15px"
              }}
            >
              <Link to={xlsxsamplefile} target="_blank" download>
                {" "}
                Download XLSX Sample Template Here!
                <DownloadForOffline />
              </Link>
            </Box>
            <Box
              sx={{
                display: "flex",
                marginBottom: "15px"
              }}
            >
              <Link
                to={jsonsamplefile}
                target="_blank"
                download="jsonsamplefile.json"
              >
                {" "}
                Download JSON Sample Template Here!
                <DownloadForOffline size="small" />
              </Link>
            </Box>
            <Progress percentage={uploadPercentage} />
            <Box
              sx={{
                display: "flex",
                marginTop: "15px",
                justifyContent: "center"
              }}
            >
              <Button
                type="submit"
                fullWidth
                color="secondary"
                variant="contained"
                endIcon={<PhotoCamera />}
              >
                Upload
              </Button>
            </Box>
          </ValidatorForm>
        </Box>
      </div>
    </>
  )
}

export default Uploadfile
