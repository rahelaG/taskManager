package com.taskmanager.taskmanager.tests;

import com.taskmanager.taskmanager.dto.TaskRequest;
import jakarta.validation.Validation;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.junit.jupiter.api.Assertions.assertEquals;

class TaskRequestValidationTest {

    @ParameterizedTest(name = "Title length {0}, expected valid: {1}")
    @CsvSource({
            "2, false",
            "3, true",
            "100, true",
            "101, false"
    })
    void titleLength_hasExpectedValidationOutcome(int length, boolean expectedValid) {
        TaskRequest request = new TaskRequest();
        request.setTitlu("a".repeat(length));

        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            boolean titleIsValid = factory.getValidator()
                    .validateProperty(request, "titlu")
                    .isEmpty();

            assertEquals(expectedValid, titleIsValid);
        }
    }
}