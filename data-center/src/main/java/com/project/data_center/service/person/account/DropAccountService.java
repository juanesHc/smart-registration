package com.project.data_center.service.person.account;

import com.project.data_center.dto.person.response.DropPersonDataResponseDto;
import com.project.data_center.entity.PersonEntity;
import com.project.data_center.entity.enums.MessageCodes;
import com.project.data_center.entity.enums.MessageCodes.*;
import com.project.data_center.exception.RegisterPersonException;
import com.project.data_center.repository.PersonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DropAccountService {

    private final PersonRepository personRepository;

    public DropPersonDataResponseDto dropPersonData(String email){
       PersonEntity personEntity= personRepository.findByEmail (email).
               orElseThrow(()->new RegisterPersonException(MessageCodes.PERSON_NOT_FOUND));

       personRepository.delete(personEntity);
       return new DropPersonDataResponseDto(MessageCodes.ELIMINATION_SUCCESS);
    }

}
