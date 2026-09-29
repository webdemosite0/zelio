import type { ReactNode } from "react";
const paths:Record<string,ReactNode>={
 grid:<><rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/></>,
 team:<><circle cx="9" cy="8" r="3"/><path d="M3.5 20c.6-3.5 2.5-5.2 5.5-5.2s4.9 1.7 5.5 5.2M16 5.5a3 3 0 0 1 0 5M18 15c1.7.8 2.6 2.3 2.8 4"/></>,
 check:<><rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="m8 12 2.6 2.6L16.5 8.7"/></>,
 file:<><path d="M6 2.8h8l4 4V21H6z"/><path d="M14 2.8v4h4M9 12h6M9 16h6"/></>,
 chart:<><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></>,
 spark:<path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z"/>,
 search:<><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></>,
 users:<><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.3"/><path d="M3 20c.5-3.5 2.6-5.3 6-5.3s5.5 1.8 6 5.3M15.5 15c2.8.1 4.6 1.5 5 4"/></>,
 bolt:<path d="m13.5 2-8 12h6L10.5 22l8-12h-6z"/>,
 link:<><path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.2"/><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.2"/></>,
 settings:<><circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.3M12 18.9v2.3M2.8 12h2.3M18.9 12h2.3M5.5 5.5l1.6 1.6M16.9 16.9l1.6 1.6M18.5 5.5l-1.6 1.6M7.1 16.9l-1.6 1.6"/></>,
};
export default function AppIcon({name,className="h-[18px] w-[18px]"}:{name:string;className?:string}){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">{paths[name]??paths.spark}</svg>}