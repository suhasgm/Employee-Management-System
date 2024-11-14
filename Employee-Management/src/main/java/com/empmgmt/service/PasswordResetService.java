package com.empmgmt.service;

import java.util.Optional;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.empmgmt.dto.ReqRes;
import com.empmgmt.entity.Employee;
import com.empmgmt.repository.EmployeeRepo;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class PasswordResetService {
	@Autowired
	private JavaMailSender emailSender;

	@Autowired
	private PasswordEncoder passwordEncoder;
	@Autowired
	private EmployeeRepo employeeRepo;

	private String generateOtp() {
		// Generate a random OTP (for example, a 6-digit number)
		return String.valueOf(100000 + new Random().nextInt(900000)); // 6 digits
	}

	private String generatedOtp; // Store generated OTP temporarily

	public ReqRes requestPasswordReset(String email) {
		ReqRes response = new ReqRes();

		try {
			Optional<Employee> employee = employeeRepo.findByEmail(email.trim());
			if (employee.isPresent()) {
				// Generate OTP
				generatedOtp = generateOtp();
				String username = employee.get().getFullName().toUpperCase();
				String subject = "Your OTP for Password Reset is Here! 🔒";
				String verificationCode = "Your OTP:" + generatedOtp;
				String htmlMessage = "<html>" + "<body style=\"font-family: Arial, sans-serif;\">"
						+ "<div style=\"background-color: #f5f5f5; padding: 20px;\">"
						+ "<h2 style=\"color: #333;\">Hello " + username + "👋</h2>"
						+ "<p style=\"font-size: 16px;\">We’re here to help you get back in! To reset your password, please use the One-Time Password (OTP) below:</p>"
						+ "<div style=\"background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">"
						+ "<h3 style=\"color: #333;font-size: 18px;font-weight: bold;\">Verification Code</h3>"
						+ "<p style=\"font-size: 27px; font-weight: bold; color: #007bff;\">" + verificationCode
						+ "</p>"
						+ "<p style=\"font-size: 10px;\">Simply enter this code on the password reset page to create a new password.\r\n"
						+ "\r\n"
						+ "If you didn’t request a password reset, just ignore this email. Your account is safe and sound!</p>"
						+ "</div>" + "</div>" + "</body>" + "</html>";

				// Send OTP to email
				sendEmail(email, subject, htmlMessage);

				response.setStatusCode(200);
				response.setMessage("OTP Sent Successfully....");
			} else {
				response.setStatusCode(404);
				response.setMessage("Employee Not Found");
			}

		} catch (Exception e) {
			response.setStatusCode(500);
			response.setMessage("Error occurred while getting Employee ID " + e.getMessage());
		}

		return response;
	}

	private ConcurrentHashMap<String, String> verifiedOtpEmailMap = new ConcurrentHashMap<>();

	public ReqRes verifyOtpandStore(String email, String otp) {
		ReqRes response = new ReqRes();
		if (verifyOtp(otp)) {

			verifiedOtpEmailMap.put(email, otp);
			response.setStatusCode(200);
			response.setMessage("OTP verified. You can now reset your password.");
			return response;
		} else {
			response.setStatusCode(401);
			response.setMessage("Invalid Otp");
			return response;
		}
	}

	public boolean verifyOtp(String otp) {
		return generatedOtp != null && generatedOtp.equals(otp);

	}

	public void sendEmail(String to, String subject, String body) throws MessagingException {

		MimeMessage message = emailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true);

		helper.setTo(to);
		helper.setSubject(subject);
		helper.setText(body, true);

		emailSender.send(message);
	}

	public ReqRes restPassword(String email, String password) {
		ReqRes response = new ReqRes();

		String otp = verifiedOtpEmailMap.get(email);

		if (otp == null) {
			response.setStatusCode(401);
			response.setMessage("OTP not verified or expired");
			return response;
		}
		try {
			Optional<Employee> employee = employeeRepo.findByEmail(email);
			if (employee.isPresent()) {
				employee.get().setPassword(passwordEncoder.encode(password));
				response.setStatusCode(200);
				response.setMessage("Password reset successfully");
				verifiedOtpEmailMap.remove(email);
				employeeRepo.save(employee.get());
				return response;
			} else {
				response.setStatusCode(404);
				response.setMessage("Employee Not Found");
			}

			return response;

		} catch (Exception e) {

			response.setStatusCode(500);
			response.setMessage("Error occured while getting Employee id " + e.getMessage());
			return response;
		}

	}

	public ReqRes restPasswordFromDashBoard(String email, String password) {
		ReqRes response = new ReqRes();
		try {
			Optional<Employee> employee = employeeRepo.findByEmail(email);
			if (employee.isPresent()) {
				employee.get().setPassword(passwordEncoder.encode(password));
				response.setStatusCode(200);
				response.setMessage("Password reset successfully");
				verifiedOtpEmailMap.remove(email);
				employeeRepo.save(employee.get());
				return response;
			} else {
				response.setStatusCode(404);
				response.setMessage("Employee Not Found");
			}

			return response;

		} catch (Exception e) {

			response.setStatusCode(500);
			response.setMessage("Error occured while getting Employee id " + e.getMessage());
			return response;
		}

	}
}
