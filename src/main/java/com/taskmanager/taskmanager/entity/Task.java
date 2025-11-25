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

    @Column(length = 2000)
    private String descriere;

    private String status;     // TO_DO, IN_PROGRESS, DONE
    private String prioritate; // LOW, MEDIUM, HIGH

    private LocalDate dataCreare;
    private LocalDate dataLimita;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User userAsignat;
}
