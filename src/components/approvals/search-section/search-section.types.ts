export type SearchRequestFeedback =
  | {
      kind: 'success';
      lookupCode: string;
    }
  | {
      kind: 'error';
      lookupCode: string;
      message: string;
    };
