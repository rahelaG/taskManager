package com.taskmanager.taskmanager.service.impl;

import com.taskmanager.taskmanager.entity.Team;
import com.taskmanager.taskmanager.repository.TeamRepository;
import com.taskmanager.taskmanager.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamServiceImpl implements TeamService {

    private final TeamRepository teamRepository;

    @Override
    public Team createTeam(Team team) {
        if (teamRepository.existsByName(team.getName())) {
            throw new RuntimeException("Exista deja o echipa cu acest nume.");
        }

        return teamRepository.save(team);
    }

    @Override
    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    @Override
    public Team getTeamById(Long id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Echipa nu a fost gasita."));
    }

    @Override
    public Team updateTeam(Long id, Team updatedTeam) {
        Team team = getTeamById(id);

        team.setName(updatedTeam.getName());
        team.setDescription(updatedTeam.getDescription());

        return teamRepository.save(team);
    }

    @Override
    public void deleteTeam(Long id) {
        Team team = getTeamById(id);
        teamRepository.delete(team);
    }
}