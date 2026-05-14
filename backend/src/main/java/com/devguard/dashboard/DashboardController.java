package com.devguard.dashboard;

import com.devguard.bug.Bug;
import com.devguard.bug.BugRepository;
import com.devguard.testcase.TestCase;
import com.devguard.testcase.TestCaseRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Dashboard statistics endpoint")
public class DashboardController {

    private final BugRepository bugRepository;
    private final TestCaseRepository testCaseRepository;

    @GetMapping("/stats")
    @Operation(summary = "Get dashboard statistics")
    public ResponseEntity<DashboardStats> getStats() {
        long totalBugs        = bugRepository.count();
        long openBugs         = bugRepository.countByStatus(Bug.Status.OPEN);
        long closedBugs       = bugRepository.countByStatus(Bug.Status.CLOSED);
        long criticalBugs     = bugRepository.countBySeverity(Bug.Severity.CRITICAL);

        long totalTestCases   = testCaseRepository.count();
        long passedTestCases  = testCaseRepository.countByStatus(TestCase.Status.PASSED);
        long failedTestCases  = testCaseRepository.countByStatus(TestCase.Status.FAILED);
        long blockedTestCases = testCaseRepository.countByStatus(TestCase.Status.BLOCKED);
        long notRunTestCases  = testCaseRepository.countByStatus(TestCase.Status.NOT_RUN);
        double passRate       = totalTestCases > 0 ? (double) passedTestCases / totalTestCases * 100 : 0;

        Map<String, Long> bugsBySeverity = Arrays.stream(Bug.Severity.values())
                .collect(Collectors.toMap(Enum::name, bugRepository::countBySeverity,
                        (a, b) -> a, LinkedHashMap::new));

        Map<String, Long> bugsByStatus = Arrays.stream(Bug.Status.values())
                .collect(Collectors.toMap(Enum::name, bugRepository::countByStatus,
                        (a, b) -> a, LinkedHashMap::new));

        List<DashboardStats.RecentBug> recentBugs = bugRepository.findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(b -> DashboardStats.RecentBug.builder()
                        .id(b.getId())
                        .title(b.getTitle())
                        .severity(b.getSeverity().name())
                        .status(b.getStatus().name())
                        .projectName(b.getProject().getName())
                        .createdAt(b.getCreatedAt())
                        .build())
                .toList();

        return ResponseEntity.ok(DashboardStats.builder()
                .totalBugs(totalBugs)
                .openBugs(openBugs)
                .closedBugs(closedBugs)
                .criticalBugs(criticalBugs)
                .totalTestCases(totalTestCases)
                .passedTestCases(passedTestCases)
                .failedTestCases(failedTestCases)
                .blockedTestCases(blockedTestCases)
                .notRunTestCases(notRunTestCases)
                .passRate(passRate)
                .bugsBySeverity(bugsBySeverity)
                .bugsByStatus(bugsByStatus)
                .recentBugs(recentBugs)
                .build());
    }
}
