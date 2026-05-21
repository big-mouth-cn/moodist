import { useRegisterSW } from 'virtual:pwa-register/react'; // eslint-disable-line

import { Modal } from '@/components/modal';
import { useI18n } from '@/hooks/use-i18n';

import styles from './reload.module.css';

export function ReloadModal() {
  const { t } = useI18n();
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const close = () => {
    setNeedRefresh(false);
  };

  return (
    <Modal show={needRefresh} onClose={close}>
      <h2 className={styles.title}>{t('reload.title')}</h2>
      <p className={styles.desc}>{t('reload.desc')}</p>

      <div className={styles.buttons}>
        <button onClick={close}>{t('reload.close')}</button>

        <button
          className={styles.primary}
          onClick={() => updateServiceWorker(true)}
        >
          {t('reload.reload')}
        </button>
      </div>
    </Modal>
  );
}
