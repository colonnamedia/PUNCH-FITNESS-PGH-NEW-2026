(function(){
var key='punch_nutrition_tracker_v1';
var fields=[
{name:'meals',label:'Meals & Snacks',type:'textarea',placeholder:'What did you eat? Include timing and anything you noticed.'},
{name:'water',label:'Water / Hydration',type:'input',placeholder:'Example: 5 glasses, water with class'},
{name:'energy',label:'Energy & Hunger',type:'textarea',placeholder:'When did you feel energized, hungry, satisfied, or tired?'},
{name:'training',label:'Training / Movement',type:'input',placeholder:'Class, strength, walk, recovery day...'},
{name:'sleep',label:'Sleep',type:'input',placeholder:'Hours and how rested you felt'},
{name:'notes',label:'Notes / Patterns',type:'textarea',placeholder:'Busy schedule, stress, meal prep, wins, challenges...',wide:true}
];
function safeParse(raw){try{return JSON.parse(raw)||{};}catch(e){return {};}}
function read(){try{return safeParse(localStorage.getItem(key));}catch(e){return {};}}
function write(data){try{localStorage.setItem(key,JSON.stringify(data));}catch(e){}}
var saved=read();
document.querySelectorAll('[data-day-panel]').forEach(function(panel){
var day=panel.getAttribute('data-day-panel');
var head=document.createElement('div'); head.className='nc-tracker-title';
head.innerHTML='<h3>Day '+day+'</h3><span>Observe first. Adjust with purpose.</span>';
var grid=document.createElement('div'); grid.className='nc-fields';
fields.forEach(function(field){
var wrap=document.createElement('div'); wrap.className='nc-field'+(field.wide?' nc-field-wide':'');
var id='tracker-'+day+'-'+field.name;
var label=document.createElement('label'); label.htmlFor=id; label.textContent=field.label;
var input=document.createElement(field.type==='textarea'?'textarea':'input');
input.id=id; input.name=id; input.placeholder=field.placeholder; input.value=(saved[day]&&saved[day][field.name])||'';
input.addEventListener('input',function(){saved[day]=saved[day]||{};saved[day][field.name]=input.value;write(saved);});
wrap.appendChild(label);wrap.appendChild(input);grid.appendChild(wrap);
});
panel.appendChild(head);panel.appendChild(grid);
});
function selectDay(day){
document.querySelectorAll('[data-day-tab]').forEach(function(tab){var active=tab.getAttribute('data-day-tab')===day;tab.classList.toggle('is-active',active);tab.setAttribute('aria-selected',active?'true':'false');});
document.querySelectorAll('[data-day-panel]').forEach(function(panel){panel.classList.toggle('is-active',panel.getAttribute('data-day-panel')===day);});
}
document.querySelectorAll('[data-day-tab]').forEach(function(tab){tab.addEventListener('click',function(){selectDay(tab.getAttribute('data-day-tab'));});});
var printButton=document.getElementById('printTracker');if(printButton)printButton.addEventListener('click',function(){window.print();});
var clearButton=document.getElementById('clearTracker');
if(clearButton)clearButton.addEventListener('click',function(){if(!window.confirm('Clear all six days from this browser?'))return;saved={};write(saved);document.querySelectorAll('.nc-field textarea,.nc-field input').forEach(function(input){input.value='';});});
})();