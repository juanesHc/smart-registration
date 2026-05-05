package com.project.data_center.repository;

import com.project.data_center.entity.TypeIdEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TypeIdRepository extends JpaRepository<TypeIdEntity, UUID> {
}
