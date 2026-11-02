import type { NextConfig } from 'next';
const config: NextConfig = {
  poweredByHeader: false,
  async headers() { return [{ source: '/:path*', headers: [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'same-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
  ] }]; },
  async redirects() { return [
    {source:'/events',destination:'/news-events#tab-events',permanent:true},
    {source:'/community',destination:'/communities',permanent:true},
    {source:'/journal',destination:'/#journal',permanent:true}
  ]; }
};
export default config;
