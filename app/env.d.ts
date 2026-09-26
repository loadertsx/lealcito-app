// Secrets live in .dev.vars locally and in `wrangler secret` remotely, so
// `wrangler types` only sees them when a .dev.vars file exists. Declaring them
// here keeps typechecking independent of local secrets.
declare namespace Cloudflare {
	interface Env {
		RESEND_API_KEY: string;
		MAILER_FROM: string;
		APP_ORIGIN: string;
		/** Inbox that receives landing-page early-access requests. */
		LEADS_TO: string;
	}
}
