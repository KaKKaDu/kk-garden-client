'use client';

import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Button } from '@/components/ui/button';
import { CircleButton } from '@/components/ui/circle-button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Spinner } from '@/components/ui/spinner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useProfileAccent } from '@/features/profile/hooks/use-profile-accent/use-profile-accent';
import { ProjectStyleMenuIcon } from '../ProjectStyleMenuIcon/ProjectStyleMenuIcon';
import {
  accentColorPickerButtonClassNames as classNames,
  getAccentColorPickerTriggerClassName,
} from './accent-color-picker-button.styles';
import { accentColorPickerButtonTexts as texts } from './texts';

type AccentColorPickerButtonProps = {
  isMenuOpen: boolean;
  isMobile: boolean | null;
};

export const AccentColorPickerButton = ({
  isMenuOpen,
  isMobile,
}: AccentColorPickerButtonProps): ReactNode => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const {
    accentHex,
    feedback,
    hasChanges,
    hasCustomAccent,
    isConfigured,
    isSaving,
    previewAccent,
    resetAccent,
    resetPreview,
    saveAccent,
  } = useProfileAccent();
  const triggerClassName: string = useMemo(
    (): string => getAccentColorPickerTriggerClassName(isMenuOpen),
    [isMenuOpen],
  );
  const isMobileMenuClosed: boolean = useMemo(
    (): boolean => isMobile !== false && !isMenuOpen,
    [isMenuOpen, isMobile],
  );
  const triggerLabel: string = useMemo(
    (): string => (isConfigured ? texts.openPicker : texts.profileRequired),
    [isConfigured],
  );
  const feedbackClassName: string = useMemo(
    (): string => (feedback?.kind === 'error' ? classNames.error : classNames.success),
    [feedback?.kind],
  );
  const handleOpenChange = useCallback(
    (open: boolean): void => {
      if (!open) {
        resetPreview();
      }
      setIsOpen(open);
    },
    [resetPreview],
  );
  const handleColorChange = useCallback(
    (nextAccentHex: string): void => previewAccent(nextAccentHex),
    [previewAccent],
  );
  const handleSave = useCallback(async (): Promise<void> => {
    await saveAccent();
  }, [saveAccent]);
  const handleReset = useCallback(async (): Promise<void> => {
    setIsResetting(true);
    try {
      await resetAccent();
    } finally {
      setIsResetting(false);
    }
  }, [resetAccent]);
  const handleCancel = useCallback((): void => {
    resetPreview();
    setIsOpen(false);
  }, [resetPreview]);

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger
          render={
            <PopoverTrigger
              aria-expanded={isOpen}
              aria-haspopup="dialog"
              aria-hidden={isMobileMenuClosed}
              aria-label={triggerLabel}
              className={triggerClassName}
              disabled={!isConfigured}
              render={<CircleButton />}
              tabIndex={isMobileMenuClosed ? -1 : 0}
            />
          }
        >
          <ProjectStyleMenuIcon className={classNames.triggerIcon} name="palette" />
        </TooltipTrigger>
        <TooltipContent align="center" side="right">
          {triggerLabel}
        </TooltipContent>
      </Tooltip>
      <PopoverContent aria-label={texts.dialogLabel} className={classNames.popover}>
        <div className={classNames.content}>
          <header className={classNames.header}>
            <h2 className={classNames.title}>{texts.title}</h2>
            <p className={classNames.description}>{texts.description}</p>
          </header>
          <HexColorPicker
            aria-label={texts.pickerLabel}
            className={classNames.picker}
            color={accentHex}
            onChange={handleColorChange}
          />
          <div className={classNames.colorValue}>
            <span
              aria-hidden="true"
              className={classNames.swatch}
              style={{ backgroundColor: accentHex }}
            />
            <output aria-label={texts.selectedColor}>{accentHex}</output>
          </div>
          {feedback !== null ? (
            <p className={feedbackClassName} role={feedback.kind === 'error' ? 'alert' : 'status'}>
              {feedback.message}
            </p>
          ) : null}
          <div className={classNames.actions}>
            {hasCustomAccent ? (
              <Button
                className={classNames.resetButton}
                disabled={isSaving}
                onClick={handleReset}
                type="button"
                variant="outline"
              >
                {isResetting ? <Spinner aria-hidden="true" /> : null}
                {isResetting ? texts.resetting : texts.reset}
              </Button>
            ) : null}
            <Button
              className={classNames.actionButton}
              disabled={isSaving}
              onClick={handleCancel}
              type="button"
              variant="ghost"
            >
              {texts.cancel}
            </Button>
            <Button
              className={classNames.actionButton}
              disabled={isSaving || !hasChanges}
              onClick={handleSave}
              size="lg"
              type="button"
            >
              {isSaving && !isResetting ? <Spinner aria-hidden="true" /> : null}
              {isSaving && !isResetting ? texts.saving : texts.save}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
