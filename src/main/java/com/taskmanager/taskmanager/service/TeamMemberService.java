package com.taskmanager.taskmanager.service;

import com.taskmanager.taskmanager.entity.TeamMember;
import com.taskmanager.taskmanager.entity.TeamRole;

import java.util.List;

public interface TeamMemberService {

    TeamMember addMemberToTeam(Long teamId, Long userId, TeamRole role);

    List<TeamMember> getMembersByTeam(Long teamId);

    List<TeamMember> getTeamsByUser(Long userId);

    TeamMember updateMemberRole(Long teamId, Long userId, TeamRole role);

    void removeMemberFromTeam(Long teamId, Long userId);
}