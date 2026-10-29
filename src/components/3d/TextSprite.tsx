/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import * as THREE from 'three';

interface TextSpriteProps {
  position: [number, number, number];
  title: string;
  subtitle?: string;
  accentColor?: string;
  isActive?: boolean;
  scale?: [number, number, number];
}

export const TextSprite: React.FC<TextSpriteProps> = ({
  position,
  title,
  subtitle,
  accentColor = '#38bdf8',
  isActive = false,
  scale = [2.2, 0.75, 1],
}) => {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 176;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.Texture();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Rounded rectangle background
    const x = 12;
    const y = 12;
    const w = canvas.width - 24;
    const h = canvas.height - 24;
    const radius = 24;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();

    // Fill background
    ctx.fillStyle = isActive ? 'rgba(15, 23, 42, 0.96)' : 'rgba(3, 7, 18, 0.88)';
    ctx.fill();

    // Border
    ctx.lineWidth = isActive ? 8 : 4;
    ctx.strokeStyle = isActive ? accentColor : 'rgba(71, 85, 105, 0.7)';
    ctx.stroke();

    // Glowing dot
    ctx.beginPath();
    ctx.arc(x + 36, y + (subtitle ? 46 : h / 2), 10, 0, Math.PI * 2);
    ctx.fillStyle = accentColor;
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.restore();

    // Title Text
    ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(title, x + 62, y + (subtitle ? 46 : h / 2));

    // Subtitle Text (if present)
    if (subtitle) {
      ctx.font = '500 25px ui-monospace, SFMono-Regular, monospace';
      ctx.fillStyle = isActive ? '#7dd3fc' : '#94a3b8';
      ctx.fillText(subtitle, x + 36, y + 104);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, [title, subtitle, accentColor, isActive]);

  return (
    <sprite position={position} scale={scale}>
      <spriteMaterial
        map={texture}
        transparent
        depthTest={false}
        depthWrite={false}
      />
    </sprite>
  );
};
