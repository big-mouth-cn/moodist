import { RiPlayListFill } from 'react-icons/ri/index';

import { Item } from '../item';
import { useI18n } from '@/hooks/use-i18n';

interface PresetsProps {
  open: () => void;
}

export function Presets({ open }: PresetsProps) {
  const { t } = useI18n();

  return (
    <Item
      icon={<RiPlayListFill />}
      label={t('menu.presets')}
      shortcut="Shift + Alt + P"
      onClick={open}
    />
  );
}
