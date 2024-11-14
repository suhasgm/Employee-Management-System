package com.empmgmt.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.empmgmt.entity.Employee;

public interface EmployeeRepo extends JpaRepository<Employee, Long> {
	@Query("SELECT e FROM Employee e WHERE LOWER(e.email) = LOWER(:email)")
	Optional<Employee> findByEmail(@Param("email") String email);

	@Query("SELECT e FROM Employee e WHERE LOWER(e.fullName) = LOWER(:fullName)")
	List<Employee> findAllByName(@Param("fullName") String fullName);

	Boolean existsByEmail(String email);
}
