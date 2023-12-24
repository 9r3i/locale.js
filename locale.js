/* locale.js
 , ~ supported language - locale
 , authored by 9r3i
 , https://github.com/9r3i/locale.js
 , started at november 10th 2018
 , @require: locale.json as database
 */
window.locale=window.locale||{
version:'1.2.0',
current:'en',
source:'locale.json',
database:{},
/* translate page - alias for execAll */
translate:function(){
  return this.execAll();
},
/* execute all text nodes --- [tested] */
execAll:function(el,count){
  count=count?parseInt(count):0;
  el=el?el:document.body;
  let ch=el.childNodes,
  i=ch.length;
  if(count==0){
    let ttl=document.getElementsByTagName('title');
    if(ttl[0]&&ttl[0].childNodes[0]){
      let data=ttl[0].childNodes[0].data,
      nd=this.read(data.trim());
      if(data.trim()!=nd){
        ttl[0].childNodes[0].data=data.replace(data.trim(),nd);
      }
      let db=this.database[this.current];
      for(let o in db){
        let data=ttl[0].childNodes[0].data;
        ttl[0].childNodes[0].data=data.replace(/\b[a-z0-9\?]+\s[a-z0-9\?]+\b/ig,function(m){
          return db[m]?db[m]:m;
        }).replace(/\b[a-z0-9\?]+\b/ig,function(m){
          return db[m]?db[m]:m;
        });
      }
    }
  }
  while(i--){
    if(ch[i].nodeName=='#text'){
      let data=ch[i].data,
      nd=this.read(data.trim());
      if(data.trim()!=nd){
        ch[i].data=data.replace(data.trim(),nd);
        continue;
      }
      let db=this.database[this.current];
      for(let o in db){
        let data=ch[i].data;
        ch[i].data=data.replace(/\b[a-z0-9\?]+\s[a-z0-9\?]+\b/ig,function(m){
          return db[m]?db[m]:m;
        }).replace(/\b[a-z0-9\?]+\b/ig,function(m){
          return db[m]?db[m]:m;
        });
      }continue;
    }
    if(ch[i].placeholder){
      let data=ch[i].placeholder,
      nd=this.read(data.trim());
      if(data.trim()!==nd){
        ch[i].placeholder=data.replace(data.trim(),nd);
      }
    }
    if(ch[i].tagName.toLowerCase()=='input'&&ch[i].type=='submit'){
      let data=ch[i].value,
      nd=this.read(data.trim());
      if(data.trim()!==nd){
        ch[i].value=data.replace(data.trim(),nd);
      }
    }
    if(ch[i].title){
      let data=ch[i].title,
      nd=this.read(data.trim());
      if(data.trim()!==nd){
        ch[i].title=data.replace(data.trim(),nd);
      }
    }
    if(ch[i].dataset.hasOwnProperty('content')){
      let data=ch[i].dataset.content,
      nd=this.read(data.trim());
      if(data.trim()!==nd){
        ch[i].dataset.content=data.replace(data.trim(),nd);
      }
    }
    if(ch[i].childNodes){
      count++;
      this.execAll(ch[i],count);
    }
  }return this;
},
/* initialize
 * @parameters:
 *   l = string of language, default: en
 *   s = string of database source json file, default: locale.json
 * @return: bool true as load database, and define new function __locale
 */
init:async function(l,s){
  /* set current language */
  l=typeof l==='string'?l:'en';
  this.current=l;
  /* set database source */
  s=typeof s==='string'?s:'locale.json';
  this.source=s;
  /* create function helper */
   window.__locale=function(r){
    return window.locale.read(r);
  };
  /* load the database */
  let db=await fetch(this.source).then(r=>r.json());
  this.database=typeof db==='object'&&db!==null?db:{};
  return this.translate();
},
/* read database match
 * @parameters:
 *   s = string of word
 * @return: translated locale
 */
read:function(s){
  if(this.database.hasOwnProperty(this.current)){
    let db=this.database[this.current];
    return db.hasOwnProperty(s)?db[s]:s;
  }return s;
},
/* load locale database from source */
load:function(){
  let source=this.source,
  u=source;
  return this.get(u,function(r){
    if(typeof r==='object'&&r!==null){
      window.locale.database=r;
      return true;
    }console.warn('Warning: Failed to load "'+source+'".');
  },function(e){
    console.warn('Warning: Failed to load "'+source+'".');
  },false);
},
/* get data from url */
get:function(url,cb,er,txt){
  cb=typeof cb==='function'?cb:function(){};
  er=typeof er==='function'?er:function(){};
  txt=txt===false?false:true;
  let xhr=new XMLHttpRequest();
  xhr.open('GET',url,true);
  xhr.send();
  xhr.onreadystatechange=function(e){
    if(xhr.readyState==4){
      if(xhr.status==200){
        let res=false,
        text=xhr.responseText?xhr.responseText:' ';
        if(txt){return cb(text);}
        try{res=JSON.parse(text);}catch(e){}
        return cb(res?res:text);
      }else if(xhr.status==0){
        return er('Error: No internet connection.');
      }return er('Error: '+xhr.status+' - '+xhr.statusText+'.');
    }else if(xhr.readyState<4){
      return false;
    }return er('Error: '+xhr.status+' - '+xhr.statusText+'.');
  };return xhr;
},
/* get locale.js path */
path:function(){
  let s=document.getElementsByTagName('script'),
  x=/locale\-\d+\.\d+\.\d+(\.min)?\.js/g,
  i=s.length,p='';
  while(i--){
    if(s[i].src.match(x)){
      let r=s[i].src.split('?')[0];
      if(r.match(x)){
        p=r.replace(x,'');
        break;
      }
    }
  }return p;
},
/* temp function - always false */
temp:function(){
  return false;
}};


