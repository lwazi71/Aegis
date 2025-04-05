import { useState } from 'react'

function Analyze() {

  const handleImageDownload = async () => {
    try {
      const response = await fetch(imageOutput)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
  
      const a = document.createElement('a')
      a.href = url
      a.download = 'ai-detected-image.png'
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Failed to download image:", err)
      alert("Download failed.")
    }
  }
  

  const [selectedImage, setSelectedImage] = useState(null)
  const [textInput, setTextInput] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [imageOutput, setImageOutput] = useState(null)
  const [textOutput, setTextOutput] = useState("")

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0])
  }

  const handleTextChange = (e) => {
    setTextInput(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    alert("Form submitted!")

    // Debug outputs
    console.log("hi")
    console.log("Selected Image:", selectedImage)
    console.log("Text Input:", textInput)

    // Create FormData to send file and prompt to the backend
    const formData = new FormData()
    if (selectedImage) {
      formData.append("file", selectedImage)
    }
    formData.append("prompt", textInput)

    try {
      const response = await fetch("http://localhost:5100/process", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const data = await response.json()
      console.log("Response from backend:", data)
      setTextOutput(data.message || "Processed successfully!")
      // Assume backend returns a URL or path for the processed image.
      setImageOutput(data.output_path || null)
    } catch (error) {
      console.error("Error:", error)
      setTextOutput("Error processing image")
    }

    // Clear the inputs
    setSelectedImage(null)
    setTextInput("")
    setSubmitted(true)
    document.getElementById("imageUpload").value = ""
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-center">Analyze Your Data</h1>
      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* Image Upload */}
          <div className="col-md-6">
            <label htmlFor="imageUpload" className="form-label">Upload an Image</label>
            <input
              type="file"
              className="form-control"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          {/* Text Input */}
          <div className="col-md-6">
            <label htmlFor="textInput" className="form-label">Enter Text</label>
            <textarea
              className="form-control"
              id="textInput"
              rows="4"
              placeholder="Paste or type text to be analyzed..."
              value={textInput}
              onChange={handleTextChange}
            />
          </div>

          {/* Submit Button */}
          <div className="col-12 text-center">
            <button type="submit" className="btn btn-primary btn-lg">
              Run AI Detection
            </button>
          </div>
        </div>
      </form>

      {submitted && (
        <div className="container py-5 text-center">
          <h1 className="mb-4">{textOutput}</h1>
          {imageOutput && (
            <div>
              <div>
              <img
                src={imageOutput}
                alt="Processed Output"
                style={{ width: "50%", borderRadius: "8px" }}
              />
              </div>

            <div className="d-flex justify-content-center mt-3">
              <button
                type="button"
                onClick={handleImageDownload}
                className="icon-circle bg-primary text-white d-flex justify-content-center align-items-center mb-4"
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  border: 'none',
                }}
              >
                <i className="bi bi-download fs-2"></i>
              </button>
            </div>            

            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Analyze