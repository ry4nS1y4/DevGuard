package com.devguard.project;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Tag(name = "Projects", description = "Project management endpoints")
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    @Operation(summary = "Get all projects")
    public ResponseEntity<List<ProjectResponse>> getAllProjects() {
        List<ProjectResponse> projects = projectService.getAllProjects()
                .stream().map(ProjectResponse::from).toList();
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get project by ID")
    public ResponseEntity<ProjectResponse> getProject(@PathVariable Long id) {
        return ResponseEntity.ok(ProjectResponse.from(projectService.getProjectById(id)));
    }

    @PostMapping
    @Operation(summary = "Create a new project")
    public ResponseEntity<ProjectResponse> createProject(@Valid @RequestBody CreateProjectRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ProjectResponse.from(projectService.createProject(request)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a project")
    public ResponseEntity<ProjectResponse> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProjectRequest request) {
        return ResponseEntity.ok(ProjectResponse.from(projectService.updateProject(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a project")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    // ── DTOs ─────────────────────────────────────────────────────────────

    @Data
    public static class CreateProjectRequest {
        @NotBlank
        private String name;
        private String description;
        private Project.Status status;
    }

    @Data
    public static class UpdateProjectRequest {
        private String name;
        private String description;
        private Project.Status status;
    }

    @Data @Builder @AllArgsConstructor @NoArgsConstructor
    public static class ProjectResponse {
        private Long id;
        private String name;
        private String description;
        private Project.Status status;
        private Long ownerId;
        private String ownerName;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private int memberCount;
        private int openBugsCount;
        private int testCaseCount;

        public static ProjectResponse from(Project p) {
            return ProjectResponse.builder()
                    .id(p.getId())
                    .name(p.getName())
                    .description(p.getDescription())
                    .status(p.getStatus())
                    .ownerId(p.getOwner().getId())
                    .ownerName(p.getOwner().getFullName())
                    .createdAt(p.getCreatedAt())
                    .updatedAt(p.getUpdatedAt())
                    .memberCount(0)
                    .openBugsCount(0)
                    .testCaseCount(0)
                    .build();
        }
    }
}
