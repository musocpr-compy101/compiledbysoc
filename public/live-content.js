/* Bridge published records into the retained public design during migration. */
(async()=>{
 const feed=document.querySelector('.t-feed-list');const news=document.querySelector('#tab-news');
 if(!feed&&!news)return;
 try{
  const response=await fetch('/api/posts');if(!response.ok)return;
  const posts=await response.json();if(!posts.length)return;
  function card(p){
   const a=document.createElement('a');a.className='soc-post app-post';a.href='/important-stuff/'+p.id;
   const cover=document.createElement('div');cover.className='app-post-cover';
   if(p.image_id){const img=document.createElement('img');img.src='/api/media/'+p.image_id;img.alt='';img.loading='lazy';cover.append(img);}else{const mark=document.createElement('span');mark.textContent='C_';cover.append(mark);}
   const tags=document.createElement('div');tags.className='app-post-tags';const kind=document.createElement('strong');kind.textContent=p.kind;const date=document.createElement('time');date.textContent=new Date(p.published_at).toLocaleDateString('en-GB',{day:'numeric',month:'short',timeZone:'Africa/Lagos'});tags.append(kind,date);cover.append(tags);
   const body=document.createElement('div');body.className='app-post-body';const title=document.createElement('h3');title.textContent=p.title;const text=document.createElement('p');text.textContent=p.excerpt;const footer=document.createElement('footer');const author=document.createElement('span');author.textContent=p.byline;const more=document.createElement('strong');more.textContent='Read more →';footer.append(author,more);body.append(title,text,footer);a.append(cover,body);return a;
  }
  if(feed){feed.replaceChildren(...posts.slice(0,6).map(card));const status=document.querySelector('[data-feed-status]');if(status)status.textContent='Latest published posts for all SOC students.';document.querySelector('.t-feed-preferences')?.setAttribute('hidden','');const tag=document.querySelector('#your-feed .t-tag');if(tag)tag.textContent='Latest from SOC';}
  if(news){const current=posts.filter(p=>p.kind==='news'||p.kind==='journal');if(current.length){const section=document.createElement('section');section.className='app-main';section.style.padding='0 0 32px';const h=document.createElement('h2');h.textContent='Latest from SOC';const grid=document.createElement('div');grid.className='app-post-grid';grid.append(...current.map(card));section.append(h,grid);news.prepend(section);}}
 }catch{/* Existing reference content stays available on network failure. */}
})();
