package com.empmgmt.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.empmgmt.entity.EmploymentHistory;

public interface EmploymentHistoryRepository extends JpaRepository<EmploymentHistory, Long> {

	@Query("SELECT e FROM EmploymentHistory e WHERE LOWER(e.companyName) LIKE LOWER(CONCAT(:companyName, '%')) AND e.professionalDetails.employeeId = :employeeId")
	Optional<EmploymentHistory> findByJobTitle(@Param("companyName") String companyName,
			@Param("employeeId") Long employeeId);

}
