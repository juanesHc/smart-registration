package com.project.data_center.entity.enums;

import lombok.Getter;

@Getter
public enum DocumentTypeEnum {

    CC("Cédula de Ciudadanía"),
    TI("Tarjeta de Identidad"),
    CE("Cédula de Extranjería"),
    PASSPORT("Pasaporte");

    private final String description;

    DocumentTypeEnum(String description) {
        this.description = description;
    }

    public String getCode() {
        return this.name();
    }
}
