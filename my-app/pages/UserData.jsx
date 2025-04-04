import Logs from "../components/tables";
import Checkbox from "../components/checkbox";

function UserData() {
    return (

      <div className = "container mt-4">
        <h2>Welcome Chuzz</h2>
        <Logs /> {/* Calling the table component here */}
      </div>
    )
  }
  
  export default UserData
  