import { useMemo, useState } from 'react';
import { FaWandMagicSparkles } from 'react-icons/fa6/index';

import { Modal } from '@/components/modal';
import { Tooltip } from '@/components/tooltip';

import { generateSoundscape } from '@/lib/ai-soundscape';
import { useI18n } from '@/hooks/use-i18n';
import { useSoundStore } from '@/stores/sound';

import styles from './ai-soundscape.module.css';

import type { GeneratedSoundscape } from '@/lib/ai-soundscape';

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
  const { language, t } = useI18n();
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
    } catch (error) {
      const message = error instanceof Error ? error.message : 'requestFailed';

      setError(t(`aiSoundscape.errors.${message}`));
    } finally {
      setIsGenerating(false);
    }
  };

  const apply = () => {
    if (!result) return;

    override(result.sounds);
    play();
    onClose();
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
            <div className={styles.sounds}>
              {Object.entries(result.sounds).map(([id, volume]) => (
                <div className={styles.sound} key={id}>
                  <span>{t(`sounds.${id}`)}</span>
                  <span>{Math.round(volume * 100)}%</span>
                </div>
              ))}
            </div>
            <button className={styles.apply} onClick={apply}>
              {t('aiSoundscape.apply')}
            </button>
          </section>
        )}
      </div>
    </Modal>
  );
}
