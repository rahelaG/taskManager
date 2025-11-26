package com.taskmanager.taskmanager.controller;

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

    // ⭐ 1. LISTĂ TASK-URI (toate task-urile)
    @GetMapping("/tasks")
    public String allTasks(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String prioritate,
            @RequestParam(required = false) String categorie,
            Model model,
            Authentication authentication
    ) {
        String username = authentication.getName();
        model.addAttribute("username", username);

        List<Task> tasks = taskService.filterTasksForEditor(status, prioritate, categorie);
        model.addAttribute("tasks", tasks);

        return "tasks-editor";
    }

    // ⭐ 2. FORMULAR CREARE TASK
    @GetMapping("/task/create")
    public String createTaskForm(Model model) {
        model.addAttribute("task", new Task());
        model.addAttribute("users", userService.findAllUsers());
        return "editor-task-create";
    }

    // ⭐ 3. SALVARE TASK NOU
    @PostMapping("/task/save")
    public String saveTask(@ModelAttribute Task task, @RequestParam Long userId) {
        task.setIdCreator(userId);
        taskService.save(task);
        return "redirect:/editor/tasks";
    }

    // ⭐ 4. FORMULAR EDITARE TASK
    @GetMapping("/task/edit/{id}")
    public String editTaskForm(@PathVariable Long id, Model model) {
        Task task = taskService.findById(id);
        model.addAttribute("task", task);
        model.addAttribute("users", userService.findAllUsers());
        return "editor-task-edit";
    }

    // ⭐ 5. UPDATE TASK
    @PostMapping("/task/update")
    public String updateTask(@ModelAttribute Task task, @RequestParam Long userId) {
        task.setIdCreator(userId);
        taskService.update(task);
        return "redirect:/editor/tasks";
    }

    // ⭐ 6. ȘTERGERE TASK
    @GetMapping("/task/delete/{id}")
    public String deleteTask(@PathVariable Long id) {
        taskService.delete(id);
        return "redirect:/editor/tasks";
    }

    // ⭐ 7. REASIGNARE TASK
    @PostMapping("/task/assign")
    public String assignTask(@RequestParam Long taskId, @RequestParam Long userId) {
        Task task = taskService.findById(taskId);
        task.setIdCreator(userId);
        taskService.update(task);
        return "redirect:/editor/tasks";
    }
}
