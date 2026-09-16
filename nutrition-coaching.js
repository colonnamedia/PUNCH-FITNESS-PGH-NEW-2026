(function(){
  var key='punch_nutrition_tracker_v2';
  var oldKey='punch_nutrition_tracker_v1';
  var mealDefaults=['Meal','Snack','Meal','Snack','Meal','Snack'];
  var activities=[
    {value:'1',title:'1 — Light',desc:'Easy day or a walk'},
    {value:'2',title:'2 — Some Activity',desc:'Light movement or errands'},
    {value:'3',title:'3 — Moderate',desc:'A normal workout or active day'},
    {value:'4',title:'4 — Hard',desc:'A hard class or training session'},
    {value:'5',title:'5 — Very Hard',desc:'One of your hardest classes or sessions'}
  ];

  function safeParse(raw){try{return JSON.parse(raw)||{};}catch(e){return {};}}
  function readStorage(storageKey){try{return safeParse(localStorage.getItem(storageKey));}catch(e){return {};}}
  function write(data){
    try{
      localStorage.setItem(key,JSON.stringify(data));
      showStatus('Saved on this device');
    }catch(e){showStatus('Unable to save in this browser');}
  }
  function showStatus(message){
    var status=document.getElementById('trackerSaveStatus');
    if(status) status.textContent=message;
  }

  var saved=readStorage(key);
  if(!Object.keys(saved).length){
    var old=readStorage(oldKey);
    Object.keys(old).forEach(function(day){
      saved[day]={water:old[day].water||'',notes:old[day].notes||''};
    });
  }

  function mealRow(day,index){
    var number=index+1;
    var base='day'+day+'-entry'+number;
    return '<div class="nc-meal-row">' +
      '<div class="nc-meal-number"><b>'+number+'</b><span>Eating Time</span></div>' +
      '<label><span>Time</span><input type="time" id="'+base+'Time" data-field="entry'+number+'Time"></label>' +
      '<label><span>Meal or Snack</span><select id="'+base+'Type" data-field="entry'+number+'Type"><option value="Meal">Meal</option><option value="Snack">Snack</option></select></label>' +
      '<label class="nc-meal-food"><span>What did you eat, and approximately how much?</span><input type="text" id="'+base+'Food" data-field="entry'+number+'Food" placeholder="Example: chicken, rice and vegetables — 1 plate"></label>' +
    '</div>';
  }

  function activityOptions(day){
    return activities.map(function(item){
      var id='day'+day+'-activity-'+item.value;
      return '<label class="nc-activity-option" for="'+id+'">' +
        '<input type="radio" id="'+id+'" name="day'+day+'Activity" value="'+item.value+'" data-field="activity">' +
        '<span><b>'+item.title+'</b><small>'+item.desc+'</small></span>' +
      '</label>';
    }).join('');
  }

  function dayMarkup(day){
    var copy=day>1?'<button class="nc-copy-day" type="button" data-copy-day="'+day+'">Copy Day '+(day-1)+' Into Day '+day+'</button>':'';
    return '<div class="nc-tracker-title"><div><span>Six-Day Meal Tracker</span><h3>Day '+day+'</h3></div>'+copy+'</div>' +
      '<div class="nc-day-basics">' +
        '<label><span>What time did you wake up?</span><input type="time" data-field="wakeTime"></label>' +
      '</div>' +
      '<div class="nc-meals-heading"><h4>Meals &amp; Snacks</h4><p>Start with three meals and three snacks. Change any entry to match your day.</p></div>' +
      '<div class="nc-meal-list">'+mealDefaults.map(function(_,index){return mealRow(day,index);}).join('')+'</div>' +
      '<fieldset class="nc-activity"><legend>Activity Level Today</legend><p>Choose the number that best describes your overall activity today.</p><div class="nc-activity-grid">'+activityOptions(day)+'</div></fieldset>' +
      '<label class="nc-hydration"><span>Water / Hydration Today</span><input type="text" data-field="water" placeholder="Example: 6 glasses or 64 oz"></label>' +
      '<label class="nc-notes"><span>Notes / Patterns</span><textarea data-field="notes" placeholder="Meal prep, schedule changes, wins, challenges, or anything you noticed..."></textarea></label>';
  }

  function dayData(day){
    saved[day]=saved[day]||{};
    mealDefaults.forEach(function(type,index){
      var name='entry'+(index+1)+'Type';
      if(!saved[day][name]) saved[day][name]=type;
    });
    return saved[day];
  }

  function populate(panel,day){
    var data=dayData(day);
    panel.querySelectorAll('[data-field]').forEach(function(field){
      var name=field.getAttribute('data-field');
      if(field.type==='radio') field.checked=String(data[name]||'')===field.value;
      else field.value=data[name]||'';
    });
  }

  function bind(panel,day){
    function saveField(event){
      var field=event.target.closest('[data-field]');
      if(!field) return;
      dayData(String(day))[field.getAttribute('data-field')]=field.value;
      write(saved);
    }
    panel.addEventListener('input',saveField);
    panel.addEventListener('change',saveField);
    var copy=panel.querySelector('[data-copy-day]');
    if(copy) copy.addEventListener('click',function(){
      var current=dayData(String(day));
      var hasEntries=Object.keys(current).some(function(name){return !/Type$/.test(name)&&String(current[name]||'').trim();});
      if(hasEntries&&!window.confirm('Replace Day '+day+' with everything from Day '+(day-1)+'?')) return;
      saved[String(day)]=JSON.parse(JSON.stringify(dayData(String(day-1))));
      populate(panel,String(day));
      write(saved);
      showStatus('Day '+(day-1)+' copied into Day '+day);
    });
  }

  document.querySelectorAll('[data-day-panel]').forEach(function(panel){
    var day=panel.getAttribute('data-day-panel');
    panel.innerHTML=dayMarkup(Number(day));
    populate(panel,day);
    bind(panel,Number(day));
  });
  write(saved);

  var activeDay='1';
  function selectDay(day){
    activeDay=day;
    document.querySelectorAll('[data-day-tab]').forEach(function(tab){
      var active=tab.getAttribute('data-day-tab')===day;
      tab.classList.toggle('is-active',active);
      tab.setAttribute('aria-selected',active?'true':'false');
    });
    document.querySelectorAll('[data-day-panel]').forEach(function(panel){
      var active=panel.getAttribute('data-day-panel')===day;
      panel.classList.toggle('is-active',active);
      panel.hidden=!active;
    });
  }

  document.querySelectorAll('[data-day-tab]').forEach(function(tab){
    tab.addEventListener('click',function(){selectDay(tab.getAttribute('data-day-tab'));});
  });

  window.addEventListener('beforeprint',function(){
    document.querySelectorAll('[data-day-panel]').forEach(function(panel){panel.hidden=false;});
  });
  window.addEventListener('afterprint',function(){selectDay(activeDay);});

  var printButton=document.getElementById('printTracker');
  if(printButton) printButton.addEventListener('click',function(){window.print();});

  var clearButton=document.getElementById('clearTracker');
  if(clearButton) clearButton.addEventListener('click',function(){
    if(!window.confirm('Clear all six days from this device?')) return;
    saved={};
    document.querySelectorAll('[data-day-panel]').forEach(function(panel){populate(panel,panel.getAttribute('data-day-panel'));});
    write(saved);
    showStatus('All six days cleared');
  });
})();
