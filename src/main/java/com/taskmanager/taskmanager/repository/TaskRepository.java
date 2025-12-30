package com.taskmanager.taskmanager.repository;

import com.taskmanager.taskmanager.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // USER – doar task-urile lui
    @Query("""
        SELECT t FROM Task t
        WHERE t.idCreator = :userId
        AND (:status IS NULL OR t.status = :status)
        AND (:prioritate IS NULL OR t.prioritate = :prioritate)
        AND (:categorie IS NULL OR t.categorie LIKE %:categorie%)
    """)
    List<Task> filterTasksForUser(
            @Param("status") String status,
            @Param("prioritate") String prioritate,
            @Param("categorie") String categorie,
            @Param("userId") Long userId
    );

    // EDITOR – task-uri din TOATE proiectele lui
    @Query("""
        SELECT t FROM Task t
        WHERE t.projectId IN :projectIds
        AND (:status IS NULL OR t.status = :status)
        AND (:prioritate IS NULL OR t.prioritate = :prioritate)
        AND (:categorie IS NULL OR t.categorie LIKE %:categorie%)
    """)
    List<Task> filterTasksForEditorProjects(
            @Param("projectIds") List<Long> projectIds,
            @Param("status") String status,
            @Param("prioritate") String prioritate,
            @Param("categorie") String categorie
    );

    // EDITOR – task-uri dintr-un proiect
    List<Task> findByProjectId(Long projectId);

    // DASHBOARD
    int countByStatus(String status);
    int countByPrioritate(String prioritate);
}

