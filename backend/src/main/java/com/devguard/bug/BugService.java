package com.devguard.bug;

import com.devguard.project.Project;
import com.devguard.project.ProjectRepository;
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
public class BugService {

    private final BugRepository bugRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public List<Bug> getAllBugs() {
        return bugRepository.findAll();
    }

    public Bug getBugById(Long id) {
        return bugRepository.findById(id)
                .orElseThrow(() -> new ApiException("Bug not found", HttpStatus.NOT_FOUND));
    }

    public List<Bug> getBugsByProject(Long projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new ApiException("Project not found", HttpStatus.NOT_FOUND);
        }
        return bugRepository.findByProjectId(projectId);
    }

    public Bug createBug(BugController.CreateBugRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ApiException("Project not found", HttpStatus.NOT_FOUND));

        User assignedTo = null;
        if (request.getAssignedToId() != null) {
            assignedTo = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ApiException("Assigned user not found", HttpStatus.NOT_FOUND));
        }

        Bug bug = Bug.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .stepsToReproduce(request.getStepsToReproduce())
                .expectedResult(request.getExpectedResult())
                .actualResult(request.getActualResult())
                .severity(request.getSeverity() != null ? request.getSeverity() : Bug.Severity.MEDIUM)
                .priority(request.getPriority() != null ? request.getPriority() : Bug.Priority.MEDIUM)
                .status(Bug.Status.OPEN)
                .project(project)
                .createdBy(currentUser())
                .assignedTo(assignedTo)
                .build();

        return bugRepository.save(bug);
    }

    public Bug updateBug(Long id, BugController.UpdateBugRequest request) {
        Bug bug = getBugById(id);

        if (request.getTitle() != null) bug.setTitle(request.getTitle());
        if (request.getDescription() != null) bug.setDescription(request.getDescription());
        if (request.getStepsToReproduce() != null) bug.setStepsToReproduce(request.getStepsToReproduce());
        if (request.getExpectedResult() != null) bug.setExpectedResult(request.getExpectedResult());
        if (request.getActualResult() != null) bug.setActualResult(request.getActualResult());
        if (request.getSeverity() != null) bug.setSeverity(request.getSeverity());
        if (request.getPriority() != null) bug.setPriority(request.getPriority());
        if (request.getStatus() != null) bug.setStatus(request.getStatus());

        if (request.getAssignedToId() != null) {
            User assignedTo = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ApiException("Assigned user not found", HttpStatus.NOT_FOUND));
            bug.setAssignedTo(assignedTo);
        }

        return bugRepository.save(bug);
    }

    public void deleteBug(Long id) {
        if (!bugRepository.existsById(id)) {
            throw new ApiException("Bug not found", HttpStatus.NOT_FOUND);
        }
        bugRepository.deleteById(id);
    }

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("Authenticated user not found", HttpStatus.UNAUTHORIZED));
    }
}
