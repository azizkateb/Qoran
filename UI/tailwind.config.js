export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 35px 90px rgba(6, 83, 94, 0.16)',
      },
      colors: {
        noor: {
          deep: '#041b2c',
          emerald: '#0f5c4a',
          gold: '#d9b572',
        },
      },
    },
  },
  plugins: [],
}
