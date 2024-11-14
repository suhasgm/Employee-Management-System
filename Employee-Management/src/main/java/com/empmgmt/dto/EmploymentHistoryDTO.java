package com.empmgmt.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class EmploymentHistoryDTO {

	private Long employmentHistoryId;
	private String jobTitle;
	private String companyName;
	private LocalDate joiningDate;
	private LocalDate endingDate;
	private String jobDescription;
}
