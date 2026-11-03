import 'server-only';
import type { CSSProperties } from 'react';
import { savedFields } from './cms';
import { safeUrl } from './cms-core';
import { resolveField } from './page-data';
export type T = (key: string) => string;
/** Loads saved admin edits for a page and returns a lookup that falls back to the component defaults. */
export async function pageCopy(page: string, defaults: Record<string, string>): Promise<T> {
  const saved = await savedFields(page);
  return (key) => resolveField(key, defaults, saved, (v, image) => safeUrl(v, image));
}
/** Parses a structural inline-style string stored as data ("a-b:c;d:e") into a React style object. */
export function css(value: string): CSSProperties {
  return Object.fromEntries(
    value
      .split(';')
      .filter((x) => x.includes(':'))
      .map((x) => {
        const i = x.indexOf(':');
        const k = x.slice(0, i).trim();
        return [
          k.startsWith('--') ? k : k.replace(/-([a-z])/g, (_, c) => c.toUpperCase()),
          x.slice(i + 1).trim(),
        ];
      }),
  );
}
