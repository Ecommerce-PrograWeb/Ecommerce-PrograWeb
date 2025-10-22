// postcss.config.mjs
const isVitest = !!process.env.VITEST;

const config = isVitest
    ? { plugins: [] } // 👈 durante Vitest NO cargamos ningún plugin
    : {
        // 👇 en runtime normal (Next) Tailwind v4
        plugins: {
            "@tailwindcss/postcss": {},
        },
    };

export default config;
