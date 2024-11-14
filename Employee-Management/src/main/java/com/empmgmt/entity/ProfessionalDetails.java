package com.empmgmt.entity;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "ProfessionalDetails")
@Data
public class ProfessionalDetails {

	@Id
	@Column(name = "employee_id")
	private Long employeeId;
	@Column(name = "company_mail", nullable = false)
	private String companyMail;
	@Column(name = "office_phone", nullable = false)
	private Long officePhone;
	@Embedded
	@Column(name = "office_address", nullable = false)
	private Address officeAddress;
	@Column(name = "reporting_manager_employee_code", nullable = false)
	private Long reportingManagerEmployeeCode;
	@Column(name = "hr_name", nullable = false)
	private String hrName;

	@OneToMany(mappedBy = "professionalDetails", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<EmploymentHistory> employmentHistoryList;

	@Column(name = "date_of_joining", nullable = false)
	private LocalDate dateOfJoining;

	@OneToOne
	@MapsId
	@JoinColumn(name = "employee_id", nullable = false, referencedColumnName = "employee_id")
	private Employee employee;
}
