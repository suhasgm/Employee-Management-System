package com.empmgmt.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class CTCBreakupDTO {
	private Long ctcId;
	private BigDecimal basicSalary;
	private BigDecimal hra;
	private BigDecimal providentFund;
	private BigDecimal specialAllowance;
	private BigDecimal bonus;
	private BigDecimal otherBenefits;
	private BigDecimal totalCTC;
}
