import { MdNotes } from 'react-icons/md/index';

import { Item } from '../item';

import { useNoteStore } from '@/stores/note';
import { useI18n } from '@/hooks/use-i18n';

interface NotepadProps {
  open: () => void;
}

export function Notepad({ open }: NotepadProps) {
  const note = useNoteStore(state => state.note);
  const { t } = useI18n();

  return (
    <Item
      active={!!note.length}
      icon={<MdNotes />}
      label={t('menu.notepad')}
      shortcut="Shift + N"
      onClick={open}
    />
  );
}
