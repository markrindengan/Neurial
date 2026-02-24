/**
 * Lightweight hook to synthesize sound effects using the Web Audio API.
 * This avoids external assets and keeps the bundle small.
 */
export const useSound = () => {
    const playSound = (type: 'pop' | 'click' | 'hover') => {
        const audioCtx = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        const now = audioCtx.currentTime;

        switch (type) {
            case 'pop':
                // Short soft pop sound for hover
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(200, now);
                oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.1);
                gainNode.gain.setValueAtTime(0.05, now);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                oscillator.start(now);
                oscillator.stop(now + 0.1);
                break;

            case 'click':
                // Snappy click sound for interactions
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(800, now);
                oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.05);
                gainNode.gain.setValueAtTime(0.02, now);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                oscillator.start(now);
                oscillator.stop(now + 0.05);
                break;

            case 'hover':
                // Minimal high-pitched tick
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(1000, now);
                gainNode.gain.setValueAtTime(0.01, now);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
                oscillator.start(now);
                oscillator.stop(now + 0.02);
                break;
        }

        // Close context after playback to save resources
        setTimeout(() => {
            audioCtx.close();
        }, 200);
    };

    return { playSound };
};
