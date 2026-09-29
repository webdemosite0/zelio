"use client";
import { useEffect,useState } from "react";
const icons={
 think:<path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/>,
 read:<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></>,
 run:<><path d="M4 17l6-5-6-5"/><path d="M12 19h8"/></>,
 write:<path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/>
};
const rows=[
 {i:"think",l:"Thinking",chip:"Planning the assignment",d:"Breaking the goal into an executable specialist plan."},
 {i:"read",l:"Read context",chip:"company-context.txt",d:"Using the founder profile, website analysis and shared company context."},
 {i:"run",l:"Run specialist",chip:"agent.execute()",d:"Executing the assignment with the selected ZELIO specialist."},
 {i:"write",l:"Draft result",chip:"response.txt",d:"Turning the run into a concise founder-ready deliverable."},
] as const;
export default function ToolTrace({active,done}:{active:boolean;done:boolean}){
 const[count,setCount]=useState(done?rows.length:0);const[open,setOpen]=useState<string|null>(null);
 useEffect(()=>{if(!active){if(done)setCount(rows.length);return}setCount(0);let n=0;const t=setInterval(()=>{n++;setCount(Math.min(n,rows.length));if(n>=rows.length)clearInterval(t)},520);return()=>clearInterval(t)},[active,done]);
 if(!active&&!done)return null;
 return <div className="mt-5 rounded-2xl border border-[#e7e9ef] bg-[#fafbfc] p-3.5">
  <div className="mb-2 flex items-center justify-between px-1"><p className="text-[11px] font-semibold text-[#6f7280]">{done?"Run complete":"Agent tools"}</p><span className={"h-2 w-2 rounded-full "+(active?"animate-pulse bg-electric-violet":"bg-emerald-500")}/></div>
  <div className="space-y-1">{rows.slice(0,count).map((r,i)=><div key={r.l} className="page-enter">
   <button type="button" onClick={()=>setOpen(open===r.l?null:r.l)} className="group flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-white">
    <span className="grid h-6 w-6 place-items-center rounded-md border border-[#e7e9ef] bg-white text-[#777a86] shadow-sm"><svg width="13" height="13" viewBox="0 0 24 24" fill={r.i==="think"?"currentColor":"none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{icons[r.i]}</svg></span>
    <span className="text-[12px] font-semibold text-ink">{r.l}</span><code className="min-w-0 flex-1 truncate rounded-md bg-white px-2 py-1 text-[11px] text-[#6e7180] shadow-[inset_0_0_0_1px_#eceef2]">{r.chip}</code>
    <span className={"text-[10px] text-muted transition "+(open===r.l?"rotate-90":"")}>›</span>
   </button>
   <div className={"grid transition-all duration-300 "+(open===r.l?"grid-rows-[1fr] opacity-100":"grid-rows-[0fr] opacity-0")}><div className="overflow-hidden"><p className="ml-10 border-l border-[#e4e6ec] py-1.5 pl-3 text-[11px] leading-5 text-muted">{r.d}</p></div></div>
  </div>)}</div>
 </div>
}