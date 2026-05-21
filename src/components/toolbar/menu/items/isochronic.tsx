import { TbWaveSine } from 'react-icons/tb/index';

import { Item } from '../item';
import { useI18n } from '@/hooks/use-i18n';

interface IsochronicProps {
  open: () => void;
}

export function Isochronic({ open }: IsochronicProps) {
  const { t } = useI18n();

  return (
    <Item icon={<TbWaveSine />} label={t('menu.isochronic')} onClick={open} />
  );
}
