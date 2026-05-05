package com.project.data_center.entity.datainitializer;

import com.project.data_center.entity.TypeIdEntity;
import com.project.data_center.entity.enums.DocumentTypeEnum;
import com.project.data_center.repository.TypeIdRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final TypeIdRepository typeIdRepository;

    @Override
    public void run(String... args) {
        Arrays.stream(DocumentTypeEnum.values()).forEach(type -> {
            if (!typeIdRepository.existsByCode(type)) {
                TypeIdEntity newType = new TypeIdEntity();
                newType.setCode(type);
                typeIdRepository.save(newType);
                log.info("Document type inserted: {}", type.getCode());
            }
        });
        log.info("DataInitializer completed");
    }
}