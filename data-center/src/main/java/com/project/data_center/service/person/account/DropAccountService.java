package com.project.data_center.service.person.account;

import com.project.data_center.dto.person.request.DropPersonDataRequestDto;
import com.project.data_center.dto.person.response.DropPersonDataResponseDto;
import com.project.data_center.entity.PersonEntity;
import com.project.data_center.entity.enums.MessageCodes;
import com.project.data_center.entity.enums.MessageCodes.*;
import com.project.data_center.exception.DropPersonDataException;
import com.project.data_center.exception.RegisterPersonException;
import com.project.data_center.repository.PersonRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Slf4j
@Service
@RequiredArgsConstructor
public class DropAccountService {

    private final PersonRepository personRepository;
    private final PasswordEncoder passwordEncoder;

    public DropPersonDataResponseDto dropPersonData(String email, DropPersonDataRequestDto dto){
       PersonEntity personEntity= personRepository.findByEmail (email).
               orElseThrow(()->new RegisterPersonException(MessageCodes.PERSON_NOT_FOUND));

        if (!passwordEncoder.matches(dto.getCurrentPassword(), personEntity.getPassword())) {
            log.warn("Failed account deletion attempt for: {} (wrong password)", email);
            throw new DropPersonDataException(MessageCodes.INVALID_CREDENTIALS);
        }

       personRepository.delete(personEntity);
       return new DropPersonDataResponseDto(MessageCodes.ELIMINATION_SUCCESS);
    }

}
