import React, { useState } from 'react';
import './App.css';
import { Box, Button, Grid } from '@mui/material';
import { cloneDeep, shuffle } from 'lodash';
import { useRecoilState } from 'recoil';
import PlayersList from './components/PlayersList/PlayersList';
import { Team } from './interfaces/Team';
import TeamCard from './components/TeamCard/TeamCard';
import {
  GenerationOptions,
  GenerationType,
  PlayerFilterFn,
} from './interfaces/GenerationOptions';
import { playersAtom } from './atoms/Player';
import { commonStyles } from './util/Style';

const App = () => {
  const [players, setPlayers] = useRecoilState(playersAtom);

  const [teams, setTeams] = useState<Team[]>([
    { name: 'Team 1', players: [] },
    { name: 'Team 2', players: [] },
  ]);

  const getFilterFn = (options: GenerationOptions): PlayerFilterFn => {
    switch (options.type) {
      case GenerationType.PLAYER:
        return (player) => player.name === options.value;
      case GenerationType.POSITION:
        return (player) => player.position === options.value;
      case GenerationType.ROLE:
        return (player) => player.role === options.value;
      default:
        return (_) => true;
    }
  };

  const handleAddTeam = () => {
    const newTeams = [
      ...cloneDeep(teams),
      { name: `Team ${(teams.length + 1).toString()}`, players: [] },
    ];

    setTeams(newTeams);
  };

  const handleDeleteTeam = (index: number) => {
    const newPlayers = cloneDeep(players);

    teams[index].players.forEach((playerToRelease) => {
      const foundPlayer = players.find(
        (player) => player.name === playerToRelease.name,
      );
      if (foundPlayer) {
        newPlayers[players.indexOf(foundPlayer)].selected = false;
      }
    });

    const newTeams = [...teams.slice(0, index), ...teams.slice(index + 1)];

    setPlayers(newPlayers);
    setTeams(
      newTeams.map((team, i) => ({
        ...team,
        name: `Team ${(i + 1).toString()}`,
      })),
    );
  };

  const handleGenerate = (
    index: number,
    generationOptions: GenerationOptions,
  ) => {
    const playerPool = shuffle(
      players
        .filter((player) => !player.disabled && !player.selected)
        .filter(getFilterFn(generationOptions)),
    );

    const playersToPick = playerPool.slice(0, generationOptions.count);

    const newPlayers = cloneDeep(players);
    const newTeams = cloneDeep(teams);

    playersToPick.forEach((playerToPick) => {
      newPlayers[players.indexOf(playerToPick)].selected = true;
      newTeams[index].players.push(playerToPick);
    });

    setPlayers(newPlayers);
    setTeams(newTeams);
  };

  const handleRemovePlayer = (teamIndex: number, playerIndex: number) => {
    const playerToRemove = teams[teamIndex].players[playerIndex];
    const newPlayers = cloneDeep(players);
    const newTeams = cloneDeep(teams);

    newTeams[teamIndex].players = [
      ...teams[teamIndex].players.slice(0, playerIndex),
      ...teams[teamIndex].players.slice(playerIndex + 1),
    ];

    const foundPlayer = players.find(
      (player) => player.name === playerToRemove.name,
    );
    if (foundPlayer) {
      newPlayers[players.indexOf(foundPlayer)].selected = false;
    }

    setPlayers(newPlayers);
    setTeams(newTeams);
  };

  return (
    <Box
      component='div'
      sx={{
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        p: 1.5,
      }}
    >
      <Grid container spacing={1.5} columns={12}>
        <Grid item xs={12} sm={9}>
          <Box
            component='div'
            sx={{
              display: 'flex',
              flexGrow: 1,
              flexDirection: 'row',
              flexWrap: 'wrap',
              mt: 0,
              mb: 'auto',
            }}
          >
            {teams.map((team, i) => (
              <TeamCard
                team={team}
                onDelete={
                  teams.length > 1 ? () => handleDeleteTeam(i) : undefined
                }
                onGenerate={(options) => handleGenerate(i, options)}
                onRemovePlayer={(index) => handleRemovePlayer(i, index)}
              />
            ))}
            <Button
              color='primary'
              onClick={handleAddTeam}
              sx={{ ...commonStyles.buttonText, ml: 2.5 }}
            >
              + Add team
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Box
            component='div'
            sx={{
              display: 'flex',
              flexGrow: 1,
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <PlayersList />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default App;
