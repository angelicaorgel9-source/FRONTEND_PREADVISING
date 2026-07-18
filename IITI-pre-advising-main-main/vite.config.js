import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_URL || 'http://127.0.0.1:8000'

  return defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/bridge': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  })
}
