package com.empmgmt.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.Data;

@Data
public class ProfessionalDetailsDTO {

	private Long employeeId;
	private String companyMail;
	private Long officePhone;
	private AddressDTO officeAddress; // DTO for Address embedded object
	private Long reportingManagerEmployeeCode;
	private String hrName;
	private List<EmploymentHistoryDTO> employmentHistoryList; // DTO for Employment History
	private LocalDate dateOfJoining;

}
