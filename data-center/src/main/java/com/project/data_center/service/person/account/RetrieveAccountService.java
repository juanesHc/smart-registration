package com.project.data_center.service.person.account;

import com.project.data_center.dto.person.response.RetrievePersonDataResponseDto;
import com.project.data_center.entity.PersonEntity;
import com.project.data_center.entity.TypeIdEntity;
import com.project.data_center.entity.enums.MessageCodes;
import com.project.data_center.exception.RetrievePersonDataException;
import com.project.data_center.exception.RetrieveTypeId;
import com.project.data_center.mapper.PersonMapper;
import com.project.data_center.repository.PersonRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RetrieveAccountService {

    private final PersonRepository personRepository;
    private final PersonMapper personMapper;

    public RetrievePersonDataResponseDto retrievePersonData(String id){
        PersonEntity personEntity=personRepository.findById(UUID.fromString((id))).
                orElseThrow(()->new RetrievePersonDataException(MessageCodes.PERSON_NOT_FOUND));

        return personMapper.toRetrieveDto(personEntity);

    }


}
