export const slugify = (text: string): string =>
  String(text)
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, "_")
    .replace(/[^a-z0-9_]/g, "");

/** Ensure every row has a `value` — derive from `label` if missing or empty. */
export const normalizeRows = (rows: any[]): any[] =>
  rows.map((row) => ({
    ...row,
    value:
      row.value !== undefined && String(row.value).trim() !== ""
        ? row.value
        : slugify(row.label ?? ""),
  }));

  export const normalizeGridRows = (rows: any[]): any[] =>
  rows.map((row) => ({
    ...row,
    field:
      row.field !== undefined && String(row.field).trim() !== ""
        ? row.field
        : slugify(row.headerName ?? ""),
  }));