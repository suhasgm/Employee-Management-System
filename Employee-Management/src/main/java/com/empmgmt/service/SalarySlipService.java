package com.empmgmt.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.empmgmt.entity.CTCBreakup;
import com.empmgmt.entity.Employee;
import com.empmgmt.entity.SalarySlip;
import com.itextpdf.io.source.ByteArrayOutputStream;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.AreaBreak;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;

@Service
public class SalarySlipService {

	public List<SalarySlip> generateLastSixMonthsPayslips(Employee employee) {

		CTCBreakup ctcBreakup = employee.getFinance().getCtcBreakup();

		// Dividing each component of the CTC by 12 to get monthly salary components
		BigDecimal monthlyBasic = ctcBreakup.getBasicSalary().divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP);
		BigDecimal monthlyHra = ctcBreakup.getHra().divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP);
		BigDecimal monthlyPf = ctcBreakup.getProvidentFund().divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP);
		BigDecimal monthlySpecialAllowance = ctcBreakup.getSpecialAllowance().divide(BigDecimal.valueOf(12), 2,
				RoundingMode.HALF_UP);
		BigDecimal monthlyBonus = ctcBreakup.getBonus() != null
				? ctcBreakup.getBonus().divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP)
				: BigDecimal.ZERO;
		BigDecimal monthlyOtherBenefits = ctcBreakup.getOtherBenefits() != null
				? ctcBreakup.getOtherBenefits().divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP)
				: BigDecimal.ZERO;

		// Monthly Total Salary
		BigDecimal monthlyTotalSalary = monthlyBasic.add(monthlyHra).add(monthlySpecialAllowance).add(monthlyBonus)
				.add(monthlyOtherBenefits).subtract(monthlyPf);
//-------------------------------------------------------------

		List<SalarySlip> payslips = new ArrayList<>();

		// For the last 6 months
		for (int i = 0; i < 6; i++) {
			SalarySlip payslip = new SalarySlip();
			payslip.setMonth(LocalDate.now().minusMonths(i).getMonth().toString());
			payslip.setEmployeeName(employee.getFullName());
			payslip.setEmployeeCode(employee.getEmployeeId());
			payslip.setBasicSalary(monthlyBasic);
			payslip.setHra(monthlyHra);
			payslip.setProvidentFund(monthlyPf);
			payslip.setSpecialAllowance(monthlySpecialAllowance);
			payslip.setBonus(monthlyBonus);
			payslip.setOtherBenefits(monthlyOtherBenefits);
			payslip.setTotalSalary(monthlyTotalSalary);
			payslips.add(payslip);
		}

		return payslips;
	}

	public byte[] generatePDF(List<SalarySlip> payslips) {
		ByteArrayOutputStream out = new ByteArrayOutputStream();

		PdfWriter writer = new PdfWriter(out);

		Document document = new Document(new PdfDocument(writer));
		for (SalarySlip payslip : payslips) {
			document.add(new Paragraph("Genze Align Technologies Private Limited")
					.setTextAlignment(TextAlignment.CENTER).setBold().setFontSize(20).setMarginTop(10));
			document.add(new Paragraph("Salary Slip").setTextAlignment(TextAlignment.CENTER).setBold().setFontSize(20));

			document.add(new Paragraph("Employee Name: " + payslip.getEmployeeName()));
			document.add(new Paragraph("Employee Code: " + payslip.getEmployeeCode()));
			document.add(new Paragraph("UAN Number: " + 1018750 + "" + payslip.getEmployeeCode()));
			document.add(new Paragraph("Salary Slip for: " + payslip.getMonth().toString().substring(0, 1).toUpperCase()
					+ payslip.getMonth().toString().substring(1).toLowerCase()));
			// Creating a table for the salary breakdown
			float[] columnWidths = { 1, 2 };
			Table table = new Table(columnWidths);
			table.setWidth(UnitValue.createPercentValue(100));

			table.addCell(new Paragraph("Description").setBold().setTextAlignment(TextAlignment.CENTER)
					.setBackgroundColor(new DeviceRgb(0, 204, 204)));
			table.addCell(new Paragraph("Amount").setBold().setTextAlignment(TextAlignment.CENTER)
					.setBackgroundColor(new DeviceRgb(0, 204, 204)));

			table.addCell(new Paragraph("Basic Salary").setTextAlignment(TextAlignment.LEFT));
			table.addCell(new Paragraph(payslip.getBasicSalary().toString()).setTextAlignment(TextAlignment.RIGHT));
			table.addCell(new Paragraph("HRA").setTextAlignment(TextAlignment.LEFT));
			table.addCell(new Paragraph(payslip.getHra().toString()).setTextAlignment(TextAlignment.RIGHT));
			table.addCell(new Paragraph("Special Allowance").setTextAlignment(TextAlignment.LEFT));
			table.addCell(
					new Paragraph(payslip.getSpecialAllowance().toString()).setTextAlignment(TextAlignment.RIGHT));
			table.addCell(new Paragraph("Bonus").setTextAlignment(TextAlignment.LEFT));
			table.addCell(new Paragraph(payslip.getBonus().toString()).setTextAlignment(TextAlignment.RIGHT));
			table.addCell(new Paragraph("Other Benefits").setTextAlignment(TextAlignment.LEFT));
			table.addCell(new Paragraph(payslip.getOtherBenefits().toString()).setTextAlignment(TextAlignment.RIGHT));
			table.addCell(new Paragraph("Provident Fund(deduction)").setTextAlignment(TextAlignment.RIGHT));
			table.addCell(new Paragraph("-" + payslip.getProvidentFund().toString())
					.setTextAlignment(TextAlignment.RIGHT).setBold());
			table.addCell(new Paragraph("Total Salary").setTextAlignment(TextAlignment.RIGHT).setBold()
					.setBackgroundColor(new DeviceRgb(0, 204, 204)));
			table.addCell(new Paragraph(payslip.getTotalSalary().toString()).setTextAlignment(TextAlignment.RIGHT)
					.setBackgroundColor(new DeviceRgb(0, 204, 204)).setBold());

			document.add(table);
			document.add(new AreaBreak());
		}

		document.close();
		return out.toByteArray();
	}

}
