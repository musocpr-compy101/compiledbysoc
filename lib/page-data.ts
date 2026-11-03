// Turns a typed page-content object into admin-editable fields, and applies saved overrides back.
// Field keys are stable paths (e.g. "values.items.0.title"), NOT positions in generated HTML,
// so redesigning a component never shifts or loses saved edits.
export type Leaf = {
  key: string;
  label: string;
  group: string;
  type: 'text' | 'image' | 'url';
  value: string;
};
const LOCKED = new Set(['id', 'icon', 'bg', 'fg', 'border']); // structural / design values, not editable copy
const words = (s: string) =>
  s.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());
const typeOf = (k: string): Leaf['type'] =>
  /(^|\.)(href|url|\w*Href|\w*Url)$/.test(k)
    ? 'url'
    : /(^|\.)(image|src)$/.test(k)
      ? 'image'
      : 'text';
export function flatten(data: unknown, prefix = '', group = ''): Leaf[] {
  if (typeof data === 'string') {
    const last = prefix.split('.').pop() || '';
    if (LOCKED.has(last)) return [];
    return [
      {
        key: prefix,
        label: words(
          prefix.replace(/\./g, ' · ').replace(/ · (\d+)/g, (_, n) => ' ' + (Number(n) + 1)),
        ),
        group,
        type: typeOf(prefix),
        value: data,
      },
    ];
  }
  if (Array.isArray(data))
    return data.flatMap((v, i) => flatten(v, prefix ? prefix + '.' + i : String(i), group));
  if (data && typeof data === 'object')
    return Object.entries(data).flatMap(([k, v]) =>
      flatten(v, prefix ? prefix + '.' + k : k, group || words(k)),
    );
  return [];
}
export function overlay<T>(
  data: T,
  values: Record<string, string>,
  clean: (v: string, image: boolean) => string,
  prefix = '',
): T {
  if (typeof data === 'string') {
    const v = values[prefix];
    if (typeof v !== 'string') return data;
    const t = typeOf(prefix);
    return (t === 'text' ? v : clean(v, t === 'image')) as T;
  }
  if (Array.isArray(data))
    return data.map((v, i) =>
      overlay(v, values, clean, prefix ? prefix + '.' + i : String(i)),
    ) as T;
  if (data && typeof data === 'object')
    return Object.fromEntries(
      Object.entries(data).map(([k, v]) => [
        k,
        LOCKED.has(k) ? v : overlay(v, values, clean, prefix ? prefix + '.' + k : k),
      ]),
    ) as T;
  return data;
}

// ---- flat, generated pages: keys like "tab-values.val-card.2.val-title.text"; keys ending in "~" are structural.
const humanize = (s: string) =>
  s
    .replace(/#\d+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/^./, (c) => c.toUpperCase());
export const fieldKind = (key: string): Leaf['type'] =>
  /\.href(#\d+)?$/.test(key) ? 'url' : /\.src(#\d+)?$/.test(key) ? 'image' : 'text';
export function leavesFromRecord(rec: Record<string, string>): Leaf[] {
  return Object.entries(rec)
    .filter(([k]) => !k.endsWith('~'))
    .map(([key, value]) => {
      const segs = key.split('.');
      const type = fieldKind(key);
      const parent = humanize(segs[Math.max(0, segs.length - 2)]);
      const label =
        type === 'text'
          ? value.trim().slice(0, 70) || parent
          : (type === 'url' ? 'Link destination' : 'Image') + ' · ' + parent;
      return { key, label, group: humanize(segs[0]), type, value };
    });
}
/** Resolve one field: saved edit (validated) or the component default. Structural "~" keys are never overridden. */
export function resolveField(
  key: string,
  defaults: Record<string, string>,
  saved: Record<string, string>,
  clean: (v: string, image: boolean) => string,
): string {
  const d = defaults[key] ?? '';
  if (key.endsWith('~')) return d;
  const v = saved[key];
  if (typeof v !== 'string') return d;
  const t = fieldKind(key);
  return t === 'text' ? v : clean(v, t === 'image');
}
