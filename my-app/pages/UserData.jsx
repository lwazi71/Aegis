function UserData() {
    return (
      <div className="container py-5">
        <h2>Upload Files</h2>
        <p className="text-muted">Upload text or image files to check for private data leaks.</p>
        <form>
          <div className="mb-3">
            <label htmlFor="fileInput" className="form-label">Choose File</label>
            <input type="file" className="form-control" id="fileInput" />
          </div>
          <button type="submit" className="btn btn-primary">Analyze</button>
        </form>
      </div>
    )
  }
  
  export default UserData
  