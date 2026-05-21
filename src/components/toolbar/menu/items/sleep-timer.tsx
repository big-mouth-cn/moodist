import { IoMoonSharp } from 'react-icons/io5/index';

import { useSleepTimerStore } from '@/stores/sleep-timer';
import { Item } from '../item';
import { useI18n } from '@/hooks/use-i18n';

interface SleepTimerProps {
  open: () => void;
}

export function SleepTimer({ open }: SleepTimerProps) {
  const active = useSleepTimerStore(state => state.active);
  const { t } = useI18n();

  return (
    <Item
      active={active}
      icon={<IoMoonSharp />}
      label={t('menu.sleepTimer')}
      shortcut="Shift + Alt + T"
      onClick={open}
    />
  );
}
