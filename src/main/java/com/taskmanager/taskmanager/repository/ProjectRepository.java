package com.taskmanager.taskmanager.repository;

import com.taskmanager.taskmanager.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    // 🔹 Editor: vede proiectele asignate lui
    List<Project> findByEditorId(Long editorId);

    // 🔹 Editor / User: acces doar daca proiectul apartine editorului
    Optional<Project> findByIdAndEditorId(Long projectId, Long editorId);
}
