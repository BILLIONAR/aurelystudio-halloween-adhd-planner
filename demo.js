/* AurelyStudio: independent, editable demonstration data. */
function makeDemoState(){
 const next=defaults(),date=localDate();
 const task=(module,title,detail='')=>({id:uid(),module,title,date,detail,notes:'Example plan — edit it to try the planner.',done:false});
 next.records=[task('Task Planner','Choose one costume detail','Check the wardrobe before buying.'),task('Task Planner','Pick a movie for Friday','Choose a film and a start time.'),{...task('Task Planner','Make a short shopping list','Check the cupboard first.'),done:true},task('Decorations','Decorate one cozy corner','One pumpkin and warm battery lights.'),task('Costume Planner','A friendly little ghost','Use a soft white layer and comfortable shoes.'),task('Party Planner','A little pumpkin supper','Four friends and a simple shared meal.')];
 for(const [category,planned,actual] of [['Costumes',45,28],['Decorations',35,22],['Party',60,42],['Candy & Treats',30,18]])next.records.push({...task('Budget',category+' budget','Illustrative example'),category,planned,actual});
 next.days[date]={energy:'Normal',mood:'Ready for one small step',priorities:next.records.slice(0,3).map(r=>r.id)};
 return next;
}
let demoHasSavedState=false;try{demoHasSavedState=localStorage.getItem(KEY)!==null;}catch{}
if(!demoHasSavedState){state=makeDemoState();save();}
const renderOriginalPlanner=render;
render=function(){renderOriginalPlanner();document.querySelector('#main').insertAdjacentHTML('afterbegin',`<section class="demo-banner" aria-label="Live demo"><div><strong>FREE LIVE DEMO</strong><p>Try the example plans and live budget charts. Changes stay in this browser.</p></div><div class="demo-actions"><button data-action="demo-reset">Reset demo</button><a href="https://billionar.github.io/aurelystudio-halloween-adhd-planner/" target="_blank" rel="noopener">Open full planner ↗</a></div></section>`);};
document.addEventListener('click',e=>{if(!e.target.closest('[data-action="demo-reset"]'))return;if(!confirm('Reset this demo to its example plans? Your demo changes will be replaced.'))return;state=makeDemoState();budgetFilters={period:'all',month:'',category:'all',status:'all',sort:'date-desc'};budgetChartSelection=null;selectedDate=localDate();save();render();toast('Demo reset. Try a new plan.');});
render();
