import { createTheme } from '@shopify/restyle';
const palette = { purplePrimary: '#5A31F4', black: '#0B0B0B', white: '#F0F2F3', greenPrimary: '#0ECD9D' };
export const theme = createTheme({
  colors: { mainBackground: palette.white, text: palette.black, accent: palette.greenPrimary },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 40 },
  breakpoints: { phone: 0, tablet: 768 },
  textVariants: { defaults: { fontSize: 16, color: 'text' }, header: { fontSize: 24, fontWeight: 'bold', color: 'text' } }
});
export type Theme = typeof theme;