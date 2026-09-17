import { useCallback, useEffect, useRef, useState } from 'react';

type UseSpeechResult = {
  speak: (text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
  supported: boolean;
};

export function useSpeech(): UseSpeechResult {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    setSupported(true);

    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      voiceRef.current =
        voices.find((voice) => voice.lang.startsWith('en') && voice.localService) ??
        voices.find((voice) => voice.lang.startsWith('en')) ??
        voices[0] ??
        null;
    };

    pickVoice();
    window.speechSynthesis.addEventListener('voiceschanged', pickVoice);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', pickVoice);
      window.speechSynthesis.cancel();
    };
  }, []);

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [supported]);

  const speak = useCallback(
    (text: string) => {
      if (!supported) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (voiceRef.current) utterance.voice = voiceRef.current;
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    },
    [supported],
  );

  return { speak, stop, isSpeaking, supported };
}