import { Modal } from '@/components/modal';
import { Form } from './form';
import { Todos } from './todos';
import { useI18n } from '@/hooks/use-i18n';

import styles from './todo.module.css';

interface TodoProps {
  onClose: () => void;
  show: boolean;
}

export function Todo({ onClose, show }: TodoProps) {
  const { t } = useI18n();

  return (
    <Modal show={show} onClose={onClose}>
      <header className={styles.header}>
        <h2 className={styles.title}>{t('todo.title')}</h2>
        <p className={styles.desc}>{t('todo.desc')}</p>
      </header>

      <Form />
      <Todos />
    </Modal>
  );
}
