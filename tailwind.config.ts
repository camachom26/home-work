import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        monoPix: ['"Press Start 2P"', "system-ui", "sans-serif"],
        spaceMono: ['"Space Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"]
      }
    }
  },
  plugins: []
} satisfies Config;