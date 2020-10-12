//已知bug : pin的xy 不太正確
// 編輯時,若點選modal中的close會山資料

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
        isItemSelected:false,
        selecteditem:null,
        stroke: '#ff0000',
        fill: '#821717',
        strokeWidth: 5,
        rotate:0,
        },
    methods:{
        start(event){
            vm=this;
            switch(vm.type)
            {   
                case 'circle': vm.startCircle(event); break;
                case 'rect': vm.startRect(event); break;
                case 'marker': vm.marker(event); break;
                case 'arrow': vm.startarrow(event); break;
            }
        },
        move(event){
            vm=this;
            switch(vm.type)
            {
                case 'circle': vm.drawCircle(event); break;
                case 'rect': vm.drawRect(event); break;
            }
        },
        marker(event){
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
                geometry:{x: event.clientX, y: event.clientY},
                width: 0, 
                height: 0,
                radius: 0,
                rotate: 0,
                style:`fill:red;stroke:black;stroke-width:5;opacity:0.5`,
            });
        },
        drawRect(event){
            vm=this;
            if (event.buttons == 1 ){
                let lastRect = thi.drawlist[vm.drawlist.length];        
                console.log('drawRect2');
                console.log(lastRect);
                lastRect.height = Math.abs(event.clientY - lastRect.geometry.y);
                lastRect.width  = Math.abs(event.clientX - lastRect.geometry.x);
                console.log(lastRect.height,lastRect.width);
            }

        },

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
            vm.showmodal=false;
        },
        cancel(){
            vm=this;
            vm.drawlist.pop()
            vm.close();
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

