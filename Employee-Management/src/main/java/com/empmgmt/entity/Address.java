package com.empmgmt.entity;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class Address {
	private String city;
	private String addresslineI;
	private String addresslineII;
	private Integer pinCode;

}
