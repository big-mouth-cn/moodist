import { FaCoffee } from 'react-icons/fa/index';

import { SpecialButton } from '@/components/special-button';
import { useI18n } from '@/hooks/use-i18n';

import styles from './donate.module.css';

export function Donate() {
  const { t } = useI18n();

  return (
    <div className={styles.donate}>
      <div className={styles.iconContainer}>
        <div className={styles.tail} />
        <div aria-hidden="true" className={styles.icon}>
          <FaCoffee />
        </div>
      </div>

      <div className={styles.title}>
        <span>{t('donate.title')}</span>
      </div>
      <p className={styles.desc}>{t('donate.desc')}</p>
      <SpecialButton
        className={styles.button}
        href="https://buymeacoffee.com/remvze"
      >
        {t('donate.button')}
      </SpecialButton>
    </div>
  );
}
