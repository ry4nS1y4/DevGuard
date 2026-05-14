package com.devguard.testcase;

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
public class TestCaseService {

    private final TestCaseRepository testCaseRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public List<TestCase> getAllTestCases() {
        return testCaseRepository.findAll();
    }

    public TestCase getTestCaseById(Long id) {
        return testCaseRepository.findById(id)
                .orElseThrow(() -> new ApiException("Test case not found", HttpStatus.NOT_FOUND));
    }

    public List<TestCase> getTestCasesByProject(Long projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new ApiException("Project not found", HttpStatus.NOT_FOUND);
        }
        return testCaseRepository.findByProjectId(projectId);
    }

    public TestCase createTestCase(TestCaseController.CreateTestCaseRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ApiException("Project not found", HttpStatus.NOT_FOUND));

        TestCase testCase = TestCase.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .preconditions(request.getPreconditions())
                .testSteps(request.getTestSteps())
                .expectedResult(request.getExpectedResult())
                .priority(request.getPriority() != null ? request.getPriority() : TestCase.Priority.MEDIUM)
                .status(TestCase.Status.NOT_RUN)
                .project(project)
                .createdBy(currentUser())
                .build();

        return testCaseRepository.save(testCase);
    }

    public TestCase updateTestCase(Long id, TestCaseController.UpdateTestCaseRequest request) {
        TestCase testCase = getTestCaseById(id);

        if (request.getTitle() != null) testCase.setTitle(request.getTitle());
        if (request.getDescription() != null) testCase.setDescription(request.getDescription());
        if (request.getPreconditions() != null) testCase.setPreconditions(request.getPreconditions());
        if (request.getTestSteps() != null) testCase.setTestSteps(request.getTestSteps());
        if (request.getExpectedResult() != null) testCase.setExpectedResult(request.getExpectedResult());
        if (request.getActualResult() != null) testCase.setActualResult(request.getActualResult());
        if (request.getPriority() != null) testCase.setPriority(request.getPriority());
        if (request.getStatus() != null) testCase.setStatus(request.getStatus());

        return testCaseRepository.save(testCase);
    }

    public void deleteTestCase(Long id) {
        if (!testCaseRepository.existsById(id)) {
            throw new ApiException("Test case not found", HttpStatus.NOT_FOUND);
        }
        testCaseRepository.deleteById(id);
    }

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("Authenticated user not found", HttpStatus.UNAUTHORIZED));
    }
}
