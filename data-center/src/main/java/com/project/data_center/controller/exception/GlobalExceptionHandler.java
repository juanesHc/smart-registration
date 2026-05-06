package com.project.data_center.controller.exception;

import com.project.data_center.entity.enums.MessageCodes;
import com.project.data_center.exception.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(error.getField(), error.getDefaultMessage());
        }

        log.warn("Validation failed: {}", fieldErrors);
        return buildResponseWithFields(HttpStatus.BAD_REQUEST, "Validation failed", fieldErrors);
    }

    @ExceptionHandler(RegisterPersonException.class)
    public ResponseEntity<Map<String, Object>> handleRegisterPerson(RegisterPersonException ex) {
        log.warn("Registration error: {}", ex.getMessage());
        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(EditPersonDataException.class)
    public ResponseEntity<Map<String, Object>> handleEditPerson(EditPersonDataException ex) {
        log.warn("Edit error: {}", ex.getMessage());
        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(RetrievePersonDataException.class)
    public ResponseEntity<Map<String, Object>> handleRetrievePerson(RetrievePersonDataException ex) {
        log.warn("Retrieve error: {}", ex.getMessage());
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(RetrieveTypeId.class)
    public ResponseEntity<Map<String, Object>> handleRetrieveTypeId(RetrieveTypeId ex) {
        log.warn("Type ID retrieval error: {}", ex.getMessage());
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(LoginException.class)
    public ResponseEntity<Map<String, Object>> handleLogin(LoginException ex) {
        log.warn("Login error: {}", ex.getMessage());
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(DropPersonDataException.class)
    public ResponseEntity<Map<String, Object>> handleDropPerson(DropPersonDataException ex) {
        log.warn("Drop account error: {}", ex.getMessage());

        HttpStatus status = MessageCodes.INVALID_CREDENTIALS.equals(ex.getMessage())
                ? HttpStatus.UNAUTHORIZED
                : HttpStatus.BAD_REQUEST;

        return buildResponse(status, ex.getMessage());
    }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        log.error("Unexpected error: ", ex);
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, MessageCodes.INTERNAL_ERROR);
    }

    private ResponseEntity<Map<String, Object>> buildResponse(HttpStatus status, String messageCode) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", status.value());
        response.put("messageCode", messageCode);
        return ResponseEntity.status(status).body(response);
    }

    private ResponseEntity<Map<String, Object>> buildResponseWithFields(
            HttpStatus status, String error, Map<String, String> fields) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", status.value());
        response.put("error", error);
        response.put("fields", fields);
        return ResponseEntity.status(status).body(response);
    }
}