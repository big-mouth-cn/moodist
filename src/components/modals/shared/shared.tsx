import { useState, useEffect } from 'react';

import { Modal } from '@/components/modal';

import { useSoundStore } from '@/stores/sound';
import { useSnackbar } from '@/contexts/snackbar';
import { useCloseListener } from '@/hooks/use-close-listener';
import { useI18n } from '@/hooks/use-i18n';
import { cn } from '@/helpers/styles';
import { sounds } from '@/data/sounds';

import styles from './shared.module.css';

export function SharedModal() {
  const override = useSoundStore(state => state.override);
  const showSnackbar = useSnackbar();
  const { t } = useI18n();

  const [isOpen, setIsOpen] = useState(false);
  const [sharedSounds, setSharedSounds] = useState<
    Array<{
      id: string;
      label: string;
      volume: number;
    }>
  >([]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const share = searchParams.get('share');

    if (share) {
      try {
        const parsed = JSON.parse(decodeURIComponent(share));
        const allSounds: Record<string, string> = {};

        sounds.categories.forEach(category => {
          category.sounds.forEach(sound => {
            allSounds[sound.id] = sound.label;
          });
        });

        const _sharedSounds: Array<{
          id: string;
          label: string;
          volume: number;
        }> = [];

        Object.keys(parsed).forEach(sound => {
          if (allSounds[sound]) {
            _sharedSounds.push({
              id: sound,
              label: t(`sounds.${sound}`),
              volume: Number(parsed[sound]),
            });
          }
        });

        if (_sharedSounds.length) {
          setIsOpen(true);
          setSharedSounds(_sharedSounds);
        }
      } catch {
        return;
      } finally {
        history.pushState({}, '', location.href.split('?')[0]);
      }
    }
  }, []);

  const handleOverride = () => {
    const newSounds: Record<string, number> = {};

    sharedSounds.forEach(sound => {
      newSounds[sound.id] = sound.volume;
    });

    override(newSounds);
    setIsOpen(false);
    showSnackbar(t('snackbars.sharedApplied'));
  };

  useCloseListener(() => setIsOpen(false));

  return (
    <Modal show={isOpen} onClose={() => setIsOpen(false)}>
      <h1 className={styles.heading}>{t('shared.title')}</h1>
      <p className={styles.desc}>{t('shared.desc')}</p>
      <div className={styles.sounds}>
        {sharedSounds.map(sound => (
          <div className={styles.sound} key={sound.id}>
            {sound.label}
          </div>
        ))}
      </div>
      <div className={styles.footer}>
        <button className={cn(styles.button)} onClick={() => setIsOpen(false)}>
          {t('actions.cancel')}
        </button>
        <button
          className={cn(styles.button, styles.primary)}
          onClick={handleOverride}
        >
          {t('actions.override')}
        </button>
      </div>
    </Modal>
  );
}
