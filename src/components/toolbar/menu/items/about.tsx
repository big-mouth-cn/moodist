import { IoInformationCircleOutline } from 'react-icons/io5/index';

import { Item } from '../item';
import { useI18n } from '@/hooks/use-i18n';

interface AboutProps {
  open: () => void;
}

export function About({ open }: AboutProps) {
  const { t } = useI18n();

  return (
    <Item
      icon={<IoInformationCircleOutline />}
      label={t('menu.about')}
      onClick={open}
    />
  );
}
