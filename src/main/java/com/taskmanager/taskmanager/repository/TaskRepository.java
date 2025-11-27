package com.taskmanager.taskmanager.repository;

import com.taskmanager.taskmanager.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // ✔ USER: DOAR task-urile lui
    @Query("SELECT t FROM Task t " +
            "WHERE t.idCreator = :userId " +
            "AND (:status IS NULL OR t.status = :status) " +
            "AND (:prioritate IS NULL OR t.prioritate = :prioritate) " +
            "AND (:categorie IS NULL OR t.categorie LIKE %:categorie%)")
    List<Task> filterTasks(
            @Param("status") String status,
            @Param("prioritate") String prioritate,
            @Param("categorie") String categorie,
            @Param("userId") Long userId
    );

    // ✔ EDITOR: toate task-urile
    @Query("SELECT t FROM Task t " +
            "WHERE (:status IS NULL OR t.status = :status) " +
            "AND (:prioritate IS NULL OR t.prioritate = :prioritate) " +
            "AND (:categorie IS NULL OR t.categorie LIKE %:categorie%)")
    List<Task> filterTasksForEditor(
            @Param("status") String status,
            @Param("prioritate") String prioritate,
            @Param("categorie") String categorie
    );

    // ✔ ADMIN & Dashboard
    @Query("SELECT COUNT(t) FROM Task t WHERE t.status = :status")
    int countByStatus(@Param("status") String status);
}
