import { useEffect } from 'react';

import { useI18n } from '@/hooks/use-i18n';
import { count as soundCount } from '@/lib/sounds';

const count = soundCount();

function updateMeta(selector: string, content: string) {
  const element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) return;

  element.content = content;
}

export function DocumentMetadata() {
  const { language, t } = useI18n();

  useEffect(() => {
    const title = t('meta.title');
    const description = t('meta.description', { count });

    document.documentElement.lang = language;
    document.title = title;

    updateMeta('meta[name="title"]', title);
    updateMeta('meta[name="description"]', description);
    updateMeta('meta[property="og:title"]', title);
    updateMeta('meta[property="og:description"]', description);
  }, [language, t]);

  return null;
}
