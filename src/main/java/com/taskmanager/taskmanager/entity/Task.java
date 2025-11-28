package com.taskmanager.taskmanager.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "taskuri")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "titlu")
    private String titlu;

    @Column(name = "descriere")
    private String descriere;

    @Column(name = "status")
    private String status;

    @Column(name = "prioritate")
    private String prioritate;

    @Column(name = "categorie")
    private String categorie;

    @Column(name = "data_creare")
    private LocalDate dataCreare;

    @Column(name = "data_limita")
    private LocalDate dataLimita;

    @Column(name = "id_creator")
    private Long idCreator;
}
