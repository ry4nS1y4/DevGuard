package com.devguard.project;

import com.devguard.shared.exception.ApiException;
import com.devguard.user.User;
import com.devguard.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ApiException("Project not found", HttpStatus.NOT_FOUND));
    }

    public Project createProject(ProjectController.CreateProjectRequest request) {
        User owner = currentUser();
        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : Project.Status.ACTIVE)
                .owner(owner)
                .build();
        return projectRepository.save(project);
    }

    public Project updateProject(Long id, ProjectController.UpdateProjectRequest request) {
        Project project = getProjectById(id);
        User current = currentUser();

        boolean isOwner = project.getOwner().getId().equals(current.getId());
        boolean isAdmin = current.getRole() == User.Role.ADMIN;
        if (!isOwner && !isAdmin) {
            throw new ApiException("Access denied", HttpStatus.FORBIDDEN);
        }

        if (request.getName() != null) project.setName(request.getName());
        if (request.getDescription() != null) project.setDescription(request.getDescription());
        if (request.getStatus() != null) project.setStatus(request.getStatus());
        return projectRepository.save(project);
    }

    public void deleteProject(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new ApiException("Project not found", HttpStatus.NOT_FOUND);
        }
        projectRepository.deleteById(id);
    }

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("Authenticated user not found", HttpStatus.UNAUTHORIZED));
    }
}
