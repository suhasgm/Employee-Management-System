package com.empmgmt.dto;

import lombok.Data;

@Data
public class BankDetailsDTO {
	private String bankName;
	private String branch;
	private String ifsccode;
}
