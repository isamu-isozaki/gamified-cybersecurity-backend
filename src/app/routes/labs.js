import util from 'util';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { Router } from 'express';

import { getLabDatabase } from '../../database/index.js';
import { flagsSchema } from '../../database/schema.js';
import { findLab, parseLabMetadataFile } from '../../utils/labs.js';
import { badRequest, notFound, success } from '../responses.js';
import { LABS_DIR } from '../../config/index.js';
import { and, count, eq, lt } from 'drizzle-orm';

const execute = util.promisify(exec);

const startLab = async (req, res) => {
  const name = req.params.name;

  const lab = await findLab(name);
  if (lab === null) {
    return notFound(res, 'Lab not found');
  }

  const db = getLabDatabase(lab.path);

  await db
    .insert(flagsSchema)
    .values(
      lab.data.flags.map((flag, i) => ({
        id: i,
        flagHash: flag,
        completed: 0,
      }))
    )
    .onConflictDoNothing();

  const completedFlags = await db
    .select({
      flags: count(),
    })
    .from(flagsSchema)
    .where(eq(flagsSchema.completed, true))
    .get();

  try {
    await execute(
      `docker compose -f ${lab.path}/docker-compose.yml up -d --force-recreate`
    );
  } catch (e) {
    console.error(e);
  }

  success(res, {
    lab: {
      ...lab.data,
      flags: lab.data.flags.length,
      completedFlags: completedFlags?.flags || 0,
    },
  });
};

const stopLab = async (req, res) => {
  const name = req.params.name;

  const lab = await findLab(name);
  if (lab === null) {
    return notFound(res, 'Lab not found');
  }

  try {
    await execute(`docker compose -f ${lab.path}/docker-compose.yml down`);
  } catch (e) {
    console.error(e);
  }
  success(res, {
    message: `${lab.data.name} stopped`,
  });
};

const listLabs = async (req, res) => {
  const files = await fs.promises.readdir(LABS_DIR);
  const labs = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const stats = await fs.promises.lstat(path.join(LABS_DIR, file));
    if (stats.isDirectory()) {
      const metadata = await parseLabMetadataFile(file);

      if (metadata) {
        labs.push(metadata);
      }
    }
  }
  success(res, labs);
};

const getLab = async (req, res) => {
  const name = req.params.name;
  const lab = await findLab(name);
  if (lab === null) {
    return notFound(res, 'Lab not found');
  }

  const db = getLabDatabase(lab.path);

  const flags = await db.select().from(flagsSchema).all();

  success(res, {
    lab: lab.data,
    flags,
  });
};

const resetLab = async (req, res) => {
  const name = req.params.name;

  const lab = await findLab(name);
  if (lab === null) {
    return notFound(res, 'Lab not found');
  }

  try {
    await execute(`docker compose -f ${lab.path}/docker-compose.yml down`);
  } catch (e) {
    console.error(e);
  }

  try {
    // TODO do something if this fails, return an error
    await fs.promises.unlink(`${lab.path}/progress.db`);
  } catch (e) {
    console.error(e);
  }

  success(res, {
    message: `${lab.data.name} reset`,
  });
};

const submitFlag = async (req, res) => {
  const name = req.params.name;
  const flag = req.body.flag;

  const lab = await findLab(name);
  if (lab === null) {
    return notFound(res, 'Lab not found');
  }

  const db = getLabDatabase(lab.path);

  const flagRow = await db
    .select()
    .from(flagsSchema)
    .where(eq(flagsSchema.flagHash, flag))
    .get();
  if (flagRow) {
    let previousOutstandingFlag;
    if (lab.data.submit_flags_in_order) {
      previousOutstandingFlag = await db
        .select()
        .from(flagsSchema)
        .where(
          and(lt(flagsSchema.id, flagRow.id), eq(flagsSchema.completed, false))
        )
        .limit(1)
        .get();
    }

    if (!previousOutstandingFlag) {
      await db
        .update(flagsSchema)
        .set({
          completed: true,
        })
        .where(eq(flagsSchema.id, flagRow.id));

      const completedFlags = await db
        .select({
          flags: count(),
        })
        .from(flagsSchema)
        .where(eq(flagsSchema.completed, true))
        .get();

      return success(res, {
        message: 'Correct flag',
        completedFlags: completedFlags?.flags || 0,
      });
    }
  }

  badRequest(res, {
    message: 'Incorrect flag',
  });
};

const router = Router();

router.get('/', listLabs);
router.get('/:name', getLab);
router.post('/:name/start', startLab);
router.post('/:name/stop', stopLab);
router.post('/:name/reset', resetLab);
router.post('/:name/submit', submitFlag);

export default router;
