package com.project.data_center.mapper;

import com.project.data_center.dto.person.request.RegisterPersonRequestDto;
import com.project.data_center.dto.person.response.RegisterPersonResponseDto;
import com.project.data_center.entity.PersonEntity;
import com.project.data_center.entity.TypeIdEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PersonMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "typeIdEntity", source = "typeIdEntity")
    @Mapping(target = "password", source = "hashedPassword")
    PersonEntity toEntity(RegisterPersonRequestDto dto, TypeIdEntity typeIdEntity, String hashedPassword);

    RegisterPersonResponseDto toResponseDto(PersonEntity entity);
}
