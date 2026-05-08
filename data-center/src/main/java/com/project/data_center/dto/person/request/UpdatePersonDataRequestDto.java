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
public class UpdatePersonDataRequestDto {

    @Size(min = 3, max = 20, message = MessageCodes.FIRST_NAME_LENGTH_INVALID)
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$", message = MessageCodes.FIRST_NAME_FORMAT_INVALID)
    private String firstName;

    @Size(min = 3, max = 20, message = MessageCodes.LAST_NAME_LENGTH_INVALID)
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$", message =MessageCodes.LAST_NAME_FORMAT_INVALID)
    private String lastName;

    @Pattern(regexp = "^3\\d{9}$", message = MessageCodes.PHONE_FORMAT_INVALID)
    private String phone;

    private String extraData;

    @Size(max = 255, message = MessageCodes.ADDRESS_LENGTH_INVALID)
    private String address;

    @Size(max = 100, message = MessageCodes.CITY_LENGTH_INVALID)
    private String city;

    @Size(max = 100, message = MessageCodes.COUNTRY_LENGTH_INVALID)
    private String country;

    private Double latitude;
    private Double longitude;
}
