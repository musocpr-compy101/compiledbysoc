'use client';
import {useEffect,useState} from 'react';import type {CampusEvent} from '@/lib/validation';import {Calendar} from './Calendar';
export function CalendarBridge(){
 const [events,setEvents]=useState<CampusEvent[]|null>(null);const [signal,setSignal]=useState(0);
 useEffect(()=>{const abort=new AbortController();fetch('/api/events',{signal:abort.signal}).then(r=>r.ok?r.json():null).then(r=>{if(r?.configured)setEvents(r.events);}).catch(()=>{});return()=>abort.abort();},[]);
 useEffect(()=>{if(events===null)return;const open=(event:MouseEvent)=>{if(event.target instanceof Element&&event.target.closest('[data-calendar-view="calendar"]')){event.preventDefault();event.stopImmediatePropagation();setSignal(s=>s+1);}};document.addEventListener('click',open,true);return()=>document.removeEventListener('click',open,true);},[events]);
 return events===null?null:<Calendar events={events} hiddenTrigger openSignal={signal}/>;
}
