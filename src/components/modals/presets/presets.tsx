import { Modal } from '@/components/modal';
import { New } from './new';
import { List } from './list';
import { useI18n } from '@/hooks/use-i18n';

import styles from './presets.module.css';

interface PresetsModalProps {
  onClose: () => void;
  show: boolean;
}

export function PresetsModal({ onClose, show }: PresetsModalProps) {
  const { t } = useI18n();

  return (
    <Modal show={show} onClose={onClose}>
      <h2 className={styles.title}>{t('presets.title')}</h2>
      <New />
      <div className={styles.divider} />
      <List close={onClose} />
    </Modal>
  );
}
