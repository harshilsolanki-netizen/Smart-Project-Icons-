import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'Zio Icons — The shared icon library',description:'Find, preview and download the icons from the Zio design family. Editable SVGs, transparent PNGs, and a theme-aware icon studio.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}
