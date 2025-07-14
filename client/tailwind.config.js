// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'], // Ajusta según tu estructura
    theme: {
        extend: {
            keyframes: {
                'bounce-fast': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-8px)' },
                },
                'color-cycle': {
                    '0%, 100%': { backgroundColor: '#3b82f6' }, // azul-500
                    '50%': { backgroundColor: '#8b5cf6' },      // violeta-500
                },
            },
            animation: {
                'bounce-fast': 'bounce-fast 0.6s ease-in-out infinite',
                'color-cycle': 'color-cycle 0.6s ease-in-out infinite',
            },
        },
    },
    plugins: [],
}
