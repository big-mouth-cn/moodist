import { Sounds } from '@/components/sounds';
import { useI18n } from '@/hooks/use-i18n';

import styles from './category.module.css';

import type { Category } from '@/data/types';

interface CategoryProps extends Category {
  functional?: boolean;
}

export function Category({
  functional = true,
  icon,
  id,
  sounds,
  title,
}: CategoryProps) {
  const { t } = useI18n();
  const translatedTitle = id === 'favorites' ? title : t(`categories.${id}`);

  return (
    <div className={styles.category} id={`category-${id}`}>
      <div className={styles.iconContainer}>
        <div className={styles.tail} />
        <div aria-hidden="true" className={styles.icon}>
          {icon}
        </div>
      </div>

      <div className={styles.title}>{translatedTitle}</div>

      <Sounds functional={functional} id={id} sounds={sounds} />
    </div>
  );
}
