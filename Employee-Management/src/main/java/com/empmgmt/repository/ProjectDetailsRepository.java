package com.empmgmt.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.empmgmt.entity.ProjectDetails;

public interface ProjectDetailsRepository extends JpaRepository<ProjectDetails, Long> {
	@Query("SELECT p FROM ProjectDetails p WHERE p.projectCode = :projectCode AND p.employee.employeeId = :employeeId")
	Optional<ProjectDetails> findByProjectCodeAndEmployeeId(@Param("projectCode") Long projectCode,
			@Param("employeeId") Long employeeId);

}
