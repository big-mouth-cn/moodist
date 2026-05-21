import { sounds } from '@/data/sounds';
import { useMemo } from 'react';
import styles from './category-icons.module.css';
import { Container } from '@/components/container';
import { Tooltip } from '@/components/tooltip';
import { useI18n } from '@/hooks/use-i18n';

export default function CategoryIcons() {
  const categories = useMemo(() => sounds.categories, []);
  const { t } = useI18n();

  const goto = (id: string) => {
    const category = document.getElementById(`category-${id}`);
    category?.scrollIntoView();
  };

  return (
    <Container>
      <div className={styles.wrapper}>
        <h3 className={styles.title}>{t('categories.title')}</h3>
        <div className={styles.categoryIconsWrapper}>
          <Tooltip.Provider delayDuration={0}>
            {categories.map(category => {
              return (
                <Tooltip
                  content={t(`categories.${category.id}`)}
                  key={category.id}
                  placement="bottom"
                >
                  <button
                    className={styles.icon}
                    onClick={() => goto(category.id)}
                  >
                    {category.icon}
                  </button>
                </Tooltip>
              );
            })}
          </Tooltip.Provider>
        </div>
      </div>
    </Container>
  );
}
