(function () {
	// Remove browser extension attributes before React hydration
	const body = document.body;
	if (body) {
		const attributesToRemove = [
			'cz-shortcut-listen', // Common password manager extension
			'data-1password-root', // 1Password
			'data-bitwarden-watching', // Bitwarden
			'data-dashlane-id', // Dashlane
			'data-grammarly-ignore', // Grammarly
			'data-grammarly-shadow-root', // Grammarly
			'data-lastpass-icon-root', // LastPass
		];
		const removedAttributes = /** @type {string[]} */ ([]);

		attributesToRemove.forEach(attr => {
			if (body.hasAttribute(attr)) {
				body.removeAttribute(attr);
				removedAttributes.push(attr);
			}
		});

		// Store which attributes we removed for potential restoration
		if (removedAttributes.length > 0) {
			/** @type {Window & { __removedExtensionAttributes?: string[] }} */ (
				window
			).__removedExtensionAttributes = removedAttributes;
		}
	}
})();
