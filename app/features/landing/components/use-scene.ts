import { type RefObject, useEffect, useRef, useState } from "react";

/** Resolves after `ms` of on-screen time; rejects when the scene is stopped. */
export type Wait = (ms: number) => Promise<void>;

const STOPPED = Symbol("scene stopped");

export function usePrefersReducedMotion() {
	const [reduced, setReduced] = useState(false);
	useEffect(() => {
		const query = matchMedia("(prefers-reduced-motion: reduce)");
		setReduced(query.matches);
		const onChange = () => setReduced(query.matches);
		query.addEventListener("change", onChange);
		return () => query.removeEventListener("change", onChange);
	}, []);
	return reduced;
}

/**
 * Tracks whether an element is on screen, for pausing work nobody sees. With
 * `once`, it stays true after the first sighting (for one-shot reveals).
 */
export function useInView(
	ref: RefObject<Element | null>,
	{ threshold = 0.25, once = false } = {},
) {
	const [inView, setInView] = useState(false);
	useEffect(() => {
		const element = ref.current;
		if (!element) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				setInView(entry.isIntersecting);
				if (once && entry.isIntersecting) observer.disconnect();
			},
			{ threshold },
		);
		observer.observe(element);
		return () => observer.disconnect();
	}, [ref, threshold, once]);
	return inView;
}

type SceneOptions = {
	/** Restarts the scene whenever this value changes. */
	runKey?: unknown;
	/** Play once instead of looping. */
	once?: boolean;
};

/**
 * Runs an async animation script while `ref` is on screen. Time spent off
 * screen does not count, so a scene resumes where the viewer left it. The
 * script is skipped when the viewer prefers reduced motion; components then
 * render their resting state.
 */
export function useScene(
	ref: RefObject<Element | null>,
	script: (wait: Wait) => Promise<void>,
	{ runKey, once = false }: SceneOptions = {},
) {
	const reduced = usePrefersReducedMotion();
	const scriptRef = useRef(script);
	scriptRef.current = script;

	// biome-ignore lint/correctness/useExhaustiveDependencies: runKey restarts the scene on purpose.
	useEffect(() => {
		const element = ref.current;
		if (!element || reduced) return;

		let visible = false;
		let stopped = false;
		const observer = new IntersectionObserver(
			([entry]) => {
				visible = entry.isIntersecting;
			},
			{ threshold: 0.25 },
		);
		observer.observe(element);

		const wait: Wait = (ms) =>
			new Promise((resolve, reject) => {
				let left = ms;
				let previous = performance.now();
				const tick = (now: number) => {
					if (stopped) return reject(STOPPED);
					if (visible) left -= now - previous;
					previous = now;
					if (left <= 0) resolve();
					else requestAnimationFrame(tick);
				};
				requestAnimationFrame(tick);
			});

		(async () => {
			try {
				do await scriptRef.current(wait);
				while (!once && !stopped);
			} catch (error) {
				if (error !== STOPPED) throw error;
			}
		})();

		return () => {
			stopped = true;
			observer.disconnect();
		};
	}, [ref, reduced, once, runKey]);

	return reduced;
}

/** Types `text` into a setter one character at a time. */
export async function typeInto(
	text: string,
	set: (value: string) => void,
	wait: Wait,
	speed = 65,
) {
	for (let i = 1; i <= text.length; i++) {
		set(text.slice(0, i));
		await wait(speed + Math.random() * 55);
	}
}
