import { STORAGE_KEYS } from '../constants';
import type { TryOnJob, TryOnRequest } from '../types';
import { readStorage, writeStorage } from '../services/localStorageClient';
import type { TryOnJobRepository } from './repositoryTypes';

const jobsKey = `${STORAGE_KEYS.tryOnDraft}.jobs`;

function readJobs() {
  return readStorage<Record<string, TryOnJob>>(jobsKey, {});
}

export const mockTryOnJobRepository: TryOnJobRepository = {
  async createJob(request: TryOnRequest) {
    const now = new Date().toISOString();
    const job: TryOnJob = {
      id: `job-${Date.now()}`,
      userId: request.userId,
      status: 'queued',
      request,
      createdAt: now,
      updatedAt: now,
    };

    writeStorage(jobsKey, { ...readJobs(), [job.id]: job });
    return job;
  },

  async updateJob(jobId, updates) {
    const jobs = readJobs();
    const currentJob = jobs[jobId];
    if (!currentJob) {
      throw new Error('Try-on job not found.');
    }

    const nextJob = {
      ...currentJob,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    writeStorage(jobsKey, { ...jobs, [jobId]: nextJob });
    return nextJob;
  },

  async getJob(jobId) {
    return readJobs()[jobId] ?? null;
  },
};
