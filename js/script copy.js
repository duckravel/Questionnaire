//已知bug : pin的xy 不太正確
// 畫正方形、圓形的操作還是不太正常,有點怪怪的XD 目前無法重現,下次請清楚描述bug
$( document ).ready(function(){
    const setsoundheight=()=>{
        let h= $('body').height()-$('#menu').height();
        $('#soundheight').height(h);   
    };
    const setdataheight=()=>{
        let h= $('body').height()-$('#menu').height();
        $('#data').height(h);  
    }
    setsoundheight();
    setdataheight();
    $( window ).resize(function(){
        setsoundheight();
        setdataheight();
    });

    var app = new Vue({
        el:'#app',
        data:{
            //data for annotation
            type:'',
            drawlist:[],
            showmodal:false,
            content:'',
            pattern:'',
            isdraw:false,
            isItemSelected:false,
            isCancel:false,
            selecteditem:null,
            stroke: '#ff0000',
            fill: '#821717',
            strokeWidth: 5,
            rotate:0,
            //data for element creation
            place:'',
            Altername:'',
            Category:'',
            Description:'',
            StartTime:'',
            EndTime:'',
            currentpage:0,
            inputs:'',
            inpute:'',
            place_time:0,
            alter_time:0,
            Cate_time:0,
            Cate_acc:0,
            Desc_time:0,
            Stime:0,
            Etime:0,
            metadataelement:[],
            sourcedata:[
                'http://vis.ecowest.org/interactive/wildfires.php',
                'https://landsat.visibleearth.nasa.gov/view.php?id=91771'
            ],
            pages:10,
            //variable for sound recognition
            totext:'',
            speechcontent:'',
            speechresult:'',
            isRecord:false,
            recognition:new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition ||window.msSpeechRecognition)(),
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
            checkelement(){
                vm=this;
                list = [vm.place,vm.Altername,vm.Category,vm.StartTime,vm.EndTime,vm.Description];
                return list.every(ele=>ele.length>0);
            },
            storeelement(page){
                vm=this;
                vm.metadataelement.push(
                {
                'materialLink':vm.sourcedata[page-1],
                'type':'typing',
                'page_id':page-1,
                'place':vm.place,
                'place_time':vm.place_time,
                'place_acc':0.35,
                'Altername':vm.Altername,
                'alter_time':25,
                'alter_acc':0.35,
                'Category':vm.Category,
                'Cate_time':40,
                'Cate_acc':0.80,
                'Description':vm.Description,
                'Desc_time':30,
                'Desc_acc':0.80,
                'Start_time':vm.StartTime,
                'Stime':25,
                'End_time':vm.EndTime,
                'Etime':25});
                vm.place_time=0;
                vm.alter_time=0;
                vm.Cate_time=0;
                vm.Cate_acc=0;
                vm.Desc_time=0;
                vm.Stime=0;
                vm.Etime=0;
                vm.place=0;
                vm.Altername=0;
                vm.Category=0;
                vm.Description=0;
                vm.StartTime=0;
                vm.EndTime=0;
            },
            time_in(event){
                
                this.inputs=new Date();
            },
            time_out(event){
                
                this.inpute=new Date();
                this.time_esteimator(this.inputs,this.inpute,event);
            },
            time_esteimator(t1,t2,event){
                vm=this;
                // console.log(t1,t2,event);

                switch(event){
                    case 'place':{
                        vm.place_time+=1;
                    }
                    
                }

            },
            pageChange(page){
                //pageChange contains three seperate works: check data, store data, and change
                vm=this;
                check = vm.checkelement();
                if (check==false){
                    alert('invalid field');
                    return
                }
                vm.storeelement(page);
                vm.currentpage = (page - 1);
                
            },

            
        }
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

