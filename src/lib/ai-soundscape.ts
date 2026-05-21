import { sounds } from '@/data/sounds';
import { translations } from '@/i18n/translations';

import type { Language } from '@/i18n/types';

export interface GeneratedSoundscape {
  sounds: Record<string, number>;
  summary: string;
}

interface ChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

const MIN_VOLUME = 0.2;
const MAX_VOLUME = 1;

function getLLMConfig() {
  const baseURL = import.meta.env.PUBLIC_LLM_BASE_URL?.replace(/\/+$/, '');
  const apiKey = import.meta.env.PUBLIC_LLM_API_KEY;
  const model = import.meta.env.PUBLIC_LLM_MODEL;

  if (!baseURL || !apiKey || !model) {
    throw new Error('missingConfig');
  }

  return { apiKey, baseURL, model };
}

function clampVolume(volume: unknown) {
  const number = Number(volume);

  if (!Number.isFinite(number)) return MIN_VOLUME;

  return Math.min(MAX_VOLUME, Math.max(MIN_VOLUME, number));
}

function parseJSON(content: string) {
  try {
    return JSON.parse(content);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);

    if (!match) throw new Error('invalidResponse');

    return JSON.parse(match[0]);
  }
}

function getCatalog() {
  return sounds.categories.flatMap(category =>
    category.sounds.map(sound => ({
      category: category.id,
      id: sound.id,
      label: sound.label,
      zhLabel:
        translations['zh-CN'].sounds[
          sound.id as keyof (typeof translations)['zh-CN']['sounds']
        ],
    })),
  );
}

function validateGeneratedSoundscape(value: unknown): GeneratedSoundscape {
  if (!value || typeof value !== 'object') {
    throw new Error('invalidResponse');
  }

  const data = value as Partial<GeneratedSoundscape>;

  if (!data.sounds || typeof data.sounds !== 'object') {
    throw new Error('invalidResponse');
  }

  const validIDs = new Set(getCatalog().map(sound => sound.id));
  const generatedSounds: Record<string, number> = {};

  Object.entries(data.sounds).forEach(([id, volume]) => {
    if (!validIDs.has(id)) return;

    generatedSounds[id] = clampVolume(volume);
  });

  if (!Object.keys(generatedSounds).length) {
    throw new Error('emptyResult');
  }

  return {
    sounds: generatedSounds,
    summary: typeof data.summary === 'string' ? data.summary : '',
  };
}

function getSystemPrompt(language: Language) {
  return [
    'You are Moodist, an expert ambient soundscape designer.',
    'Generate a focused ambient sound mix from the available sound catalog.',
    'Use only sound IDs from the catalog.',
    'Choose 2 to 8 sounds unless the user clearly asks for something simpler.',
    'Set each volume between 0.2 and 1.',
    `Respond in ${language === 'zh-CN' ? 'Simplified Chinese' : 'English'}.`,
    'Return only valid JSON with this exact shape:',
    '{"summary":"short explanation","sounds":{"sound-id":0.5}}',
    `Available catalog: ${JSON.stringify(getCatalog())}`,
  ].join('\n');
}

export async function generateSoundscape(
  prompt: string,
  language: Language,
): Promise<GeneratedSoundscape> {
  const { apiKey, baseURL, model } = getLLMConfig();

  const response = await fetch(`${baseURL}/chat/completions`, {
    body: JSON.stringify({
      messages: [
        {
          content: getSystemPrompt(language),
          role: 'system',
        },
        {
          content: prompt,
          role: 'user',
        },
      ],
      model,
      response_format: { type: 'json_object' },
      temperature: 0.8,
    }),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('requestFailed');
  }

  const data = (await response.json()) as ChatCompletionResponse;
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('invalidResponse');
  }

  return validateGeneratedSoundscape(parseJSON(content));
}
