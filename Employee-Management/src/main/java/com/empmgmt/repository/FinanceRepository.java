package com.empmgmt.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.empmgmt.entity.Finance;

public interface FinanceRepository extends JpaRepository<Finance, Long> {

}
