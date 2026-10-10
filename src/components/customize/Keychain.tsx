"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import * as ClipperLib from "clipper-lib";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as opentype from "opentype.js";

interface Props {
  text: string;
  color: string;
  fontFile: string;
}

interface Api {
  setText: (t: string) => void;
  setColor: (c: string) => void;
  setFont: (f: string) => void;
}

type Path = ClipperLib.IntPoint[];

const S = 1000;
const HEIGHT_MM = 40; // fixed keychain height, width scales from it
const fontCache = new Map<string, opentype.Font>();

const orient = (p: Path): Path =>
  ClipperLib.Clipper.Orientation(p) ? p : [...p].reverse();

const toPath = (pts: THREE.Vector2[], dx: number, dy: number): Path =>
  orient(
    pts.map((p) => ({
      X: Math.round((p.x + dx) * S),
      Y: Math.round((p.y + dy) * S),
    }))
  );

function circlePath(cx: number, cy: number, r: number): Path {
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i < 40; i++) {
    const a = (i / 40) * Math.PI * 2;
    pts.push(new THREE.Vector2(cx + Math.cos(a) * r, cy + Math.sin(a) * r));
  }
  return toPath(pts, 0, 0);
}

function textShapes(
  font: opentype.Font,
  value: string,
  size: number
): THREE.Shape[] {
  const sp = new THREE.ShapePath();
  for (const c of font.getPath(value, 0, 0, size).commands) {
    if (c.type === "M") sp.moveTo(c.x, -c.y);
    else if (c.type === "L") sp.lineTo(c.x, -c.y);
    else if (c.type === "Q") sp.quadraticCurveTo(c.x1, -c.y1, c.x, -c.y);
    else if (c.type === "C")
      sp.bezierCurveTo(c.x1, -c.y1, c.x2, -c.y2, c.x, -c.y);
  }
  return sp.toShapes();
}

function union(a: Path[], b: Path[]): Path[] {
  const c = new ClipperLib.Clipper();
  c.AddPaths(a, ClipperLib.PolyType.ptSubject, true);
  c.AddPaths(b, ClipperLib.PolyType.ptClip, true);
  const out: Path[] = [];
  c.Execute(
    ClipperLib.ClipType.ctUnion,
    out,
    ClipperLib.PolyFillType.pftNonZero,
    ClipperLib.PolyFillType.pftNonZero
  );
  return out;
}

function offset(paths: Path[], delta: number): Path[] {
  const co = new ClipperLib.ClipperOffset(2, 5);
  co.AddPaths(
    paths,
    ClipperLib.JoinType.jtRound,
    ClipperLib.EndType.etClosedPolygon
  );
  const out: Path[] = [];
  co.Execute(out, delta * S);
  return out;
}

const outers = (paths: Path[]): Path[] =>
  paths.filter((p) => ClipperLib.Clipper.Orientation(p));

const toShape = (p: Path): THREE.Shape =>
  new THREE.Shape(p.map((pt) => new THREE.Vector2(pt.X / S, pt.Y / S)));

function dimLine(
  a: THREE.Vector3,
  b: THREE.Vector3,
  tick: THREE.Vector3,
  m: THREE.Material
): THREE.LineSegments {
  const t = tick.clone().multiplyScalar(0.15);
  const pts = [
    a,
    b,
    a.clone().sub(t),
    a.clone().add(t),
    b.clone().sub(t),
    b.clone().add(t),
  ];
  return new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints(pts),
    m
  );
}

function disposeGroup(g: THREE.Group): void {
  g.traverse((o) => {
    if ("geometry" in o) (o.geometry as THREE.BufferGeometry).dispose();
  });
  g.clear();
}

