package com.project.data_center.dto.person.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RegisterPersonRequestDto {

    @NotBlank(message = "FIRST_NAME_REQUIRED")
    @Size(min = 3, max = 20, message = "FIRST_NAME_LENGTH_INVALID")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$", message = "FIRST_NAME_FORMAT_INVALID")
    private String firstName;

    @NotBlank(message = "LAST_NAME_REQUIRED")
    @Size(min = 3, max = 20, message = "LAST_NAME_LENGTH_INVALID")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$", message = "LAST_NAME_FORMAT_INVALID")
    private String lastName;

    @NotBlank(message = "EMAIL_REQUIRED")
    @Email(message = "EMAIL_FORMAT_INVALID")
    @Size(max = 100, message = "EMAIL_LENGTH_INVALID")
    private String email;

    @NotBlank(message = "PHONE_REQUIRED")
    @Pattern(regexp = "^3\\d{9}$", message = "PHONE_FORMAT_INVALID")
    private String phone;

    @NotBlank(message = "DOCUMENT_NUMBER_REQUIRED")
    @Pattern(regexp = "^\\d+$", message = "DOCUMENT_NUMBER_FORMAT_INVALID")
    @Size(min = 6, max = 15, message = "DOCUMENT_NUMBER_LENGTH_INVALID")
    private String numberId;

    @NotBlank(message = "PASSWORD_REQUIRED")
    @Size(min = 8, max = 50, message = "PASSWORD_LENGTH_INVALID")
    private String password;

    private String extraData;

    @NotBlank(message = "DOCUMENT_TYPE_REQUIRED")
    private String documentType;

    @NotBlank(message = "ADDRESS_REQUIRED")
    @Size(max = 255, message = "ADDRESS_LENGTH_INVALID")
    private String address;

    @NotBlank(message = "CITY_REQUIRED")
    @Size(max = 100, message = "CITY_LENGTH_INVALID")
    private String city;

    @NotBlank(message = "COUNTRY_REQUIRED")
    @Size(max = 100, message = "COUNTRY_LENGTH_INVALID")
    private String country;

    @NotNull(message = "LATITUDE_REQUIRED")
    private Double latitude;

    @NotNull(message = "LONGITUDE_REQUIRED")
    private Double longitude;

}
