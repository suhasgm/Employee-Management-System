package com.empmgmt.service;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.function.Function;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.annotation.PostConstruct;

@Component
public class JWTUtils {

	private SecretKey key;
	private static final long EXPIRATION_TIME = 25200000; // 24 hours

	@Value("${jwt.secret}")
	private String secretString;

	// Initialize the key after the bean is fully initialized
	@PostConstruct
	public void init() {
		byte[] keyBytes = Base64.getDecoder().decode(secretString.getBytes(StandardCharsets.UTF_8));
		this.key = new SecretKeySpec(keyBytes, "HmacSHA256");
	}

	// Generate token for user details
	public String generateToken(UserDetails userDetails) {
		return Jwts.builder().setSubject(userDetails.getUsername()).setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)).signWith(key) // Sign the token
																										// with the
																										// secret key
				.compact();
	}

	// Generate refresh token with custom claims
	public String generateRefreshToken(HashMap<String, Object> claims, UserDetails userDetails) {
		return Jwts.builder().setClaims(claims).setSubject(userDetails.getUsername())
				.setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)).signWith(key) // Sign the refresh
																										// token with
																										// the secret
																										// key
				.compact();
	}

	// Extract username from the token
	public String extractUsername(String token) {
		return extractClaims(token, Claims::getSubject);
	}

	// Extract specific claims from the token
	private <T> T extractClaims(String token, Function<Claims, T> claimsResolver) {
		return claimsResolver.apply(Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody());
	}

	// Validate token by comparing username and checking expiration
	public boolean isTokenValid(String token, UserDetails userDetails) {
		final String username = extractUsername(token);
		return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
	}

	// Check if the token is expired
	public boolean isTokenExpired(String token) {
		return extractClaims(token, Claims::getExpiration).before(new Date());
	}
}
