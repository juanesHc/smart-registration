package com.project.data_center.entity;

import com.project.data_center.entity.enums.DocumentTypeEnum;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="type_id")
@Getter
@Setter
public class TypeIdEntity extends BaseEntity{


    @Enumerated(EnumType.STRING)
    @Column(unique = true, nullable = false, length = 20)
    private DocumentTypeEnum code;

    @Column(nullable = false, length = 100)
    private String description;

}
