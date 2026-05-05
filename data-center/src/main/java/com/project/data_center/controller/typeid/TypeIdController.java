package com.project.data_center.controller.typeid;

import com.project.data_center.dto.typeid.RetrieveDocumentTypeDto;
import com.project.data_center.service.typeid.RetrieveTypeId;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping("/api/typeid")
@RestController
@RequiredArgsConstructor
public class TypeIdController {

    private final RetrieveTypeId retrieveTypeId;

    @GetMapping("/retrieve")
    public ResponseEntity<List<RetrieveDocumentTypeDto>> getDocumentType(){
        return ResponseEntity.ok(retrieveTypeId.getAllDocumentTypes());
    }


}
