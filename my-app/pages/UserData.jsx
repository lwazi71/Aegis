import Masonry from "react-masonry-css";

function UserData() {
  const userImages = [
    {
      id: 1,
      original: "/src/testimages/reg.jpeg",
      processed: "/src/testimages/ai.webp",
      changes: 2,
      prompt: "blur our the plate"
    },
    {
      id: 2,
      original: "/src/testimages/reg2.jpg",
      processed: "/src/testimages/ai2.jpg",
      changes: 1,
      prompt: "can you blur out the license plate"
    },
    {
      id: 3,
      original: "/src/testimages/reg4.webp",
      processed: "/src/testimages/ai4.png",
      changes: 2,
      prompt: "can you blur out all the location on this image"
    },
    {
      id: 4,
      original: "/src/testimages/reg6.webp",
      processed: "/src/testimages/ai6.png",
      changes: 2,
      prompt: "blur out the the address on the map"
    }
  ];

  const totalUses = userImages.length;
  const totalChanges = userImages.reduce((sum, img) => sum + img.changes, 0);

  const handleDelete = (id) => {
    alert(`Delete image with ID ${id}`);
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-5">Your Dashboard</h1>

      <div className="row g-4 text-center mb-5">
        <div className="col-md-6">
          <div className="card border-0 shadow-lg rounded-4 p-4 h-100">
            <h4 className="text-muted">Total Uses</h4>
            <p className="display-4 fw-bold text-primary mb-0">{totalUses}</p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-lg rounded-4 p-4 h-100">
            <h4 className="text-muted">Total Changes</h4>
            <p className="display-4 fw-bold text-success mb-0">{totalChanges}</p>
          </div>
        </div>
      </div>

      <Masonry
        breakpointCols={{ default: 2, 768: 1 }}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {userImages.map((img) => (
          <div key={img.id}>
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden mb-4">
              <div className="card-header bg-light d-flex justify-content-between align-items-center border-0">
                <span className="fw-semibold">Image ID #{img.id}</span>
                <button
                  className="btn btn-sm btn-outline-danger rounded-pill px-3"
                  onClick={() => handleDelete(img.id)}
                >
                  Delete
                </button>
              </div>
              <div className="card-body p-4">
                <div className="row g-3 align-items-start">
                  <div className="col-6 text-center">
                    <p className="fw-semibold text-secondary">Before</p>
                    <img
                      src={img.original}
                      alt="Original"
                      className="img-fluid rounded-3 shadow-sm"
                    />
                  </div>
                  <div className="col-6 text-center">
                    <p className="fw-semibold text-secondary">After</p>
                    <img
                      src={img.processed}
                      alt="Processed"
                      className="img-fluid rounded-3 shadow-sm"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="mb-0 text-muted"><strong>Prompt:</strong> {img.prompt}</p>
                </div>
              </div>
              <div className="card-footer bg-white border-0 text-center mb-2">
                <span className="text-light px-3 py-2 rounded-pill" style={{ backgroundColor: "#e65c00" }}>
                  {img.changes} change{img.changes !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        ))}
      </Masonry>
    </div>
  );
}

export default UserData;
