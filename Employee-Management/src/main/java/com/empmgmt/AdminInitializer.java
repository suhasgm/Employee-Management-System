package com.empmgmt;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.empmgmt.entity.Address;
import com.empmgmt.entity.BankDetails;
import com.empmgmt.entity.CTCBreakup;
import com.empmgmt.entity.Employee;
import com.empmgmt.entity.Finance;
import com.empmgmt.entity.ProfessionalDetails;
import com.empmgmt.repository.EmployeeRepo;

@Component
public class AdminInitializer implements CommandLineRunner {

	private final EmployeeRepo employeeRepo;
	private final PasswordEncoder passwordEncoder; // Add PasswordEncoder

	// Constructor to inject EmployeeRepo and PasswordEncoder
	public AdminInitializer(EmployeeRepo employeeRepo, PasswordEncoder passwordEncoder) {
		this.employeeRepo = employeeRepo;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	public void run(String... args) throws Exception {
		// Check if admin already exists by email or ID to prevent duplicate creation
		if (!employeeRepo.existsById(177373L)) {
			// Create admin user
			Employee admin = new Employee();
			admin.setEmployeeId(177373L);
			admin.setFullName("Admin Profile");
			admin.setRole("ADMIN");
			admin.setEmail("admin@gmail.com");
			admin.setPassword(passwordEncoder.encode("AdminPassword")); // Encode password here
			admin.setGender("Male");
			admin.setAge(20);
			admin.setDateOfBirth(LocalDate.parse("1994-01-15"));
			admin.setMobileNumber(9876543210L);

			// Create and set current address
			Address currentAddress = new Address();
			currentAddress.setCity("Los Angeles");
			currentAddress.setAddresslineI("456 Elm St");
			currentAddress.setAddresslineII("-");
			currentAddress.setPinCode(2026);
			admin.setCurrentAddress(currentAddress);
			admin.setPermanentAddress(currentAddress);

			// Set emergency contact details
			admin.setEmergencyContactName("Thalapathy Vijay");
			admin.setEmergencyContactNumber(1234567890L);

			// Create and set professional details
			ProfessionalDetails professionalDetails = new ProfessionalDetails();
			professionalDetails.setCompanyMail("Thalapthy.Vijay@tvk.com");
			professionalDetails.setOfficePhone(1234567890L);
			professionalDetails.setOfficeAddress(currentAddress);
			professionalDetails.setHrName("Thalapathy");
			professionalDetails.setDateOfJoining(LocalDate.parse("2000-01-20"));
			professionalDetails.setReportingManagerEmployeeCode(89789789L);
			professionalDetails.setEmployee(admin);
			admin.setProfessionalDetails(professionalDetails);

			// Create and set finance details
			Finance finance = new Finance();
			finance.setPanCard("ABCDE1234F");
			finance.setAadharcard(123456789012L);
			finance.setEmployee(admin);

			// Create and set bank details
			BankDetails bankDetails = new BankDetails();
			bankDetails.setBankName("Bank of America");
			bankDetails.setBranch("Main Branch");
			bankDetails.setIFSCCode("BOFA0001234");
			finance.setBankDetails(bankDetails);

			// Create and set CTC breakup details
			CTCBreakup ctcBreakup = new CTCBreakup();
			ctcBreakup.setBasicSalary(BigDecimal.valueOf(60000.00));
			ctcBreakup.setHra(BigDecimal.valueOf(15000.00));
			ctcBreakup.setProvidentFund(BigDecimal.valueOf(7200.00));
			ctcBreakup.setSpecialAllowance(BigDecimal.valueOf(5000.00));
			ctcBreakup.setBonus(BigDecimal.valueOf(3000.00));
			ctcBreakup.setOtherBenefits(BigDecimal.valueOf(2000.00));
			ctcBreakup.setTotalCTC(BigDecimal.valueOf(102200.00));
			ctcBreakup.setFinance(finance);
			finance.setCtcBreakup(ctcBreakup);
			admin.setFinance(finance);

			// Save the admin user directly using the Employee entity
			employeeRepo.save(admin);

			System.out.println("Admin user initialized.");
		} else {
			System.out.println("Admin user already exists.");
		}
	}
}
