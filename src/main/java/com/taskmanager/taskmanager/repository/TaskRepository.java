package com.taskmanager.taskmanager.repository;

import com.taskmanager.taskmanager.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

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
}
