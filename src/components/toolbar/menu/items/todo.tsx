import { MdTaskAlt } from 'react-icons/md/index';

import { Item } from '../item';
import { useI18n } from '@/hooks/use-i18n';

interface TodoProps {
  open: () => void;
}

export function Todo({ open }: TodoProps) {
  const { t } = useI18n();

  return (
    <Item
      icon={<MdTaskAlt />}
      label={t('menu.todo')}
      shortcut="Shift + T"
      onClick={open}
    />
  );
}
