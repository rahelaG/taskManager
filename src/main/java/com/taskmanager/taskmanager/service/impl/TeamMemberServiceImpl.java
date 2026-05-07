package com.taskmanager.taskmanager.service.impl;

import com.taskmanager.taskmanager.entity.Team;
import com.taskmanager.taskmanager.entity.TeamMember;
import com.taskmanager.taskmanager.entity.TeamRole;
import com.taskmanager.taskmanager.entity.User;
import com.taskmanager.taskmanager.repository.TeamMemberRepository;
import com.taskmanager.taskmanager.repository.TeamRepository;
import com.taskmanager.taskmanager.repository.UserRepository;
import com.taskmanager.taskmanager.service.TeamMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamMemberServiceImpl implements TeamMemberService {

    private final TeamMemberRepository teamMemberRepository;
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;

    @Override
    public TeamMember addMemberToTeam(Long teamId, Long userId, TeamRole role) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Echipa nu a fost gasita."));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Userul nu a fost gasit."));

        if (teamMemberRepository.existsByTeamAndUser(team, user)) {
            throw new RuntimeException("Userul este deja membru in aceasta echipa.");
        }

        TeamMember teamMember = TeamMember.builder()
                .team(team)
                .user(user)
                .role(role)
                .build();

        return teamMemberRepository.save(teamMember);
    }

    @Override
    public List<TeamMember> getMembersByTeam(Long teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Echipa nu a fost gasita."));

        return teamMemberRepository.findByTeam(team);
    }

    @Override
    public List<TeamMember> getTeamsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Userul nu a fost gasit."));

        return teamMemberRepository.findByUser(user);
    }

    @Override
    public TeamMember updateMemberRole(Long teamId, Long userId, TeamRole role) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Echipa nu a fost gasita."));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Userul nu a fost gasit."));

        TeamMember teamMember = teamMemberRepository.findByTeamAndUser(team, user)
                .orElseThrow(() -> new RuntimeException("Userul nu este membru in aceasta echipa."));

        teamMember.setRole(role);

        return teamMemberRepository.save(teamMember);
    }

    @Override
    public void removeMemberFromTeam(Long teamId, Long userId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Echipa nu a fost gasita."));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Userul nu a fost gasit."));

        TeamMember teamMember = teamMemberRepository.findByTeamAndUser(team, user)
                .orElseThrow(() -> new RuntimeException("Userul nu este membru in aceasta echipa."));

        teamMemberRepository.delete(teamMember);
    }
}