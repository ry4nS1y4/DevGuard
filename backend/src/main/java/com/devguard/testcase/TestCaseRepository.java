package com.devguard.testcase;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestCaseRepository extends JpaRepository<TestCase, Long> {
    List<TestCase> findByProjectId(Long projectId);
    List<TestCase> findByCreatedById(Long userId);
    long countByStatus(TestCase.Status status);
}
