import { BiShuffle } from 'react-icons/bi/index';

import { useSoundStore } from '@/stores/sound';

import { Item } from '../item';
import { useI18n } from '@/hooks/use-i18n';

export function Shuffle() {
  const shuffle = useSoundStore(state => state.shuffle);
  const locked = useSoundStore(state => state.locked);
  const { t } = useI18n();

  return (
    <Item
      disabled={locked}
      icon={<BiShuffle />}
      label={t('menu.shuffle')}
      onClick={shuffle}
    />
  );
}
