import { MdKeyboardCommandKey } from 'react-icons/md/index';

import { Item } from '../item';
import { useI18n } from '@/hooks/use-i18n';

interface ShortcutsProps {
  open: () => void;
}

export function Shortcuts({ open }: ShortcutsProps) {
  const { t } = useI18n();

  return (
    <Item
      icon={<MdKeyboardCommandKey />}
      label={t('menu.shortcuts')}
      shortcut="Shift + H"
      onClick={open}
    />
  );
}
