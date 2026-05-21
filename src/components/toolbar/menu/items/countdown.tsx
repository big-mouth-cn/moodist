import { MdOutlineTimer } from 'react-icons/md/index';

import { Item } from '../item';
import { useI18n } from '@/hooks/use-i18n';

interface CountdownProps {
  open: () => void;
}

export function Countdown({ open }: CountdownProps) {
  const { t } = useI18n();

  return (
    <Item
      icon={<MdOutlineTimer />}
      label={t('menu.countdown')}
      shortcut="Shift + C"
      onClick={open}
    />
  );
}
