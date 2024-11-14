package com.empmgmt.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.empmgmt.entity.ProfessionalDetails;

public interface ProfessionalDetailsRepository extends JpaRepository<ProfessionalDetails, Long> {
}
