"use client";

import { useEffect, useState, useCallback } from "react";
import {
  MessageCircle, // WhatsApp
  Twitter,        // X / Twitter
  Send,           // Telegram
  Facebook,       // Facebook
  Link2,          // Copiar link
  Check,          // Confirmação de cópia
  Share2,         // Native share (mobile)
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ShareButtonsProps {
  /** Título do post/receita — obrigatório */
  title: string;
  /** URL completa para compartilhar. Se omitida, usa window.location.href */
  url?: string;
  /** Descrição/excerpt opcional (usada no native share) */
  description?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildShareUrls(title: string, url: string) {
  const encodedUrl   = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedText  = encodeURIComponent(`${title} - ${url}`);

  return {
    whatsapp: `https://api.whatsapp.com/send?text=${encodedText}`,
    twitter:  `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  };
}

// ─── Sub-component: individual button ─────────────────────────────────────────

interface SocialButtonProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  /** Tailwind classes para hover (cor da rede social) */
  hoverClass: string;
}

function SocialButton({ href, label, icon, hoverClass }: SocialButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className={[
        "flex items-center gap-2 px-3.5 py-2 rounded-xl",
        "bg-zinc-900 border border-zinc-800 text-zinc-400",
        "text-xs font-medium transition-all duration-200",
        "hover:scale-105 active:scale-95",
        hoverClass,
      ].join(" ")}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ShareButtons({ title, url: urlProp, description }: ShareButtonsProps) {
  const [resolvedUrl,   setResolvedUrl]   = useState(urlProp ?? "");
  const [copied,        setCopied]        = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  // Resolve URL no client (SSR-safe)
  useEffect(() => {
    if (!urlProp) setResolvedUrl(window.location.href);
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, [urlProp]);

  const shareUrls = buildShareUrls(title, resolvedUrl);

  // ── Copiar link ──────────────────────────────────────────────────────────────
  const handleCopy = useCallback(async () => {
    if (!resolvedUrl) return;
    try {
      await navigator.clipboard.writeText(resolvedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback para browsers antigos
      const el = document.createElement("textarea");
      el.value = resolvedUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  }, [resolvedUrl]);

  // ── Native Share (mobile) ────────────────────────────────────────────────────
  const handleNativeShare = useCallback(async () => {
    if (!resolvedUrl) return;
    try {
      await navigator.share({
        title,
        text: description ?? title,
        url: resolvedUrl,
      });
    } catch {
      // Usuário cancelou ou não suportado — silencioso
    }
  }, [title, description, resolvedUrl]);

  return (
    <div className="flex flex-col gap-3">
      {/* Label */}
      <p className="text-xs font-semibold tracking-widest text-zinc-500 uppercase">
        Compartilhar
      </p>

      {/* Botões */}
      <div className="flex flex-wrap gap-2">
        {/* WhatsApp */}
        <SocialButton
          href={shareUrls.whatsapp}
          label="WhatsApp"
          icon={<MessageCircle className="h-4 w-4" />}
          hoverClass="hover:border-green-500/50 hover:text-green-400 hover:bg-green-500/5"
        />

        {/* Twitter / X */}
        <SocialButton
          href={shareUrls.twitter}
          label="Twitter"
          icon={<Twitter className="h-4 w-4" />}
          hoverClass="hover:border-sky-500/50 hover:text-sky-400 hover:bg-sky-500/5"
        />

        {/* Telegram */}
        <SocialButton
          href={shareUrls.telegram}
          label="Telegram"
          icon={<Send className="h-4 w-4" />}
          hoverClass="hover:border-blue-400/50 hover:text-blue-400 hover:bg-blue-500/5"
        />

        {/* Facebook */}
        <SocialButton
          href={shareUrls.facebook}
          label="Facebook"
          icon={<Facebook className="h-4 w-4" />}
          hoverClass="hover:border-blue-600/50 hover:text-blue-500 hover:bg-blue-600/5"
        />

        {/* Copiar link */}
        <button
          onClick={handleCopy}
          aria-label={copied ? "Link copiado!" : "Copiar link"}
          title={copied ? "Link copiado!" : "Copiar link"}
          className={[
            "flex items-center gap-2 px-3.5 py-2 rounded-xl",
            "bg-zinc-900 border text-xs font-medium transition-all duration-200",
            "hover:scale-105 active:scale-95",
            copied
              ? "border-amber-500/60 text-amber-400 bg-amber-500/10"
              : "border-zinc-800 text-zinc-400 hover:border-amber-500/50 hover:text-amber-400 hover:bg-amber-500/5",
          ].join(" ")}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              <span className="hidden sm:inline">Copiado!</span>
            </>
          ) : (
            <>
              <Link2 className="h-4 w-4" />
              <span className="hidden sm:inline">Copiar link</span>
            </>
          )}
        </button>

        {/* Native Share — exibido apenas em mobile com suporte */}
        {canNativeShare && (
          <button
            onClick={handleNativeShare}
            aria-label="Compartilhar"
            title="Compartilhar"
            className={[
              "flex items-center gap-2 px-3.5 py-2 rounded-xl",
              "bg-amber-500 border border-amber-500 text-zinc-950",
              "text-xs font-bold transition-all duration-200",
              "hover:bg-amber-400 hover:scale-105 active:scale-95",
            ].join(" ")}
          >
            <Share2 className="h-4 w-4" />
            <span>Compartilhar</span>
          </button>
        )}
      </div>
    </div>
  );
}
