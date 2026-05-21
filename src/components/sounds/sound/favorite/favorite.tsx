import { BiHeart, BiSolidHeart } from 'react-icons/bi/index';
import { AnimatePresence, motion } from 'motion/react';

import { useSoundStore } from '@/stores/sound';
import { cn } from '@/helpers/styles';
import { fade } from '@/lib/motion';

import styles from './favorite.module.css';

import { useKeyboardButton } from '@/hooks/use-keyboard-button';
import { useI18n } from '@/hooks/use-i18n';
import { waitUntil } from '@/helpers/wait';

interface FavoriteProps {
  id: string;
  label: string;
}

export function Favorite({ id, label }: FavoriteProps) {
  const isFavorite = useSoundStore(state => state.sounds[id].isFavorite);
  const toggleFavorite = useSoundStore(state => state.toggleFavorite);
  const { t } = useI18n();

  const handleToggle = async () => {
    toggleFavorite(id);

    // Check if false -> true
    if (!isFavorite) {
      await waitUntil(
        () => !!document.getElementById('category-favorites'),
        50,
      );

      document
        .getElementById('category-favorites')
        ?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const variants = fade();

  const handleKeyDown = useKeyboardButton(handleToggle);

  return (
    <AnimatePresence initial={false} mode="wait">
      <button
        className={cn(styles.favoriteButton, isFavorite && styles.isFavorite)}
        aria-label={
          isFavorite
            ? t('common.removeFavoriteAria', { label })
            : t('common.addFavoriteAria', { label })
        }
        onKeyDown={handleKeyDown}
        onClick={e => {
          e.stopPropagation();
          handleToggle();
        }}
      >
        <motion.span
          animate="show"
          aria-hidden="true"
          exit="hidden"
          initial="hidden"
          key={isFavorite ? `${id}-is-favorite` : `${id}-not-favorite`}
          variants={variants}
        >
          {isFavorite ? <BiSolidHeart /> : <BiHeart />}
        </motion.span>
      </button>
    </AnimatePresence>
  );
}
