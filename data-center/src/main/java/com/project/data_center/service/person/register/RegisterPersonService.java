package com.project.data_center.service.person.register;

import com.project.data_center.dto.person.request.RegisterPersonRequestDto;
import com.project.data_center.dto.person.response.RegisterPersonResponseDto;
import com.project.data_center.entity.PersonEntity;
import com.project.data_center.entity.TypeIdEntity;
import com.project.data_center.entity.enums.DocumentTypeEnum;
import com.project.data_center.entity.enums.MessageCodes;
import com.project.data_center.exception.RegisterPersonException;
import com.project.data_center.mapper.PersonMapper;
import com.project.data_center.repository.PersonRepository;
import com.project.data_center.repository.TypeIdRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class RegisterPersonService {

        private final PasswordEncoder passwordEncoder;
        private final PersonRepository personRepository;
        private final TypeIdRepository typeIdRepository;
        private final PersonMapper personMapper;

        @Transactional
        public RegisterPersonResponseDto registerPerson(RegisterPersonRequestDto request) {
            log.info("Starting registration for email: {}", request.getEmail());

            DocumentTypeEnum documentTypeEnum = parseDocumentType(request.getDocumentType());

            TypeIdEntity typeIdEntity = typeIdRepository.findByCode(documentTypeEnum)
                    .orElseThrow(() -> new RegisterPersonException(MessageCodes.DOCUMENT_TYPE_NOT_FOUND));

            if (personRepository.existsByEmail(request.getEmail())) {
                throw new RegisterPersonException(MessageCodes.EMAIL_ALREADY_EXISTS);
            }
            if (personRepository.existsByNumberId(request.getNumberId())) {
                throw new RegisterPersonException(MessageCodes.DOCUMENT_NUMBER_ALREADY_EXISTS);
            }

            String hashedPassword = passwordEncoder.encode(request.getPassword());
            PersonEntity personEntity = personMapper.toEntity(request, typeIdEntity, hashedPassword);
            PersonEntity saved = personRepository.save(personEntity);

            log.info("Person registered successfully with id: {}", saved.getId());
            return new RegisterPersonResponseDto(MessageCodes.REGISTRATION_SUCCESS);
        }

    private DocumentTypeEnum parseDocumentType(String documentType) {
        try {
            return DocumentTypeEnum.valueOf(documentType.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new RegisterPersonException(MessageCodes.DOCUMENT_TYPE_INVALID);
        }
}
}
