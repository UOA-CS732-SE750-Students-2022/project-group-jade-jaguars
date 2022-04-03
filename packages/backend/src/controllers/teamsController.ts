import { mongoService } from '../services/mongoService';
import { Team } from '../models/teamsModel';
import { v4 } from 'uuid';
import express from 'express';

export async function getTeam(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const team: Team = await mongoService.findOne('teams', {
      uuid: req.params.teamId,
    });

    if (team === null) {
      res.status(404).send('Team not found');
    } else {
      res.status(200).send(team);
    }
  } catch (err) {
    console.error(`Error while getting team`, err.message);
    next(err);

    res.status(501).send('Internal Server Error');
  }
}

export async function createTeam(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const body: Team = req.body;
    body.uuid = v4();

    await mongoService.insertOne('teams', body);

    res.status(201).send('OK');
  } catch (err) {
    console.error(`Error while creating team`, err.message);
    next(err);

    res.status(501).send('Internal Server Error');
  }
}

export async function updateTeam(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const body: Team = req.body;

    await mongoService.updateOne(
      'teams',
      {
        uuid: body.uuid,
      },
      body,
    );

    res.status(204).send('OK');
  } catch (err) {
    console.error(`Error while updating team`, err.message);
    next(err);

    res.status(501).send('Internal Server Error');
  }
}

export async function deleteTeam(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    await mongoService.deleteOne('teams', {
      uuid: req.params.teamId,
    });

    res.status(204);
  } catch (err) {
    console.error(`Error while deleting team`, err.message);
    next(err);

    res.status(501).send('Internal Server Error');
  }
}
