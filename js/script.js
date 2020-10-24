//已知bug : pin的xy 不太正確
//無法阻止同時錄製的動作QAQ 崩潰
//圖片大小不太OK
//時間未錄製
//存檔案
//指導說明頁

let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
let recognition = SpeechRecognition? new SpeechRecognition() : false
recognition.lang = 'en-US';
recognition.continuous=true;
recognition.interimResults=true;

$( document ).ready(function(){
    //get highet for annotation xy setting
    let h= $('body').height()-$('#menu').height();
    $('#soundheight').height(h);   
  
    var annoComponent = {
        inherit: true,
        props:['page','data','drawingtype','tempisempty'],
        template:'#annoComponent',
        data:function(){return {
            templist:[{type:'pin',geometry:{x: 0, y:0},style:{fontsize:`1px`,fill:`transparent`}}],
            isdraw:false,stroke: '#ff0000',fill: '#821717',strokeWidth: 5,rotate:0
        }},
        methods:{
            start(event){
                // this.templist=[];
                vm=this;
                vm.isdraw=false;
                switch(this.drawingtype)
                {   
                    case 'circle': vm.startCircle(event); break;
                    case 'rect': vm.startRect(event); break;
                    case 'pin': vm.pin(event); break;
                    case 'pencil': vm.startpencil(event); break;
                }
            },
            move(event){
                vm=this;
                switch(this.drawingtype)
                {   
                    case 'circle': vm.drawCircle(event); break;
                    case 'rect': vm.drawRect(event); break;
                    case 'pencil':vm.drawpencil(event);break;
                }
            },
            pin(event){
                vm=this;
                vm.templist.push({
                            id:Date.now(),
                            type:'pin',geometry:{x: event.clientX, y: event.clientY-40},
                            style:{fill:`${vm.fill}`},selected:false});
                 result={open:true,isNew:true,data:vm.templist[vm.templist.length-1]};
                 this.$emit('openmodal',result);
            },
            startRect(event){
                vm=this;           
                vm.templist.push({
                    id:Date.now(),
                    type: 'rect',selected:false,
                    geometry:{x: event.clientX, y: event.clientY-40},width: 0, height: 0,radius: 0,rotate: 0,
                    style:`fill:${vm.fill};stroke:${vm.stroke};strokewidth:${vm.strokeWidth};opacity:0.7`,
                });
                vm.isdraw=true;
            },
            startCircle(event){
                vm=this;           
                vm.templist.push({
                    id:Date.now(),
                    type:'circle',
                    geometry:{x: event.clientX, y: event.clientY-40},radius: 0,selected:false,
                    style:`fill:${vm.fill};stroke:${vm.stroke};strokewidth:${vm.strokeWidth};opacity:0.7`,
                });
                vm.isdraw=true;
            },
            startpencil(event){
                vm=this;
                vm.templist.push(
                   {    id:Date.now(), 
                        type: 'pencil',
                        points: `${event.clientX},${event.clientY-40} `,
                        style: `stroke-width:${vm.strokeWidth};stroke:${vm.stroke};fill:none`,
                        selected:false,
                    });
                vm.isdraw=true;
            },
            drawRect(event){
                vm=this;
                //if leftclick and status is drawing
                if (event.buttons == 1 && vm.isdraw){
                    let lastRect=vm.templist[vm.templist.length-1]
                    lastRect.height = Math.abs(event.clientY -40- lastRect.geometry.y);
                    lastRect.width  = Math.abs(event.clientX - lastRect.geometry.x);
                }
                else if (event.button == 0 && vm.isdraw){
                    vm.isdraw=false;
                    result={open:true,isNew:true,data:vm.templist[vm.templist.length-1]};
                    this.$emit('openmodal',result);
                }
            },
            drawCircle(event){
                vm=this;
                //if leftclick and status is drawing
                if (event.buttons == 1 && vm.isdraw){
                    let lastCircle = vm.templist[vm.templist.length-1];        
                    let a = Math.abs(event.clientY -40- lastCircle.geometry.y);
                    let b = Math.abs(event.clientX - lastCircle.geometry.x);
                    lastCircle.radius = Math.sqrt((a * a) + (b * b));
                }
                else if (event.button == 0 && vm.isdraw){
                    vm.isdraw=false;
                    result={open:true,isNew:true,data:vm.templist[vm.templist.length-1]};
                    this.$emit('openmodal',result);
                }
            },
            drawpencil(event){
                vm=this;
                if(event.buttons == 1 && vm.isdraw){
                    let lastLine = vm.templist[vm.templist.length-1];
                    lastLine.points += `${event.clientX},${event.clientY-40} `;
                }
                else if (event.buttons == 0 && vm.isdraw){
                    vm.isdraw=false;
                    result={open:true,isNew:true,data:vm.templist[vm.templist.length-1]};
                    this.$emit('openmodal',result);
                }
            },
        },
        watch:{
            tempisempty:function(){
                if (this.tempisempty==''){this.templist=[{type:'pin',geometry:{x: 0, y:0},style:{fontsize:`1px`,fill:`transparent`}}]};
            }
        }
    };
    //component for type element
    var typeelement = Vue.extend({
        props:['element'],
        template:'#typeElement',
        data:function(){
            return {inputs:'',inpute:'',place_time:0,alter_time:0,Cate_time:0,Cate_acc:0,Desc_time:0,Stime:0,Etime:0,pages:10,currentpage:0}
        },
        methods:{
            time_in(event){
                this.inputs=new Date();
            },
            time_out(event){            
                this.inpute=new Date();
                timeresult=this.time_esteimator(this.inputs,this.inpute,event);
                this.$emit('timelistener',timeresult);
            },
            time_esteimator(t1,t2,event){
                vm=this;
                time=0;            
                second = t2.getSeconds()-t1.getSeconds();
                min= t2.getMinutes()-t1.getMinutes();
                hour = t2.getHours()-t1.getHours();
                day = t2.getDay()-t1.getDay();
                time = (day*24*60*60)+(hour*60*60)+(min*60)+second;
                switch(event){
                    case 'place':{ vm.place_time+=time; return [vm.place_time,event]}
                    case 'Altername':{ vm.alter_time+=time; return [vm.alter_time,event];}
                    case 'Category':{ vm.Cate_time+=time;return [vm.Cate_time,event]}
                    case 'Description':{vm.Desc_time+=time;return [vm.Desc_time,event]}
                    case 'StartTime':{vm.Stime+=time;return [ vm.Stime,event]}
                    case 'EndTime':{vm.Etime+=time;return [ vm.Etime,event]}
                }
            },
            link(element){return `${element.materialLink}`}
        }
    });
    var soundElement ={
        props:['element','itemid'],
        template:'#soundElement',
        extends:typeelement,
        data() {
            return {
                totext:'',speechresult:[],isRecord:false,
                place:true,Altername:true,Category:true,Description:true,EndTime:true,StartTime:true
            }
        },
        methods: {
            prevent(){
                list=[this.place,this.Altername,this.Category,this.Description,this.StartTime,this.EndTime]
                newlist = list.filter(ele=> {ele==false});
                if (newlist.length>=2){return true}
                else{return false}
            },
            record(ele,id){
                const vm=this;
                // if (vm.prevent()){
                //     alert('Recording different elements at the same time is not allowed');
                //     vm.endrecord();
                //     return};
                recognition.start();
                recognition.addEventListener('result', event => {
                    const text = Array.from(event.results).map(result => result[0]).map(result => result.transcript).join('')
                    this.totext = `${text}.`;
                    this.speechresult.push(this.totext);
                  });
              
        },
            endrecord(ele,id){
                vm=this;
                // if (vm.prevent()){
                //     alert('Recording different elements at the same time is not allowed');
                //     vm.endrecord();
                //     return};
                recognition.stop();
                if (this.speechresult[this.speechresult.length-1]==undefined){
                    alert("Did not detect your voice, please record again");
                    return
                }
                result = [id,ele, this.speechresult[this.speechresult.length-1]]
                this.$emit('catchdata',result);
                this.speechresult=[];
                this.totext='';
            }
        },
    };
    var rowDisplay={
        props:['arc'],
        template:'#rowDisplay'
    };
    var rowData={
        props:['dataitem','datakey'],
        template:'#rowData',
        methods: {
            rm(item){
                this.$emit('delete',item);
            },
            modify(item,key){
                result={open:true,isNew:false,index:key,content:item.content,pattern:item.pattern};
                this.$emit('openmodal',result);
            },
            select(isselect,item){
                result={selected:isselect,data:item};
                this.$emit('isselect',result);
            },
        },
    };
    var app = new Vue({
        el:'#app',
        data:{
            type:'',
            //data for all
            casedata:[],annotationdata:[],isSubmit:false,
            //data for annotation;
            templist:'',drawlist:[[],[],[],[],[]],isAdd:true,itemid:-1,showmodal:false,content:'',pattern:'',
            //pagedata for element creation
            currentpage:0,pages:10,inputs:'',inpute:'',place_time:0,alter_time:0,Cate_time:0,Cate_acc:0,Desc_time:0,Stime:0,Etime:0,
            sourcedata:[],
            //variable for sound recognition
            totext:'',speechcontent:'',speechresult:'',isRecord:false,recognition:new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition ||window.msSpeechRecognition)(),
            },
        methods:{
            timeresult(result){
                vm=this;
                time=result[0]; field =result[1];
                switch(field){
                    case 'place':{vm.place_time=time;break;}
                    case 'Altername':{vm.alter_time=time;break;}
                    case 'Category':{vm.Cate_time=time;break;}
                    case 'Description':{vm.Desc_time=time;break;}
                    case 'StartTime':{vm.Stime=time;break;}
                    case 'EndTime':{vm.Etime=time;break;}
                }
            },
            storeelement(page){
                vm=this;
                //clear the time variables for the next calculation
                vm.sourcedata[page].place_time+=vm.place_time;
                vm.sourcedata[page].alter_time+=vm.alter_time;
                vm.sourcedata[page].Cate_time+=vm.Cate_time;
                vm.sourcedata[page].Desc_time+=vm.Desc_time;
                vm.sourcedata[page].Stime+=vm.Stime;
                vm.sourcedata[page].Etime+=vm.Etime;
                //clear the time variables for the next calculation
                vm.place_time=0;vm.alter_time=0;vm.Cate_time=0;vm.Desc_time=0;vm.Stime=0;vm.Etime=0;
                },
            checkelement(place,Altername,Category,StartTime,EndTime,Description){
                list = [place,Altername,Category,StartTime,EndTime,Description];  
                return list.every(ele=>ele.length>0);
            }, 
            pageChange(dir){
                //pageChange contains three seperate works: check data, store data, and change
                vm=this;
                element=vm.sourcedata[vm.currentpage];
                if (dir=='next'){
                    check = vm.checkelement(element.place,element.Altername,element.Category,element.StartTime,element.EndTime,element.Description);
                    if (check==false){
                        alert('Please fill the empty field');
                        return
                    };
                    vm.storeelement(vm.currentpage);
                    ++vm.currentpage;}
                else {vm.storeelement(vm.currentpage);
                     --vm.currentpage;
                      }
            },
            ano_pageChange(dir){
                if (dir=='next'){++this.currentpage;}
                else{--this.currentpage;}
            },
            store_sounddata(result){
                id=result[0],element=result[1],data=result[2];
                this.sourcedata[id][element] = data;
            },
            //annotation data processing
            modal(result){
                vm=this; vm.isAdd=result.isNew;
                if (result.isNew){this.templist = result.data;}
                else{
                    vm.content=result.content;
                    vm.pattern=result.pattern;
                    vm.itemid=result.index;
                }
                this.showmodal=result.open;
            },
            save(){
                vm=this;
                if(vm.isAdd)
                {vm.templist.content=vm.content;vm.templist.pattern=vm.pattern;
                vm.drawlist[vm.currentpage].push(this.templist)}
                else{
                    vm.drawlist[vm.currentpage][vm.itemid].content=vm.content;
                    vm.drawlist[vm.currentpage][vm.itemid].pattern=vm.pattern;
                } 
                vm.close();
                vm.content=""; vm.pattern="";vm.templist='';vm.itemid=-1;
            },
            keycompare(item){
                var newindex; vm=this;
                vm.drawlist[vm.currentpage].forEach((ele,key)=>{
                    if(ele.id===item.id){newindex=key;}
                });
                console.log(newindex);
                return newindex;
            },
            selected(result){
                newindex =  this.keycompare(result.data);
                if (result.selected){
                    stroke='#2e2d2c',fill='#e8e815',strokeWidth=5
                switch(vm.drawlist[vm.currentpage][newindex].type){
                    case 'rect': case 'circle':{ vm.drawlist[vm.currentpage][newindex].style=`fill:${fill};stroke:${stroke};strokewidth:${strokeWidth};opacity:0.7`;break};
                    case 'pencil':{ vm.drawlist[vm.currentpage][newindex].style=`stroke-width:${strokeWidth};stroke:${stroke};fill:none`;break};
                    case 'pin':{ vm.drawlist[vm.currentpage][newindex].style=`fill:${fill}`;break};
                }
            }else{
                stroke='#ff0000',fill='#821717',strokeWidth=5;
                switch(vm.drawlist[vm.currentpage][newindex].type){
                    case 'rect': case 'circle':{ vm.drawlist[vm.currentpage][newindex].style=`fill:${fill};stroke:${stroke};strokewidth:${strokeWidth};opacity:0.7`;break};
                    case 'pencil':{ vm.drawlist[vm.currentpage][newindex].style=`stroke-width:${strokeWidth};stroke:${stroke};fill:none`;break};
                    case 'pin':{ vm.drawlist[vm.currentpage][newindex].style=`fill:${fill}`;break};}
            }},
            rm(item){
                vm=this;
                newindex =  this.keycompare(item);
                vm.drawlist[vm.currentpage].splice(newindex,1);
            },
            close(){vm=this; vm.showmodal=false; vm.content=""; vm.pattern="";vm.templist='';vm.itemid=-1;},
            cancel(){
                $('#alertModal').modal('show');
                this.isSubmit=false;
            },
            discard(){this.drawlist=[[],[],[],[],[]];$('#alertModal').modal('hide');},
            submit(){this.isSubmit=true; $('#alertModal').modal('show'); this.submit();},
            export(){$('#alertModal').modal('hide');}
        },
        created(){
            if (Math.floor(Math.random(10)*10)%2==0){
                this.casedata = [{link:'Type_annotation.html',text:'Map Annotation Creation'},{link:'Sound_Element.html',text:'Map Metadata Creation'}];}
            else{this.casedata = [{link:'Sound_annotation.html',text:'Map Annotation Creation'},{link:'Type_Element.html',text:'Map Metadata Creation'}];}
            xhr = new XMLHttpRequest();
            xhr.open('GET','data/source.json',false);
            xhr.send(null);
            this.sourcedata=JSON.parse(xhr.responseText).data;
            this.annotationdata=JSON.parse(xhr.responseText).annotationdata
        },
        components:{
            'anno-component':annoComponent,
            'type-element':typeelement,
            'row-display':rowDisplay,
            'row-data':rowData,
            'sound-element':soundElement,
        },
    });
}
);

