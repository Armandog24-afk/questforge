"use client";

import * as React from "react";
import { Pause, Play, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { parseSynthUrl } from "@/lib/music";

/**
 * No commercial/copyrighted audio ships with the demo. Instead this
 * synthesizes a short procedural ambience via Web Audio API from the
 * track's `synth:<category>:<freq>` descriptor — real, working playback
 * with zero external assets.
 */
export function AudioPlayer({ audioUrl, name }: { audioUrl: string; name: string }) {
  const [playing, setPlaying] = React.useState(false);
  const [volume, setVolume] = React.useState(0.5);
  const ctxRef = React.useRef<AudioContext | null>(null);
  const nodesRef = React.useRef<{ oscillators: OscillatorNode[]; gain: GainNode } | null>(null);

  const descriptor = parseSynthUrl(audioUrl);

  function stop() {
    const nodes = nodesRef.current;
    const ctx = ctxRef.current;
    if (nodes && ctx) {
      const now = ctx.currentTime;
      nodes.gain.gain.cancelScheduledValues(now);
      nodes.gain.gain.setTargetAtTime(0, now, 0.12);
      const oscillators = nodes.oscillators;
      setTimeout(() => oscillators.forEach((o) => o.stop()), 400);
    }
    nodesRef.current = null;
    setPlaying(false);
  }

  function start() {
    if (!descriptor) return;
    const ctx = ctxRef.current ?? new AudioContext();
    ctxRef.current = ctx;

    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(ctx.destination);
    gain.gain.setTargetAtTime(volume * 0.18, ctx.currentTime, 0.4);

    const detunes = [0, 7, -5];
    const oscillators = detunes.map((detune, i) => {
      const osc = ctx.createOscillator();
      osc.type = i === 0 ? "sine" : "triangle";
      osc.frequency.value = descriptor.baseFrequency * (1 + detune / 200);
      osc.connect(gain);
      osc.start();
      return osc;
    });

    nodesRef.current = { oscillators, gain };
    setPlaying(true);
  }

  React.useEffect(() => stop, []);

  React.useEffect(() => {
    if (nodesRef.current && ctxRef.current) {
      nodesRef.current.gain.gain.setTargetAtTime(volume * 0.18, ctxRef.current.currentTime, 0.2);
    }
  }, [volume]);

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        size="icon"
        variant={playing ? "primary" : "secondary"}
        onClick={() => (playing ? stop() : start())}
        aria-label={playing ? `Pausa ${name}` : `Riproduci ${name}`}
      >
        {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
      </Button>
      <Volume2 className="size-4 text-muted" />
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={volume}
        onChange={(e) => setVolume(Number(e.target.value))}
        aria-label="Volume"
        className="w-20 accent-[var(--qf-accent-purple)]"
      />
    </div>
  );
}
