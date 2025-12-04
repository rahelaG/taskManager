package com.taskmanager.taskmanager.controller_archived;

import com.taskmanager.taskmanager.entity.Task;
import com.taskmanager.taskmanager.service.TaskService;
import com.taskmanager.taskmanager.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/editor")
public class EditorController {

    private final TaskService taskService;
    private final UserService userService;

    public EditorController(TaskService taskService, UserService userService) {
        this.taskService = taskService;
        this.userService = userService;
    }

    /**
     * Pagina de listare a tuturor task-urilor pentru EDITOR (Thymeleaf).
     * TODO (Phase 4): Va fi înlocuită de React <EditorTasksPage>,
     * care va folosi API-ul /api/editor/tasks.
     */
    @GetMapping("/tasks")
    public String allTasks(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String prioritate,
            @RequestParam(required = false) String categorie,
            Model model,
            Authentication authentication
    ) {
        model.addAttribute("username", authentication.getName());

        List<Task> tasks = taskService.filterTasksForEditor(status, prioritate, categorie);
        model.addAttribute("tasks", tasks);

        return "tasks-editor";
    }

    /**
     * Formular de creare task (Thymeleaf).
     * TODO (Phase 4): Logica de creare va fi apelată din React prin /api/editor/tasks (POST).
     */
    @GetMapping("/task/create")
    public String createTaskForm(Model model, Authentication authentication) {
        model.addAttribute("username", authentication.getName());
        model.addAttribute("task", new Task());
        model.addAttribute("users", userService.findAllUsers());
        return "editor-task-create";
    }

    @PostMapping("/task/save")
    public String saveTask(@ModelAttribute Task task, @RequestParam Long userId) {
        task.setIdCreator(userId);
        taskService.save(task);
        return "redirect:/editor/tasks";
    }

    /**
     * Formular de editare task (Thymeleaf).
     * TODO (Phase 4): Va fi înlocuit de React, care va folosi /api/editor/tasks/{id} (PUT).
     */
    @GetMapping("/task/edit/{id}")
    public String editTaskForm(@PathVariable Long id, Model model, Authentication authentication) {
        model.addAttribute("username", authentication.getName());
        Task task = taskService.findById(id);
        model.addAttribute("task", task);
        model.addAttribute("users", userService.findAllUsers());
        return "editor-task-edit";
    }

    @PostMapping("/task/update")
    public String updateTask(@ModelAttribute Task task, @RequestParam Long userId) {
        task.setIdCreator(userId);
        taskService.update(task);
        return "redirect:/editor/tasks";
    }

    @GetMapping("/task/delete/{id}")
    public String deleteTask(@PathVariable Long id) {
        taskService.delete(id);
        return "redirect:/editor/tasks";
    }

    @PostMapping("/task/assign")
    public String assignTask(@RequestParam Long taskId, @RequestParam Long userId) {
        Task task = taskService.findById(taskId);
        task.setIdCreator(userId);
        taskService.update(task);
        return "redirect:/editor/tasks";
    }
}
