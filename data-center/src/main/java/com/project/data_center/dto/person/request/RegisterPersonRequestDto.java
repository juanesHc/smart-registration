package com.project.data_center.dto.person.request;

import com.project.data_center.entity.enums.MessageCodes;
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

    @NotBlank(message = MessageCodes.FIRST_NAME_REQUIRED)
    @Size(min = 3, max = 20, message = MessageCodes.FIRST_NAME_LENGTH_INVALID)
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$", message = MessageCodes.FIRST_NAME_FORMAT_INVALID)
    private String firstName;

    @NotBlank(message = MessageCodes.LAST_NAME_REQUIRED)
    @Size(min = 3, max = 20, message = MessageCodes.LAST_NAME_LENGTH_INVALID)
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$", message =MessageCodes.LAST_NAME_FORMAT_INVALID)
    private String lastName;

    @NotBlank(message = MessageCodes.EMAIL_REQUIRED)
    @Email(message = MessageCodes.EMAIL_FORMAT_INVALID)
    @Size(max = 100, message = MessageCodes.EMAIL_LENGTH_INVALID)
    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@gmail\\.com$",message = MessageCodes.EMAIL_MUST_BE_GMAIL)
    private String email;

    @NotBlank(message = MessageCodes.PHONE_REQUIRED)
    @Pattern(regexp = "^3\\d{9}$", message = MessageCodes.PHONE_FORMAT_INVALID)
    private String phone;

    @NotBlank(message = MessageCodes.DOCUMENT_NUMBER_REQUIRED)
    @Pattern(regexp = "^\\d+$", message = MessageCodes.DOCUMENT_NUMBER_FORMAT_INVALID)
    @Size(min = 6, max = 15, message = MessageCodes.DOCUMENT_NUMBER_LENGTH_INVALID)
    private String numberId;

    @NotBlank(message = MessageCodes.PASSWORD_REQUIRED)
    @Size(min = 8, max = 50, message = MessageCodes.PASSWORD_LENGTH_INVALID)
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,50}$",message = MessageCodes.PASSWORD_FORMAT_INVALID)
    private String password;

    @NotBlank(message = MessageCodes.CONFIRM_PASSWORD_REQUIRED)
    private String confirmPassword;

    private String extraData;

    @NotBlank(message = MessageCodes.DOCUMENT_TYPE_REQUIRED)
    private String documentType;

    @NotBlank(message = MessageCodes.ADDRESS_REQUIRED)
    @Size(max = 255, message = MessageCodes.ADDRESS_LENGTH_INVALID)
    private String address;

    @NotBlank(message = MessageCodes.CITY_REQUIRED)
    @Size(max = 100, message = MessageCodes.CITY_LENGTH_INVALID)
    private String city;

    @NotBlank(message = MessageCodes.COUNTRY_REQUIRED)
    @Size(max = 100, message = MessageCodes.COUNTRY_LENGTH_INVALID)
    private String country;

    @NotNull(message = MessageCodes.LATITUDE_REQUIRED)
    private Double latitude;

    @NotNull(message = MessageCodes.LONGITUDE_REQUIRED)
    private Double longitude;

}
