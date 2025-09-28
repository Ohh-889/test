/* eslint-disable consistent-return */
import { keyOfName } from '../../utils/util';
import type { Action, Middleware } from '../middleware';

export type Issue = { message: string; path: string };

export function toEntries(issues: Issue[]): [string, string[]][] {
  const map = new Map<string, string[]>();
  for (const { message, path } of issues) {
    const k = keyOfName(path || 'root');
    const arr = map.get(k) || [];
    arr.push(message);
    map.set(k, arr);
  }
  return Array.from(map.entries());
}

export function dispatchIssues(dispatch: (a: Action) => void, issues: Issue[]) {
  const entries = toEntries(issues);
  dispatch({ entries, type: 'setExternalErrors' });
}

/**
 * 工厂函数：生成通用 resolver
 */
export function createGenericResolver(
  validate: (state: any, name?: string | string[]) => Promise<Issue[]>
): Middleware {
  return ({ dispatch, getState }) =>
    next =>
    async action => {
      if (action.type === 'validateField' || action.type === 'validateFields') {
        const issues = await validate(getState(), action.name);

        dispatchIssues(dispatch, issues);

        return;
      }

      return next(action);
    };
}
