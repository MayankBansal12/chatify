/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */

module.exports = {
    darkMode: ['class'],
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
        './node_modules/react-tailwindcss-datepicker/dist/index.esm.js',
    ],
    theme: {
        extend: {
            fontFamily: {
                josefin: ['Josefin Sans', 'Ssans-serif'],
                title: ['Jomhuria', 'serif'],
            },
            colors: {
                primary: {
                    light: '#8477D7',
                    dull: '#757575',
                    DEFAULT: '#000000',
                },
                accent: {
                    light: '#D06DFF',
                    DEFAULT: '#000000',
                },
                background: {
                    light: '#E9E8E8',
                    extralight: '#EDEDEE',
                },
            },
        },
    },
    plugins: [],
}