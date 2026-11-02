import {Chrome} from './Chrome';
/** Frame for component pages: loads the page's design stylesheet (shared base + page rules) then the shared chrome. */
export function PageFrame({route,children,bodyClass='reference-page',hero=false,skip}:{route:string;children:React.ReactNode;bodyClass?:string;hero?:boolean;skip?:{href:string;label:string}}){
 const sheet='/design-'+(route.slice(1).replaceAll('/','-')||'home')+'.css';
 return <><link rel="stylesheet" href={sheet} precedence="design"/><Chrome appCss={false} bodyClass={bodyClass} hero={hero} skip={skip}>{children}</Chrome></>;
}
