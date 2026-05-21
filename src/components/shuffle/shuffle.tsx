import { BiShuffle } from 'react-icons/bi/index';

import { Tooltip } from '@/components/tooltip';
import { useSoundStore } from '@/stores/sound';
import { useI18n } from '@/hooks/use-i18n';

import styles from './shuffle.module.css';

export function Shuffle() {
  const shuffle = useSoundStore(state => state.shuffle);
  const { t } = useI18n();

  return (
    <Tooltip.Provider delayDuration={0}>
      <Tooltip content={t('menu.shuffle')}>
        <button
          aria-label={t('menu.shuffle')}
          className={styles.button}
          onClick={shuffle}
        >
          <BiShuffle />
        </button>
      </Tooltip>
    </Tooltip.Provider>
  );
}
