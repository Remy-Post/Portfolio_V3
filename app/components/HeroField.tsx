'use client';

import { useEffect, useRef } from 'react';
import {
  Scene,
  OrthographicCamera,
  WebGLRenderer,
  BufferGeometry,
  Float32BufferAttribute,
  Line,
  LineBasicMaterial,
  Color,
  Group,
  Clock,
  MathUtils,
} from 'three';

const ROW_COUNT = 22;
const POINTS_PER_ROW = 96;
const AMPLITUDE = 0.08;
const FLOW_SPEED = 0.18;
const MOUSE_RADIUS = 0.42;
const MOUSE_STRENGTH = 0.12;

/**
 * Layered pseudo-noise — cheap, good-enough fluid drift.
 */
function noise(x: number, y: number, t: number): number {
  return (
    Math.sin(x * 1.9 + t * 1.0 + y * 0.7) * 0.5 +
    Math.sin(x * 0.8 - t * 0.7 + y * 1.4) * 0.33 +
    Math.cos(x * 3.1 + y * 0.3 + t * 0.4) * 0.17
  );
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export default function HeroField() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const containerEl: HTMLDivElement | null = containerRef.current;
    if (!containerEl) return;
    const container: HTMLDivElement = containerEl;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Detect WebGL support; fall back silently to the CSS-rendered placeholder if missing.
    let supportsWebGL = false;
    try {
      const probe = document.createElement('canvas');
      supportsWebGL = !!(probe.getContext('webgl2') || probe.getContext('webgl'));
    } catch {
      supportsWebGL = false;
    }
    if (!supportsWebGL) return;

    // --- Scene setup ---
    const scene = new Scene();
    const inkColor = new Color('#2a201a');

    let width = container.clientWidth;
    let height = container.clientHeight;
    const aspect = () => width / Math.max(1, height);

    const camera = new OrthographicCamera(-aspect(), aspect(), 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'low-power',
    });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(width, height, false);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    renderer.domElement.setAttribute('aria-hidden', 'true');
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    // --- Geometry: one polyline per row, stacked vertically ---
    const group = new Group();
    scene.add(group);

    type Row = {
      geometry: BufferGeometry;
      positions: Float32Array;
      line: Line;
      material: LineBasicMaterial;
      baseY: number;
      phase: number;
    };
    const rows: Row[] = [];

    for (let r = 0; r < ROW_COUNT; r++) {
      const t = r / (ROW_COUNT - 1); // 0..1 top→bottom
      const baseY = MathUtils.lerp(0.72, -0.72, t);
      const depth = 1 - Math.abs(t - 0.5) * 2; // 1 at center, 0 at edges
      const opacity = 0.14 + depth * 0.22;

      const positions = new Float32Array(POINTS_PER_ROW * 3);
      for (let i = 0; i < POINTS_PER_ROW; i++) {
        const u = i / (POINTS_PER_ROW - 1);
        positions[i * 3 + 0] = MathUtils.lerp(-1.4, 1.4, u);
        positions[i * 3 + 1] = baseY;
        positions[i * 3 + 2] = 0;
      }

      const geometry = new BufferGeometry();
      geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));

      const material = new LineBasicMaterial({
        color: inkColor,
        transparent: true,
        opacity,
      });

      const line = new Line(geometry, material);
      group.add(line);
      rows.push({ geometry, positions, line, material, baseY, phase: r * 0.37 });
    }

    // --- Cursor ---
    const mouse = { x: 0, y: 0, active: false };

    function onPointerMove(e: PointerEvent) {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.x = nx * aspect();
      mouse.y = ny;
      mouse.active = true;
    }
    function onPointerLeave() {
      mouse.active = false;
    }
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerleave', onPointerLeave);

    // --- Animation loop ---
    const clock = new Clock();
    let rafId: number | null = null;
    let running = true;
    let visible = true;

    const tick = () => {
      if (!running || !visible) {
        rafId = null;
        return;
      }
      const t = clock.getElapsedTime() * FLOW_SPEED;

      for (let r = 0; r < rows.length; r++) {
        const row = rows[r];
        const { positions } = row;
        for (let i = 0; i < POINTS_PER_ROW; i++) {
          const u = i / (POINTS_PER_ROW - 1);
          const x = MathUtils.lerp(-1.4, 1.4, u);

          const n = noise(x * 1.8 + row.phase, row.baseY * 1.5 + row.phase, t);
          let y = row.baseY + n * AMPLITUDE;

          if (mouse.active) {
            const dx = x - mouse.x;
            const dy = row.baseY - mouse.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            const influence = 1 - smoothstep(0, MOUSE_RADIUS, d);
            y += influence * MOUSE_STRENGTH * Math.sign(dy || 1);
          }

          positions[i * 3 + 1] = y;
        }
        row.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
      rafId = window.requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (prefersReduced) {
        // Render one static frame and stop.
        renderer.render(scene, camera);
        return;
      }
      if (rafId === null) rafId = window.requestAnimationFrame(tick);
    };

    const stopLoop = () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    // --- Resize ---
    const onResize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      renderer.setSize(width, height, false);
      const a = aspect();
      camera.left = -a;
      camera.right = a;
      camera.top = 1;
      camera.bottom = -1;
      camera.updateProjectionMatrix();
      if (prefersReduced) renderer.render(scene, camera);
    };

    const resizeObs = new ResizeObserver(onResize);
    resizeObs.observe(container);

    // --- Intersection (pause off-screen) ---
    const intersectionObs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible = entry.isIntersecting;
          if (visible) startLoop();
          else stopLoop();
        }
      },
      { threshold: 0.01, rootMargin: '200px' },
    );
    intersectionObs.observe(container);

    // --- Tab visibility ---
    const onVisibility = () => {
      running = !document.hidden;
      if (running) startLoop();
      else stopLoop();
    };
    document.addEventListener('visibilitychange', onVisibility);

    // Start
    startLoop();

    // --- Cleanup ---
    return () => {
      stopLoop();
      resizeObs.disconnect();
      intersectionObs.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerleave', onPointerLeave);

      for (const row of rows) {
        row.geometry.dispose();
        row.material.dispose();
      }
      group.clear();
      scene.clear();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="hero-field relative w-full h-full overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 60% 50%, color-mix(in srgb, var(--color-ink) 3%, transparent) 0%, transparent 70%)',
      }}
    />
  );
}
