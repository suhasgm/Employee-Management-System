package com.empmgmt.service;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.empmgmt.dto.AddressDTO;
import com.empmgmt.dto.BankDetailsDTO;
import com.empmgmt.dto.CTCBreakupDTO;
import com.empmgmt.dto.EmployeeDTO;
import com.empmgmt.dto.EmploymentHistoryDTO;
import com.empmgmt.dto.FinanceDTO;
import com.empmgmt.dto.ProfessionalDetailsDTO;
import com.empmgmt.dto.ProjectDetailsDTO;
import com.empmgmt.entity.Address;
import com.empmgmt.entity.BankDetails;
import com.empmgmt.entity.CTCBreakup;
import com.empmgmt.entity.Employee;
import com.empmgmt.entity.EmploymentHistory;
import com.empmgmt.entity.Finance;
import com.empmgmt.entity.ProfessionalDetails;
import com.empmgmt.entity.ProjectDetails;
import com.empmgmt.repository.EmployeeRepo;

@Service
public class EmployeeDTOService {

	@Autowired
	private EmployeeRepo employeeRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private PasswordGenerator passwordGenerator;

	private int calculateAge(LocalDate dateOfBirth) {
		if (dateOfBirth == null) {
			return 0; // Or handle this scenario appropriately
		}
		return Period.between(dateOfBirth, LocalDate.now()).getYears();
	}

	public Employee mapDTOToEntity(EmployeeDTO employeeDTO) {
		Employee employee = new Employee();
		employeeDTO.setPassword(passwordGenerator.generatePassword(10));
		employee.setEmployeeId(employeeDTO.getEmployeeId());
		employee.setEmail(employeeDTO.getEmail().trim());
		employee.setPassword(passwordEncoder.encode(employeeDTO.getPassword()));
		employee.setRole(employeeDTO.getRole());
		employee.setFullName(employeeDTO.getFullName());
		employee.setGender(employeeDTO.getGender());
		employee.setAge(calculateAge(employeeDTO.getDateOfBirth()));
		employee.setDateOfBirth(employeeDTO.getDateOfBirth());
		employee.setMobileNumber(employeeDTO.getMobileNumber());

		// Map current and permanent address
		employee.setCurrentAddress(mapAddressDTOToEntity(employeeDTO.getCurrentAddress()));
		employee.setPermanentAddress(mapAddressDTOToEntity(employeeDTO.getPermanentAddress()));

		employee.setEmergencyContactName(employeeDTO.getEmergencyContactName());
		employee.setEmergencyContactNumber(employeeDTO.getEmergencyContactNumber());

		if (employeeDTO.getProfessionalDetails() != null) {
			employee.setProfessionalDetails(
					mapProfessionalDetailsDTOToEntity(employeeDTO.getProfessionalDetails(), employee));
		}

		if (employeeDTO.getProjectDetailsList() != null) {
			employee.setProjectDetailsList(
					mapProjectDetailsDTOListToEntityList(employeeDTO.getProjectDetailsList(), employee));
		}

		// Handle Finance
		if (employeeDTO.getFinance() != null) {
			employee.setFinance(mapFinanceDTOToEntity(employeeDTO.getFinance(), employee));
		}

		return employee;
	}

