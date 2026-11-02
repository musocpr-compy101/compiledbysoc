import type { Metadata,Viewport } from 'next';
import Script from 'next/script';
import {CalendarBridge} from '@/components/CalendarBridge';
import './app.css';
export const metadata:Metadata={title:{default:'Compiled By SOC',template:'%s · Compiled By SOC'},description:'Your everyday School of Computing hub. Study, stay updated and take part.',robots:{index:false,follow:false}};
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:'#111111'};
export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="en"><head/><body id="top">{children}<CalendarBridge/><Script src="/site.js" strategy="afterInteractive"/></body></html>;
}
