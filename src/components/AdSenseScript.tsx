import Script from 'next/script';
import { getWebsiteSettings } from '@/lib/db';

export default function AdSenseScript() {
  const settings = getWebsiteSettings();
  if (!settings.adsense_active || !settings.adsense_publisher_id) {
    return null;
  }

  return (
    <Script
      id="adsense-init"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${settings.adsense_publisher_id}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}

