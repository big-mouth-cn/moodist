import { Modal } from '@/components/modal';
import { useI18n } from '@/hooks/use-i18n';

import styles from './about.module.css';

interface AboutModalProps {
  onClose: () => void;
  show: boolean;
}

export function AboutModal({ onClose, show }: AboutModalProps) {
  const { t } = useI18n();

  return (
    <Modal show={show} onClose={onClose}>
      <h1 className={styles.heading}>{t('about.title')}</h1>
      <div className={styles.body}>
        <p className={styles.paragraph}>{t('about.desc')}</p>
        <p className={styles.paragraph}>{t('about.customize')}</p>
        <p className={styles.paragraph}>
          {t('about.sourcePrefix')}{' '}
          <a
            href="https://github.com/remvze/moodist"
            rel="noreferrer"
            target="_blank"
          >
            {t('about.sourceLink')}
          </a>{' '}
          {t('about.sourceSuffix')}
        </p>
        <p className={styles.meta}>{t('about.meta')}</p>
      </div>
    </Modal>
  );
}