export default function KeychainCanvas({ text, color, fontFile }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<Api | null>(null);

  

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xcccccc, 1.2));
    const dir = new THREE.DirectionalLight(0xffffff, 2);
    dir.position.set(4, 6, 8);
    scene.add(dir);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 4;
    controls.maxDistance = 40;

    const mBlack = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.5,
    });
    const mText = new THREE.MeshStandardMaterial({ color, roughness: 0.4 });
    const mMetal = new THREE.MeshStandardMaterial({
      color: 0xcfcfcf,
      metalness: 0.9,
      roughness: 0.25,
    });
    const mDim = new THREE.LineBasicMaterial({ color: 0x121110 });

    const group = new THREE.Group();
    scene.add(group);

    const mkLabel = (): HTMLSpanElement => {
      const el = document.createElement("span");
      el.className = "cz-dim";
      mount.appendChild(el);
      return el;
    };
    const wLabel = mkLabel();
    const hLabel = mkLabel();
    const wPos = new THREE.Vector3();
    const hPos = new THREE.Vector3();
    const fitSize = new THREE.Vector3();

    let font: opentype.Font | null = null;
    let current = "Name";
    let fontReq = 0;

    const layer = (
      shapes: THREE.Shape[],
      z: number,
      depth: number,
      m: THREE.Material
    ): THREE.Mesh => {
      const geo = new THREE.ExtrudeGeometry(shapes, {
        depth,
        bevelEnabled: false,
        curveSegments: 8,
      });
      const mesh = new THREE.Mesh(geo, m);
      mesh.position.z = z;
      return mesh;
    };

    const fit = (): void => {
      if (fitSize.x === 0) return;
      const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const d =
        Math.max(fitSize.y / (2 * t), fitSize.x / (2 * t * camera.aspect)) *
          1.2 +
        fitSize.z;
      camera.position.setLength(d);
    };

    const build = (): void => {
      if (!font) return;
      disposeGroup(group);
      group.position.set(0, 0, 0);

      const shapes = textShapes(font, current, 1.6);
      if (shapes.length === 0) return;

      const raw = shapes.map((s) => s.extractPoints(12).shape);
      const all = raw.flat();
      const minX = Math.min(...all.map((p) => p.x));
      const minY = Math.min(...all.map((p) => p.y));
      const maxY = Math.max(...all.map((p) => p.y));
      const dx = -minX;
      const dy = -(minY + maxY) / 2;

      const textPaths = union(
        raw.map((r) => toPath(r, dx, dy)),
        []
      );

      // const hole = { x: -0.15, y: (maxY - minY) / 2 + 0.1, r: 0.28 };
      const hole = { x: -0.6, y: 0, r: 0.26 };
      const blackPaths = outers(
        union(offset(textPaths, 0.3), [circlePath(hole.x, hole.y, 0.8)])
      );
      const blackShapes = blackPaths.map(toShape);
      const holeIdx = blackPaths.findIndex(
        (p) =>
          ClipperLib.Clipper.PointInPolygon(
            { X: hole.x * S, Y: hole.y * S },
            p
          ) !== 0
      );
      if (holeIdx >= 0) {
        const h = new THREE.Path();
        h.absarc(hole.x, hole.y, hole.r, 0, Math.PI * 2, true);
        blackShapes[holeIdx].holes.push(h);
      }

      const top = layer(shapes, 0.4, 0.3, mText);
      top.geometry.translate(dx, dy, 0);
      group.add(layer(blackShapes, 0, 0.4, mBlack), top);

      // dimensions (height fixed, width derived from proportions)
      const body = new THREE.Box3().setFromObject(group);
      const bs = body.getSize(new THREE.Vector3());
      const wMm = Math.round((bs.x / bs.y) * HEIGHT_MM);
      const zz = 0.2;
      const yLine = body.min.y - 0.7;
      const xLine = body.max.x + 0.7;
      group.add(
        dimLine(
          new THREE.Vector3(body.min.x, yLine, zz),
          new THREE.Vector3(body.max.x, yLine, zz),
          new THREE.Vector3(0, 1, 0),
          mDim
        ),
        dimLine(
          new THREE.Vector3(xLine, body.min.y, zz),
          new THREE.Vector3(xLine, body.max.y, zz),
          new THREE.Vector3(1, 0, 0),
          mDim
        )
      );
      wPos.set((body.min.x + body.max.x) / 2, yLine - 0.6, zz);
      hPos.set(xLine + 1.1, (body.min.y + body.max.y) / 2, zz);
      wLabel.textContent = `${wMm} mm`;
      hLabel.textContent = `${HEIGHT_MM} mm`;

      // chain
      const d = new THREE.Vector2(-0.6, 0.8).normalize();
      const angle = Math.atan2(d.y, d.x) - Math.PI / 2;
      const links = 4;
      for (let i = 0; i < links; i++) {
        const link = new THREE.Mesh(
          new THREE.TorusGeometry(0.2, 0.055, 12, 24),
          mMetal
        );
        link.scale.y = 1.7;
        link.rotation.order = "ZYX";
        link.rotation.set(0, i % 2 ? Math.PI / 2 : 0, angle);
        const t = 0.12 + i * 0.36;
        link.position.set(hole.x + d.x * t, hole.y + d.y * t, 0.3);
        group.add(link);
      }
      const endT = 0.12 + links * 0.36 + 0.7;
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.95, 0.06, 16, 60),
        mMetal
      );
      ring.rotation.y = 0.5;
      ring.position.set(hole.x + d.x * endT, hole.y + d.y * endT, 0.3);
      group.add(ring);

      const box = new THREE.Box3().setFromObject(group);
      const c = box.getCenter(new THREE.Vector3());
      box.getSize(fitSize);
      group.position.set(-c.x, -c.y, -c.z);
      fit();
    };

    const resize = (): void => {
      const { clientWidth: w, clientHeight: h } = mount;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      fit();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    resize();

    const place = (el: HTMLElement, local: THREE.Vector3): void => {
      const v = group.localToWorld(local.clone()).project(camera);
      const x = (v.x * 0.5 + 0.5) * mount.clientWidth;
      const y = (-v.y * 0.5 + 0.5) * mount.clientHeight;
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    };

    let raf = 0;
    const loop = (): void => {
      controls.update();
      renderer.render(scene, camera);
      place(wLabel, wPos);
      place(hLabel, hPos);
      raf = requestAnimationFrame(loop);
    };
    loop();

    apiRef.current = {
      setText: (t) => {
        current = t;
        build();
      },
      setColor: (c) => {
        mText.color.set(c);
      },
      setFont: (file) => {
        const id = ++fontReq;
        const apply = (f: opentype.Font): void => {
          if (id !== fontReq) return;
          font = f;
          build();
        };
        const cached = fontCache.get(file);
        if (cached) return apply(cached);
        fetch(file)
          .then((r) => r.arrayBuffer())
          .then((buf) => {
            const f = opentype.parse(buf);
            fontCache.set(file, f);
            apply(f);
          });
      },
    };

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      disposeGroup(group);
      [mBlack, mText, mMetal, mDim].forEach((m) => m.dispose());
      renderer.dispose();
      mount.removeChild(renderer.domElement);
      wLabel.remove();
      hLabel.remove();
      apiRef.current = null;
    };
  }, []);

  useEffect(() => {
    apiRef.current?.setColor(color);
  }, [color]);

  useEffect(() => {
    apiRef.current?.setFont(fontFile);
  }, [fontFile]);

  useEffect(() => {
    apiRef.current?.setText(text.trim() || "Name");
  }, [text]);

  return <div ref={mountRef} className="cz-canvas" />;
}
