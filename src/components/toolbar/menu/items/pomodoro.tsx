import { MdOutlineAvTimer } from 'react-icons/md/index';

import { Item } from '../item';

import { usePomodoroStore } from '@/stores/pomodoro';
import { useI18n } from '@/hooks/use-i18n';

interface PomodoroProps {
  open: () => void;
}

export function Pomodoro({ open }: PomodoroProps) {
  const running = usePomodoroStore(state => state.running);
  const { t } = useI18n();

  return (
    <Item
      active={running}
      icon={<MdOutlineAvTimer />}
      label={t('menu.pomodoro')}
      shortcut="Shift + P"
      onClick={open}
    />
  );
}
