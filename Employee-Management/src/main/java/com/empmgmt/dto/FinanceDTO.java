package com.empmgmt.dto;

import lombok.Data;

@Data
public class FinanceDTO {

	private long fid;
	private String panCard;
	private long aadharCard;
	private BankDetailsDTO bankDetails; // DTO for embedded BankDetails
	private CTCBreakupDTO ctcBreakup; // DTO for associated CTCBreakup
}
