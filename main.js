/**
 * Created by zane on 5/20/15.
 */
init(10,"mycanvas",390,480,main);

var backGroundLayer,
    loadingLayer,
    floorLayer,
    playerLayer,
    scoreLayer,
    beginLayer,
    lefttouchLayer,
    righttouchLayer;


var imageList={};

var imageData=new Array({name:"endbackground",path:"./endbackground.jpg"},
    {name:"indexbackground",path:"./indexbackground.jpg"},
    {name:"background",path:"./background.png"},
    {name:"image",path:"./image.png"});

var MOVE_STEP= 5,
    MOVE_SPEED=10,
    HARD=8,
    g=1,
    score=0;

var isMove=false;
var isGamebegin=false;

function main(){
    backGroundLayer=new LSprite();
    backGroundLayer.graphics.drawRect(0,"white",[0,0,400,480]);
    addChild(backGroundLayer);

    beginLayer=new LSprite();

    loadingLayer=new LoadingSample4();
    backGroundLayer.addChild(loadingLayer);



    LLoadManage.load(imageData,function(progress){
        loadingLayer.setProgress(progress);
    },gameIndex);

}
var backgroundbitmap;
var SpringUpBitmapData;
var SpringDownBitmapData;

function gameIndex(result){
    imageList=result;
    SpringUpBitmapData=new LBitmapData(imageList["image"],4,501,31,53);
    SpringDownBitmapData=new LBitmapData(imageList["image"],1,468,43,23);

    backGroundLayer.removeChild(loadingLayer);
    loadingLayer=null;
    backgroundbitmap=new LBitmap(new LBitmapData(imageList["indexbackground"]))
    backGroundLayer.addChild(backgroundbitmap);

    floorLayer=new LSprite();
    backGroundLayer.addChild(floorLayer);

    playerLayer=new Player();
    backGroundLayer.addChild(playerLayer);
    playerLayer.setView();
    playerLayer.x=(LGlobal.width-playerLayer.bitmap.width/2)/2;
    playerLayer.y=400;



    lefttouchLayer=new LSprite();
    righttouchLayer=new LSprite();
    lefttouchLayer.graphics.drawRect(0,"white",[0,0,LGlobal.width/2-20,LGlobal.height]);
    righttouchLayer.graphics.drawRect(0,"white",[LGlobal.width/2+20,0,LGlobal.width/2,LGlobal.height]);
    backGroundLayer.addChild(lefttouchLayer);
    backGroundLayer.addChild(righttouchLayer);
    lefttouchLayer.addEventListener(LMouseEvent.MOUSE_DOWN,leftdown);
    lefttouchLayer.addEventListener(LMouseEvent.MOUSE_UP,bothup);
    righttouchLayer.addEventListener(LMouseEvent.MOUSE_DOWN,rightdown);
    righttouchLayer.addEventListener(LMouseEvent.MOUSE_UP,bothup);


    if(!LGlobal.canTouch){
        LEvent.addEventListener(window,LKeyboardEvent.KEY_DOWN,down);
        LEvent.addEventListener(window,LKeyboardEvent.KEY_UP,up);
    }

    var mid=new normalFloor();
    mid.y=400;
    mid.x=(LGlobal.width-105*0.6)/2;
    floorLayer.addChild(mid);
    mid.setView();

    backGroundLayer.addEventListener(LEvent.ENTER_FRAME,onframe);

    scoreLayer=new LTextField();
    scoreLayer.text="score:"+score;
    scoreLayer.color="black";
    scoreLayer.weight="bolder";
    scoreLayer.font="Georgia";
    scoreLayer.y=10;
    scoreLayer.x=LGlobal.width-scoreLayer.getWidth()-20;

    mid.addEventListener(LMouseEvent.MOUSE_UP,start_game);

}
var mid;
function leftdown(){
        playerLayer.moveType="left";
}
function rightdown(){
    playerLayer.moveType="right";
}
function bothup(){
    playerLayer.moveType=null;
}

function start_game(){
    scoreLayer.text="score:"+score;
    backgroundbitmap.bitmapData=new LBitmapData(imageList["background"]);
    backGroundLayer.removeEventListener(LEvent.ENTER_FRAME,onframe);
    backGroundLayer.addEventListener(LEvent.ENTER_FRAME,onframe);

    isGamebegin=true;
    for(var i=1;i<7;i++){
        getFloor().y=-40+i*60;
    }
    backGroundLayer.addChild(scoreLayer);
}


var move;
var cnt=0;
var jumpspeed=2;
var cnt2=0;

function movebackground(){
    score++;
    scoreLayer.text="score:"+score;
    scoreLayer.x=LGlobal.width-scoreLayer.getWidth()-20;
    g=2.3;
    cnt++;
    for (var i = 0; i < floorLayer.childList.length; i++) {
        floorLayer.childList[i]._move();
    }
    move-=MOVE_STEP;

    if(cnt>=14){
        var midfloor=getFloor();
        cnt=0;

        if(Math.random()*10>=9&&midfloor.isMissing==false){
            midfloor.isSpring=true;
            midfloor.springBitmap=new LBitmap(SpringDownBitmapData);
            midfloor.springBitmap.scaleX=0.6;
            midfloor.springBitmap.scaleY=0.5;
            midfloor.springBitmap.x=Math.random()*((105-43)*0.6);
            midfloor.springBitmap.y=-23*0.5;
            midfloor.addChild(mid.springBitmap);
        };
    }
}
var cnt3=0;


