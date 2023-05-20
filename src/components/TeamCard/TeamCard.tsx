import {
  Autocomplete,
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { ChevronRight, Delete, Send } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { uniq } from 'lodash';
import { useRecoilValue } from 'recoil';
import { Team } from '../../interfaces/Team';
import {
  GenerationOptions,
  GenerationType,
} from '../../interfaces/GenerationOptions';
import { commonColors, commonStyles } from '../../util/Style';
import {
  getDefaultGenerationOptions,
  getGenerationTypeName,
} from '../../util/GenerationOptions';
import { playersAtom } from '../../atoms/Player';

interface TeamCardProps {
  team: Team;
  onDelete?: () => void;
  onGenerate: (options: GenerationOptions) => void;
  onRemovePlayer: (index: number) => void;
}

const TeamCard = (props: TeamCardProps) => {
  const players = useRecoilValue(playersAtom);

  const [generationOptions, setGenerationOptions] = useState(
    getDefaultGenerationOptions(),
  );

  useEffect(
    () => setGenerationOptions(getDefaultGenerationOptions()),
    [props.team.players],
  );

  useEffect(() => {
    switch (generationOptions.type) {
      case GenerationType.PLAYER: {
        setGenerationOptions({
          ...generationOptions,
          value:
            players.filter((player) => !player.selected && !player.disabled)[0]
              ?.name ?? '',
          count: 1,
        });
        break;
      }

      case GenerationType.ROLE: {
        setGenerationOptions({
          ...generationOptions,
          value:
            players.filter((player) => !player.selected && !player.disabled)[0]
              ?.role ?? '',
          count: 1,
        });
        break;
      }

      case GenerationType.POSITION: {
        setGenerationOptions({
          ...generationOptions,
          value:
            players.filter((player) => !player.selected && !player.disabled)[0]
              ?.position ?? '',
          count: 1,
        });
        break;
      }

      case GenerationType.RANDOM: {
        setGenerationOptions({
          ...generationOptions,
          count: 1,
        });
        break;
      }

      default:
    }
  }, [generationOptions.type]);

  const handleSelectGenerationType = (e: any) =>
    setGenerationOptions({
      ...generationOptions,
      type: e.target.value ?? GenerationType.RANDOM,
    });

  const handleSelectPlayer = (_: any, playerName: string | null) => {
    setGenerationOptions({ ...generationOptions, value: playerName ?? '' });
  };

  const handleSelectValue = (e: any) =>
    setGenerationOptions({
      ...generationOptions,
      value: e.target.value ?? '',
    });

  const handleChangeCount = (e: any) => {
    setGenerationOptions({
      ...generationOptions,
      count: Math.max(0, parseInt(e.target.value as string, 10) ?? 1),
    });
  };

  const fieldNameStyle = {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '16px',
  };

  return (
    <Paper sx={{ padding: 2, width: 'fit-content', mt: 0, mb: 1.5, ml: 1.5 }}>
      <Box component='div' sx={commonStyles.row}>
        <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
          {props.team.name}
        </Typography>
        <Box component='div' sx={{ flexGrow: 1 }} />
        {props.onDelete && (
          <Button
            color='error'
            size='small'
            endIcon={<ChevronRight />}
            onClick={props.onDelete}
            sx={commonStyles.buttonText}
          >
            Delete
          </Button>
        )}
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
              <TableCell key='index'>
                <Typography sx={fieldNameStyle}>#</Typography>
              </TableCell>
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
                <Typography sx={fieldNameStyle}>Remove</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.team.players.map((player, i) => (
              <TableRow key={player.name}>
                <TableCell key={`${player.name}_index`}>
                  <Typography>{i + 1}</Typography>
                </TableCell>
                <TableCell key={`${player.name}_name`}>
                  <Typography>{player.name}</Typography>
                </TableCell>
                <TableCell key={`${player.name}_role`}>
                  <Typography>{player.role}</Typography>
                </TableCell>
                <TableCell key={`${player.name}_position`}>
                  <Typography>{player.position}</Typography>
                </TableCell>
                <TableCell key={`${player.name}_overall`}>
                  <Typography>{player.overall}</Typography>
                </TableCell>
                <TableCell key={`${player.name}_remove`}>
                  <IconButton
                    color='error'
                    onClick={() => props.onRemovePlayer(i)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Paper
        sx={{
          display: 'flex',
          flexGrow: 1,
          p: 1.5,
          mt: 1.5,
          flexDirection: 'row',
          backgroundColor: commonColors.gray1,
        }}
      >
        <FormControl
          size='small'
          sx={{ minWidth: 120, mt: 'auto', mb: 'auto' }}
        >
          <InputLabel id='type-label'>Pick Type</InputLabel>
          <Select
            labelId='type-label'
            label='Pick Type'
            id='type-select'
            onChange={handleSelectGenerationType}
            value={generationOptions.type}
            sx={{ backgroundColor: commonColors.white }}
          >
            {Object.keys(GenerationType).map((type) => (
              <MenuItem value={type}>
                {getGenerationTypeName(type as GenerationType)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {generationOptions.type === GenerationType.ROLE && (
          <FormControl
            size='small'
            sx={{ minWidth: 120, mt: 'auto', mb: 'auto', ml: 1.5 }}
          >
            <InputLabel id='value-label'>Role</InputLabel>
            <Select
              labelId='value-label'
              label='Role'
              id='value-select'
              onChange={handleSelectValue}
              value={generationOptions.value}
              sx={{ backgroundColor: commonColors.white }}
            >
              {uniq(players.map((player) => player.role)).map((role) => (
                <MenuItem value={role}>{role}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {generationOptions.type === GenerationType.PLAYER && (
          <Autocomplete
            renderInput={(params) => (
              <TextField
                {...params}
                size='small'
                label='Player'
                variant='outlined'
                sx={{
                  width: 150,
                  backgroundColor: commonColors.white,
                }}
              />
            )}
            options={players
              .filter((player) => !player.selected && !player.disabled)
              .map((player) => player.name)}
            value={
              generationOptions.value === '' ? null : generationOptions.value
            }
            onChange={handleSelectPlayer}
            sx={{ mb: 'auto', mt: 'auto', ml: 1.5 }}
          />
        )}
        {generationOptions.type === GenerationType.POSITION && (
          <FormControl
            size='small'
            sx={{ minWidth: 120, mt: 'auto', mb: 'auto', ml: 1.5 }}
          >
            <InputLabel id='value-label'>Position</InputLabel>
            <Select
              labelId='value-label'
              label='Position'
              id='value-select'
              onChange={handleSelectValue}
              value={generationOptions.value}
              sx={{ backgroundColor: commonColors.white }}
            >
              {uniq(players.map((player) => player.position)).map(
                (position) => (
                  <MenuItem value={position}>{position}</MenuItem>
                ),
              )}
            </Select>
          </FormControl>
        )}
        {generationOptions.type !== GenerationType.PLAYER && (
          <TextField
            variant='outlined'
            size='small'
            type='number'
            label='Count'
            value={generationOptions.count}
            onChange={handleChangeCount}
            sx={{
              ml: 1.5,
              width: 70,
              backgroundColor: commonColors.white,
            }}
          />
        )}
        <Box component='div' sx={{ flexGrow: 1 }} />
        <Button
          variant='contained'
          color='primary'
          size='small'
          endIcon={<Send fontSize='small' />}
          disabled={
            generationOptions.type === GenerationType.PLAYER &&
            generationOptions.value === ''
          }
          onClick={() => props.onGenerate(generationOptions)}
          sx={{ ...commonStyles.buttonText, ml: 1.5, mt: 'auto', mb: 'auto' }}
        >
          Pick
        </Button>
      </Paper>
    </Paper>
  );
};

export default TeamCard;
