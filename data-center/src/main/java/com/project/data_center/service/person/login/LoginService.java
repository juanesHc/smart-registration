package com.project.data_center.service.person.login;

import com.project.data_center.dto.person.request.LoginRequestDto;
import com.project.data_center.dto.person.response.LoginResponseDto;
import com.project.data_center.entity.PersonEntity;
import com.project.data_center.entity.enums.MessageCodes;
import com.project.data_center.entity.security.SecurityUser;
import com.project.data_center.exception.LoginException;
import com.project.data_center.exception.RetrievePersonDataException;
import com.project.data_center.repository.PersonRepository;
import com.project.data_center.service.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Slf4j
@Service
@RequiredArgsConstructor
public class LoginService {

    private final PersonRepository personRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginResponseDto login(LoginRequestDto loginRequestDto) {

        PersonEntity personEntity=personRepository.findByEmail((loginRequestDto.getEmail())).
                orElseThrow(()->new RetrievePersonDataException(MessageCodes.PERSON_NOT_FOUND));

        if (!passwordEncoder.matches(loginRequestDto.getPassword(), personEntity.getPassword())) {
            log.warn("Wrong password");
            throw new LoginException(MessageCodes.INVALID_CREDENTIALS);
        }

        LoginResponseDto loginResponseDto = new LoginResponseDto();
        SecurityUser securityUser=new SecurityUser(personEntity);
        loginResponseDto.setToken(jwtService.generateToken(securityUser));

        return loginResponseDto;
    }


}
