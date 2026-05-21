import { Modal } from '@/components/modal';
import { useI18n } from '@/hooks/use-i18n';

import styles from './shortcuts.module.css';

interface ShortcutsModalProps {
  onClose: () => void;
  show: boolean;
}

export function ShortcutsModal({ onClose, show }: ShortcutsModalProps) {
  const { t } = useI18n();

  const shortcuts = [
    {
      keys: ['Shift', 'H'],
      label: t('shortcuts.list'),
    },
    {
      keys: ['Shift', 'Alt', 'P'],
      label: t('presets.title'),
    },
    {
      keys: ['Shift', 'S'],
      label: t('menu.share'),
    },
    {
      keys: ['Shift', 'Alt', 'T'],
      label: t('menu.sleepTimer'),
    },
    {
      keys: ['Shift', 'C'],
      label: t('menu.countdown'),
    },
    {
      keys: ['Shift', 'P'],
      label: t('menu.pomodoro'),
    },
    {
      keys: ['Shift', 'N'],
      label: t('menu.notepad'),
    },
    {
      keys: ['Shift', 'G'],
      label: t('menu.settings'),
    },
    {
      keys: ['Shift', 'T'],
      label: t('menu.todo'),
    },
    {
      keys: ['Shift', 'B'],
      label: t('menu.breathing'),
    },
    {
      keys: ['Shift', 'Space'],
      label: t('shortcuts.togglePlay'),
    },
    {
      keys: ['Shift', 'R'],
      label: t('shortcuts.unselectAll'),
    },
  ];

  return (
    <Modal show={show} onClose={onClose}>
      <h1 className={styles.heading}>{t('shortcuts.title')}</h1>
      <div className={styles.shortcuts}>
        {shortcuts.map(shortcut => (
          <Row
            key={shortcut.label}
            keys={shortcut.keys}
            label={shortcut.label}
          />
        ))}
      </div>
    </Modal>
  );
}

interface RowProps {
  keys: Array<string>;
  label: string;
}

function Row({ keys, label }: RowProps) {
  return (
    <div className={styles.row}>
      <p className={styles.label}>{label}</p>
      <div className={styles.divider} />
      <div className={styles.keys}>
        {keys.map(key => (
          <Key key={`${label}-${key}`}>{key}</Key>
        ))}
      </div>
    </div>
  );
}

interface KeyProps {
  children: React.ReactNode;
}

function Key({ children }: KeyProps) {
  return <div className={styles.key}>{children}</div>;
}
