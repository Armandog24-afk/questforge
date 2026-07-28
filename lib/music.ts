/**
 * Demo tracks don't ship real audio files (no commercial/copyrighted music).
 * Instead their `audioUrl` is a `synth:<category>:<baseFrequencyHz>` descriptor
 * that AudioPlayer turns into a short procedural ambience via Web Audio API —
 * real, working playback with zero external assets.
 */
export interface SynthDescriptor {
  category: string;
  baseFrequency: number;
}

export function parseSynthUrl(audioUrl: string): SynthDescriptor | null {
  const match = /^synth:([a-z0-9-]+):(\d+(?:\.\d+)?)$/i.exec(audioUrl.trim());
  if (!match) return null;
  return { category: match[1], baseFrequency: Number(match[2]) };
}
