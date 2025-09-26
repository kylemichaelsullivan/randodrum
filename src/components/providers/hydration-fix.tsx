import Script from 'next/script';

/**
 * HydrationFix injects a script that runs immediately before React hydration
 * to remove browser extension attributes that cause hydration mismatches
 */
export function HydrationFix() {
	return <Script id='hydration-fix' src='/scripts/hydration-fix.js' strategy='beforeInteractive' />;
}
