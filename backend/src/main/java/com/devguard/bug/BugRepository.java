package com.devguard.bug;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BugRepository extends JpaRepository<Bug, Long> {
    List<Bug> findByProjectId(Long projectId);
    List<Bug> findByAssignedToId(Long userId);
    long countBySeverity(Bug.Severity severity);
    long countByStatus(Bug.Status status);
    List<Bug> findTop5ByOrderByCreatedAtDesc();
}
