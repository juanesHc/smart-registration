package com.project.data_center.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="person")
@Getter
@Setter
public class PersonEntity extends BaseEntity{

    private String firstName;

    private String lastName;

    private String email;

    private String phone;

    private String numberId;

    private String password;

    private String extraData;

    private String address;
    private String city;
    private String country;
    private Double latitude;
    private Double longitude;


    @ManyToOne
    @JoinColumn(name = "type_id_id")
    private TypeIdEntity typeIdEntity;

}
