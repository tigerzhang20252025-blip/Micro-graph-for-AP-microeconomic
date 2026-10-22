/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        econ: {
          demand: '#2563eb',      // Blue for Demand (D, MPB, MSB)
          supply: '#dc2626',      // Red for Supply (S, MPC, MSC)
          equilibrium: '#059669', // Emerald for Equilibrium
          cost: '#7c3aed',        // Purple for MC/ATC/AVC
          revenue: '#d97706',     // Amber for MR
          dwl: '#ef4444',         // Red / danger for Deadweight Loss
          surplus: '#10b981',     // Green for Consumer Surplus / Producer Surplus
          consumer: '#3b82f6',    // Sky blue for Consumer Surplus
          producer: '#f59e0b',    // Orange/amber for Producer Surplus
          tax: '#8b5cf6',         // Violet for Tax Revenue / Wedge
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'Monaco', 'Courier New', 'monospace']
      }
    },
  },
  plugins: [],
}
