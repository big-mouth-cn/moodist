import { SiBuymeacoffee } from 'react-icons/si/index';

import { Item } from '../item';
import { useI18n } from '@/hooks/use-i18n';

export function Donate() {
  const { t } = useI18n();

  return (
    <Item
      href="https://buymeacoffee.com/remvze"
      icon={<SiBuymeacoffee />}
      label={t('menu.donate')}
    />
  );
}
