export interface Trace {
  filename?: string;
  function?: string | null;
  lineNo?: number | null;
  columnNo?: number | null;
  internal?: boolean;
  absPath?: string | null;
  extension?: string | null;
  preCode?: string[] | null;
  code?: string | null;
  postCode?: string[] | null;
}