	public EmployeeDTO mapEntityToDTO(Employee employee) {
		EmployeeDTO employeeDTO = new EmployeeDTO();
		employeeDTO.setEmployeeId(employee.getEmployeeId());
		employeeDTO.setEmail(employee.getEmail());
		employeeDTO.setPassword(employee.getPassword());
		employeeDTO.setRole(employee.getRole());
		employeeDTO.setFullName(employee.getFullName());
		employeeDTO.setGender(employee.getGender());
		employeeDTO.setAge(employee.getAge());
		employeeDTO.setDateOfBirth(employee.getDateOfBirth());
		employeeDTO.setMobileNumber(employee.getMobileNumber());

		// Map current and permanent address
		employeeDTO.setCurrentAddress(mapAddressEntityToDTO(employee.getCurrentAddress()));
		employeeDTO.setPermanentAddress(mapAddressEntityToDTO(employee.getPermanentAddress()));

		employeeDTO.setEmergencyContactName(employee.getEmergencyContactName());
		employeeDTO.setEmergencyContactNumber(employee.getEmergencyContactNumber());

		// Handle nested entities such as ProfessionalDetails
		if (employee.getProfessionalDetails() != null) {
			employeeDTO.setProfessionalDetails(
					mapProfessionalDetailsEntityToDTO(employee.getProfessionalDetails(), employeeDTO));
		}

		// Handle ProjectDetails
		if (employee.getProjectDetailsList() != null) {
			employeeDTO.setProjectDetailsList(
					mapProjectDetailsEntityListToDTOList(employee.getProjectDetailsList(), employeeDTO));
		}

		// Handle Finance
		if (employee.getFinance() != null) {
			employeeDTO.setFinance(mapFinanceEntityToDTO(employee.getFinance()));
		}

		return employeeDTO;
	}

	public Address mapAddressDTOToEntity(AddressDTO addressDTO) {
		Address address = new Address();
		address.setCity(addressDTO.getCity());
		address.setAddresslineI(addressDTO.getAddressLineI());
		address.setAddresslineII(addressDTO.getAddressLineII());
		address.setPinCode(addressDTO.getPinCode());
		return address;
	}

	public AddressDTO mapAddressEntityToDTO(Address address) {
		AddressDTO addressDTO = new AddressDTO();
		addressDTO.setCity(address.getCity());
		addressDTO.setAddressLineI(address.getAddresslineI());
		addressDTO.setAddressLineII(address.getAddresslineII());
		addressDTO.setPinCode(address.getPinCode());
		return addressDTO;
	}

	public ProfessionalDetails mapProfessionalDetailsDTOToEntity(ProfessionalDetailsDTO professionalDetailsDTO,
			Employee employee) {
		ProfessionalDetails professionalDetails = new ProfessionalDetails();

		professionalDetails.setCompanyMail(professionalDetailsDTO.getCompanyMail());
		professionalDetails.setOfficePhone(professionalDetailsDTO.getOfficePhone());
		professionalDetails.setOfficeAddress(mapAddressDTOToEntity(professionalDetailsDTO.getOfficeAddress()));
		professionalDetails.setReportingManagerEmployeeCode(professionalDetailsDTO.getReportingManagerEmployeeCode());
		professionalDetails.setHrName(professionalDetailsDTO.getHrName());
		professionalDetails.setDateOfJoining(professionalDetailsDTO.getDateOfJoining());
		professionalDetails.setEmployee(employee);

		if (professionalDetailsDTO.getEmploymentHistoryList() != null) {
			List<EmploymentHistory> employmentHistoryList = professionalDetailsDTO.getEmploymentHistoryList().stream()
					.map(employmentHistory -> mapDTOToEmploymentHistory(employmentHistory, professionalDetails))
					.collect(Collectors.toList());
			professionalDetails.setEmploymentHistoryList(employmentHistoryList);
		}

		return professionalDetails;
	}

	public ProfessionalDetailsDTO mapProfessionalDetailsEntityToDTO(ProfessionalDetails professionalDetails,
			EmployeeDTO employee) {
		ProfessionalDetailsDTO professionalDetailsDTO = new ProfessionalDetailsDTO();
		professionalDetailsDTO.setEmployeeId(professionalDetails.getEmployeeId());
		professionalDetailsDTO.setCompanyMail(professionalDetails.getCompanyMail());
		professionalDetailsDTO.setOfficePhone(professionalDetails.getOfficePhone());
		professionalDetailsDTO.setOfficeAddress(mapAddressEntityToDTO(professionalDetails.getOfficeAddress()));
		professionalDetailsDTO.setReportingManagerEmployeeCode(professionalDetails.getReportingManagerEmployeeCode());
		professionalDetailsDTO.setHrName(professionalDetails.getHrName());
		professionalDetailsDTO.setDateOfJoining(professionalDetails.getDateOfJoining());
		if (professionalDetails.getEmploymentHistoryList() != null) {
			List<EmploymentHistoryDTO> employmentHistoryDTOs = professionalDetails.getEmploymentHistoryList().stream()
					.map(employmentHistory -> employmentHistoryToDTO(employmentHistory)).collect(Collectors.toList());
			professionalDetailsDTO.setEmploymentHistoryList(employmentHistoryDTOs);
		}

		professionalDetails.setEmploymentHistoryList(professionalDetails.getEmploymentHistoryList());
		return professionalDetailsDTO;
	}

