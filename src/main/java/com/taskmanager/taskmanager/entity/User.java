package com.taskmanager.taskmanager.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role rol;

    @JsonIgnore
    @OneToMany(mappedBy = "user")
    @Builder.Default
    private List<TeamMember> teamMembers = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "editor", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Project> projects = new ArrayList<>();
}