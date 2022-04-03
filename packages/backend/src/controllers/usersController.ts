import { mongoService } from '../services/mongoService';
import { User } from '../models/usersModel';
import { v4 } from 'uuid';
import express from 'express';

export async function getUser(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const user: User = await mongoService.findOne('users', {
      uuid: req.params.userId,
    });

    if (user === null) {
      res.status(404).send('User not found');
    } else {
      res.status(200).send(user);
    }
  } catch (err) {
    console.error(`Error while getting user`, err.message);
    next(err);

    res.status(501).send('Internal Server Error');
  }
}

export async function createUser(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const body: User = req.body;

    body.uuid = body.uuid ?? v4();

    await mongoService.insertOne('users', body);

    res.status(201).send('OK');
  } catch (err) {
    console.error(`Error while creating user`, err.message);
    next(err);

    res.status(501).send('Internal Server Error');
  }
}

export async function updateUser(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const body: User = req.body;

    await mongoService.updateOne(
      'users',
      {
        uuid: body.uuid,
      },
      body,
    );

    res.status(204).send('OK');
  } catch (err) {
    console.error(`Error while updating user`, err.message);
    next(err);

    res.status(501).send('Internal Server Error');
  }
}

export async function deleteUser(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    await mongoService.deleteOne('users', {
      uuid: req.params.userId,
    });

    res.status(204);
  } catch (err) {
    console.error(`Error while deleting user`, err.message);
    next(err);

    res.status(501).send('Internal Server Error');
  }
}
