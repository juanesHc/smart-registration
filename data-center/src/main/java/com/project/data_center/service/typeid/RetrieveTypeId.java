package com.project.data_center.service.typeid;

import com.project.data_center.dto.typeid.RetrieveDocumentTypeDto;
import com.project.data_center.entity.enums.DocumentTypeEnum;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class RetrieveTypeId {
    public List<RetrieveDocumentTypeDto> getAllDocumentTypes() {
        return Arrays.stream(DocumentTypeEnum.values())
                .map(type -> new RetrieveDocumentTypeDto(type.getCode()))
                .toList();
    }
}
