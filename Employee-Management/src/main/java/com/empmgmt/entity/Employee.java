package com.empmgmt.entity;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "Employee")
@Data
public class Employee implements UserDetails {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "employee_id", nullable = false, unique = true)
	private Long employeeId;
	@Column(nullable = false, unique = true)
	private String email;
	@Column(nullable = false, unique = true)
	private String password;
	@Column(nullable = false)
	private String role;
	@Column(name = "full_name", nullable = false)
	private String fullName;
	@Column(nullable = false)
	private String gender;
	@Column(nullable = false)
	private int age;
	@Column(name = "date_of_birth", nullable = false)
	private LocalDate dateOfBirth;
	@Column(name = "mobile-number", nullable = false)
	private Long mobileNumber;
	@Embedded
	private Address currentAddress;

	@Embedded
	@AttributeOverrides({ @AttributeOverride(name = "city", column = @Column(name = "permanentcity")),
			@AttributeOverride(name = "addresslineI", column = @Column(name = "permanentaddresslineI")),
			@AttributeOverride(name = "addresslineII", column = @Column(name = "permanentaddresslineII")),
			@AttributeOverride(name = "pinCode", column = @Column(name = "permanentpinCode")), })
	@Column(name = "permanent_address", nullable = false)
	private Address permanentAddress;
	@Column(name = "emergency_contact_name", nullable = false)
	private String emergencyContactName;
	@Column(name = "emergency_contact_number", nullable = false)
	private long emergencyContactNumber;

	@OneToOne(mappedBy = "employee", cascade = CascadeType.ALL, optional = false, orphanRemoval = true, fetch = FetchType.LAZY)
	private ProfessionalDetails professionalDetails;

	@OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<ProjectDetails> projectDetailsList;

	@OneToOne(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true, optional = false)
	private Finance finance;

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return List.of(new SimpleGrantedAuthority(role));
	}

	@Override
	public String getUsername() {
		return email; // or return this.email;
	}

}
