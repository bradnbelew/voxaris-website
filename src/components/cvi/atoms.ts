import { atom } from 'jotai';
import type { DailyCall } from '@daily-co/daily-js';

export const callObjectAtom = atom<DailyCall | null>(null);
export const isJoinedAtom = atom<boolean>(false);
export const isJoiningAtom = atom<boolean>(false);
export const participantCountAtom = atom<number>(0);
