package com.empmgmt.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import lombok.Data;

@Entity
@Data
public class Finance {

	@Id
	private long fid;
	@Column(name = "pan_card", nullable = false, unique = true)
	private String panCard;
	@Column(name = "aadhar_card", nullable = false, unique = true)
	private long Aadharcard;
	@Embedded
	private BankDetails bankDetails;// contains Bank Name, Branch and IFSC Code
	@OneToOne(mappedBy = "finance", cascade = CascadeType.ALL)
	private CTCBreakup ctcBreakup;

	@OneToOne
	@MapsId
	@JoinColumn(name = "fid", referencedColumnName = "employee_id")
	private Employee employee;
}
