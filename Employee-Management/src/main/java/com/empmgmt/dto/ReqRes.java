package com.empmgmt.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
public class ReqRes {

	private int statusCode;
	private String error;
	private String message;
	private String token;
	private String refreshToken;
	private String expirationTime;
	private EmployeeDTO OurEmployee;
	private List<EmployeeDTO> ourEmployeesList;
	private byte[] salarySlipsbytes;
	private String email;
	private String password;
	private String role;
	private String otp;
	private String fullName;

}
