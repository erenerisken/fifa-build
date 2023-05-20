import { useRecoilState } from 'recoil';
import {
  Box,
  Divider,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { cloneDeep } from 'lodash';
import { playersAtom } from '../../atoms/Player';
import { commonColors } from '../../util/Style';

const PlayersList = () => {
  const [players, setPlayers] = useRecoilState(playersAtom);

  const fieldNameStyle = {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '16px',
  };

  const enabledFieldStyle = {
    color: commonColors.black,
  };

  const disabledFieldStyle = {
    color: commonColors.gray4,
  };

  const handleToggleEnabled = (i: number) => {
    const newPlayers = cloneDeep(players);
    newPlayers[i].disabled = !players[i].disabled;
    setPlayers(newPlayers);
  };

  return (
    <Paper sx={{ padding: 2, height: '95%', width: 'fit-content' }}>
      <Box component='div'>
        <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
          Players
        </Typography>
      </Box>
      <Divider sx={{ mb: 2.5 }} />
      <TableContainer
        sx={{
          display: 'flex',
          flexGrow: 1,
          flexDirection: 'column',
          backgroundColor: commonColors.gray1,
        }}
      >
        <Table size='small'>
          <TableHead sx={{ backgroundColor: commonColors.gray2 }}>
            <TableRow>
              <TableCell key='name'>
                <Typography sx={fieldNameStyle}>Name</Typography>
              </TableCell>
              <TableCell key='role'>
                <Typography sx={fieldNameStyle}>Role</Typography>
              </TableCell>
              <TableCell key='position'>
                <Typography sx={fieldNameStyle}>Position</Typography>
              </TableCell>
              <TableCell key='overall'>
                <Typography sx={fieldNameStyle}>Overall</Typography>
              </TableCell>
              <TableCell key='enabled'>
                <Typography sx={fieldNameStyle}>Enabled</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {players.map((player, i) => (
              <TableRow key={player.name}>
                <TableCell key={`${player.name}_name`}>
                  <Typography
                    sx={{
                      ...(player.disabled
                        ? disabledFieldStyle
                        : enabledFieldStyle),
                      textDecoration: player.selected
                        ? 'line-through'
                        : undefined,
                    }}
                  >
                    {player.name}
                  </Typography>
                </TableCell>
                <TableCell key={`${player.name}_role`}>
                  <Typography
                    sx={{
                      ...(player.disabled
                        ? disabledFieldStyle
                        : enabledFieldStyle),
                      textDecoration: player.selected
                        ? 'line-through'
                        : undefined,
                    }}
                  >
                    {player.role}
                  </Typography>
                </TableCell>
                <TableCell key={`${player.name}_position`}>
                  <Typography
                    sx={{
                      ...(player.disabled
                        ? disabledFieldStyle
                        : enabledFieldStyle),
                      textDecoration: player.selected
                        ? 'line-through'
                        : undefined,
                    }}
                  >
                    {player.position}
                  </Typography>
                </TableCell>
                <TableCell key={`${player.name}_overall`}>
                  <Typography
                    sx={{
                      ...(player.disabled
                        ? disabledFieldStyle
                        : enabledFieldStyle),
                      textDecoration: player.selected
                        ? 'line-through'
                        : undefined,
                    }}
                  >
                    {player.overall}
                  </Typography>
                </TableCell>
                <TableCell key={`${player.name}_enabled`}>
                  <Switch
                    checked={!player.disabled}
                    onChange={() => handleToggleEnabled(i)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default PlayersList;
