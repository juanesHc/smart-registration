package com.project.data_center.dto.person.request;

import com.project.data_center.entity.enums.MessageCodes;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequestDto {

    @NotBlank(message = MessageCodes.EMAIL_REQUIRED)
    private String email;

    @NotBlank(message = MessageCodes.PASSWORD_REQUIRED)
    private String password;

}
