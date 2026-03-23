/**
 * Tipagem para a função global `fbq` injetada pelo Meta Pixel.
 * Extende a interface Window para que o TypeScript reconheça `window.fbq`.
 */
type FbqCommand = 'init' | 'track' | 'trackCustom' | 'trackSingle' | 'trackSingleCustom';

interface FbqFunction {
  (command: FbqCommand, eventName: string, params?: Record<string, unknown>): void;
  (command: 'init', pixelId: string): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: (...args: unknown[]) => void;
  loaded: boolean;
  version: string;
}

declare global {
  interface Window {
    fbq: FbqFunction;
    _fbq: FbqFunction;
  }
}

export const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '';

/** Dispara um PageView — chamado automaticamente pelo componente MetaPixel em cada mudança de rota. */
export const pageview = () => {
  window.fbq('track', 'PageView');
};

/**
 * Dispara um evento padrão ou customizado do Meta Pixel.
 *
 * @example
 * // Evento padrão sem parâmetros
 * trackEvent('Lead');
 *
 * @example
 * // Evento padrão com parâmetros de compra
 * trackEvent('Purchase', { value: 97.00, currency: 'BRL' });
 *
 * @example
 * // Evento customizado
 * trackEvent('CompleteRegistration', { content_name: 'Plano Anual' });
 */
export const trackEvent = (
  name: string,
  options: Record<string, unknown> = {},
) => {
  window.fbq('track', name, options);
};
