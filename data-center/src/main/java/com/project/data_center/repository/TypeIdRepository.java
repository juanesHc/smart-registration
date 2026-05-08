package com.project.data_center.repository;

import com.project.data_center.entity.TypeIdEntity;
import com.project.data_center.entity.enums.DocumentTypeEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TypeIdRepository extends JpaRepository<TypeIdEntity, UUID> {

    Optional<TypeIdEntity> findByCode(DocumentTypeEnum code);

    boolean existsByCode(DocumentTypeEnum code);

}
