//已知bug : pin的xy 不太正確
// 編輯時,若點選modal中的close會山資料
// 畫正方形、圓形的操作還是不太正常,有點怪怪的XD

var recognition = new webkitSpeechRecognition() || new SpeechRecognition();
recognition.lang = 'en-US';
function speechstart(){
    recognition.start();
    console.log('speech');
    recognition.onspeechstart=function(){
        console.log('Start Speech Recording.');
    }
    recognition.onresult = function(event) {
        word = event.results[0].transcript;
    }
}
function speechend(){
    recognition.onspeechend=function(){
        recognition.stop();
        console.log('Start end');
}}

var app = new Vue({
    el:'#app',
    data:{
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
                console.log(lastLine.points);
            }
            else if (event.buttons == 0 && vm.isdraw){
                console.log('s3')
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
        }
    },
}

)

// data send to the back_end
// data=[{
// annotion:{ 
//       participant_ID:'Al396421',
//       scenario:'A',
//       order:1,
    //   type:'speech',
    //   page_id:'',
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
//         materialLink:'',
//         type:'speech',
//         page_id:'',
//         place:'',
//         place_time:25,
//         place_acc:0.35,
//         Altername:'',
//         alter_time:25,
//         alter_acc:0.35,
//         Category:'Geography',
//         Cate_time:40,
//         Cate_acc:0.80,
//         Description:'he',
//         Desc_time:30,
//         Desc_acc:0.80,
//         Start_time:89,
//         s_spent_time:25,
//         End_time:89,
//         e_spent_time:25,
//         }}]

