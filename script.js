const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const search = $('#search'), category = $('#category'), cards = $$('.card'), chips = $$('.chip');
let activeFilter = 'all', currentCard = null, toastTimer;
function toast(message){const t=$('#toast');t.textContent=message;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2400)}
function applyFilters(){
 const query=search.value.trim().toLowerCase();
 const selected=category.value!=='all'?category.value:activeFilter;
 let count=0;
 cards.forEach(card=>{const text=(card.dataset.search+' '+card.innerText).toLowerCase();const show=(selected==='all'||card.dataset.category===selected)&&text.includes(query);card.hidden=!show;if(show)count++});
 $('#empty').hidden=count>0;
 chips.forEach(chip=>chip.classList.toggle('active',chip.dataset.filter===selected));
}
$('#searchButton').addEventListener('click',()=>{applyFilters();$('#explore').scrollIntoView({behavior:'smooth'})});
search.addEventListener('input',applyFilters);
category.addEventListener('change',()=>{activeFilter='all';applyFilters()});
chips.forEach(chip=>chip.addEventListener('click',()=>{activeFilter=chip.dataset.filter;category.value='all';applyFilters()}));
$$('.heart').forEach(btn=>btn.addEventListener('click',()=>{btn.classList.toggle('saved');btn.textContent=btn.classList.contains('saved')?'♥':'♡';const title=btn.closest('.card').querySelector('h3').textContent;toast(btn.classList.contains('saved')?`${title} saved to favourites`:`${title} removed from favourites`)}));
$$('[data-jump]').forEach(tile=>tile.addEventListener('click',()=>{activeFilter=tile.dataset.jump;category.value='all';applyFilters()}));
const dialog=$('#detailDialog');
$$('.details').forEach(btn=>btn.addEventListener('click',()=>{currentCard=btn.closest('.card');$('#dialogTitle').textContent=btn.dataset.title;$('#dialogPlace').textContent='📍 '+btn.dataset.place;$('#dialogInfo').textContent=btn.dataset.info;$('#saveFromDialog').textContent=currentCard.querySelector('.heart').classList.contains('saved')?'♥ Saved to favourites':'♡ Save this mela';dialog.showModal()}));
$('#closeDialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
$('#saveFromDialog').addEventListener('click',()=>{if(!currentCard)return;const heart=currentCard.querySelector('.heart');heart.classList.toggle('saved');heart.textContent=heart.classList.contains('saved')?'♥':'♡';$('#saveFromDialog').textContent=heart.classList.contains('saved')?'♥ Saved to favourites':'♡ Save this mela';toast(heart.classList.contains('saved')?'Mela saved to favourites':'Mela removed from favourites')});
$('#hamburger').addEventListener('click',()=>$('#nav').classList.toggle('open'));
$$('#nav a').forEach(a=>a.addEventListener('click',()=>$('#nav').classList.remove('open')));
$('#newsletter').addEventListener('submit',e=>{e.preventDefault();const email=$('#email').value.trim();if(email){$('#message').textContent=`Thanks! ${email} — demo signup successful (browser only).`;toast('Demo signup successful! Email server par send nahi hua.');e.target.reset()}});
