import { useState } from 'react';
import YouTube from 'react-youtube';

import { Modal } from '@/components/modal/modal';

import styles from './lofi.module.css';
import { padNumber } from '@/helpers/number';
import { useI18n } from '@/hooks/use-i18n';

interface LofiProps {
  onClose: () => void;
  show: boolean;
}

const videos = [
  {
    channel: 'Lofi Girl',
    id: 'jfKfPfyJRdk',
    title: 'lofi hip hop radio',
  },
  {
    channel: 'Lofi Girl',
    id: '4xDzrJKXOOY',
    title: 'synthwave radio',
  },
  {
    channel: 'Lofi Girl',
    id: 'P6Segk8cr-c',
    title: 'sad lofi radio',
  },
  {
    channel: 'Lofi Girl',
    id: 'S_MOd40zlYU',
    title: 'dark ambient radio',
  },
  {
    channel: 'Lofi Girl',
    id: 'TtkFsfOP9QI',
    title: 'peaceful piano radio',
  },
];

export function LofiModal({ onClose, show }: LofiProps) {
  const [isAccepted, setIsAccepted] = useState(false);
  const { t } = useI18n();

  return (
    <Modal persist show={show} onClose={onClose}>
      <h1 className={styles.title}>{t('lofi.title')}</h1>

      {!isAccepted ? (
        <div className={styles.notice}>
          <p>{t('lofi.notice')}</p>

          <div className={styles.buttons}>
            <button onClick={onClose}>{t('actions.cancel')}</button>
            <button
              className={styles.primary}
              onClick={() => setIsAccepted(true)}
            >
              {t('actions.continue')}
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.videos}>
          {videos.map((video, index) => (
            <div className={styles.video} key={video.id}>
              <h2>
                <span className={styles.index}>{padNumber(index + 1, 2)}</span>{' '}
                <strong>{video.channel}</strong> <span>/</span> {video.title}
              </h2>
              <div className={styles.container}>
                <YouTube iframeClassName={styles.iframe} videoId={video.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
