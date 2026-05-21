import { FaHeadphonesAlt } from 'react-icons/fa/index';

import { Item } from '../item';
import { useI18n } from '@/hooks/use-i18n';

interface BinauralProps {
  open: () => void;
}

export function Binaural({ open }: BinauralProps) {
  const { t } = useI18n();

  return (
    <Item
      icon={<FaHeadphonesAlt />}
      label={t('menu.binaural')}
      onClick={open}
    />
  );
}
