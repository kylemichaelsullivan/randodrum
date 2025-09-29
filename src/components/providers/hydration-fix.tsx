import Script from 'next/script';

/**
 * HydrationFix injects a script that runs immediately before React hydration
 * to remove browser extension attributes that cause hydration mismatches
 */
export function HydrationFix() {
	return <Script src='/scripts/hydration-fix.js' strategy='afterInteractive' id='hydration-fix' />;
}
