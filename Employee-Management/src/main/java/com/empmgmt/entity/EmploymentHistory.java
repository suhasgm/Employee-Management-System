package com.empmgmt.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class EmploymentHistory {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long employmentHistoryId;
	@Column(nullable = false, name = "job_title")
	private String jobTitle;
	@Column(nullable = false, name = "company_name")
	private String companyName;
	@Column(nullable = false, name = "joining_date")
	private LocalDate joiningDate;
	@Column(nullable = false, name = "ending_date")
	private LocalDate endingDate;
	@Column(nullable = false, name = "job_description")
	private String jobDescription;

	@ManyToOne
	@JoinColumn(name = "employment_id")
	private ProfessionalDetails professionalDetails;
}
