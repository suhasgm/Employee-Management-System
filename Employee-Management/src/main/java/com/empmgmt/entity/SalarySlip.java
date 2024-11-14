package com.empmgmt.entity;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class SalarySlip {
	private String employeeName;
	private long employeeCode;
	private String month;
	private BigDecimal basicSalary;
	private BigDecimal hra;
	private BigDecimal providentFund;
	private BigDecimal specialAllowance;
	private BigDecimal bonus;
	private BigDecimal otherBenefits;
	private BigDecimal totalSalary;

}
