/**
 * Created by zane on 5/20/15.
 */
function Floor(){
    base(this,LSprite,[]);
    this.isSpring=false;
    this.springBitmap=null;
    this.isMissing=false;
}

Floor.prototype.setAct=function(){};

Floor.prototype._move=function(){
    this.y+=MOVE_STEP;
};

Floor.prototype.setView=function(){};

function normalFloor(){
    base(this,Floor,[]);
}

normalFloor.prototype.setView=function(){
    this.bitmap= new LBitmap(new LBitmapData(imageList["image"],0,0,105,29));
    this.bitmap.scaleX=0.6;
    this.bitmap.scaleY=0.5;
    this.addChild(this.bitmap);
}

function movingFloor(){
    base(this,Floor,[]);
}

movingFloor.prototype.setView=function(){
    this.bitmap= new LBitmap(new LBitmapData(imageList["image"],0,61,105,30));
    this.bitmap.scaleX=0.6;
    this.bitmap.scaleY=0.5;
    this.addChild(this.bitmap);
}



    movingFloor.prototype.setAct=function(){
    if(this.x<=0){
        this.turn="right";
    }
    if(this.x>=LGlobal.width-105*0.6){
        this.turn="left";
    }
    if(this.turn=="left"){
        this.x-=MOVE_STEP;
    }else{
        this.x+=MOVE_STEP;
    }
}


function getFloor(){
    var i=Math.floor(Math.random()*10);
    if(i<HARD){
        mid=new normalFloor();
    }else if(i>HARD){
        mid=new movingFloor();
    }else{
        mid=new missingFloor();
    }
        mid.y=0;
        mid.x=Math.floor((Math.random()*(LGlobal.width-40)));
        mid.setView();
        floorLayer.addChild(mid);
        return mid;
}


function missingFloor(){
    base(this,Floor,[]);
}

missingFloor.prototype.setView=function(){
    this.bitmap= new LBitmap(new LBitmapData(imageList["image"],0,92,105,30));
    this.bitmap.scaleX=0.6;
    this.bitmap.scaleY=0.5;
    this.isMissing=true;
    this.addChild(this.bitmap);
}


