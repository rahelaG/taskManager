package com.taskmanager.taskmanager.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "utilizatori")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nume;

    @Column(unique = true, nullable = false)
    private String utilizator;

    @JsonIgnore
    @Column(nullable = false)
    private String parola;

    @Column(nullable = false)
    private String rol; // ROLE_USER / ROLE_EDITOR / ROLE_ADMIN
}
