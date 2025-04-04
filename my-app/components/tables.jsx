import Trash from "./trash";
import { useState } from "react";

function Logs() {
  const [rows, setRows] = useState([
    { id: 1, type: "Image", time: "April 4th 3:05PM" },
    { id: 2, type: "Photo", time: "April 4th 3:04PM" },
    { id: 3, type: "Photo", time: "April 4th 3:03PM" },
    { id: 4, type: "Image", time: "April 4th 3:02PM" },
  ]);

  const handleDelete = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Activity</th>
          <th>Type</th>
          <th>Date Logged</th>
          <th>Trash</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <td>Link</td>
            <td>{row.type}</td>
            <td>{row.time}</td>
            <td><Trash onClick={() => handleDelete(row.id)} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Logs;
