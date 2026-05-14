package com.devguard.bug;

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
@RequestMapping("/api/bugs")
@RequiredArgsConstructor
@Tag(name = "Bugs", description = "Bug tracking endpoints")
public class BugController {

    private final BugService bugService;

    @GetMapping
    @Operation(summary = "Get all bugs")
    public ResponseEntity<List<BugResponse>> getAllBugs() {
        return ResponseEntity.ok(bugService.getAllBugs().stream().map(BugResponse::from).toList());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get bug by ID")
    public ResponseEntity<BugResponse> getBug(@PathVariable Long id) {
        return ResponseEntity.ok(BugResponse.from(bugService.getBugById(id)));
    }

    @GetMapping("/project/{projectId}")
    @Operation(summary = "Get all bugs for a project")
    public ResponseEntity<List<BugResponse>> getBugsByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(bugService.getBugsByProject(projectId).stream().map(BugResponse::from).toList());
    }

    @PostMapping
    @Operation(summary = "Create a new bug")
    public ResponseEntity<BugResponse> createBug(@Valid @RequestBody CreateBugRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(BugResponse.from(bugService.createBug(request)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a bug")
    public ResponseEntity<BugResponse> updateBug(
            @PathVariable Long id,
            @Valid @RequestBody UpdateBugRequest request) {
        return ResponseEntity.ok(BugResponse.from(bugService.updateBug(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a bug")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBug(@PathVariable Long id) {
        bugService.deleteBug(id);
        return ResponseEntity.noContent().build();
    }

    // ── DTOs ─────────────────────────────────────────────────────────────

    @Data
    public static class CreateBugRequest {
        @NotBlank
        private String title;
        private String description;
        private String stepsToReproduce;
        private String expectedResult;
        private String actualResult;
        private Bug.Severity severity;
        private Bug.Priority priority;
        @NotNull
        private Long projectId;
        private Long assignedToId;
    }

    @Data
    public static class UpdateBugRequest {
        private String title;
        private String description;
        private String stepsToReproduce;
        private String expectedResult;
        private String actualResult;
        private Bug.Severity severity;
        private Bug.Priority priority;
        private Bug.Status status;
        private Long assignedToId;
    }

    @Data @Builder @AllArgsConstructor @NoArgsConstructor
    public static class BugResponse {
        private Long id;
        private String title;
        private String description;
        private String stepsToReproduce;
        private String expectedResult;
        private String actualResult;
        private Bug.Severity severity;
        private Bug.Priority priority;
        private Bug.Status status;
        private Long projectId;
        private String projectName;
        private Long createdById;
        private String createdByName;
        private Long assignedToId;
        private String assignedToName;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public static BugResponse from(Bug b) {
            return BugResponse.builder()
                    .id(b.getId())
                    .title(b.getTitle())
                    .description(b.getDescription())
                    .stepsToReproduce(b.getStepsToReproduce())
                    .expectedResult(b.getExpectedResult())
                    .actualResult(b.getActualResult())
                    .severity(b.getSeverity())
                    .priority(b.getPriority())
                    .status(b.getStatus())
                    .projectId(b.getProject().getId())
                    .projectName(b.getProject().getName())
                    .createdById(b.getCreatedBy().getId())
                    .createdByName(b.getCreatedBy().getFullName())
                    .assignedToId(b.getAssignedTo() != null ? b.getAssignedTo().getId() : null)
                    .assignedToName(b.getAssignedTo() != null ? b.getAssignedTo().getFullName() : null)
                    .createdAt(b.getCreatedAt())
                    .updatedAt(b.getUpdatedAt())
                    .build();
        }
    }
}
