import { IoSettingsSharp } from 'react-icons/io5/index';

import { Item } from '../item';
import { useI18n } from '@/hooks/use-i18n';

interface SettingsProps {
  open: () => void;
}

export function Settings({ open }: SettingsProps) {
  const { t } = useI18n();

  return (
    <Item
      icon={<IoSettingsSharp />}
      label={t('menu.settings')}
      shortcut="Shift + G"
      onClick={open}
    />
  );
}
