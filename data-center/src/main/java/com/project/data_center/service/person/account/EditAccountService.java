package com.project.data_center.service.person.account;

import com.project.data_center.dto.person.request.UpdatePersonDataRequestDto;
import com.project.data_center.dto.person.response.UpdatePersonDataResponseDto;
import com.project.data_center.entity.PersonEntity;
import com.project.data_center.entity.enums.MessageCodes;
import com.project.data_center.exception.EditPersonDataException;
import com.project.data_center.mapper.PersonMapper;
import com.project.data_center.repository.PersonRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class EditAccountService {

    private final PersonRepository personRepository;
    private final PersonMapper personMapper;

    @Transactional
    public UpdatePersonDataResponseDto editPersonData(String email, UpdatePersonDataRequestDto request) {
        log.info("Updating person data for email: {}", email);

        PersonEntity person = personRepository.findByEmail(email)
                .orElseThrow(() -> new EditPersonDataException(MessageCodes.PERSON_NOT_FOUND));

        personMapper.updatePersonFromDto(request, person);

        log.info("Person updated successfully: {}", email);
        return new UpdatePersonDataResponseDto(MessageCodes.UPDATE_SUCCESS);
    }

}
