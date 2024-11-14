package com.empmgmt.service;

import java.security.SecureRandom;

import org.springframework.stereotype.Service;

@Service
public class PasswordGenerator {

	private static final String UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	private static final String LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
	private static final String DIGITS = "0123456789";
	private static final String SPECIAL_CHARS = "!@#$%&*";

	private static final String ALL_CHARS = UPPERCASE + LOWERCASE + DIGITS + SPECIAL_CHARS;

	private static final SecureRandom random = new SecureRandom();

	public String generatePassword(int length) {

		StringBuilder password = new StringBuilder(length);

		// Ensure password contains at least one character from each group
		password.append(UPPERCASE.charAt(random.nextInt(UPPERCASE.length())));
		password.append(LOWERCASE.charAt(random.nextInt(LOWERCASE.length())));
		password.append(DIGITS.charAt(random.nextInt(DIGITS.length())));
		password.append(SPECIAL_CHARS.charAt(random.nextInt(SPECIAL_CHARS.length())));

		for (int i = 4; i < length; i++) {
			password.append(ALL_CHARS.charAt(random.nextInt(ALL_CHARS.length())));

		}

		return shuffleString(password.toString());

	}

	// Shuffle characters to make the password unpredictable
	private String shuffleString(String input) {
		char[] a = input.toCharArray();
		for (int i = a.length - 1; i > 0; i--) {
			int j = random.nextInt(i + 1);
			char temp = a[i];
			a[i] = a[j];
			a[j] = temp;
		}
		return new String(a);
	}
}
