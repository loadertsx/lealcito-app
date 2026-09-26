/** Reject cross-origin form posts before performing mutations. */
export function assertSameOrigin(request: Request) {
	const origin = request.headers.get("Origin");
	if (origin !== new URL(request.url).origin) {
		throw new Response("Forbidden", { status: 403 });
	}
}
