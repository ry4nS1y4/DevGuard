package com.devguard.dashboard;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class DashboardStats {
    private long totalBugs;
    private long openBugs;
    private long closedBugs;
    private long criticalBugs;
    private long totalTestCases;
    private long passedTestCases;
    private long failedTestCases;
    private long blockedTestCases;
    private long notRunTestCases;
    private double passRate;
    private Map<String, Long> bugsBySeverity;
    private Map<String, Long> bugsByStatus;
    private List<RecentBug> recentBugs;

    @Data @Builder @AllArgsConstructor @NoArgsConstructor
    public static class RecentBug {
        private Long id;
        private String title;
        private String severity;
        private String status;
        private String projectName;
        private LocalDateTime createdAt;
    }
}
