import { Modal } from '@/components/modal';
import { Exercise } from './exercise';
import { useI18n } from '@/hooks/use-i18n';

import styles from './breathing.module.css';

interface TimerProps {
  onClose: () => void;
  show: boolean;
}

export function BreathingExerciseModal({ onClose, show }: TimerProps) {
  const { t } = useI18n();

  return (
    <Modal show={show} onClose={onClose}>
      <h2 className={styles.title}>{t('breathing.title')}</h2>
      <Exercise />
    </Modal>
  );
}
