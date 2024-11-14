package com.empmgmt.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "ProjectDetails")
public class ProjectDetails {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long projectDetailsId;

	@Column(name = "project_code", nullable = false)
	private Long projectCode;

	@Column(name = "start_date", nullable = false)
	private LocalDate startDate;

	@Column(name = "end_date", nullable = false)
	private LocalDate endDate;

	@Column(name = "project_name", nullable = false)
	private String projectName;

	@Column(name = "reporting_manager_employee_code", nullable = false)
	private Long reportingManagerEmployeeCode;

	@ManyToOne
	@JoinColumn(name = "employee_id")
	private Employee employee;
}
