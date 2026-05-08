package com.project.data_center.dto.person.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RetrievePersonDataResponseDto {

    private String firstName;

    private String lastName;

    private String email;

    private String phone;

    private String numberId;

    private String extraData;

    private String documentType;

    private String address;

    private String city;

    private String country;

    private Double latitude;

    private Double longitude;

}
