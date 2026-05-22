import { LuGithub } from 'react-icons/lu/index';

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
          {t('about.projectPrefix')}{' '}
          <a
            className={styles.githubLink}
            href="https://github.com/big-mouth-cn/moodist"
            rel="noreferrer"
            target="_blank"
          >
            <LuGithub aria-hidden="true" />
            {t('about.projectLink')}
          </a>
        </p>
        <p className={styles.meta}>{t('about.meta')}</p>
      </div>
    </Modal>
  );
}
