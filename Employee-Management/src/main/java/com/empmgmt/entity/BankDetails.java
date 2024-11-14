package com.empmgmt.entity;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class BankDetails {
	private String bankName;
	private String branch;
	private String iFSCCode;

}
