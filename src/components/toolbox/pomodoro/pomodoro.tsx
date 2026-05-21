import { useState, useEffect, useRef, useMemo } from 'react';
import { FaUndo, FaPlay, FaPause } from 'react-icons/fa/index';
import { IoMdSettings } from 'react-icons/io/index';

import { Modal } from '@/components/modal';
import { Button } from '../generics/button';
import { Timer } from './timer';
import { Tabs } from './tabs';
import { Setting } from './setting';

import { useLocalStorage } from '@/hooks/use-local-storage';
import { useSoundEffect } from '@/hooks/use-sound-effect';
import { usePomodoroStore } from '@/stores/pomodoro';
import { useSettingsStore } from '@/stores/settings';
import { useCloseListener } from '@/hooks/use-close-listener';
import { useI18n } from '@/hooks/use-i18n';

import styles from './pomodoro.module.css';

interface PomodoroProps {
  onClose: () => void;
  open: () => void;
  show: boolean;
}

export function Pomodoro({ onClose, open, show }: PomodoroProps) {
  const [showSetting, setShowSetting] = useState(false);
  const { t } = useI18n();

  const [selectedTab, setSelectedTab] = useState('pomodoro');

  const running = usePomodoroStore(state => state.running);
  const setRunning = usePomodoroStore(state => state.setRunning);

  const [timer, setTimer] = useState(0);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  const alarmVolume = useSettingsStore(state => state.alarmVolume);

  const alarm = useSoundEffect('/sounds/alarm.mp3', alarmVolume);

  const defaultTimes = useMemo(
    () => ({
      long: 15 * 60,
      pomodoro: 25 * 60,
      short: 5 * 60,
    }),
    [],
  );

  const [times, setTimes] = useLocalStorage<Record<string, number>>(
    'moodist-pomodoro-setting',
    defaultTimes,
  );

  const [completions, setCompletions] = useState<Record<string, number>>({
    long: 0,
    pomodoro: 0,
    short: 0,
  });

  const tabs = useMemo(
    () => [
      { id: 'pomodoro', label: t('pomodoro.pomodoro') },
      { id: 'short', label: t('pomodoro.break') },
      { id: 'long', label: t('pomodoro.longBreak') },
    ],
    [t],
  );

  useCloseListener(() => setShowSetting(false));

  useEffect(() => {
    if (running) {
      if (interval.current) clearInterval(interval.current);

      interval.current = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else {
      if (interval.current) clearInterval(interval.current);
    }
  }, [running]);

  useEffect(() => {
    if (timer <= 0 && running) {
      if (interval.current) clearInterval(interval.current);

      alarm.play();

      setRunning(false);
      setCompletions(prev => ({
        ...prev,
        [selectedTab]: prev[selectedTab] + 1,
      }));
    }
  }, [timer, selectedTab, running, setRunning, alarm]);

  useEffect(() => {
    const time = times[selectedTab] || 10;

    if (interval.current) clearInterval(interval.current);

    setRunning(false);
    setTimer(time);
  }, [selectedTab, times, setRunning]);

  const toggleRunning = () => {
    if (running) setRunning(false);
    else if (timer <= 0) {
      const time = times[selectedTab] || 10;

      setTimer(time);
      setRunning(true);
    } else setRunning(true);
  };

  const restart = () => {
    if (interval.current) clearInterval(interval.current);

    const time = times[selectedTab] || 10;

    setRunning(false);
    setTimer(time);
  };

  return (
    <>
      <Modal show={show} onClose={onClose}>
        <header className={styles.header}>
          <h2 className={styles.title}>{t('pomodoro.title')}</h2>

          <div className={styles.button}>
            <Button
              icon={<IoMdSettings />}
              tooltip={t('pomodoro.changeTimes')}
              onClick={() => {
                onClose();
                setShowSetting(true);
              }}
            />
          </div>
        </header>

        <Tabs selectedTab={selectedTab} tabs={tabs} onSelect={setSelectedTab} />
        <Timer timer={timer} />

        <div className={styles.control}>
          <p className={styles.completed}>
            {t('pomodoro.completed', {
              count: completions[selectedTab] || 0,
            })}
          </p>
          <div className={styles.buttons}>
            <Button
              icon={<FaUndo />}
              smallIcon
              tooltip={t('pomodoro.restart')}
              onClick={restart}
            />
            <Button
              icon={running ? <FaPause /> : <FaPlay />}
              smallIcon
              tooltip={running ? t('pomodoro.pause') : t('pomodoro.start')}
              onClick={toggleRunning}
            />
          </div>
        </div>
      </Modal>

      <Setting
        show={showSetting}
        times={times}
        onChange={times => {
          setShowSetting(false);
          setTimes(times);
          open();
        }}
        onClose={() => {
          setShowSetting(false);
          open();
        }}
      />
    </>
  );
}
