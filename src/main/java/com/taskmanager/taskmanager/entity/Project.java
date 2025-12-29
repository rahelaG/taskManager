package com.taskmanager.taskmanager.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "proiecte")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Numele proiectului
    @Column(name = "nume", nullable = false)
    private String nume;

    // Descriere optionala
    @Column(name = "descriere", length = 2000)
    private String descriere;

    // Exemplu: "ACTIVE", "INACTIVE", "DONE"
    @Column(name = "status", nullable = false)
    private String status;

    // Data crearii proiectului
    @Column(name = "data_creare", nullable = false)
    private LocalDate dataCreare;

    // Editorul responsabil de proiect (asignat de ADMIN in v1)
    @Column(name = "id_editor", nullable = false)
    private Long editorId;
}
