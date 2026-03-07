"use client";

import { useEffect, useState, useCallback } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { FaWhatsapp, FaTelegram, FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ShareButtonsProps {
  /** Título do post/receita — obrigatório */
  title: string;
  /** URL completa. Se omitida, usa window.location.href */
  url?: string;
  /** Excerpt/descrição (usado no native share mobile) */
  description?: string;
}

// ─── URL builders ─────────────────────────────────────────────────────────────

function buildUrls(title: string, url: string) {
  const eu = encodeURIComponent(url);
  const et = encodeURIComponent(title);
  const eb = encodeURIComponent(`${title} - ${url}`);
  return {
    whatsapp: `https://api.whatsapp.com/send?text=${eb}`,
    twitter:  `https://twitter.com/intent/tweet?text=${et}&url=${eu}`,
    telegram: `https://t.me/share/url?url=${eu}&text=${et}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${eu}`,
  };
}

// ─── Individual social button ─────────────────────────────────────────────────

interface SocialBtnProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  /** Classes Tailwind para hover (cor da rede social) */
  hover: string;
  /** Cor do ícone no estado padrão */
  iconColor: string;
}

function SocialBtn({ href, label, icon, hover, iconColor }: SocialBtnProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Compartilhar no ${label}`}
      title={`Compartilhar no ${label}`}
      className={[
        "flex items-center gap-2 px-3.5 py-2.5 rounded-xl",
        "bg-zinc-900 border border-zinc-800",
        "text-xs font-semibold transition-all duration-200",
        "hover:scale-105 active:scale-95",
        hover,
      ].join(" ")}
    >
      <span className={`text-base leading-none ${iconColor} transition-colors duration-200`}>
        {icon}
      </span>
      <span className="text-zinc-300">{label}</span>
    </a>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ShareButtons({ title, url: urlProp, description }: ShareButtonsProps) {
  const [resolvedUrl,    setResolvedUrl]    = useState(urlProp ?? "");
  const [copied,         setCopied]         = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    if (!urlProp) setResolvedUrl(window.location.href);
    setCanNativeShare(
      typeof navigator !== "undefined" && typeof navigator.share === "function"
    );
  }, [urlProp]);

  const urls = buildUrls(title, resolvedUrl);

  // ── Copiar link ──────────────────────────────────────────────────────────────
  const handleCopy = useCallback(async () => {
    if (!resolvedUrl) return;
    try {
      await navigator.clipboard.writeText(resolvedUrl);
    } catch {
      const el = document.createElement("textarea");
      el.value = resolvedUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }, [resolvedUrl]);

  // ── Native Share (iOS / Android) ─────────────────────────────────────────────
  const handleNativeShare = useCallback(async () => {
    if (!resolvedUrl) return;
    try {
      await navigator.share({ title, text: description ?? title, url: resolvedUrl });
    } catch {
      // cancelado ou não suportado — silencioso
    }
  }, [title, description, resolvedUrl]);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[11px] font-bold tracking-widest text-zinc-500 uppercase">
        Compartilhar
      </p>

      <div className="flex flex-wrap gap-2">
        {/* WhatsApp */}
        <SocialBtn
          href={urls.whatsapp}
          label="WhatsApp"
          icon={<FaWhatsapp />}
          iconColor="text-[#25D366]"
          hover="hover:border-[#25D366]/50 hover:bg-[#25D366]/5"
        />

        {/* X / Twitter */}
        <SocialBtn
          href={urls.twitter}
          label="X (Twitter)"
          icon={<FaXTwitter />}
          iconColor="text-zinc-100"
          hover="hover:border-zinc-400/50 hover:bg-zinc-100/5"
        />

        {/* Telegram */}
        <SocialBtn
          href={urls.telegram}
          label="Telegram"
          icon={<FaTelegram />}
          iconColor="text-[#2AABEE]"
          hover="hover:border-[#2AABEE]/50 hover:bg-[#2AABEE]/5"
        />

        {/* Facebook */}
        <SocialBtn
          href={urls.facebook}
          label="Facebook"
          icon={<FaFacebookF />}
          iconColor="text-[#1877F2]"
          hover="hover:border-[#1877F2]/50 hover:bg-[#1877F2]/5"
        />

        {/* Copiar link */}
        <button
          onClick={handleCopy}
          aria-label={copied ? "Link copiado!" : "Copiar link"}
          title={copied ? "Link copiado!" : "Copiar link"}
          className={[
            "flex items-center gap-2 px-3.5 py-2.5 rounded-xl",
            "bg-zinc-900 border text-xs font-semibold transition-all duration-200",
            "hover:scale-105 active:scale-95",
            copied
              ? "border-amber-500/60 bg-amber-500/10"
              : "border-zinc-800 hover:border-amber-500/50 hover:bg-amber-500/5",
          ].join(" ")}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-amber-400" />
              <span className="text-amber-400">Copiado!</span>
            </>
          ) : (
            <>
              <Link2 className="h-4 w-4 text-amber-400" />
              <span className="text-zinc-300">Copiar link</span>
            </>
          )}
        </button>

        {/* Native Share — apenas mobile com suporte */}
        {canNativeShare && (
          <button
            onClick={handleNativeShare}
            aria-label="Compartilhar"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Share2 className="h-4 w-4" />
            Compartilhar
          </button>
        )}
      </div>
    </div>
  );
}
