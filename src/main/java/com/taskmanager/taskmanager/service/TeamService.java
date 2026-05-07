package com.taskmanager.taskmanager.service;

import com.taskmanager.taskmanager.entity.Team;

import java.util.List;

public interface TeamService {

    Team createTeam(Team team);

    List<Team> getAllTeams();

    Team getTeamById(Long id);

    Team updateTeam(Long id, Team updatedTeam);

    void deleteTeam(Long id);
}