///////////////////////
///JsonLD Schema///////
///////////////////////
const schema = (item,type) =>{
    var ele;
    if (type=='annotation'){
        ele = `{
            "@context": "http://schema.org",
            '@type': 'Map',
            'name': ${item.title},
            '@pattern':${item.pattern},
            '@caption':${item.content},
        }`;
    }
    else if (type=='metaElement'){
        ele = `{
            "@context": "http://schema.org",
            '@type': 'Map',
            'name': ${item.title},
            '@spatialCoverage':${item.placename},
            '@alternateName':${item.altername},
            '@genre':${category},
            '@description':${item.Description},
            '@TemporalReference':${item.starttime}/${item.endtime},
        }`;
    }
    let JLD = document.createElement('script');
    JLD.type='application/ld+json',
    JLD.innerHTML=ele;
    return JLD
}



// data send to the back_end
// data=[{
// annotion:{ 
//       participant_ID:'Al396421',
//       scenario:'A',
//       order:1,
//       record_date:,
//       type:'speech',
//       page_id:'',
//       materialLink:'',
//       anno_type:'rect',
//       anno_time:22,
//       pattern:'distribution',
//       pattern_time:10,
//       content:'',
//       content_acc: 0.35,
//       content_time:25},
//       metadataelement:{
//         participant_ID:'Al396421',
//         scenario:'A',
//         order:1,
    //   record_date:,
    //     materialLink:'',
    //     type:'speech',
    //     page_id:'',
    //     place:'',
    //     place_time:25,
    //     place_acc:0.35,
    //     Altername:'',
    //     alter_time:25,
    //     alter_acc:0.35,
    //     Category:'Geography',
    //     Cate_time:40,
    //     Cate_acc:0.80,
    //     Description:'he',
    //     Desc_time:30,
    //     Desc_acc:0.80,
    //     Start_time:89,
    //     s_spent_time:25,
    //     End_time:89,
    //     e_spent_time:25,
//         }}]

