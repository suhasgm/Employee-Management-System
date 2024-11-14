import React from "react";
import "./EmployeeIDCard.css"; // Include your CSS styles
// Import your company logo
import logo from "@/assets/svgexport-22(1).png";



const EmployeeIDCard = ({ employee }) => {
  return (
    <div className="id-card">
      <div className="id-card-header">
        <img src={logo} alt="Company Logo" /> {/* Company Logo with drop shadow */}
        <div className="company-info">
          <h1>Genze Align Technologies</h1>
          <p>Synchronizing Tech with Purpose</p>
        </div>
      </div>
      <div className="id-card-body">
        <div className="employee-details">
          <h3>{employee.fullName}</h3>
          <p><strong>ID:</strong> {employee.employeeId}</p>
          <p><strong>Role:</strong> {employee.role}</p>
          <p><strong>Mobile:</strong> {employee.mobileNumber}</p>
          <p><strong>Email:</strong> {employee.email}</p>
        </div>
      </div>
      <div className="id-card-footer">
        <p>Employee since: {employee.professionalDetails.dateOfJoining}</p>
      </div>
    </div>
  );
};

export default EmployeeIDCard;