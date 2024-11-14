package com.empmgmt.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.empmgmt.dto.EmployeeDTO;
import com.empmgmt.dto.EmploymentHistoryDTO;
import com.empmgmt.dto.ProjectDetailsDTO;
import com.empmgmt.dto.ReqRes;
import com.empmgmt.entity.CTCBreakup;
import com.empmgmt.entity.Employee;
import com.empmgmt.entity.EmploymentHistory;
import com.empmgmt.entity.Finance;
import com.empmgmt.entity.ProfessionalDetails;
import com.empmgmt.entity.ProjectDetails;
import com.empmgmt.repository.EmployeeRepo;
import com.empmgmt.repository.EmploymentHistoryRepository;
import com.empmgmt.repository.ProjectDetailsRepository;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmployeesManagementService {

	@Autowired
	private EmployeeRepo employeeRepo;
	@Autowired
	private JWTUtils jwtUtils;
	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private SalarySlipService salarySlipService;

	@Autowired
	private EmployeeDTOService employeeDTOService;

	@Autowired
	private ProjectDetailsRepository projectDetailsRepository;

	@Autowired
	private EmploymentHistoryRepository employmentHistoryRepo;

	@Autowired
	private JavaMailSender emailSender;

	private Long generateUniqueSixDigitId() {
		Random random = new Random();
		Long id;

		do {
			id = 100000 + random.nextLong(900000); // Generate a 6-digit number
		} while (employeeRepo.existsById(id)); // Check for existence in the database

		return id;
	}

	public ReqRes register(EmployeeDTO registerReq) {
		ReqRes resp = new ReqRes();

		UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		boolean isAdmin = userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority)
				.anyMatch(role -> role.equals("ADMIN"));

		if (!isAdmin) {
			resp.setStatusCode(403);
			resp.setMessage("Unauthorized: Only admins can register employees.");
			return resp;
		}
		try {

			registerReq.setEmployeeId(generateUniqueSixDigitId());
			Employee employee = employeeDTOService.mapDTOToEntity(registerReq);

			Employee ourEmployeeSaveResult = employeeRepo.save(employee);

			if (ourEmployeeSaveResult.getEmployeeId() > 0) {
				resp.setStatusCode(200);
				resp.setOurEmployee(employeeDTOService.mapEntityToDTO(ourEmployeeSaveResult));
				resp.setMessage("Employee Saved Successfully");

				String username = ourEmployeeSaveResult.getFullName().toUpperCase();
				String subject = "Welcome to Our Platform! Here are your login credentials 🔑";
				String email = employee.getEmail();
				String password = registerReq.getPassword();

				String htmlMessage = "<html>"
						+ "<body style=\"font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9f9f9;\">"
						+ "<div style=\"max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);\">"
						+ "<h2 style=\"color: #333333; text-align: center;font-size: 30px;\">Hello! " + username
						+ " 👋</h2>"
						+ "<p style=\"font-size: 16px; color: #666666; text-align: center;\">Welcome to our platform! We're excited to have you on board.</p>"
						+ "<p style=\"font-size: 16px; color: #666666; text-align: center;\">Here are your login credentials:</p>"
						+ "<div style=\"background-color: #f1f1f1; padding: 20px; border-radius: 5px; text-align: center;\">"
						+ "<p style=\"font-size: 18px; color: #333333;\"><strong>Username:</strong> " + email + "</p>"
						+ "<p style=\"font-size: 18px; color: #333333;\"><strong>Password:</strong> " + password
						+ "</p>" + "</div>"
						+ "<p style=\"font-size: 16px; color: #666666; text-align: center;\">You can change your password after logging in.</p>"
						+ "<p style=\"font-size: 14px; color: #999999; text-align: center;\">If you have any questions, feel free to contact our support team.</p>"
						+ "<p style=\"font-size: 14px; color: #999999; text-align: center;\">Thank you for joining us!</p>"
						+ "</div>" + "</body>" + "</html>";

				MimeMessage message = emailSender.createMimeMessage();
				MimeMessageHelper helper = new MimeMessageHelper(message, true);

				helper.setTo(email);
				helper.setSubject(subject);
				helper.setText(htmlMessage, true);

				emailSender.send(message);

			}
		} catch (Exception e) {
			resp.setStatusCode(500);
			resp.setMessage("Error Occured: " + e.getMessage());
		}
		return resp;
	}

	public ReqRes login(ReqRes loginRequest) {
		ReqRes response = new ReqRes();

		try {
			authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

			Optional<Employee> employee = employeeRepo.findByEmail(loginRequest.getEmail());
			if (employee.isPresent()) {
				String jwt = jwtUtils.generateToken(employee.get());
				String refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), employee.get());
				response.setStatusCode(200);
				response.setMessage("Successfully Logged In");
				response.setToken(jwt);
				response.setRole(employee.get().getRole());
				response.setExpirationTime("7Hrs");
				response.setRefreshToken(refreshToken);
				return response;
			} else {
				response.setStatusCode(404);
				response.setMessage("Not Found");
			}

		} catch (Exception e) {
			response.setStatusCode(500);
			response.setMessage("Error Occured: " + e.getMessage());
		}
		return response;
	}

	public ReqRes refreshToken(ReqRes refreshTokenRequest) {
		ReqRes response = new ReqRes();

		try {
			String ourEmail = jwtUtils.extractUsername(refreshTokenRequest.getToken());
			Employee employees = employeeRepo.findByEmail(ourEmail).orElseThrow();

			if (jwtUtils.isTokenValid(refreshTokenRequest.getToken(), employees)) {
				String jwt = jwtUtils.generateToken(employees);
				response.setStatusCode(200);
				response.setMessage("Successfully Refreshed Token");
				response.setToken(jwt);
				response.setExpirationTime("24Hrs");
				response.setRefreshToken(refreshTokenRequest.getToken());

			}
			response.setStatusCode(200);
			return response;
		} catch (Exception e) {
			response.setStatusCode(500);
			response.setMessage("Error Occured: " + e.getMessage());
			return response;
		}

	}

	public ReqRes getAllEmployees() {
		ReqRes response = new ReqRes();

		UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		boolean isAdmin = userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority)
				.anyMatch(role -> role.equals("ADMIN"));

		if (!isAdmin) {
			response.setStatusCode(403);
			response.setMessage("Unauthorized: Only admins can Get All Employees employees.");
			return response;
		}

		try {

			List<EmployeeDTO> resultEmployeesDtos = new ArrayList<>();
			List<Employee> resultEmployees = employeeRepo.findAll();
			resultEmployees.forEach(Employee -> resultEmployeesDtos.add(employeeDTOService.mapEntityToDTO(Employee)));

			if (!resultEmployees.isEmpty()) {
				response.setOurEmployeesList(resultEmployeesDtos);
				response.setStatusCode(200);
				response.setMessage("Successfull......");
			} else {
				response.setStatusCode(404);
				response.setMessage("No Employees Found");
			}
			return response;
		} catch (Exception e) {
			response.setStatusCode(500);
			response.setMessage("Error Occured: " + e.getMessage());
			return response;
		}
	}

	public ReqRes getEmployeeById(Long id) {
		ReqRes response = new ReqRes();

		try {
			Optional<Employee> employeeById = employeeRepo.findById(id);
			if (employeeById.isPresent()) {
				response.setOurEmployee(employeeDTOService.mapEntityToDTO(employeeById.get()));
				response.setStatusCode(200);
				response.setMessage("Employee with id '" + id + "' Found Successfully");
			} else {
				response.setStatusCode(404);
				response.setMessage("Employee Not Found for Deletion");
			}
			return response;

		} catch (Exception e) {
			response.setStatusCode(500);
			response.setMessage("Error Occured: " + e.getMessage());
			return response;
		}

	}

	public ReqRes deleteEmployee(Long id) {
		ReqRes response = new ReqRes();

		UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		boolean isAdmin = userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority)
				.anyMatch(role -> role.equals("ADMIN"));

		if (!isAdmin) {
			response.setStatusCode(403);
			response.setMessage("Unauthorized: Only admins can Delete employees.");
			return response;
		}

		try {

			Optional<Employee> employeeOptional = employeeRepo.findById(id);
			if (employeeOptional.isPresent()) {
				employeeRepo.deleteById(id);
				response.setStatusCode(200);
				response.setMessage("Employee Deleted Successfully");
//				employeeRepo.flush();
			} else {
				response.setStatusCode(404);
				response.setMessage("Employee Not Found for Deletion");
			}
			return response;

		} catch (Exception e) {
			response.setStatusCode(500);
			response.setMessage("Error Occured While Deleting Employee" + e.getMessage());
			return response;
		}
	}

	public ReqRes updateEmployee(Long id, EmployeeDTO employeeDTO) {
		ReqRes response = new ReqRes();

		UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		boolean isAdmin = userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority)
				.anyMatch(role -> role.equals("ADMIN"));

		if (!isAdmin) {
			response.setStatusCode(403);
			response.setMessage("Unauthorized: Only admins can Update employees.");
			return response;
		}

		try {
			Optional<Employee> employeeOptional = employeeRepo.findById(id);
			if (employeeOptional.isPresent()) {

				Employee existingEmployee = employeeOptional.get();
//
//				existingEmployee.setEmail(employeeDTO.getEmail().trim());
////				existingEmployee.setPassword(passwordEncoder.encode(employeeDTO.getPassword()));
//				existingEmployee.setRole(employeeDTO.getRole());
//				existingEmployee.setFullName(employeeDTO.getFullName());
//				existingEmployee.setAge(employeeDTO.getAge());
//				existingEmployee.setMobileNumber(employeeDTO.getMobileNumber());
//
//				// Map current and permanent address
//				existingEmployee
//						.setCurrentAddress(employeeDTOService.mapAddressDTOToEntity(employeeDTO.getCurrentAddress()));
//				existingEmployee.setPermanentAddress(
//						employeeDTOService.mapAddressDTOToEntity(employeeDTO.getPermanentAddress()));
//
//				existingEmployee.setEmergencyContactName(employeeDTO.getEmergencyContactName());
//				existingEmployee.setEmergencyContactNumber(employeeDTO.getEmergencyContactNumber());

				if (employeeDTO.getEmail() != null && !employeeDTO.getEmail().trim().isEmpty()) {
					existingEmployee.setEmail(employeeDTO.getEmail().trim());
				}

				if (employeeDTO.getRole() != null) {
					existingEmployee.setRole(employeeDTO.getRole());
				}

				if (employeeDTO.getFullName() != null) {
					existingEmployee.setFullName(employeeDTO.getFullName());
				}

//				if (employeeDTO.getAge() > 0) { // Check for a valid age (assuming age must be positive)
//					existingEmployee.setAge(employeeDTO.getAge());
//				}

				if (employeeDTO.getMobileNumber() != null) {
					existingEmployee.setMobileNumber(employeeDTO.getMobileNumber());
				}

				// Map current and permanent address if not null
				if (employeeDTO.getCurrentAddress() != null) {
					existingEmployee.setCurrentAddress(
							employeeDTOService.mapAddressDTOToEntity(employeeDTO.getCurrentAddress()));
				}

				if (employeeDTO.getPermanentAddress() != null) {
					existingEmployee.setPermanentAddress(
							employeeDTOService.mapAddressDTOToEntity(employeeDTO.getPermanentAddress()));
				}

				if (employeeDTO.getEmergencyContactName() != null) {
					existingEmployee.setEmergencyContactName(employeeDTO.getEmergencyContactName());
				}

				if (employeeDTO.getEmergencyContactNumber() != null) {
					existingEmployee.setEmergencyContactNumber(employeeDTO.getEmergencyContactNumber());
				}

				// ProfessionalDetails
				if (employeeDTO.getProfessionalDetails() != null) {
					ProfessionalDetails existingEmployeeProfessionalDetails = existingEmployee.getProfessionalDetails();
					existingEmployeeProfessionalDetails.setOfficeAddress(employeeDTOService
							.mapAddressDTOToEntity(employeeDTO.getProfessionalDetails().getOfficeAddress()));
					existingEmployeeProfessionalDetails
							.setOfficePhone(employeeDTO.getProfessionalDetails().getOfficePhone());
					existingEmployeeProfessionalDetails.setReportingManagerEmployeeCode(
							employeeDTO.getProfessionalDetails().getReportingManagerEmployeeCode());
					existingEmployeeProfessionalDetails.setHrName(employeeDTO.getProfessionalDetails().getHrName());

					if (employeeDTO.getProfessionalDetails().getEmploymentHistoryList() != null) {
						List<EmploymentHistory> existingEmploymentHistoryList = existingEmployeeProfessionalDetails
								.getEmploymentHistoryList();
						List<EmploymentHistoryDTO> dtoEmploymentHistoryList = employeeDTO.getProfessionalDetails()
								.getEmploymentHistoryList();

						// Creating a map of existing employment history records for easier lookup by ID
						Map<Long, EmploymentHistory> existingHistoryMap = existingEmploymentHistoryList.stream()
								.collect(Collectors.toMap(EmploymentHistory::getEmploymentHistoryId, eh -> eh));

						// Process each DTO employment history
						for (EmploymentHistoryDTO dtoHistory : dtoEmploymentHistoryList) {
							if (dtoHistory.getEmploymentHistoryId() != null
									&& existingHistoryMap.containsKey(dtoHistory.getEmploymentHistoryId())) {
								// Updating existing record if ID matches
								EmploymentHistory existingHistory = existingHistoryMap
										.get(dtoHistory.getEmploymentHistoryId());
								existingHistory.setJobTitle(dtoHistory.getJobTitle());
								existingHistory.setCompanyName(dtoHistory.getCompanyName());
								existingHistory.setJoiningDate(dtoHistory.getJoiningDate());
								existingHistory.setEndingDate(dtoHistory.getEndingDate());
								existingHistory.setJobDescription(dtoHistory.getJobDescription());

								// Updating any other fields if needed
							} else {
								// Add new record if ID doesn't match or is null (new record)
								EmploymentHistory newHistory = employeeDTOService.mapDTOToEmploymentHistory(dtoHistory,
										existingEmployeeProfessionalDetails);
								existingEmploymentHistoryList.add(newHistory);
							}
						}

						// Saving the updated list back into the employee's professional details
						existingEmployeeProfessionalDetails.setEmploymentHistoryList(existingEmploymentHistoryList);
					}
				}

				// Project Details
				if (employeeDTO.getProjectDetailsList() != null) {

					List<ProjectDetails> existingProjectDetailsList = existingEmployee.getProjectDetailsList();

					Map<Long, ProjectDetails> existingProjectMap = existingProjectDetailsList.stream()
							.collect(Collectors.toMap(ProjectDetails::getProjectCode, pd -> pd));

					// Process each DTO in the projectDetailsDTOList
					for (ProjectDetailsDTO dtoProject : employeeDTO.getProjectDetailsList()) {
						if (dtoProject.getProjectCode() != null
								&& existingProjectMap.containsKey(dtoProject.getProjectCode())) {
							// Step 1: Update existing project if projectCode matches
							ProjectDetails existingProject = existingProjectMap.get(dtoProject.getProjectCode());

							existingProject.setProjectCode(dtoProject.getProjectCode());
							existingProject.setStartDate(dtoProject.getStartDate());
							existingProject.setEndDate(dtoProject.getEndDate());
							existingProject.setProjectName(dtoProject.getProjectName());
							existingProject
									.setReportingManagerEmployeeCode(dtoProject.getReportingManagerEmployeeCode());
						} else {
							ProjectDetails newProjectDetails = employeeDTOService
									.mapProjectDetailsDTOToEntity(dtoProject, existingEmployee);
							existingProjectDetailsList.add(newProjectDetails);
						}
					}
//					existingEmployee.setProjectDetailsList(employeeDTOService.mapProjectDetailsDTOListToEntityList(
//							employeeDTO.getProjectDetailsList(), existingEmployee));
				}

				// Handle Finance
				if (employeeDTO.getFinance() != null) {

					Finance existingFinance = existingEmployee.getFinance();

					existingFinance.setAadharcard(employeeDTO.getFinance().getAadharCard());
					existingFinance.setBankDetails(
							employeeDTOService.mapBankDetailsDTOToEntity(employeeDTO.getFinance().getBankDetails()));
					existingFinance.setPanCard(employeeDTO.getFinance().getPanCard());

					if (employeeDTO.getFinance().getCtcBreakup() != null) {
						CTCBreakup ctcBreakup = existingFinance.getCtcBreakup();
//					ctcBreakup.setCtcId(employeeDTO.getFinance().getCtcBreakup().getCtcId());
						ctcBreakup.setBasicSalary(employeeDTO.getFinance().getCtcBreakup().getBasicSalary());
						ctcBreakup.setHra(employeeDTO.getFinance().getCtcBreakup().getHra());
						ctcBreakup.setProvidentFund(employeeDTO.getFinance().getCtcBreakup().getProvidentFund());
						ctcBreakup.setSpecialAllowance(employeeDTO.getFinance().getCtcBreakup().getSpecialAllowance());
						ctcBreakup.setBonus(employeeDTO.getFinance().getCtcBreakup().getBonus());
						ctcBreakup.setOtherBenefits(employeeDTO.getFinance().getCtcBreakup().getOtherBenefits());
						ctcBreakup.setTotalCTC(employeeDTO.getFinance().getCtcBreakup().getTotalCTC());

						existingFinance.setCtcBreakup(ctcBreakup);
					}
				}

				Employee savedEmployee = employeeRepo.save(existingEmployee);
				response.setOurEmployee(employeeDTOService.mapEntityToDTO(savedEmployee));
				response.setStatusCode(200);
				response.setMessage("Employee Updated Successfully");

			} else {
				response.setStatusCode(404);
				response.setMessage("Employee Not Found for Update");
			}

			return response;
		} catch (Exception e) {
			response.setStatusCode(500);
			response.setMessage("Error Occured While Updating Employee" + e.getMessage());
			return response;
		}
	}

	public ReqRes getMyInfo(String email) {
		ReqRes response = new ReqRes();

		try {
			Optional<Employee> employeeOptional = employeeRepo.findByEmail(email);
			if (employeeOptional.isPresent()) {
				response.setOurEmployee(employeeDTOService.mapEntityToDTO(employeeOptional.get()));
				response.setStatusCode(200);
				response.setMessage("Successful");
			} else {
				response.setStatusCode(404);
				response.setMessage("Employee Not Found ");
			}
			return response;

		} catch (Exception e) {
			response.setStatusCode(500);
			response.setMessage("Error occured while getting Employee id " + e.getMessage());
			return response;

		}
	}

	public ReqRes getMySalarySlips(String email) {
		ReqRes response = new ReqRes();

		UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		boolean isUser = userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority)
				.anyMatch(role -> role.equals("USER"));

		if (!isUser) {
			response.setStatusCode(403);
			response.setMessage("Unauthorized: Only User can Download Salary Slip");
			return response;
		}

		try {
			Optional<Employee> employeeOptional = employeeRepo.findByEmail(email);
			if (employeeOptional.isPresent()) {
				response.setSalarySlipsbytes(salarySlipService
						.generatePDF(salarySlipService.generateLastSixMonthsPayslips(employeeOptional.get())));
				response.setStatusCode(200);
				response.setMessage("Successful");
			} else {
				response.setStatusCode(404);
				response.setMessage("Employee Not Found ");
			}
			return response;

		} catch (Exception e) {
			response.setStatusCode(500);
			response.setMessage("Error occured while getting Employee id " + e.getMessage());
			return response;

		}

	}

	public ReqRes deleteProject(Long empId, Long projectId) {
		ReqRes response = new ReqRes();
		response.setStatusCode(500); // Default error code for any unhandled cases

		UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		boolean isAdmin = userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority)
				.anyMatch(role -> role.equals("ADMIN"));

		if (!isAdmin) {
			response.setStatusCode(403);
			response.setMessage("Unauthorized: Only admins can delete employee projects.");
			return response;
		}

		try {
			Optional<Employee> emplOptional = employeeRepo.findById(empId);
			if (emplOptional.isPresent()) {
				Optional<ProjectDetails> projectOptional = projectDetailsRepository.findById(projectId);

				if (projectOptional.isPresent()) {
					ProjectDetails project = projectOptional.get();

					if (project.getEmployee().getEmployeeId().equals(empId)
							&& project.getProjectDetailsId().equals(projectId)) {
						projectDetailsRepository.delete(project);
						projectDetailsRepository.flush();

						response.setStatusCode(200);
						response.setMessage("Project deleted successfully.");
					} else {
						response.setStatusCode(404);
						response.setMessage("Project code or employee ID mismatch.");
					}
				} else {
					response.setStatusCode(404);
					response.setMessage("Project not found for deletion.");
				}
			} else {
				response.setStatusCode(404);
				response.setMessage("Employee not found for project deletion.");
			}
		} catch (Exception e) {
			response.setStatusCode(500);
			response.setMessage("Error occurred while deleting project: " + e.getMessage());
		}

		return response;
	}

	public ReqRes deleteEmploymentHistory(Long empId, Long employmentHistoryId) {
		ReqRes response = new ReqRes();

		UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		boolean isAdmin = userDetails.getAuthorities().stream().anyMatch(role -> role.getAuthority().equals("ADMIN"));

		if (!isAdmin) {
			response.setStatusCode(403);
			response.setMessage("Unauthorized: Only admins can delete employee EmploymentHistory.");
			return response;
		}

		try {

			Optional<Employee> emplOptional = employeeRepo.findById(empId);
			if (emplOptional.isPresent()) {
				Optional<EmploymentHistory> employeeHistoryOptional = employmentHistoryRepo
						.findById(employmentHistoryId);
				if (employeeHistoryOptional.isPresent()) {
					EmploymentHistory employmentHistory = employeeHistoryOptional.get();
					ProfessionalDetails professionalDetails = employmentHistory.getProfessionalDetails();

					// Ensure that the employee ID in the EmploymentHistory matches the provided
					// employee ID
					if (professionalDetails != null && professionalDetails.getEmployeeId().equals(empId)) {
						employmentHistoryRepo.delete(employmentHistory);
						response.setStatusCode(200);
						response.setMessage("EmploymentHistory Deleted Successfully");
					} else {
						response.setStatusCode(404);
						response.setMessage("EmploymentHistory does not belong to this employee");
					}
				} else {
					response.setStatusCode(404);
					response.setMessage("EmploymentHistory Not Found for Deletion");
				}
			} else {
				response.setStatusCode(404);
				response.setMessage("Employee Not Found for EmploymentHistory Deletion");
			}
			return response;

		} catch (Exception e) {

			response.setStatusCode(500);
			response.setMessage("Error occured while getting Employee id " + e.getMessage());
			return response;
		}
	}

	public ReqRes findEmployeesByName(String fullName) {
		ReqRes response = new ReqRes();

		UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		boolean isAdmin = userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority)
				.anyMatch(role -> role.equals("ADMIN"));

		if (!isAdmin) {
			response.setStatusCode(403);
			response.setMessage("Unauthorized: Only admins can Get All Employees employees.");
			return response;
		}

		try {

			List<EmployeeDTO> resultEmployeesDtos = new ArrayList<>();
			List<Employee> resultEmployees = employeeRepo.findAllByName(fullName);
			resultEmployees.forEach(Employee -> resultEmployeesDtos.add(employeeDTOService.mapEntityToDTO(Employee)));

			if (!resultEmployees.isEmpty()) {
				response.setOurEmployeesList(resultEmployeesDtos);
				response.setStatusCode(200);
				response.setMessage("Successfull......");
			} else {
				response.setStatusCode(404);
				response.setMessage("No Employees Found");
			}
			return response;
		} catch (Exception e) {
			response.setStatusCode(500);
			response.setMessage("Error Occured: " + e.getMessage());
			return response;
		}
	}
}
