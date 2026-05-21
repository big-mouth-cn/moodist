import { Modal } from '@/components/modal';
import { Slider } from '@/components/slider';
import { languages } from '@/i18n/translations';
import { useSettingsStore } from '@/stores/settings';
import { useI18n } from '@/hooks/use-i18n';

import styles from './settings.module.css';

import type { Language } from '@/i18n/types';

interface SettingsModalProps {
  onClose: () => void;
  show: boolean;
}

export function SettingsModal({ onClose, show }: SettingsModalProps) {
  const globalVolume = useSettingsStore(state => state.globalVolume);
  const alarmVolume = useSettingsStore(state => state.alarmVolume);
  const language = useSettingsStore(state => state.language);
  const setGlobalVolume = useSettingsStore(state => state.setGlobalVolume);
  const setAlarmVolume = useSettingsStore(state => state.setAlarmVolume);
  const setLanguage = useSettingsStore(state => state.setLanguage);
  const { t } = useI18n();

  return (
    <Modal show={show} onClose={onClose}>
      <header className={styles.header}>
        <h2 className={styles.title}>{t('settings.title')}</h2>
        <p className={styles.desc}>{t('settings.desc')}</p>
      </header>

      <div className={styles.group}>
        <label className={styles.label} htmlFor="language">
          {t('settings.language')}
        </label>
        <select
          className={styles.select}
          id="language"
          value={language}
          onChange={e => setLanguage(e.target.value as Language)}
        >
          {languages.map(language => (
            <option key={language.id} value={language.id}>
              {language.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.group}>
        <p className={styles.label}>{t('settings.globalVolume')}</p>
        <Slider
          max={100}
          min={0}
          value={globalVolume * 100}
          onChange={value => setGlobalVolume(value / 100)}
        />
      </div>

      <div className={styles.group}>
        <p className={styles.label}>{t('settings.alarmVolume')}</p>
        <Slider
          max={100}
          min={0}
          value={alarmVolume * 100}
          onChange={value => setAlarmVolume(value / 100)}
        />
      </div>
    </Modal>
  );
}
