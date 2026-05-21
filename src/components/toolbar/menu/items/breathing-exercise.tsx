import { IoMdFlower } from 'react-icons/io/index';

import { Item } from '../item';
import { useI18n } from '@/hooks/use-i18n';

interface BreathingExerciseProps {
  open: () => void;
}

export function BreathingExercise({ open }: BreathingExerciseProps) {
  const { t } = useI18n();

  return (
    <Item
      icon={<IoMdFlower />}
      label={t('menu.breathing')}
      shortcut="Shift + B"
      onClick={open}
    />
  );
}
