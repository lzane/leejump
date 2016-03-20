/**
 * Created by zane on 5/20/15.
 */
function Player(){
    base(this,LSprite,[]);
    this.position="right";
    this.moveType=null;
    this.isjump=true;
    this.speed=-20;
    this.maxspeed=20;
    this.charaOld;
    this.rightimage=new LBitmapData(imageList["image"],30,124,78,76);
    this.rightimaged=new LBitmapData(imageList["image"],30,291,80,72);
    this.leftimage=new LBitmapData(imageList["image"],0,203,79,78);
    this.leftimaged=new LBitmapData(imageList["image"],0,373,81,73);

    this.isfly=false;
    this.flyBitmap=null;
}

Player.prototype.up_down= function () {
    this.charaOld=this.y;
    this.y+=this.speed;
    this.speed+=g;
    if(this.speed>this.maxspeed) this.speed=this.maxspeed;

    if(this.moveType=="left"){
        this.position="left";
        this.x-=MOVE_SPEED;
        if(this.x<-this.bitmap.width/2){this.x=LGlobal.width;}
        this.bitmap.bitmapData=this.leftimage;
    }else if(this.moveType=="right"){
        this.x+=MOVE_SPEED;
        this.position="right";
        this.bitmap.bitmapData=this.rightimage;
        if(this.x>LGlobal.width)this.x=-this.bitmap.width*0.5;
    }
}

Player.prototype.setView = function(){
    this.bitmap=new LBitmap(new LBitmapData(imageList["image"],30,124,78,76));
    this.bitmap.scaleX=0.5;
    this.bitmap.scaleY=0.5;
    this.addChild(this.bitmap);
}

Player.prototype.on_frame=function(){
    if(this.position=="left"){
        if(this.isjump){
            this.bitmap.bitmapData=this.leftimage;
        }else{
            this.bitmap.bitmapData=this.leftimaged;
        }
    }else{
        if(this.isjump){
            this.bitmap.bitmapData=this.rightimage;
        }else{
            this.bitmap.bitmapData=this.rightimaged;
        }
    }
}