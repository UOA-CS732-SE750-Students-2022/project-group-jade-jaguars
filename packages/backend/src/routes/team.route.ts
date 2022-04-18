import express from 'express';
import {
  createTeam,
  deleteTeamById,
  getTeamById,
  updateTeamById,
} from '../controllers/team.controller';
export const teamRouter = express.Router();

// TODO: swagger docs
teamRouter.get('/team/:id', getTeamById);
teamRouter.post('/team', createTeam);
teamRouter.put('/team/:id', updateTeamById);
teamRouter.delete('/team/:id', deleteTeamById);
