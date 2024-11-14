package com.empmgmt.dto;

import lombok.Data;

@Data
public class AddressDTO {
	private String city;
	private String addressLineI;
	private String addressLineII;
	private Integer pinCode;
}
