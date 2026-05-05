package com.project.data_center.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="type_id")
@Getter
@Setter
public class TypeIdEntity extends BaseEntity{
    private String code;

    private String description;
}
