package com.empmgmt.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class ProjectDetailsDTO {

	private Long projectCode;
	private Long projectDetailsId;
	private LocalDate startDate;
	private LocalDate endDate;
	private String projectName;
	private Long reportingManagerEmployeeCode;
}
