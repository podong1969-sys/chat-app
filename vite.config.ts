import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 깃허브 페이지 저장소명으로 바꿔야 함
const repoName = '/your-repo-name/'

// https://vitejs.dev/config/
export default defineConfig({
  base: repoName,
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
})
