import { useEffect } from "react";
import { subscribeToLogo, LogoData } from "../store/siteStore";

/**
 * Genera un ícono PNG a partir del logo en base64 o del texto "Z"
 * y lo inyecta dinámicamente en el manifest de la PWA.
 */
function generateIconBlob(logo: LogoData, size: number): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    if (logo.mode === "image" && logo.imageBase64) {
      // Usar el logo subido por el admin
      const img = new Image();
      img.onload = () => {
        // Fondo negro
        ctx.fillStyle = "#050505";
        ctx.fillRect(0, 0, size, size);

        // Dibujar imagen circular centrada
        ctx.save();
        const radius = size / 2;
        ctx.beginPath();
        ctx.arc(radius, radius, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, 0, 0, size, size);
        ctx.restore();

        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = () => {
        // Fallback a ícono de texto si falla la imagen
        drawTextIcon(ctx, logo, size);
        resolve(canvas.toDataURL("image/png"));
      };
      img.src = logo.imageBase64;
    } else {
      // Ícono de texto con la "Z" o letra configurada
      drawTextIcon(ctx, logo, size);
      resolve(canvas.toDataURL("image/png"));
    }
  });
}

function drawTextIcon(
  ctx: CanvasRenderingContext2D,
  logo: LogoData,
  size: number
) {
  // Fondo negro
  ctx.fillStyle = "#050505";
  ctx.fillRect(0, 0, size, size);

  // Círculo rojo oscuro
  const radius = size * 0.42;
  const cx = size / 2;
  const cy = size / 2;

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = "#8B0000";
  ctx.fill();

  // Letra
  const letter = logo.letter || "Z";
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `900 ${size * 0.38}px 'Syne', sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(letter, cx, cy + size * 0.02);
}

async function injectDynamicManifest(logo: LogoData) {
  try {
    const [icon192, icon512] = await Promise.all([
      generateIconBlob(logo, 192),
      generateIconBlob(logo, 512),
    ]);

    const manifest = {
      name: "ZEQUI SMASH BURGERS",
      short_name: "ZEQUI",
      description: "Las mejores smash burgers artesanales. Haz tu pedido ahora.",
      start_url: "/",
      scope: "/",
      display: "standalone",
      orientation: "portrait-primary",
      background_color: "#050505",
      theme_color: "#050505",
      lang: "es",
      categories: ["food", "restaurants", "shopping"],
      icons: [
        {
          src: icon192,
          sizes: "192x192",
          type: "image/png",
          purpose: "any",
        },
        {
          src: icon512,
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    };

    // Crear Blob URL del manifest
    const blob = new Blob([JSON.stringify(manifest)], {
      type: "application/manifest+json",
    });
    const url = URL.createObjectURL(blob);

    // Reemplazar el link del manifest en el <head>
    let link = document.querySelector<HTMLLinkElement>("link[rel='manifest']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "manifest";
      document.head.appendChild(link);
    }

    // Revocar URL anterior si existe
    const oldUrl = link.href;
    link.href = url;
    if (oldUrl && oldUrl.startsWith("blob:")) {
      URL.revokeObjectURL(oldUrl);
    }

    // También actualizar el apple-touch-icon con el logo real
    if (logo.mode === "image" && logo.imageBase64) {
      let appleIcon = document.querySelector<HTMLLinkElement>(
        "link[rel='apple-touch-icon']"
      );
      if (!appleIcon) {
        appleIcon = document.createElement("link");
        appleIcon.rel = "apple-touch-icon";
        document.head.appendChild(appleIcon);
      }
      appleIcon.href = icon192;
    }
  } catch (_) {
    // Silencioso — usa el manifest estático como fallback
  }
}

export function useDynamicManifest() {
  useEffect(() => {
    const unsub = subscribeToLogo((logo) => {
      injectDynamicManifest(logo);
    });
    return () => unsub();
  }, []);
}
