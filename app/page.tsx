"use client";

import { useMemo, useState } from "react";

type Agent = { name:string; task:string; color:string; soft:string; x:number; y:number };

const agents: Agent[] = [
  { name:"Strategy", task:"Sharpening the launch plan", color:"#ffb23f", soft:"#fff2ce", x:50, y:12 },
  { name:"Research", task:"Mapping competitor gaps", color:"#21cdd5", soft:"#d9fbfb", x:18, y:38 },
  { name:"Product", task:"Turning insights into scope", color:"#a554ff", soft:"#efddff", x:82, y:38 },
  { name:"Marketing", task:"Drafting the launch story", color:"#ff4ea3", soft:"#ffe0f0", x:22, y:76 },
  { name:"Development", task:"Building the landing page", color:"#3887ff", soft:"#deebff", x:50, y:88 },
  { name:"Sales", task:"Finding early prospects", color:"#ff725e", soft:"#ffe3dd", x:78, y:76 },
];

function ZelioLogo({ compact=false }: { compact?: boolean }) {
  return <div className="brand" aria-label="ZELIO">
    <svg className={compact ? "logoMark compact" : "logoMark"} viewBox="0 0 88 88" aria-hidden="true">
      <defs>
        <linearGradient id="zg1" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#18dcff"/><stop offset=".35" stopColor="#258bff"/><stop offset=".63" stopColor="#8745ff"/><stop offset="1" stopColor="#ff4cae"/>
        </linearGradient>
        <linearGradient id="zg2" x1=".05" y1=".9" x2=".95" y2=".05">
          <stop stopColor="#258bff"/><stop offset=".4" stopColor="#7a45ff"/><stop offset=".68" stopColor="#ff3e9d"/><stop offset="1" stopColor="#ffcb45"/>
        </linearGradient>
      </defs>
      <path d="M18 15h47c8 0 12 8 7 14L62 40H15c-6 0-9-7-5-12l8-13Z" fill="url(#zg1)"/>
      <path d="M62 18c5-6 14-4 17 3 1 4 0 8-3 11L28 76c-5 4-12 3-16-3-3-5-2-10 2-14l48-41Z" fill="url(#zg2)"/>
      <path d="M25 59h49c7 0 10 7 6 12l-7 8H22c-6 0-9-7-5-11l8-9Z" fill="url(#zg2)"/>
    </svg>
    <span className="brandName">ZELIO</span>
  </div>;
}

function CompanyMap({ large=false }: { large?: boolean }) {
  const [active,setActive] = useState("Development");
  const activeAgent = useMemo(()=>agents.find(a=>a.name===active) ?? agents[4],[active]);

  return <div className={large ? "companyMap companyMapLarge" : "companyMap"}>
    <svg className="connections" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {agents.map(a=><line key={a.name} x1="50" y1="50" x2={a.x} y2={a.y}/>)}
    </svg>

    <button className="coreNode" aria-label="Zelio company core"><ZelioLogo compact/></button>

    {agents.map(a=><button
      key={a.name}
      className={`agentNode ${active===a.name ? "active":""}`}
      style={{left:`${a.x}%`,top:`${a.y}%`,"--agent":a.color,"--agentSoft":a.soft} as React.CSSProperties}
      onMouseEnter={()=>setActive(a.name)}
      onFocus={()=>setActive(a.name)}
      onClick={()=>setActive(a.name)}
    >
      <span className="agentDot"/>
      <span><strong>{a.name}</strong><small>{active===a.name ? a.task : "Working"}</small></span>
    </button>)}

    <div className="activityCard" style={{"--agent":activeAgent.color} as React.CSSProperties}>
      <div className="activityTop"><span className="liveDot"/> {activeAgent.name}</div>
      <strong>{activeAgent.task}</strong>
      <div className="progress"><i/></div>
      <small>Live · team context synced</small>
    </div>
  </div>;
}

