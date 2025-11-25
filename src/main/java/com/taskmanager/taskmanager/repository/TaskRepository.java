package com.taskmanager.taskmanager.repository;

import com.taskmanager.taskmanager.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long>,
        JpaSpecificationExecutor<Task> {

    @Query("""
        SELECT t FROM Task t
        WHERE (:status IS NULL OR t.status = :status)
          AND (:prioritate IS NULL OR t.prioritate = :prioritate)
    """)
    List<Task> filterTasks(
            @Param("status") String status,
            @Param("prioritate") String prioritate
    );
}
