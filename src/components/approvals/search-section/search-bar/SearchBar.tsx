'use client';

import type { ChangeEvent, ReactNode } from 'react';
import { useCallback, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { searchBarClassNames as classNames } from './search-bar.styles';
import { searchBarTexts as texts } from './texts';

type SearchBarProps = {
  errorMessage: string | null;
  lookupCode: string;
  onLookupCodeChange: (lookupCode: string) => void;
};

export const SearchBar = ({
  errorMessage,
  lookupCode,
  onLookupCodeChange,
}: SearchBarProps): ReactNode => {
  const hasError: boolean = useMemo((): boolean => errorMessage !== null, [errorMessage]);
  const describedBy: string = useMemo(
    (): string => (hasError ? 'approvals-lookup-code-error' : 'approvals-lookup-code-help'),
    [hasError],
  );
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      onLookupCodeChange(event.currentTarget.value.toUpperCase());
    },
    [onLookupCodeChange],
  );

  return (
    <section aria-label={texts.sectionLabel} className={classNames.root} role="search">
      <label className={classNames.label} htmlFor="approvals-lookup-code">
        {texts.label}
      </label>
      <div className={classNames.field}>
        <Search aria-hidden="true" className={classNames.icon} />
        <Input
          aria-describedby={describedBy}
          aria-invalid={hasError}
          autoComplete="off"
          autoCapitalize="characters"
          className={classNames.input}
          id="approvals-lookup-code"
          maxLength={16}
          onChange={handleChange}
          placeholder={texts.placeholder}
          spellCheck={false}
          type="text"
          value={lookupCode}
        />
      </div>
      {hasError ? (
        <p className={classNames.error} id="approvals-lookup-code-error" role="alert">
          {errorMessage}
        </p>
      ) : (
        <p className={classNames.help} id="approvals-lookup-code-help">
          {texts.help}
        </p>
      )}
    </section>
  );
};
