package com.empmgmt.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.Data;

@Data
public class EmployeeDTO {

	private Long employeeId;
	private String email;
	private String password;
	private String role;
	private String fullName;
	private String gender;
	private int age;
	private LocalDate dateOfBirth;
	private Long mobileNumber;
	private AddressDTO currentAddress;
	private AddressDTO permanentAddress;
	private String emergencyContactName;
	private Long emergencyContactNumber;
	private ProfessionalDetailsDTO professionalDetails;
	private List<ProjectDetailsDTO> projectDetailsList;
	private FinanceDTO finance;

}
