import express from 'express';
import {
  addMemberById,
  createTeam,
  deleteTeamById,
  getTeamById,
  patchTeamById,
} from '../controllers/team.controller';
export const teamRouter = express.Router();

teamRouter.get('/team/:teamId', getTeamById);

teamRouter.post('/team', createTeam);

teamRouter.patch('/team/:teamId', patchTeamById);

teamRouter.delete('/team/:teamId', deleteTeamById);

teamRouter.put('/team/:teamId/member', addMemberById);
