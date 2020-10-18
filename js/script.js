//已知bug : pin的xy 不太正確
$( document ).ready(function(){
    const setsoundheight=()=>{
        let h= $('body').height()-$('#menu').height();
        $('#soundheight').height(h);   
    };
    setsoundheight();
    //component for type element
    var typeelement = {
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
                    case 'place':{
                        vm.place_time+=time;
                        return [vm.place_time,event]
                        break;
                    }
                    case 'Altername':{
                        vm.alter_time+=time;
                        return [vm.alter_time,event]
                        break;
                    }
                    case 'Category':{
                        vm.Cate_time+=time;
                        return [vm.Cate_time,event]
                        break;
                    }
                    case 'Description':{
                        vm.Desc_time+=time;
                        return [vm.Desc_time,event]
                        break;
                    }
                    case 'StartTime':{
                        vm.Stime+=time;
                        return [ vm.Stime,event]
                        break;
                    }
                    case 'EndTime':{
                        vm.Etime+=time;
                        return [ vm.Etime,event]
                        break;
                    }
                }
            },
            link(element){return `${element.materialLink}`}
        },
        computed:{
            
        }
    };
    var app = new Vue({
        el:'#app',
        data:{
            type:'',
            //data for annotation
            drawlist:[],showmodal:false,content:'',pattern:'',isdraw:false,isItemSelected:false,isCancel:false,selecteditem:null,stroke: '#ff0000',fill: '#821717',strokeWidth: 5,rotate:0,
            //pagedata for element creation
            currentpage:0,pages:10,inputs:'',inpute:'',place_time:0,alter_time:0,Cate_time:0,Cate_acc:0,Desc_time:0,Stime:0,Etime:0,
            sourcedata:[
                {materialLink:'http://vis.ecowest.org/interactive/wildfires.php',
                type:'typing',
                page_id:1,
                place:'',
                place_time:0,
                place_acc:0.35,
                Altername:'',
                alter_time:0,
                alter_acc:0.35,
                Category:'',
                Cate_time:0,
                Cate_acc:0.80,
                Description:'',
                Desc_time:0,
                Desc_acc:0.80,
                Start_time:'',
                Stime:0,
                End_time:'',
                Etime:0},
                {materialLink:'https://landsat.visibleearth.nasa.gov/view.php?id=91771',
                type:'typing',
                page_id:2,
                place:'',
                place_time:0,
                place_acc:0.35,
                Altername:'',
                alter_time:0,
                alter_acc:0.35,
                Category:'',
                Cate_time:0,
                Cate_acc:0.80,
                Description:'',
                Desc_time:0,
                Desc_acc:0.80,
                Start_time:'',
                Stime:0,
                End_time:'',
                Etime:0},
                {materialLink:'https://landsat.visibleearth.nasa.gov/view.php?id=91771',
                type:'typing',
                page_id:3,
                place:'',
                place_time:0,
                place_acc:0.35,
                Altername:'',
                alter_time:0,
                alter_acc:0.35,
                Category:'',
                Cate_time:0,
                Cate_acc:0.80,
                Description:'',
                Desc_time:0,
                Desc_acc:0.80,
                Start_time:'',
                Stime:0,
                End_time:'',
                Etime:0},
                {materialLink:'https://landsat.visibleearth.nasa.gov/view.php?id=91771',
                type:'typing',
                page_id:4,
                place:'',
                place_time:0,
                place_acc:0.35,
                Altername:'',
                alter_time:0,
                alter_acc:0.35,
                Category:'',
                Cate_time:0,
                Cate_acc:0.80,
                Description:'',
                Desc_time:0,
                Desc_acc:0.80,
                Start_time:'',
                Stime:0,
                End_time:'',
                Etime:0},
                {materialLink:'https://landsat.visibleearth.nasa.gov/view.php?id=91771',
                type:'typing',
                page_id:5,
                place:'',
                place_time:0,
                place_acc:0.35,
                Altername:'',
                alter_time:0,
                alter_acc:0.35,
                Category:'',
                Cate_time:0,
                Cate_acc:0.80,
                Description:'',
                Desc_time:0,
                Desc_acc:0.80,
                Start_time:'',
                Stime:0,
                End_time:'',
                Etime:0},
                {materialLink:'https://landsat.visibleearth.nasa.gov/view.php?id=91771',
                type:'typing',
                page_id:6,
                place:'',
                place_time:0,
                place_acc:0.35,
                Altername:'',
                alter_time:0,
                alter_acc:0.35,
                Category:'',
                Cate_time:0,
                Cate_acc:0.80,
                Description:'',
                Desc_time:0,
                Desc_acc:0.80,
                Start_time:'',
                Stime:0,
                End_time:'',
                Etime:0},
                {materialLink:'https://landsat.visibleearth.nasa.gov/view.php?id=91771',
                type:'typing',
                page_id:7,
                place:'',
                place_time:0,
                place_acc:0.35,
                Altername:'',
                alter_time:0,
                alter_acc:0.35,
                Category:'',
                Cate_time:0,
                Cate_acc:0.80,
                Description:'',
                Desc_time:0,
                Desc_acc:0.80,
                Start_time:'',
                Stime:0,
                End_time:'',
                Etime:0},
                {materialLink:'https://landsat.visibleearth.nasa.gov/view.php?id=91771',
                type:'typing',
                page_id:8,
                place:'',
                place_time:0,
                place_acc:0.35,
                Altername:'',
                alter_time:0,
                alter_acc:0.35,
                Category:'',
                Cate_time:0,
                Cate_acc:0.80,
                Description:'',
                Desc_time:0,
                Desc_acc:0.80,
                Start_time:'',
                Stime:0,
                End_time:'',
                Etime:0},
                {materialLink:'https://landsat.visibleearth.nasa.gov/view.php?id=91771',
                type:'typing',
                page_id:9,
                place:'',
                place_time:0,
                place_acc:0.35,
                Altername:'',
                alter_time:0,
                alter_acc:0.35,
                Category:'',
                Cate_time:0,
                Cate_acc:0.80,
                Description:'',
                Desc_time:0,
                Desc_acc:0.80,
                Start_time:'',
                Stime:0,
                End_time:'',
                Etime:0},
                {materialLink:'https://landsat.visibleearth.nasa.gov/view.php?id=91771',
                type:'typing',
                page_id:10,
                place:'',
                place_time:0,
                place_acc:0.35,
                Altername:'',
                alter_time:0,
                alter_acc:0.35,
                Category:'',
                Cate_time:0,
                Cate_acc:0.80,
                Description:'',
                Desc_time:0,
                Desc_acc:0.80,
                Start_time:'',
                Stime:0,
                End_time:'',
                Etime:0},
                
            ],
            //variable for sound recognition
            totext:'',speechcontent:'',speechresult:'',isRecord:false,recognition:new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition ||window.msSpeechRecognition)(),
            },
        methods:{
            //drawing part
            start(event){
                vm=this;
                vm.isdraw=false;
                switch(vm.type)
                {   
                    case 'circle': vm.startCircle(event); break;
                    case 'rect': vm.startRect(event); break;
                    case 'marker': vm.marker(event); break;
                    case 'pencil': vm.startpencil(event); break;
                }
            },
            move(event){
                vm=this;
                switch(vm.type)
                {
                    case 'circle': vm.drawCircle(event); break;
                    case 'rect': vm.drawRect(event); break;
                    case 'pencil':vm.drawpencil(event);break;
                }
            },
            marker(event){
                vm=this;
                vm.drawlist.push({
                            id:Date.now(),
                            type:'marker',
                            geometry:{x:event.clientX,y:event.clientY},
                            style:{
                                left:`${event.clientX}px`,
                                top:`${event.clientY-55}px`,
                                position:`absolute`,
                                zIndex:'999'}
                            ,selected:false});
                vm.showmodal=true;
            },
            startRect(event){
                vm=this;           
                vm.drawlist.push({
                    id:Date.now(),
                    type: 'rect',
                    geometry:{x: event.clientX, y: event.clientY-55},
                    width: 0, 
                    height: 0,
                    radius: 0,
                    rotate: 0,
                    style:`fill:${vm.fill};stroke:${vm.stroke};strokewidth:${vm.strokeWidth};opacity:0.7`,
                    selected:false,
                });
                vm.isdraw=true;
            },
            startCircle(event){
                vm=this;           
                vm.drawlist.push({
                    id:Date.now(),
                    type:'circle',
                    geometry:{x: event.clientX, y: event.clientY-55},
                    style:`fill:${vm.fill};stroke:${vm.stroke};strokewidth:${vm.strokeWidth};opacity:0.7`,
                    radius: 0,
                    selected:false
                });
                vm.isdraw=true;
            },
            startpencil(event){
                vm=this;
                vm.drawlist.push(
                   {
                        type: 'pencil',
                        points: `${event.clientX},${event.clientY-55} `,
                        style: `stroke-width:${vm.strokeWidth};stroke:${vm.stroke};fill:none`,
                        selected:false,
                    });
                vm.isdraw=true;
            },
            drawRect(event){
                vm=this;
                //if leftclick and status is drawing
                if (event.buttons == 1 && vm.isdraw){
                    let lastRect = this.drawlist[vm.drawlist.length-1];        
                    lastRect.height = Math.abs(event.clientY -55 - lastRect.geometry.y);
                    lastRect.width  = Math.abs(event.clientX - lastRect.geometry.x);
                }
                else if (event.button == 0 && vm.isdraw){
                    vm.isdraw=false;
                    vm.showmodal=true;
                }
    
            },
            drawCircle(event){
                vm=this;
                //if leftclick and status is drawing
                if (event.buttons == 1 && vm.isdraw){
                    let lastCircle = this.drawlist[vm.drawlist.length-1];        
                    let a = Math.abs(event.clientY -55 - lastCircle.geometry.y);
                    let b = Math.abs(event.clientX - lastCircle.geometry.x);
                    lastCircle.radius = Math.sqrt((a * a) + (b * b));
                }
                else if (event.button == 0 && vm.isdraw){
                    vm.isdraw=false;
                    vm.showmodal=true;
                }
            },
            drawpencil(event){
                vm=this;
                if(event.buttons == 1 && vm.isdraw){
    
                    let lastLine = vm.drawlist[vm.drawlist.length - 1];
                    lastLine.points += `${event.clientX},${event.clientY-55} `;
                    
                }
                else if (event.buttons == 0 && vm.isdraw){
                    
                    vm.isdraw=false;
                    vm.showmodal=true;
                }
            },
            //data processing
            save(item){
                vm=this;
                item.content = vm.content;
                item.pattern = vm.pattern;
                vm.close();
                vm.content="";
                vm.pattern="";
            },
            close(){
                vm=this;
                if (vm.isCancel){
                    vm.cancel()
                }
                vm.showmodal=false;
            },
            cancel(){
                vm=this;
                vm.drawlist.pop()
                vm.showmodal=false;
                //要拿掉剛存進去的前一筆資料 pop
            },
            rm(item){
                vm=this;
                var newindex;
                vm.drawlist.forEach((ele,key)=>{
                    if(ele.id===item.id){
                        newindex=key;
                    }
                });
                vm.drawlist.splice(newindex,1);
            },
            modify(item){
                vm=this;
                vm.content = item.content;
                vm.pattern = item.pattern;
                vm.showmodal=true;
            },
            rmselected(key){
                vm=this;
                if (vm.selecteditem !=null ){
                    vm.drawlist[vm.selecteditem].selected = !vm.drawlist[vm.selecteditem].selected;
                }
                vm.selecteditem = key;
            },
            record(){
                const vm=this;
                vm.recognition.lang = 'en-US';
                vm.recognition.continuous = true;
                vm.isRecord=!vm.isRecord;
                if (vm.isRecord){
                    vm.recognition.start();
                    vm.recognition.onresult = function(event) {
                        vm.speechcontent =event.results;
                        for (let i =0; i< vm.speechcontent.length ; i++){
                            transcript = vm.speechcontent[i][0].transcript + '. '; 
                            vm.speechresult += transcript;
                            vm.totext=vm.speechresult;
                    }
                        vm.totext=vm.speechresult;
                    }
                }
                else{
                    vm.recognition.stop();
                    vm.speechresult='';
                    vm.speechcontent='';
                }
                
            },            
            timeresult(result){
                vm=this;
                console.log(result);
                time=result[0]; field =result[1];
                switch(field){
                    case 'place':{
                        vm.place_time=time;
                        break;
                    }
                    case 'Altername':{
                        vm.alter_time=time;
                        break;
                    }
                    case 'Category':{
                        vm.Cate_time=time;
                        break;
                    }
                    case 'Description':{
                        vm.Desc_time=time;
                        break;
                    }
                    case 'StartTime':{
                        vm.Stime=time;
                        break;
                    }
                    case 'EndTime':{
                        vm.Etime=time;
                        break;
                    }
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
                console.log(list);
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
        },
        components:{
            'type-element':typeelement,
            'row-page':pageControl,
        },
    });
}
);
//speech recognition
// recogntion = new Speechrecogntion();
// recogntion.lang = 'en-US';
// recogntion.continuous = true;
// isRecord=false;
// var content;
// function record(){
//     isRecord=!isRecord;
//     var result='';
//     if (isRecord){
//         recogntion.start();
//         recogntion.onresult = function(event) {
//             content =event.results;
//         }
//     }
//     else{
//         recognition.stop();
//         for (let i =0; i< content.length ; i++){
//                 transcript = content[i][0].transcript + '. '; 
//                 result += transcript;
//             }
//     }
    
//     console.log(result);
// }

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

