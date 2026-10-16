"use client";

import { useEffect, useRef } from "react";
import { CanvasSpace, Pt, Group, Create, Circle } from "pts";
import { qualityScale } from "@/lib/museum/qualityScale";

export function PtsLocusStage({ expanded = false }: { expanded?: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const expandedRef = useRef(expanded);
  expandedRef.current = expanded;

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    const space = new CanvasSpace(el).setup({
      bgcolor: "#0e0e10",
      resize: true,
      retina: true,
    });
    const form = space.getForm();
    let pts: Group;
    let wellActive = false;
    let well = new Pt(0, 0);
    let pointerDownAt: Pt | null = null;
    let t = 0;

    space.add({
      start: () => {
        const n = qualityScale(expandedRef.current, 90, 140);
        pts = Create.distributeRandom(space.innerBound, n);
      },
      animate: () => {
        t += 0.016;
        // Soft trail instead of hard clear
        form.fillOnly("rgba(14,14,16,0.22)").rect(space.innerBound);
        const pointer = space.pointer;
        const linkDist = qualityScale(expandedRef.current, 90, 110);

        if (wellActive) {
          well = pointer;
          pts.forEach((p) => {
            const delta = well.$subtract(p);
            const d = Math.max(12, delta.magnitude());
            const pull = Math.min(2.8, 180 / d);
            p.add(delta.$unit().$multiply(pull * 0.55));
          });
          form.fillOnly("rgba(185,28,28,0.12)").point(well, 28, "circle");
          form.strokeOnly("rgba(185,28,28,0.45)", 1).circle(Circle.fromCenter(well, 36));
        }

        const near = pts.map((p) => {
          const d = Math.min(220, p.$subtract(pointer).magnitude());
          return { p, d };
        });

        form.strokeOnly("rgba(185,28,28,0.35)", 1);
        for (let i = 0; i < near.length; i++) {
          for (let j = i + 1; j < near.length; j++) {
            const a = near[i];
            const b = near[j];
            if (a.p.$subtract(b.p).magnitude() < linkDist) {
              form.line(new Group(a.p, b.p));
            }
          }
        }

        near.forEach(({ p, d }) => {
          const r = 2 + (1 - d / 220) * 5;
          form.fillOnly(d < 100 ? "#b91c1c" : "#d4d4d8").point(p, r, "circle");
          if (d < 140) {
            form.strokeOnly("rgba(232,228,220,0.15)", 1).circle(Circle.fromCenter(p, r * 3));
          }
        });

        // Quiet idle drift (low-frequency) instead of pure jitter
        pts.forEach((p, i) => {
          const drift = 0.22 + 0.12 * Math.sin(t * 0.7 + i * 0.15);
          p.add(
            new Pt(Math.sin(t * 0.4 + i) * drift * 0.15, Math.cos(t * 0.35 + i * 0.7) * drift * 0.15)
          );
          if (p.x < 0) p.x = space.width;
          if (p.x > space.width) p.x = 0;
          if (p.y < 0) p.y = space.height;
          if (p.y > space.height) p.y = 0;
        });
      },
      action: (type, px, py) => {
        if (type === "down") {
          wellActive = true;
          well = new Pt(px, py);
          pointerDownAt = new Pt(px, py);
        } else if (type === "up" || type === "drop") {
          const wasClick =
            pointerDownAt && pointerDownAt.$subtract(new Pt(px, py)).magnitude() < 10;
          if (wasClick) {
            const spawn = qualityScale(expandedRef.current, 10, 16);
            for (let i = 0; i < spawn; i++) {
              const a = Math.random() * Math.PI * 2;
              const r = 4 + Math.random() * 28;
              pts.push(new Pt(px + Math.cos(a) * r, py + Math.sin(a) * r));
            }
            const cap = qualityScale(expandedRef.current, 180, 260);
            if (pts.length > cap + 40) pts.splice(0, pts.length - cap);
          }
          wellActive = false;
          pointerDownAt = null;
        } else if (type === "drag" || type === "move") {
          if (wellActive) well = new Pt(px, py);
        }
      },
    });

    space.bindMouse().bindTouch().play();
    return () => {
      space.dispose();
    };
  }, [expanded]);

  return <div ref={host} className="h-full w-full touch-none" />;
}
