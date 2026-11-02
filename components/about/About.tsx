import {Fragment} from 'react';
import type {AboutContent} from '@/content/pages/about';
import {TabIcon} from './icons';
const Lines=({text}:{text:string})=>{const l=text.split('\n');return <>{l.map((x,i)=><Fragment key={i}>{i>0&&<br/>}{x}</Fragment>)}</>;};
const Section=({heading,children,intro}:{heading:string;intro?:string;children:React.ReactNode})=><div className="section" style={{background:'#fff'}}><h2 className="sec-title">{heading}</h2><div className="sec-rule"/>{intro&&<p className="sec-sub">{intro}</p>}{children}</div>;
const Panel=({id,active,children}:{id:string;active?:boolean;children:React.ReactNode})=><div className={active?'tab-content active':'tab-content'} id={'tab-'+id}>{children}</div>;

export function About({c,children}:{c:AboutContent;children?:React.ReactNode}){
 const {masthead:m,index:ix,overview:o}=c;
 return <main id="main-content"><div className="reference-surface reference-about">
  <header className="editorial-masthead has-photo">
   <div className="masthead-copy"><h1>{m.title}<br/><em>{m.accent}</em></h1><p className="masthead-deck">{m.deck}</p></div>
   <figure className="masthead-photo"><img src={m.image} alt={m.imageAlt} width={1200} height={900} decoding="async"/><figcaption>{m.caption}</figcaption></figure>
  </header>
  <div className="editorial-body">
   <aside className="section-index" aria-label={ix.label}>
    <div className="desktop-index-intro"><h2>{ix.heading}</h2><p>{ix.intro}</p></div>
    <p className="section-index-label">{ix.exploreLabel}</p>
    <div className="tab-nav" id="tabNav">
     {c.tabs.map((t,i)=><button key={t.id} className={i===0?'tab-btn active':'tab-btn'} type="button" data-tab-target={'tab-'+t.id} data-tab-group="main" data-section-label={t.label}>{t.label}<span className="desktop-index-icon" aria-hidden="true"><TabIcon name={t.icon}/></span><span className="desktop-index-description" aria-hidden="true">{t.description}</span></button>)}
    </div>
   </aside>
   <div className="section-panels">
    <Panel id="overview" active>
     <div className="t-inline-note"><span className="t-tag">{o.tag}</span><h2>{o.noteHeading}</h2>{o.noteBody.map((p,i)=><p key={i}>{p}</p>)}</div>
     <div className="section" style={{background:'#fff'}}><div className="overview-grid">
      <div><h2 className="sec-title">{o.heading}</h2><div className="sec-rule"/>{o.body.map((p,i)=><p className="sec-body" key={i}>{p}</p>)}
       <div className="stat-row">{o.stats.map((s,i)=><div className="stat-box" key={i}><div className="stat-big">{s.value}</div><div className="stat-lbl">{s.label}</div></div>)}</div></div>
      <div><div className="overview-img"/><div className="hod-card"><div className="hod-photo">{o.hod.initials}</div><div className="hod-quote">{o.hod.quote}</div><div className="hod-name">{o.hod.name}</div><div className="hod-role">{o.hod.role}</div></div></div>
     </div></div>
    </Panel>
    <Panel id="values"><Section heading={c.values.heading} intro={c.values.intro}><div className="values-grid">{c.values.items.map((v,i)=><div className="val-card" key={i}><div className="val-num">{v.number}</div><div className="val-title">{v.title}</div><div className="val-desc">{v.body}</div></div>)}</div></Section></Panel>
    <Panel id="vision">
     <Section heading={c.vision.heading}><div className="vm-wrap"><div className="vm-big">{c.vision.statement}</div>{c.vision.body.map((p,i)=><p className="vm-sub" key={i} style={i>0?{marginTop:14}:undefined}>{p}</p>)}</div></Section>
     <div className="vision-dark"><div style={{maxWidth:600}}>{c.vision.closing.map((p,i)=><div key={i} style={i===0?{marginBottom:16}:undefined}>{p}</div>)}</div></div>
    </Panel>
    <Panel id="mission">
     <Section heading={c.mission.heading}><div className="vm-wrap"><div className="vm-big">{c.mission.statement}</div><p className="vm-sub">{c.mission.body}</p></div></Section>
     <div className="section-alt"><h2 className="sec-title">{c.mission.actionHeading}</h2><div className="sec-rule"/><div className="mission-grid">{c.mission.items.map((x,i)=><div className="mission-card" key={i}><div className="mission-card-title">{x.title}</div><div className="mission-card-desc">{x.body}</div></div>)}</div></div>
    </Panel>
    <Panel id="departments"><Section heading={c.departments.heading} intro={c.departments.intro}><div className="dept-grid">{c.departments.items.map((d,i)=><div className="dept-card" key={i}><div className="dept-code">{d.code}</div><div className="dept-name">{d.name}</div><div className="dept-desc">{d.body}</div><a href={d.href} className="dept-link">{d.linkLabel} <span className="dept-arr"/></a></div>)}</div></Section></Panel>
    <Panel id="rules"><Section heading={c.rules.heading} intro={c.rules.intro}><div className="rules-wrap">{c.rules.items.map((r,i)=><div className="rule-item" key={i}><div className="rule-num">{r.number}</div><div className="rule-text">{r.text}</div></div>)}</div><a className="pdf-download" href={c.rules.downloadHref} target="_blank" rel="noopener">{c.rules.downloadLabel}</a></Section></Panel>
    <Panel id="dresscode"><Section heading={c.dresscode.heading} intro={c.dresscode.intro}>
     <div className="dress-grid">{c.dresscode.items.map((d,i)=><div className="dress-card" key={i}><div className="dress-img"><div className="dress-swatch">{d.swatches.map((s,j)=><div className="swatch" key={j} style={{background:s.bg,...(s.border?{borderRight:s.border}:{})}}><span className="swatch-label" style={{color:s.fg}}>{s.label}</span></div>)}</div></div><div className="dress-body"><div className="dress-combo">{d.combo}</div><div className="dress-note">{d.note}</div><span className="dress-badge">{d.badge}</span></div></div>)}</div>
     <div className="dress-note-box"><div className="dress-note-title">{c.dresscode.noteTitle}</div><div className="dress-note-text">{c.dresscode.noteText}</div></div>
    </Section></Panel>
    <Panel id="whyus">
     <Section heading={c.whyus.heading} intro={c.whyus.intro}><div className="why-grid">{c.whyus.items.map((w,i)=><div className="why-card" key={i}><div className="why-icon"><span>{w.badge}</span></div><div className="why-title">{w.title}</div><div className="why-desc">{w.body}</div></div>)}</div></Section>
     <div className="why-dark"><div className="why-dark-inner"><div><div className="why-cta-title">{c.whyus.ctaTitle}</div><div className="why-cta-sub">{c.whyus.ctaText}</div></div><div style={{display:'flex',alignItems:'center',flexWrap:'wrap',gap:10}}><button className="btn-white" type="button">{c.whyus.primaryButton}</button><button className="btn-ghost-w" type="button">{c.whyus.secondaryButton}</button></div></div></div>
    </Panel>
    <Panel id="freshers"><section className="section t-workspace"><h2 className="t-section-title"><Lines text={c.freshers.heading}/></h2><p className="t-intro">{c.freshers.intro}</p>
     <div className="t-grid-two"><div className="t-checklist">{c.freshers.checklist.map((x,i)=><label key={i}><input type="checkbox" data-checklist={i}/><span>{x}</span></label>)}</div>
      <article className="t-note"><span className="t-tag">{c.freshers.noteTag}</span><h3>{c.freshers.noteHeading}</h3><p><Lines text={c.freshers.noteBody}/></p><a className="t-text-link" href={c.freshers.linkHref}>{c.freshers.linkLabel}</a></article></div></section></Panel>
    <Panel id="constitution"><section className="section t-workspace"><h2 className="t-section-title">{c.constitution.heading}</h2><p className="t-intro">{c.constitution.intro}</p>
     <div className="t-paper"><span className="t-tag">{c.constitution.tag}</span><h3>{c.constitution.paperHeading}</h3><p>{c.constitution.paperBody}</p><button type="button" className="t-button" data-unavailable={c.constitution.unavailableTitle} data-unavailable-message={c.constitution.unavailableMessage}>{c.constitution.buttonLabel}</button></div></section></Panel>
   </div>
  </div>
 </div>{children}</main>;
}