	public List<ProjectDetails> mapProjectDetailsDTOListToEntityList(List<ProjectDetailsDTO> projectDetailsDTOList,
			Employee employee) {
		return projectDetailsDTOList.stream().map(dto -> mapProjectDetailsDTOToEntity(dto, employee)) // Pass
																										// both
																										// DTO
				// and Employee
				.collect(Collectors.toList());
	}

	public ProjectDetails mapProjectDetailsDTOToEntity(ProjectDetailsDTO projectDetailsDTO, Employee employee) {
		ProjectDetails projectDetails = new ProjectDetails();

		projectDetails.setProjectCode(projectDetailsDTO.getProjectCode());
		projectDetails.setStartDate(projectDetailsDTO.getStartDate());
		projectDetails.setEndDate(projectDetailsDTO.getEndDate());
		projectDetails.setProjectName(projectDetailsDTO.getProjectName());
		projectDetails.setReportingManagerEmployeeCode(projectDetailsDTO.getReportingManagerEmployeeCode());
		projectDetails.setEmployee(employee);

		return projectDetails;
	}

	public List<ProjectDetailsDTO> mapProjectDetailsEntityListToDTOList(List<ProjectDetails> projectDetailsList,
			EmployeeDTO employeeDTO) {
		return projectDetailsList.stream().map(this::mapProjectDetailsEntityToDTO).collect(Collectors.toList());
	}

	public ProjectDetailsDTO mapProjectDetailsEntityToDTO(ProjectDetails projectDetails) {
		ProjectDetailsDTO projectDetailsDTO = new ProjectDetailsDTO();
		projectDetailsDTO.setProjectCode(projectDetails.getProjectCode());
		projectDetailsDTO.setProjectDetailsId(projectDetails.getProjectDetailsId());
		projectDetailsDTO.setStartDate(projectDetails.getStartDate());
		projectDetailsDTO.setEndDate(projectDetails.getEndDate());
		projectDetailsDTO.setProjectName(projectDetails.getProjectName());
		projectDetailsDTO.setReportingManagerEmployeeCode(projectDetails.getReportingManagerEmployeeCode());
		return projectDetailsDTO;
	}

	public Finance mapFinanceDTOToEntity(FinanceDTO financeDTO, Employee employee) {
		Finance finance = new Finance();
		finance.setPanCard(financeDTO.getPanCard());
		finance.setAadharcard(financeDTO.getAadharCard());
		finance.setBankDetails(mapBankDetailsDTOToEntity(financeDTO.getBankDetails()));
		finance.setEmployee(employee);
		finance.setCtcBreakup(mapDTOToCTCBreakup(financeDTO.getCtcBreakup(), finance));

		return finance;
	}

	public FinanceDTO mapFinanceEntityToDTO(Finance finance) {
		FinanceDTO financeDTO = new FinanceDTO();
		financeDTO.setFid(finance.getFid());
		financeDTO.setPanCard(finance.getPanCard());
		financeDTO.setAadharCard(finance.getAadharcard());
		financeDTO.setBankDetails(mapBankDetailsEntityToDTO(finance.getBankDetails()));
		financeDTO.setCtcBreakup(mapCTCBreakupToDTO(finance.getCtcBreakup()));
		return financeDTO;
	}

	public BankDetails mapBankDetailsDTOToEntity(BankDetailsDTO bankDetailsDTO) {
		if (bankDetailsDTO == null) {
			return null;
		}
		BankDetails bankDetails = new BankDetails();
		bankDetails.setBankName(bankDetailsDTO.getBankName());
		bankDetails.setBranch(bankDetailsDTO.getBranch());
		bankDetails.setIFSCCode(bankDetailsDTO.getIfsccode());
		return bankDetails;
	}

