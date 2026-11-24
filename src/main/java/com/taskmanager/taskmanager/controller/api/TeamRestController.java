package com.taskmanager.taskmanager.controller.api;

import com.taskmanager.taskmanager.entity.Team;
import com.taskmanager.taskmanager.entity.TeamMember;
import com.taskmanager.taskmanager.entity.TeamRole;
import com.taskmanager.taskmanager.service.TeamMemberService;
import com.taskmanager.taskmanager.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TeamRestController {

    private final TeamService teamService;
    private final TeamMemberService teamMemberService;

    // =========================
    // TEAM CRUD
    // =========================

    @PostMapping
    public Team createTeam(@RequestBody Team team) {
        return teamService.createTeam(team);
    }

    @GetMapping
    public List<Team> getAllTeams() {
        return teamService.getAllTeams();
    }

    @GetMapping("/{id}")
    public Team getTeamById(@PathVariable Long id) {
        return teamService.getTeamById(id);
    }

    @PutMapping("/{id}")
    public Team updateTeam(@PathVariable Long id, @RequestBody Team team) {
        return teamService.updateTeam(id, team);
    }

    @DeleteMapping("/{id}")
    public void deleteTeam(@PathVariable Long id) {
        teamService.deleteTeam(id);
    }

    // =========================
    // TEAM MEMBERS
    // =========================

    @PostMapping("/{teamId}/members/{userId}")
    public TeamMember addMemberToTeam(
            @PathVariable Long teamId,
            @PathVariable Long userId,
            @RequestParam(defaultValue = "MEMBER") TeamRole role
    ) {
        return teamMemberService.addMemberToTeam(teamId, userId, role);
    }

    @GetMapping("/{teamId}/members")
    public List<TeamMember> getMembersByTeam(@PathVariable Long teamId) {
        return teamMemberService.getMembersByTeam(teamId);
    }

    @GetMapping("/user/{userId}")
    public List<TeamMember> getTeamsByUser(@PathVariable Long userId) {
        return teamMemberService.getTeamsByUser(userId);
    }

    @PutMapping("/{teamId}/members/{userId}/role")
    public TeamMember updateMemberRole(
            @PathVariable Long teamId,
            @PathVariable Long userId,
            @RequestParam TeamRole role
    ) {
        return teamMemberService.updateMemberRole(teamId, userId, role);
    }

    @DeleteMapping("/{teamId}/members/{userId}")
    public void removeMemberFromTeam(
            @PathVariable Long teamId,
            @PathVariable Long userId
    ) {
        teamMemberService.removeMemberFromTeam(teamId, userId);
    }
}