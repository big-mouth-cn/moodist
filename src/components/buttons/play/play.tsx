import { useCallback, useEffect } from 'react';
import { BiPause, BiPlay } from 'react-icons/bi/index';
import { useHotkeys } from 'react-hotkeys-hook';

import { useSoundStore } from '@/stores/sound';
import { useSnackbar } from '@/contexts/snackbar';
import { cn } from '@/helpers/styles';
import { useI18n } from '@/hooks/use-i18n';

import styles from './play.module.css';

export function PlayButton() {
  const isPlaying = useSoundStore(state => state.isPlaying);
  const pause = useSoundStore(state => state.pause);
  const toggle = useSoundStore(state => state.togglePlay);
  const noSelected = useSoundStore(state => state.noSelected());
  const locked = useSoundStore(state => state.locked);

  const showSnackbar = useSnackbar();
  const { t } = useI18n();

  const handleToggle = useCallback(() => {
    if (locked) return;

    if (noSelected) return showSnackbar(t('snackbars.selectSoundFirst'));

    toggle();
  }, [showSnackbar, t, toggle, noSelected, locked]);

  useEffect(() => {
    if (isPlaying && noSelected) pause();
  }, [isPlaying, pause, noSelected]);

  useHotkeys('shift+space', handleToggle, {}, [handleToggle]);

  return (
    <button
      aria-disabled={noSelected}
      className={cn(styles.playButton, noSelected && styles.disabled)}
      onClick={handleToggle}
    >
      {isPlaying ? (
        <>
          <span aria-hidden="true">
            <BiPause />
          </span>{' '}
          {t('actions.pause')}
        </>
      ) : (
        <>
          <span aria-hidden="true">
            <BiPlay />
          </span>{' '}
          {t('actions.play')}
        </>
      )}
    </button>
  );
}
