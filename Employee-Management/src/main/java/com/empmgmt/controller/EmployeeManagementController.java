package com.empmgmt.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.empmgmt.dto.EmployeeDTO;
import com.empmgmt.dto.ReqRes;
import com.empmgmt.service.EmployeesManagementService;
import com.empmgmt.service.PasswordResetService;

@RestController
//@CrossOrigin
public class EmployeeManagementController {

	@Autowired
	EmployeesManagementService employeesManagementService;

	@Autowired
	PasswordResetService passwordResetService;

	@PostMapping("/auth/register")
	public ResponseEntity<ReqRes> register(@RequestBody EmployeeDTO employeeDTO) {
		return ResponseEntity.ok(employeesManagementService.register(employeeDTO));
	}

	@PostMapping("/auth/login")
	public ResponseEntity<ReqRes> login(@RequestBody ReqRes req) {
		return ResponseEntity.ok(employeesManagementService.login(req));
	}

	@PostMapping("/auth/refresh")
	public ResponseEntity<ReqRes> refreshToken(@RequestBody ReqRes req) {
		return ResponseEntity.ok(employeesManagementService.refreshToken(req));
	}

	@GetMapping("/admin/get-all-employees")
	public ResponseEntity<ReqRes> getAllEmployees() {
		return ResponseEntity.ok(employeesManagementService.getAllEmployees());
	}

	@GetMapping("/admin/find-all-employees-by-name")
	public ResponseEntity<ReqRes> findAllEmployeesByName(@RequestBody ReqRes reqRes) {
		return ResponseEntity.ok(employeesManagementService.findEmployeesByName(reqRes.getFullName()));
	}

	@GetMapping("/admin/get-employee/{empId}")
	public ResponseEntity<ReqRes> getEmployeeById(@PathVariable Long empId) {
		return ResponseEntity.ok(employeesManagementService.getEmployeeById(empId));
	}

	@PutMapping("/admin/update/{empId}")
	public ResponseEntity<ReqRes> updateEmployee(@PathVariable Long empId, @RequestBody EmployeeDTO employeeDTO) {
		return ResponseEntity.ok(employeesManagementService.updateEmployee(empId, employeeDTO));
	}

	@GetMapping("/adminuser/get-profile")
	public ResponseEntity<ReqRes> getMyProfile() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String email = authentication.getName();
		ReqRes responseReqRes = employeesManagementService.getMyInfo(email);
		return ResponseEntity.status(responseReqRes.getStatusCode()).body(responseReqRes);

	}

	@DeleteMapping("/admin/delete/{empId}")
	public ResponseEntity<ReqRes> deleteEmployee(@PathVariable Long empId) {
		return ResponseEntity.ok(employeesManagementService.deleteEmployee(empId));
	}

	@DeleteMapping("/admin/delete/{empId}/project/{projectId}")
	public ResponseEntity<ReqRes> deleteProject(@PathVariable Long empId, @PathVariable Long projectId) {
		return ResponseEntity.ok(employeesManagementService.deleteProject(empId, projectId));
	}

	@DeleteMapping("/admin/delete/{empId}/employmentHistory/{employmentHistoryId}")
	public ResponseEntity<ReqRes> deleteEmploymentHistory(@PathVariable Long empId,
			@PathVariable Long employmentHistoryId) {
		return ResponseEntity.ok(employeesManagementService.deleteEmploymentHistory(empId, employmentHistoryId));
	}

	@GetMapping("/user/download/")
	public ResponseEntity<ReqRes> downloadMySalarySlips() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String email = authentication.getName();
		ReqRes responseReqRes = employeesManagementService.getMySalarySlips(email);
		return ResponseEntity.status(responseReqRes.getStatusCode()).body(responseReqRes);

	}

	@PostMapping("/auth/forget")
	public ResponseEntity<ReqRes> forgetPassword(@RequestBody ReqRes req) {
		return ResponseEntity.ok(passwordResetService.requestPasswordReset(req.getEmail()));
	}

	@PostMapping("/auth/verify-otp")
	public ResponseEntity<ReqRes> verifyOtp(@RequestBody ReqRes req) {
		return ResponseEntity.ok(passwordResetService.verifyOtpandStore(req.getEmail(), req.getOtp()));
	}

	@PostMapping("/auth/reset")
	public ResponseEntity<ReqRes> resetPassword(@RequestBody ReqRes req) {
		return ResponseEntity.ok(passwordResetService.restPassword(req.getEmail(), req.getPassword()));
	}

	@PostMapping("/auth/resetPassword")
	public ResponseEntity<ReqRes> resetPasswordFromDashboard(@RequestBody ReqRes req) {
		return ResponseEntity.ok(passwordResetService.restPasswordFromDashBoard(req.getEmail(), req.getPassword()));
	}

}