export default function Home() {
  return <main>
    <div className="ambient ambientA"/><div className="ambient ambientB"/>
    <nav className="nav shell">
      <ZelioLogo/>
      <div className="navLinks"><a href="#product">Product</a><a href="#how">How it works</a><a href="#company">Company map</a></div>
      <a className="navCta" href="#start">Build my company <span>↗</span></a>
    </nav>

    <section className="hero shell" id="product">
      <div className="heroCopy">
        <div className="eyebrow"><span/> AI operating system for solo founders</div>
        <h1>Build the company.<br/>Skip the <em>headcount.</em></h1>
        <p>Give ZELIO an idea. It assembles a focused AI team, shares context across the company, and starts moving the work forward.</p>
        <div className="heroActions">
          <a className="primaryBtn" href="#start">Build my company <span>→</span></a>
          <a className="secondaryBtn" href="#company"><b>▶</b> Watch it work</a>
        </div>
        <div className="miniProof"><span className="proofOrb"/> One founder. One company brain. Six specialists.</div>
      </div>

      <div className="heroProduct">
        <div className="productTop">
          <div><small>HQ</small><strong>Good morning.</strong></div>
          <span className="status"><i/> 6 agents working</span>
        </div>
        <CompanyMap/>
        <div className="commandBar"><span>⌘</span><p>Ask your company what to do next...</p><button>→</button></div>
      </div>
    </section>

    <section className="statement shell">
      <p className="sectionLabel">WHY ZELIO</p>
      <h2>Your startup shouldn’t need<br/>12 tabs and 6 AI subscriptions.</h2>
      <p className="subcopy">One shared company context. One coordinated team. One place to see what is moving.</p>
      <div className="concepts">
        <article><span className="conceptIcon cyan">01</span><h3>Think</h3><p>Research and strategy stay connected instead of living in separate chats.</p></article>
        <article><span className="conceptIcon purple">02</span><h3>Build</h3><p>Product and development turn decisions into concrete work and deliverables.</p></article>
        <article><span className="conceptIcon pink">03</span><h3>Grow</h3><p>Marketing and sales work from the same story, priorities, and customer context.</p></article>
      </div>
    </section>

    <section className="how shell" id="how">
      <div className="howIntro">
        <p className="sectionLabel">HOW IT WORKS</p>
        <h2>Idea → company.</h2>
        <p>We keep the workflow deliberately simple. ZELIO handles the coordination underneath.</p>
      </div>
      <div className="steps">
        <article><span>01</span><div><h3>Tell us what you’re building.</h3><p>Describe the business, customer, and goal in plain language.</p></div></article>
        <article><span>02</span><div><h3>ZELIO assembles your team.</h3><p>The right specialists appear with shared context and clear jobs.</p></div></article>
        <article><span>03</span><div><h3>Your company starts working.</h3><p>Review decisions, approve important moves, and watch the work progress.</p></div></article>
      </div>
    </section>

    <section className="companySection shell" id="company">
      <div className="companyHeadline">
        <p className="sectionLabel inverse">MEET YOUR COMPANY</p>
        <h2>A team you can actually see thinking.</h2>
        <p>Hover or tap a specialist. The map makes collaboration visible instead of hiding it behind another chat window.</p>
      </div>
      <CompanyMap large/>
    </section>

    <section className="execution shell">
      <div><p className="sectionLabel">REAL EXECUTION</p><h2>They don’t just chat.<br/>They work.</h2></div>
      <div className="taskStack">
        <article className="taskCard"><span className="taskIcon aqua">R</span><div><small>Research</small><strong>Competitor analysis</strong><p>Completed · 12 sources synthesized</p></div><b className="done">✓</b></article>
        <article className="taskCard raised"><span className="taskIcon blue">D</span><div><small>Development</small><strong>Landing page</strong><p>Building · 68%</p><div className="taskProgress"><i/></div></div><b>68%</b></article>
        <article className="taskCard"><span className="taskIcon pink">M</span><div><small>Marketing</small><strong>Launch campaign</strong><p>Waiting for founder approval</p></div><b className="waiting">•</b></article>
      </div>
    </section>

    <section className="finalCta shell" id="start">
      <div className="ctaGlow one"/><div className="ctaGlow two"/>
      <div><p className="sectionLabel inverse">READY WHEN YOU ARE</p><h2>Turn your idea into<br/>a company.</h2></div>
      <div className="ctaRight"><p>Your AI team is ready when you are.</p><button className="lightBtn">Build my company <span>→</span></button></div>
    </section>

    <footer className="footer shell">
      <ZelioLogo/><p>One founder. An entire AI company.</p><div><a href="#product">Product</a><a href="#how">How it works</a><a href="#company">Company map</a></div>
    </footer>
  </main>;
}