	public BankDetailsDTO mapBankDetailsEntityToDTO(BankDetails bankDetails) {
		BankDetailsDTO bankDetailsDTO = new BankDetailsDTO();
		bankDetailsDTO.setBankName(bankDetails.getBankName());
		bankDetailsDTO.setBranch(bankDetails.getBranch());
		bankDetailsDTO.setIfsccode(bankDetails.getIFSCCode());
		return bankDetailsDTO;
	}

	private CTCBreakupDTO mapCTCBreakupToDTO(CTCBreakup ctcBreakup) {
		if (ctcBreakup == null) {
			return null;
		}

		CTCBreakupDTO ctcBreakupDTO = new CTCBreakupDTO();
		ctcBreakupDTO.setCtcId(ctcBreakup.getCtcId());
		ctcBreakupDTO.setBasicSalary(ctcBreakup.getBasicSalary());
		ctcBreakupDTO.setHra(ctcBreakup.getHra());
		ctcBreakupDTO.setProvidentFund(ctcBreakup.getProvidentFund());
		ctcBreakupDTO.setSpecialAllowance(ctcBreakup.getSpecialAllowance());
		ctcBreakupDTO.setBonus(ctcBreakup.getBonus());
		ctcBreakupDTO.setOtherBenefits(ctcBreakup.getOtherBenefits());
		ctcBreakupDTO.setTotalCTC(ctcBreakup.getTotalCTC());

		return ctcBreakupDTO;
	}

	private CTCBreakup mapDTOToCTCBreakup(CTCBreakupDTO ctcBreakupDTO, Finance finance) {
		if (ctcBreakupDTO == null) {
			return null;
		}

		CTCBreakup ctcBreakup = new CTCBreakup();
		ctcBreakup.setCtcId(ctcBreakupDTO.getCtcId());
		ctcBreakup.setBasicSalary(ctcBreakupDTO.getBasicSalary());
		ctcBreakup.setHra(ctcBreakupDTO.getHra());
		ctcBreakup.setProvidentFund(ctcBreakupDTO.getProvidentFund());
		ctcBreakup.setSpecialAllowance(ctcBreakupDTO.getSpecialAllowance());
		ctcBreakup.setBonus(ctcBreakupDTO.getBonus());
		ctcBreakup.setOtherBenefits(ctcBreakupDTO.getOtherBenefits());
		ctcBreakup.setTotalCTC(ctcBreakupDTO.getTotalCTC());
		ctcBreakup.setFinance(finance);

		return ctcBreakup;
	}

	public EmploymentHistoryDTO employmentHistoryToDTO(EmploymentHistory employmentHistory) {
		if (employmentHistory == null) {
			return null;
		}

		EmploymentHistoryDTO dto = new EmploymentHistoryDTO();
		dto.setEmploymentHistoryId(employmentHistory.getEmploymentHistoryId());
		dto.setJobTitle(employmentHistory.getJobTitle());
		dto.setCompanyName(employmentHistory.getCompanyName());
		dto.setJoiningDate(employmentHistory.getJoiningDate());
		dto.setEndingDate(employmentHistory.getEndingDate());
		dto.setJobDescription(employmentHistory.getJobDescription());

		return dto;
	}

	public EmploymentHistory mapDTOToEmploymentHistory(EmploymentHistoryDTO dto,
			ProfessionalDetails professionalDetails) {
		if (dto == null) {
			return null;
		}

		EmploymentHistory employmentHistory = new EmploymentHistory();
//		employmentHistory.setEmploymentHistoryId(dto.getEmploymentHistoryId());
		employmentHistory.setJobTitle(dto.getJobTitle());
		employmentHistory.setCompanyName(dto.getCompanyName());
		employmentHistory.setJoiningDate(dto.getJoiningDate());
		employmentHistory.setEndingDate(dto.getEndingDate());
		employmentHistory.setJobDescription(dto.getJobDescription());
		employmentHistory.setProfessionalDetails(professionalDetails);

		return employmentHistory;
	}
}
