import { GenerateStructureArgs } from '../types/types.js';

/**
 * GenerateStructureArgsの型チェックを行う
 */
export const isGenerateStructureArgs = (args: unknown): args is GenerateStructureArgs => {
  if (typeof args !== 'object' || args === null) return false;
  const obj = args as Record<string, unknown>;
  return typeof obj.path === 'string' && 
         (obj.ignorePath === undefined || typeof obj.ignorePath === 'string');
};
