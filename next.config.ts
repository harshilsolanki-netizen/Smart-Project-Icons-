import type { NextConfig } from 'next';
const config: NextConfig = {
  async headers() {
    return [{source:'/icons/:path*',headers:[{key:'Cache-Control',value:'public, max-age=3600, must-revalidate'},{key:'X-Content-Type-Options',value:'nosniff'}]},
    {source:'/:path*',headers:[{key:'X-Content-Type-Options',value:'nosniff'},{key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},{key:'X-Frame-Options',value:'DENY'}]}];
  },
};
export default config;