function onframe(){

    if(move>0) {
        movebackground();
    }else g=1;

    if(playerLayer.y>LGlobal.height){
        if(isMove==false){
            playerLayer.speed=-20;
        }else{
            gameover();
        }
    }
    if(jumpspeed--<=0) {
        if(playerLayer.isfly==true&&cnt3++>=8){
            cnt3=0;
            playerLayer.flyBitmap.springBitmap.bitmapData=SpringDownBitmapData;
            playerLayer.flyBitmap.springBitmap.y=-23*0.5;
            playerLayer.isfly=false;
        }
        playerLayer.up_down();
        jumpspeed=2;
        if(playerLayer.isjump==false){
            if(cnt2++>=2){
            playerLayer.isjump=true;
            playerLayer.on_frame();}
        }

        for(var i=0;i<floorLayer.childList.length;i++){
            floorLayer.childList[i].setAct();
            if(floorLayer.childList[i].y>LGlobal.height){
                floorLayer.removeChild(floorLayer.childList[i]);
            }
            if(playerLayer.x+playerLayer.bitmap.width/2>=floorLayer.childList[i].x
                &&playerLayer.x<=floorLayer.childList[i].x+floorLayer.childList[i].bitmap.width*0.6
                &&playerLayer.y+playerLayer.bitmap.height/2>=floorLayer.childList[i].y
                &&playerLayer.charaOld+playerLayer.bitmap.height/2-1<=floorLayer.childList[i].y)
            {

                playerLayer.isjump=false;
                playerLayer.speed=-18;

                if(isGamebegin&&playerLayer.y<430){
                    move=400-playerLayer.y;
                    isMove=true;
                }

                if(floorLayer.childList[i].isSpring==true){
                    if(playerLayer.x+40>=floorLayer.childList[i].x+floorLayer.childList[i].springBitmap.x&&
                        playerLayer.x<=floorLayer.childList[i].x+floorLayer.childList[i].springBitmap.x+20){
                        playerLayer.speed=-25;
                        playerLayer.isfly=true;
                        playerLayer.flyBitmap=floorLayer.childList[i];
                        move=200;
                        floorLayer.childList[i].springBitmap.bitmapData=SpringUpBitmapData;
                        floorLayer.childList[i].springBitmap.y=-53*0.5;
                    }
                }

                if(floorLayer.childList[i].isMissing==true){
                    floorLayer.removeChild(floorLayer.childList[i]);
                }

                playerLayer.on_frame();
                cnt2=0;
                break;
            }
        }

    }
    if(score>2000) HARD=7;
    if(score>5000) HARD=6;
    if(score>10000) HARD=5;

}

function up(event){
    playerLayer.moveType=null;
}
function down(event){
    if(playerLayer.moveType) return;
    if(event.keyCode==37){
        playerLayer.moveType="left";
    }
    if(event.keyCode==39){
        playerLayer.moveType="right";
    }
}

function gameover(){
    backGroundLayer.removeEventListener(LEvent.ENTER_FRAME,onframe);
    backGroundLayer.addEventListener(LEvent.ENTER_FRAME,downdie);
}
function  downdie(){
    if(floorLayer.childList[0].y>=0) {
        for (var i = 0; i < floorLayer.childList.length; i++) {
            floorLayer.childList[i].y -= 5;
        }
        playerLayer.y-=2;
    }else{
        playerLayer.y+=10;
    }
    if (floorLayer.childList[0].y<0&&playerLayer.y>LGlobal.height) {
    backGroundLayer.removeEventListener(LEvent.ENTER_FRAME, downdie);
    game_over();
    }
}
var finalscore;

function game_over(){
    floorLayer.removeAllChild();
    backGroundLayer.removeChild(scoreLayer);

    isGamebegin=false;
    backgroundbitmap.bitmapData=new LBitmapData(imageList["endbackground"]);
    finalscore=new LTextField();
    finalscore.text=score;
    finalscore.size=30;
    finalscore.color="black";
    finalscore.x=(LGlobal.width-finalscore.getWidth())/2;
    finalscore.y=235;
    backGroundLayer.addChild(finalscore);

    score=0;
    HARD=8;
    var button=new normalFloor();
    button.y=400;
    button.x=(LGlobal.width-105*0.6)/2;
    button.setView();
    floorLayer.addChild(button);
    button.addEventListener(LMouseEvent.MOUSE_UP,restart_game);
}


function restart_game(){
    backGroundLayer.removeChild(finalscore);
    playerLayer.x=(LGlobal.width-105*0.6)/2;
    playerLayer.y=300;
    playerLayer.speed=0;
    start_game();
}

