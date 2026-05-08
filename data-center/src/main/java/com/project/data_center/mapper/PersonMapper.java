package com.project.data_center.mapper;

import com.project.data_center.dto.person.request.RegisterPersonRequestDto;
import com.project.data_center.dto.person.request.UpdatePersonDataRequestDto;
import com.project.data_center.dto.person.response.RegisterPersonResponseDto;
import com.project.data_center.dto.person.response.RetrievePersonDataResponseDto;
import com.project.data_center.entity.PersonEntity;
import com.project.data_center.entity.TypeIdEntity;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface PersonMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "typeIdEntity", source = "typeIdEntity")
    @Mapping(target = "password", source = "hashedPassword")
    PersonEntity toEntity(RegisterPersonRequestDto dto, TypeIdEntity typeIdEntity, String hashedPassword);

    @Mapping(target = "documentType", source = "typeIdEntity.code")
    RetrievePersonDataResponseDto toRetrieveDto(PersonEntity entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "numberId", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "typeIdEntity", ignore = true)
    void updatePersonFromDto(UpdatePersonDataRequestDto dto, @MappingTarget PersonEntity entity);
}
