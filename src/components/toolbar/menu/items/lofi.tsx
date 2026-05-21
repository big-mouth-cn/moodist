import { IoIosMusicalNote } from 'react-icons/io/index';

import { Item } from '../item';
import { useI18n } from '@/hooks/use-i18n';

interface LofiProps {
  open: () => void;
}

export function Lofi({ open }: LofiProps) {
  const { t } = useI18n();

  return (
    <Item icon={<IoIosMusicalNote />} label={t('menu.lofi')} onClick={open} />
  );
}
