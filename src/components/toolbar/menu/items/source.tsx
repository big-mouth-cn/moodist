import { LuGithub } from 'react-icons/lu/index';

import { Item } from '../item';
import { useI18n } from '@/hooks/use-i18n';

export function Source() {
  const { t } = useI18n();

  return (
    <Item
      href="https://github.com/big-mouth-cn/moodist"
      icon={<LuGithub />}
      label={t('menu.source')}
    />
  );
}
