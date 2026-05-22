import { useMemo, useState } from 'react';
import { FaWandMagicSparkles } from 'react-icons/fa6/index';

import { Modal } from '@/components/modal';
import { Tooltip } from '@/components/tooltip';

import { generateSoundscape } from '@/lib/ai-soundscape';
import { useI18n } from '@/hooks/use-i18n';
import { useAISoundscapeStore } from '@/stores/ai-soundscape';
import { useSoundStore } from '@/stores/sound';

import styles from './ai-soundscape.module.css';

import type { GeneratedSoundscape } from '@/lib/ai-soundscape';
import type { AISoundscapeRecord } from '@/stores/ai-soundscape';

type View = 'generate' | 'history';

export function AISoundscapeButton() {
  const [show, setShow] = useState(false);
  const { t } = useI18n();

  return (
    <>
      <Tooltip.Provider delayDuration={0}>
        <Tooltip content={t('aiSoundscape.tooltip')}>
          <button
            aria-label={t('aiSoundscape.tooltip')}
            className={styles.trigger}
            onClick={() => setShow(true)}
          >
            <FaWandMagicSparkles />
          </button>
        </Tooltip>
      </Tooltip.Provider>

      <AISoundscapeModal show={show} onClose={() => setShow(false)} />
    </>
  );
}

interface AISoundscapeModalProps {
  onClose: () => void;
  show: boolean;
}

function AISoundscapeModal({ onClose, show }: AISoundscapeModalProps) {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<GeneratedSoundscape | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [view, setView] = useState<View>('generate');
  const { language, t } = useI18n();
  const addRecord = useAISoundscapeStore(state => state.addRecord);
  const deleteRecord = useAISoundscapeStore(state => state.deleteRecord);
  const records = useAISoundscapeStore(state => state.records);
  const override = useSoundStore(state => state.override);
  const play = useSoundStore(state => state.play);

  const examples = useMemo(
    () => [
      t('aiSoundscape.examples.focus'),
      t('aiSoundscape.examples.sleep'),
      t('aiSoundscape.examples.cafe'),
    ],
    [t],
  );

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt || isGenerating) return;

    setError('');
    setResult(null);
    setIsGenerating(true);

    try {
      const generated = await generateSoundscape(trimmedPrompt, language);

      setResult(generated);
      addRecord({
        language,
        prompt: trimmedPrompt,
        sounds: generated.sounds,
        summary: generated.summary,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'requestFailed';

      setError(t(`aiSoundscape.errors.${message}`));
    } finally {
      setIsGenerating(false);
    }
  };

  const applySounds = (sounds: Record<string, number>) => {
    override(sounds);
    play();
    onClose();
  };

  const applyResult = () => {
    if (!result) return;

    applySounds(result.sounds);
  };

  return (
    <Modal show={show} wide onClose={onClose}>
      <div className={styles.dialog}>
        <header className={styles.header}>
          <div className={styles.icon}>
            <FaWandMagicSparkles />
          </div>
          <div>
            <h2 className={styles.title}>{t('aiSoundscape.title')}</h2>
            <p className={styles.desc}>{t('aiSoundscape.desc')}</p>
          </div>
        </header>

        <div className={styles.tabs}>
          <button
            className={view === 'generate' ? styles.activeTab : undefined}
            type="button"
            onClick={() => setView('generate')}
          >
            {t('aiSoundscape.tabs.generate')}
          </button>
          <button
            className={view === 'history' ? styles.activeTab : undefined}
            type="button"
            onClick={() => setView('history')}
          >
            {t('aiSoundscape.tabs.history', { count: records.length })}
          </button>
        </div>

        {view === 'generate' ? (
          <>
            <form className={styles.form} onSubmit={handleGenerate}>
              <textarea
                className={styles.textarea}
                placeholder={t('aiSoundscape.placeholder')}
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
              />

              <div className={styles.examples}>
                {examples.map(example => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => setPrompt(example)}
                  >
                    {example}
                  </button>
                ))}
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <button
                className={styles.generate}
                disabled={!prompt.trim() || isGenerating}
                type="submit"
              >
                {isGenerating
                  ? t('aiSoundscape.generating')
                  : t('aiSoundscape.generate')}
              </button>
            </form>

            {result && (
              <section className={styles.preview}>
                <h3>{t('aiSoundscape.previewTitle')}</h3>
                {result.summary && <p>{result.summary}</p>}
                <SoundList sounds={result.sounds} />
                <button className={styles.apply} onClick={applyResult}>
                  {t('aiSoundscape.apply')}
                </button>
              </section>
            )}
          </>
        ) : (
          <HistoryView
            records={records}
            onApply={applySounds}
            onDelete={deleteRecord}
            onUsePrompt={record => {
              setPrompt(record.prompt);
              setResult({
                sounds: record.sounds,
                summary: record.summary,
              });
              setError('');
              setView('generate');
            }}
          />
        )}
      </div>
    </Modal>
  );
}

interface SoundListProps {
  sounds: Record<string, number>;
}

function SoundList({ sounds }: SoundListProps) {
  const { t } = useI18n();

  return (
    <div className={styles.sounds}>
      {Object.entries(sounds).map(([id, volume]) => (
        <div className={styles.sound} key={id}>
          <span>{t(`sounds.${id}`)}</span>
          <span>{Math.round(volume * 100)}%</span>
        </div>
      ))}
    </div>
  );
}

interface HistoryViewProps {
  onApply: (sounds: Record<string, number>) => void;
  onDelete: (id: string) => void;
  onUsePrompt: (record: AISoundscapeRecord) => void;
  records: AISoundscapeRecord[];
}

function HistoryView({
  onApply,
  onDelete,
  onUsePrompt,
  records,
}: HistoryViewProps) {
  const { t } = useI18n();

  if (!records.length) {
    return <p className={styles.empty}>{t('aiSoundscape.history.empty')}</p>;
  }

  return (
    <section className={styles.history}>
      {records.map(record => (
        <article className={styles.record} key={record.id}>
          <div className={styles.recordHeader}>
            <div>
              <h3>{record.prompt}</h3>
              <time dateTime={new Date(record.createdAt).toISOString()}>
                {new Intl.DateTimeFormat(record.language, {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                }).format(record.createdAt)}
              </time>
            </div>
            <span>
              {t('aiSoundscape.history.soundCount', {
                count: Object.keys(record.sounds).length,
              })}
            </span>
          </div>

          {record.summary && (
            <p className={styles.recordSummary}>{record.summary}</p>
          )}

          <SoundList sounds={record.sounds} />

          <div className={styles.recordActions}>
            <button type="button" onClick={() => onApply(record.sounds)}>
              {t('aiSoundscape.history.apply')}
            </button>
            <button type="button" onClick={() => onUsePrompt(record)}>
              {t('aiSoundscape.history.usePrompt')}
            </button>
            <button type="button" onClick={() => onDelete(record.id)}>
              {t('aiSoundscape.history.delete')}
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}
