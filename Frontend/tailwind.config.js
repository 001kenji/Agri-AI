/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./*.html",
    "./src/**/*.{js,ts,jsx,tsx}",
   'node_modules/flowbite-react/lib/esm/**/*.js'
  ],
  theme: {
    extend: {
      screens: {
        xs: '321px',
      },
    },
  },
  plugins: [
	require('daisyui'),
	require('flowbite/plugin'),
	],
  darkMode : 'class'
}