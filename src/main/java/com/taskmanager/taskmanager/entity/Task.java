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

    private String titlu;
    private String descriere;
    private String status;
    private String prioritate;
    private String categorie;

    @Column(name = "data_creare")
    private LocalDate dataCreare;

    @Column(name = "data_limita")
    private LocalDate dataLimita;

    // =========================
    // RELAȚII
    // =========================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_creator", nullable = false)
    private User creator;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;
}
