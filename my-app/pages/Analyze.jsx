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
    console.log('Selected Image:', selectedImage)
    console.log('Text Input:', textInput)


    
    // Here you can send data to your AI API / backend
    setTextOutput("testing text input")
    setImageOutput(URL.createObjectURL(selectedImage))



    //clear the inputs
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
                alt="Preview"
                style={{ width: "50%", borderRadius: "8px" }}
              />
            </div>

            <div className="d-flex justify-content-center mt-4">
              <button
                type="button"
                onClick={handleImageDownload}
                className="icon-circle bg-primary text-white d-flex justify-content-center align-items-center"
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