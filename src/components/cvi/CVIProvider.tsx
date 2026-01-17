import { Provider } from 'jotai';
import type { CVIProviderProps } from './types';

export function CVIProvider({ children }: CVIProviderProps) {
  return <Provider>{children}</Provider>;
}
