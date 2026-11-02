'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <main className="app-main"><h1>Couldn’t load this page.</h1><p>Please try again. Your submitted records have not been changed by this error.</p><button className="app-button" onClick={reset}>Try again</button><a href="/">Go home</a></main>;}
