package com.empmgmt.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import lombok.Data;

@Entity
@Data
public class CTCBreakup {

	@Id
	@Column(name = "ctc_id")
	private Long ctcId;
	@Column(name = "basic_salary", nullable = false)
	private BigDecimal basicSalary;
	@Column(name = "house_rent_allowance", nullable = false)
	private BigDecimal hra; // House Rent Allowance
	@Column(name = "provident_fund", nullable = false)
	private BigDecimal providentFund;
	@Column(name = "special_alowance", nullable = false)
	private BigDecimal specialAllowance;
	@Column(nullable = false)
	private BigDecimal bonus; // Optional, can be null
	@Column(name = "other_benefits")
	private BigDecimal otherBenefits; // Any other allowances or benefits
	@Column(name = "total_ctc", nullable = false)
	private BigDecimal totalCTC; // Total cost to company, computed field

	@OneToOne
	@MapsId
	@JoinColumn(name = "ctc_id")
	private Finance finance;

	public BigDecimal getTotalCTC() {
		BigDecimal total = BigDecimal.ZERO;

		if (basicSalary != null) {
			total = total.add(basicSalary);
		}
		if (hra != null) {
			total = total.add(hra);
		}
		if (providentFund != null) {
			total = total.add(providentFund);
		}
		if (specialAllowance != null) {
			total = total.add(specialAllowance);
		}
		if (bonus != null) {
			total = total.add(bonus);
		}
		if (otherBenefits != null) {
			total = total.add(otherBenefits);
		}

		return total;
	}

}
