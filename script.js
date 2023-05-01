let debug=false;

function objectFromTemplate(tmp){
  obj = {
    body: tmp.body,
    root: tmp.root,
    anchors: tmp.anchors,
    children: new Array(tmp.anchors.length)
  };
  return obj;
}


function transformAttribute(offsets){
  str = ''
  str += 'translate(' + offsets.x + ',' + offsets.y + ')';
  if('rotate' in offsets && offsets.rotate != 0){
    str += 'rotate(' + offsets.rotate + ')';
  }
  if('scale' in offsets && offsets.scale != 1){
    str += 'scale(' + offsets.scale + ')';
  }
  return str;
}

function createObject(template,offset){
  let g = document.createElementNS('http://www.w3.org/2000/svg','g');
  g.innerHTML = template.body;
  if(debug){
    g.innerHTML += `<circle cx="${template.root.x}" cy="${template.root.y}" r="5" fill="red" />`;
    for(let i=0; i<template.anchors.length; i++){
      g.innerHTML += `<circle cx="${template.anchors[i].x}" cy="${template.anchors[i].y}" r="5" fill="blue" />`;
    }
  }
  g.setAttribute('transform', transformAttribute(offset) + transformAttribute({x: -template.root.x, y: -template.root.y}) );
  for(let i=0; i<template.anchors.length; i++){
    if(template.children[i] !== undefined){
      console.log(template.children[i]);
      g.appendChild(createObject(template.children[i], template.anchors[i]));
    }
  }
  return g;
}

function redraw(objects){
  svg = document.getElementById("svg");
  while(svg.firstChild){
    svg.removeChild(svg.firstChild);
  }
  objects.forEach((obj)=>{
    svg.appendChild(createObject(obj, {x:0,y:0,rotate: 0}));
  });
}

function selectFromDistribution(distribution){
  let index = Math.random();
  for (let [key,value] of Object.entries(distribution)){
    index -= value;
    if(index<=0){
      return key;
    }
  }
}

function randomPlant(prob,distribution,depth){
  let obj = objectFromTemplate(templates[selectFromDistribution(distribution)]);
  if(depth > 0 && Math.random() < prob){
    obj.children[0] = randomPlant(prob,distribution,depth-1);
  }
  if(depth > 0 && Math.random() < prob){
    obj.children[1] = randomPlant(prob,distribution,depth-1);
  }
  console.log(obj);
  return obj;
}

function init(){
  let pot = objectFromTemplate(templates["pot"]);
  pot.children[0] = randomPlant(0.5,{cactus: 1.0, cactus2: 0.0},3);
  console.log(pot);
  redraw([pot]);
}

init();
