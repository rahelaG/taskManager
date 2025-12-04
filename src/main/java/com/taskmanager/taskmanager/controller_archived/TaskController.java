package com.taskmanager.taskmanager.controller_archived;

import com.taskmanager.taskmanager.entity.Task;
import com.taskmanager.taskmanager.service.TaskService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    /**
     * Pagina cu task-urile unui user (Thymeleaf).
     * TODO (Phase 4): Va fi înlocuită de React <UserTasksPage>,
     * care va apela API-ul /api/tasks.
     */
    @GetMapping("/tasks")
    public String listTasks(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String prioritate,
            @RequestParam(required = false) String categorie,
            Authentication authentication,
            Model model
    ) {
        // USERNAME
        String username = authentication.getName();
        model.addAttribute("username", username);

        // LISTA TASK-URI FILTRATE DOAR PENTRU UTILIZATORUL LOGAT
        List<Task> tasks = taskService.filterTasks(status, prioritate, categorie, username);
        model.addAttribute("tasks", tasks);

        // MESAJ FRUMOS PENTRU FILTRARE
        StringBuilder message = new StringBuilder("Toate task-urile tale");

        if (status != null && !status.isEmpty()) message.append(" cu status = ").append(status);
        if (prioritate != null && !prioritate.isEmpty()) message.append(" și prioritate = ").append(prioritate);
        if (categorie != null && !categorie.isEmpty()) message.append(" și categorie = ").append(categorie);

        model.addAttribute("filterMessage", message.toString());

        return "tasks-user";
    }
}
