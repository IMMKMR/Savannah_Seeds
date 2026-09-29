
import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

// Simple plugin to handle HTML includes
function htmlIncludePlugin() {
  return {
    name: 'html-include',
    enforce: 'pre',
    transformIndexHtml(html) {
      return html.replace(/<include src="(.*?)"><\/include>/g, (match, src) => {
        try {
          const filePath = resolve(__dirname, src);
          return fs.readFileSync(filePath, 'utf-8');
        } catch (e) {
          console.error('Error including HTML file:', src, e);
          return match;
        }
      });
    }
  };
}

export default defineConfig({
  base: '/Savannah_Seeds/',
  plugins: [htmlIncludePlugin()],
  server: {
    port: 8000
  }
});
