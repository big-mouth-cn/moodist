import { BsSoundwave } from 'react-icons/bs/index';

import { Container } from '@/components/container';
import { count as soundCount } from '@/lib/sounds';
import { useI18n } from '@/hooks/use-i18n';

import styles from './hero.module.css';

const count = soundCount();

export function Hero() {
  const { t } = useI18n();

  return (
    <div className={styles.hero}>
      <Container>
        <div className={styles.wrapper}>
          <div className={styles.pattern} />
          <div className={styles.logoWrapper}>
            <img
              alt="Faded Moodist Logo"
              aria-hidden="true"
              className={styles.logo}
              height={48}
              src="/logo.svg"
              width={48}
            />
          </div>

          <h1 className={styles.title}>
            {t('hero.title')}
            <span className={styles.line}>{t('hero.subtitle')}</span>
          </h1>

          <p className={styles.sounds}>
            <span aria-hidden="true" className={styles.icon}>
              <BsSoundwave />
            </span>
            <span>{t('hero.soundCount', { count })}</span>
          </p>
        </div>
      </Container>
    </div>
  );
}
