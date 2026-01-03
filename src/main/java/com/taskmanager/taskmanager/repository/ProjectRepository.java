package com.taskmanager.taskmanager.repository;

import com.taskmanager.taskmanager.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    // 🔹 Editor: vede proiectele lui
    List<Project> findByEditor_Id(Long editorId);

    // 🔹 Editor: acces la un proiect doar dacă e al lui
    Optional<Project> findByIdAndEditor_Id(Long projectId, Long editorId);

    // 🔹 Folosit de TaskService (editor → proiecte)
    @Query("select p.id from Project p where p.editor.id = :editorId")
    List<Long> findProjectIdsByEditorId(@Param("editorId") Long editorId);
}
