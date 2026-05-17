import { STORAGE_KEYS } from '../constants';
import type { UsageRecord } from '../types';
import { readStorage, writeStorage } from '../services/localStorageClient';
import type { UsageRepository } from './repositoryTypes';

const usageKey = `${STORAGE_KEYS.user}.usage`;

function createUsageRecord(userId: string, month: string): UsageRecord {
  return {
    id: `${userId}-${month}`,
    userId,
    month,
    tryOnsUsed: 0,
    updatedAt: new Date().toISOString(),
  };
}

function readUsageMap() {
  return readStorage<Record<string, UsageRecord>>(usageKey, {});
}

export const mockUsageRepository: UsageRepository = {
  async getMonthlyUsage(userId, month) {
    const records = readUsageMap();
    return records[`${userId}-${month}`] ?? createUsageRecord(userId, month);
  },

  async incrementMonthlyUsage(userId, month) {
    const records = readUsageMap();
    const key = `${userId}-${month}`;
    const currentRecord = records[key] ?? createUsageRecord(userId, month);
    const nextRecord = {
      ...currentRecord,
      tryOnsUsed: currentRecord.tryOnsUsed + 1,
      updatedAt: new Date().toISOString(),
    };

    writeStorage(usageKey, { ...records, [key]: nextRecord });
    return nextRecord;
  },
};
