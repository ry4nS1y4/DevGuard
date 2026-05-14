package com.devguard.testcase;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/test-cases")
@RequiredArgsConstructor
@Tag(name = "Test Cases", description = "Test case management endpoints")
public class TestCaseController {

    private final TestCaseService testCaseService;

    @GetMapping
    @Operation(summary = "Get all test cases")
    public ResponseEntity<List<TestCaseResponse>> getAllTestCases() {
        return ResponseEntity.ok(testCaseService.getAllTestCases().stream().map(TestCaseResponse::from).toList());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get test case by ID")
    public ResponseEntity<TestCaseResponse> getTestCase(@PathVariable Long id) {
        return ResponseEntity.ok(TestCaseResponse.from(testCaseService.getTestCaseById(id)));
    }

    @GetMapping("/project/{projectId}")
    @Operation(summary = "Get all test cases for a project")
    public ResponseEntity<List<TestCaseResponse>> getTestCasesByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(testCaseService.getTestCasesByProject(projectId).stream().map(TestCaseResponse::from).toList());
    }

    @PostMapping
    @Operation(summary = "Create a new test case")
    public ResponseEntity<TestCaseResponse> createTestCase(@Valid @RequestBody CreateTestCaseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(TestCaseResponse.from(testCaseService.createTestCase(request)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a test case")
    public ResponseEntity<TestCaseResponse> updateTestCase(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTestCaseRequest request) {
        return ResponseEntity.ok(TestCaseResponse.from(testCaseService.updateTestCase(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a test case")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTestCase(@PathVariable Long id) {
        testCaseService.deleteTestCase(id);
        return ResponseEntity.noContent().build();
    }

    // ── DTOs ─────────────────────────────────────────────────────────────

    @Data
    public static class CreateTestCaseRequest {
        @NotBlank
        private String title;
        private String description;
        private String preconditions;
        private String testSteps;
        private String expectedResult;
        private TestCase.Priority priority;
        @NotNull
        private Long projectId;
    }

    @Data
    public static class UpdateTestCaseRequest {
        private String title;
        private String description;
        private String preconditions;
        private String testSteps;
        private String expectedResult;
        private String actualResult;
        private TestCase.Priority priority;
        private TestCase.Status status;
    }

    @Data @Builder @AllArgsConstructor @NoArgsConstructor
    public static class TestCaseResponse {
        private Long id;
        private String title;
        private String description;
        private String preconditions;
        private String testSteps;
        private String expectedResult;
        private String actualResult;
        private TestCase.Status status;
        private TestCase.Priority priority;
        private Long projectId;
        private String projectName;
        private Long createdById;
        private String createdByName;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public static TestCaseResponse from(TestCase tc) {
            return TestCaseResponse.builder()
                    .id(tc.getId())
                    .title(tc.getTitle())
                    .description(tc.getDescription())
                    .preconditions(tc.getPreconditions())
                    .testSteps(tc.getTestSteps())
                    .expectedResult(tc.getExpectedResult())
                    .actualResult(tc.getActualResult())
                    .status(tc.getStatus())
                    .priority(tc.getPriority())
                    .projectId(tc.getProject().getId())
                    .projectName(tc.getProject().getName())
                    .createdById(tc.getCreatedBy().getId())
                    .createdByName(tc.getCreatedBy().getFullName())
                    .createdAt(tc.getCreatedAt())
                    .updatedAt(tc.getUpdatedAt())
                    .build();
        }
    }
}
