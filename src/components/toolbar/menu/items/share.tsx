import { IoShareSocialSharp } from 'react-icons/io5/index';

import { Item } from '../item';

import { useSoundStore } from '@/stores/sound';
import { useI18n } from '@/hooks/use-i18n';

interface ShareProps {
  open: () => void;
}

export function Share({ open }: ShareProps) {
  const noSelected = useSoundStore(state => state.noSelected());
  const { t } = useI18n();

  return (
    <Item
      disabled={noSelected}
      icon={<IoShareSocialSharp />}
      label={t('menu.share')}
      shortcut="Shift + S"
      onClick={open}
    />
  );
}
