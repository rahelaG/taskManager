package com.taskmanager.taskmanager.dto;

import java.time.LocalDate;

public class TaskResponse {

    private Long id;
    private String titlu;
    private String descriere;
    private String status;
    private String prioritate;
    private String categorie;
    private LocalDate dataCreare;
    private Long projectId;
    private Long idCreator;
    private LocalDate dataLimita;


    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitlu() { return titlu; }
    public void setTitlu(String titlu) { this.titlu = titlu; }

    public String getDescriere() { return descriere; }
    public void setDescriere(String descriere) { this.descriere = descriere; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPrioritate() { return prioritate; }
    public void setPrioritate(String prioritate) { this.prioritate = prioritate; }

    public String getCategorie() { return categorie; }
    public void setCategorie(String categorie) { this.categorie = categorie; }

    public LocalDate getDataCreare() { return dataCreare; }
    public void setDataCreare(LocalDate dataCreare) { this.dataCreare = dataCreare; }

    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }

    public Long getIdCreator() { return idCreator; }
    public void setIdCreator(Long idCreator) { this.idCreator = idCreator; }

    public LocalDate getDataLimita() {
        return dataLimita;
    }

    public void setDataLimita(LocalDate dataLimita) {
        this.dataLimita = dataLimita;
    }

}
