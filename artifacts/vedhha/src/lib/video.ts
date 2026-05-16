import { useEffect, useState } from 'react';

export function useVideoPlayer({ durations }: { durations: Record<string, number> }) {
  const [currentScene, setCurrentScene] = useState(0);
  const sceneKeys = Object.keys(durations);

  useEffect(() => {
    // Mock the recording functions that the environment might expect
    if (typeof window !== 'undefined' && !(window as any).startRecording) {
      (window as any).startRecording = () => console.log('Recording started');
      (window as any).stopRecording = () => console.log('Recording stopped');
    }

    (window as any).startRecording?.();

    let timeout: NodeJS.Timeout;
    const playScene = (index: number) => {
      setCurrentScene(index);
      const sceneKey = sceneKeys[index];
      const duration = durations[sceneKey];

      timeout = setTimeout(() => {
        if (index === sceneKeys.length - 1) {
          (window as any).stopRecording?.();
          playScene(0); // loop
        } else {
          playScene(index + 1);
        }
      }, duration);
    };

    playScene(0);

    return () => clearTimeout(timeout);
  }, []);

  return { currentScene };
}
