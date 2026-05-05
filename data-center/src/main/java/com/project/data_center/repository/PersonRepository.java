package com.project.data_center.repository;

import com.project.data_center.entity.PersonEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PersonRepository extends JpaRepository<PersonEntity, UUID> {

    boolean existsByEmail(String email);

    boolean existsByNumberId(String numberId);

    Optional<PersonEntity> findByEmail(String email);

}
