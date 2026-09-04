import React, { useEffect } from 'react';
import { TranslationDict } from '../i18n/translations.ts';

interface HeadProps {
  t: TranslationDict;
  selectedRegion?: string;
  selectedTopic?: string;
}

export const Head: React.FC<HeadProps> = ({ t, selectedRegion, selectedTopic }) => {
  useEffect(() => {
    let title = `${t.appTitle} — ${t.tagline}`;
    if (selectedTopic && selectedTopic !== 'All' && selectedTopic !== 'Todos') {
      title = `${selectedTopic} | ${t.appTitle}`;
    } else if (selectedRegion && selectedRegion !== 'Global' && selectedRegion !== 'Todos') {
      title = `${selectedRegion} | ${t.appTitle}`;
    }
    document.title = title;
  }, [t, selectedRegion, selectedTopic]);

  return null;
};
