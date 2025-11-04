import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
	base: "/",
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:8080',
				changeOrigin: true,
				// rewrite: (path) => path.replace(/^\/api/, 'api'),
			},
		}
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
			// 'monaco-editor': path.resolve(__dirname, 'node_modules/monaco-editor')

		},
	},
	plugins: [
		react(),
		tailwindcss()
	],
	optimizeDeps: {
		include: ['monaco-editor'],
	},
})
