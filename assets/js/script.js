/*
A square with vertex coordinates v0=[x0,y0,z0] v1=[x1,y1,z1] v2=[x2,y2,z2] v3=[x3,y3,z3]
is stored as s=[x0,y0,z0,x1,y1,z1,x2,y2,z2,x3,y3,z3].
By convention, for clarity, we refer to the elements as if they were in a matrix:
for example, to access the y coordinate of the first (0th) vertex, we write s[0*3+1].
Alternately, if iterating through the points in a loop, 
for example, to access the y coordinate of each vertex, we write s[i+1] in a loop that increments i by 3.
*/




//set up canvas
const canvas = document.getElementById("canvas");
const background = document.getElementById("background");
const scree = document.getElementById("screen");
const ctx = canvas.getContext("2d");
const bck = background.getContext("2d");
ctx.globalAlpha=0;
let wid = window.innerWidth;
let hei = window.innerHeight;
let midX=Math.round(wid/2);
let midY=Math.round(hei/2);
canvas.setAttribute("width",wid);
canvas.setAttribute("height",hei);
background.setAttribute("width",wid);
background.setAttribute("height",hei);
scree.setAttribute("width",wid);
scree.setAttribute("height",hei);

var back = bck.createLinearGradient(0, hei, wid, 0);
back.addColorStop(0, "rgb(250,220,255)");
back.addColorStop(.3, "rgb(180,180,255)");
back.addColorStop(1, "rgb(240,195,240)");

bck.fillStyle=back;
bck.fillRect(0,0,wid,hei);




//controls

let xinc=1;
let yinc=1;
let zinc=1;

let tol = .00001;



const con={
    Numpad8 : false,
    Numpad2 : false,
    Numpad4 : false,
    Numpad6 : false,
    Numpad5 : false,
    Numpad0 : false,
    KeyZ : false,
    KeyX : false,
    KeyC : false,
    xr : 0,
    yr : 0,
    zr : 0,
    xt : 0,////////////////////////////////////////////////use this to make movement incremental/////////////////////////////////////
    yt : 0,//follow the thing for rotation
    zt : 0//then add collision detection 
    

}
function resp(AA,A){
    if (con.Numpad8&&con.zt==0)con.zt+=w;
    if (con.Numpad2&&A.z>49&&con.zt==0)con.zt-=w;
    if (con.Numpad4&&con.xt==0)con.xt-=w;
    if (con.Numpad6&&con.xt==0)con.xt+=w;
    if (con.Numpad5&&con.yt==0)con.yt-=w;
    if (con.Numpad0&&con.yt==0)con.yt+=w;
    if (con.zt>0){
        A.z+=zinc;
        con.zt--;   
    }
    if (con.xt>0){
        A.x+=xinc;
        con.xt--;   
    }
    if (con.yt>0){
        A.y+=yinc;
        con.yt--;   
    }
    if (con.zt<0){
        A.z-=zinc;
        con.zt++;   
    }
    if (con.xt<0){
        A.x-=xinc;
        con.xt++;   
    }
    if (con.yt<0){
        A.y-=yinc;
        con.yt++;   
    }
    if (con.KeyZ&&con.xr==0&&con.yr==0&&con.zr==0){
        con.zr+=25;
        con.KeyZ = false;   
    }
    if (con.KeyX&&con.xr==0&&con.yr==0&&con.zr==0){
        con.xr+=25;
        con.KeyX = false; 
    }
    if (con.KeyC&&con.xr==0&&con.yr==0&&con.zr==0){
        con.yr+=25;
        con.KeyC = false; 
    }
    if (con.zr>0){
        rotateZV(A.f);
        rotateZV(A.b);
        con.zr--;   
    }
    if (con.xr>0){
        rotateXV(A.f);
        rotateXV(A.b);
        con.xr--; 
    }
    if (con.yr>0){
        rotateYV(A.f);
        rotateYV(A.b);
        con.yr--;
    }





}

document.onkeydown = downkey;
document.onkeyup = upkey;

function downkey(e){
    con[e.code]=true;
}

function upkey(e){
    con[e.code]=false;
}

//shapes

const w = 60;//size increment of blocks 
const scr = 1*hei;//distance between viewer and screen
const al = .4//alpha of block sides

let highl="rgba(20,20,20,1)"

//draw grid
bck.strokeStyle="rgb(150,150,150)";


for (let i = -3; i<4; i++){
    bck.moveTo(((i*w)*scr)/(scr+10-3*w)+midX,(1*7*w*scr)/(scr+10-3*w)+2*w);
    bck.lineTo(((i*w)*scr)/(scr+10+3*w)+midX,(1*7*w*scr)/(scr+10+3*w)+2*w);
    bck.stroke();
    bck.closePath();
}
for (let i = -3; i<4; i++){
    bck.moveTo(((-3*w)*scr)/(scr+10+i*w)+midX,(1*7*w*scr)/(scr+10+i*w)+2*w);
    bck.lineTo(((3*w)*scr)/(scr+10+i*w)+midX,(1*7*w*scr)/(scr+10+i*w)+2*w);
    bck.stroke();
    bck.closePath();
}


//L-shape
class LT {
    constructor(){
        this.x=0;
        this.y=0;
        this.z=scr+10;
        this.f=[-1*w,-2*w,0,0,-2*w,0,0,0,0,1*w,0,0,1*w,1*w,0,-1*w,1*w,0],//front (in default position)
        this.b=[-1*w,-2*w,w,0,-2*w,w,0,0,w,1*w,0,w,1*w,1*w,w,-1*w,1*w,w],//back
        this.colorf="rgba(180,10,15,"+al+")",
        this.colorb="rgba(180,10,0,"+al+")",
        this.color0="rgba(230,0,45,"+al+")",
        this.color1="rgba(210,20,20,"+al+")",
        this.color2="rgba(200,42,69,"+al+")",
        this.color3="rgba(190,53,85, "+al+")",
        this.color4="rgba(208,10,55,"+al+")",
        this.color5="rgba(235,25,10,"+al+")"
    }
    static s0(a){return [a.f[0*3+0],a.f[0*3+1],a.f[0*3+2],a.f[1*3+0],a.f[1*3+1],a.f[1*3+2],a.b[1*3+0],a.b[1*3+1],a.b[1*3+2],a.b[0*3+0],a.b[0*3+1],a.b[0*3+2]]}//sides
    static s1(a){return [a.f[1*3+0],a.f[1*3+1],a.f[1*3+2],a.f[2*3+0],a.f[2*3+1],a.f[2*3+2],a.b[2*3+0],a.b[2*3+1],a.b[2*3+2],a.b[1*3+0],a.b[1*3+1],a.b[1*3+2]]}
    static s2(a){return [a.f[2*3+0],a.f[2*3+1],a.f[2*3+2],a.f[3*3+0],a.f[3*3+1],a.f[3*3+2],a.b[3*3+0],a.b[3*3+1],a.b[3*3+2],a.b[2*3+0],a.b[2*3+1],a.b[2*3+2]]}
    static s3(a){return [a.f[3*3+0],a.f[3*3+1],a.f[3*3+2],a.f[4*3+0],a.f[4*3+1],a.f[4*3+2],a.b[4*3+0],a.b[4*3+1],a.b[4*3+2],a.b[3*3+0],a.b[3*3+1],a.b[3*3+2]]}
    static s4(a){return [a.f[4*3+0],a.f[4*3+1],a.f[4*3+2],a.f[5*3+0],a.f[5*3+1],a.f[5*3+2],a.b[5*3+0],a.b[5*3+1],a.b[5*3+2],a.b[4*3+0],a.b[4*3+1],a.b[4*3+2]]}
    static s5(a){return [a.f[5*3+0],a.f[5*3+1],a.f[5*3+2],a.f[0*3+0],a.f[0*3+1],a.f[0*3+2],a.b[0*3+0],a.b[0*3+1],a.b[0*3+2],a.b[5*3+0],a.b[5*3+1],a.b[5*3+2]]}
    static lowest(a) {return Math.max(a.f[0*3+1],a.f[1*3+1],a.f[2*3+1],a.f[3*3+1],a.f[4*3+1],a.f[5*3+1],a.b[0*3+1],a.b[1*3+1],a.b[2*3+1],a.b[3*3+1],a.b[4*3+1],a.b[5*3+1]);}
    static contact(a){
        if (Math.abs(this.lowest(a)-a.f[0*3+1])<tol&&Math.abs(this.lowest(a)-a.b[1*3+1])<tol)return this.s2(a);
        else if (Math.abs(this.lowest(a)-a.f[3*3+1])<tol&&Math.abs(this.lowest(a)-a.b[4*3+1])<tol)return this.s1(a);
        else return 0;    
    }
    static draw(a){
        //let MXXX=Math.min(a.f[0*3+2],a.f[1*3+2],a.f[2*3+2],a.f[3*3+2],a.f[4*3+2],a.f[5*3+2],a.b[0*3+2],a.b[1*3+2],a.b[2*3+2],a.b[3*3+2],a.b[4*3+2],a.b[5*3+2]);
        let M=this.lowest(a);
        let c= this.contact(a);
        polygon(a.f,a.colorf,a.x,a.y,a.z,M,c);
        polygon(a.b,a.colorb,a.x,a.y,a.z,M,c);
        polygon(this.s0(a),a.color0,a.x,a.y,a.z,M,c);
        polygon(this.s1(a),a.color1,a.x,a.y,a.z,M,c);
        polygon(this.s2(a),a.color2,a.x,a.y,a.z,M,c);
        polygon(this.s3(a),a.color3,a.x,a.y,a.z,M,c);
        polygon(this.s4(a),a.color4,a.x,a.y,a.z,M,c);
        polygon(this.s5(a),a.color5,a.x,a.y,a.z,M,c);   
    }  
}


//we only rotate the front and back, the sides are defined in terms of the front and back
function rotateX(A){
    for(let i=0; i<A.length;i+=3){
        let h = A[i+1];
        A[i+1]=-A[i+2];
        A[i+2]=h;
    }
}
function rotateY(A){
    for(let i=0; i<A.length;i+=3){
        let h = A[i+0];
        A[i+0]=-A[i+2];
        A[i+2]=h;
    }
}
function rotateZ(A){
    for(let i=0; i<A.length;i+=3){
        let h = A[i+0];
        A[i+0]=-A[i+1];
        A[i+1]=h;
    }
}

//gradual spins
 
function rotateXV(A,frac=50){
    let ct = Math.cos(Math.PI/frac);
    let st = Math.sin(Math.PI/frac);
    for(let i=0; i<A.length;i+=3){
        let h = A[i+1];
        let k = A[i+2];
        A[i+1]=h*ct-k*st;
        A[i+2]=h*st+k*ct;
    }
}
function rotateYV(A,frac=50){
    let ct = Math.cos(Math.PI/frac);
    let st = Math.sin(Math.PI/frac);
    for(let i=0; i<A.length;i+=3){
        let h = A[i+0];
        let k = A[i+2];
        A[i+0]=h*ct-k*st;
        A[i+2]=h*st+k*ct;
    }
}
function rotateZV(A,frac=50){
    let ct = Math.cos(Math.PI/frac);
    let st = Math.sin(Math.PI/frac);
    for(let i=0; i<A.length;i+=3){
        let h = A[i+0];
        let k = A[i+1];
        A[i+0]=h*ct-k*st;
        A[i+1]=h*st+k*ct;
    }
}
/*//draw grid
bck.strokeStyle="rgb(150,150,150)";


for (let i = -3; i<4; i++){
    bck.moveTo(((i*w)*scr)/(scr+10-3*w)+midX,(1*7*w*scr)/(scr+10-3*w)+2*w);
    bck.lineTo(((i*w)*scr)/(scr+10+3*w)+midX,(1*7*w*scr)/(scr+10+3*w)+2*w);
    bck.stroke();
    bck.closePath();
}
for (let i = -3; i<4; i++){
    bck.moveTo(((-3*w)*scr)/(scr+10+i*w)+midX,(1*7*w*scr)/(scr+10+i*w)+2*w);
    bck.lineTo(((3*w)*scr)/(scr+10+i*w)+midX,(1*7*w*scr)/(scr+10+i*w)+2*w);
    bck.stroke();
    bck.closePath();
}*/

function polygon(A,color,x,y,z,M,c){
    ctx.strokeStyle = "rgba(0,0,0,0)";
    let ff=0;
    for (let i =0; i<A.length; i+=3)if(Math.abs(A[i+1]-M)>tol)ff=1; 
    if (ff==0){
        if(c!=0){
            ctx.strokeStyle = highl;
            ctx.beginPath();
            ctx.moveTo(((c[0*3+0]+x)*scr)/(c[0*3+2]+z)+midX,(1*7*w*scr)/(c[0*3+2]+z)+2*w);
            for(let i=3; i<c.length; i+=3)ctx.lineTo(((c[i+0]+x)*scr)/(c[i+2]+z)+midX,(1*7*w*scr)/(c[i+2]+z)+2*w);
            ctx.lineTo( ((c[0*3+0]+x)*scr)/(c[0*3+2]+z)+midX,(1*7*w*scr)/(c[0*3+2]+z)+2*w);
            ctx.stroke();
            ctx.closePath();
        }

        ctx.strokeStyle = highl;
        ctx.beginPath();
        ctx.moveTo(((A[0*3+0]+x)*scr)/(A[0*3+2]+z)+midX,(1*7*w*scr)/(A[0*3+2]+z)+2*w);
        for(let i=3; i<A.length; i+=3)ctx.lineTo(((A[i+0]+x)*scr)/(A[i+2]+z)+midX,(1*7*w*scr)/(A[i+2]+z)+2*w);
        ctx.lineTo( ((A[0*3+0]+x)*scr)/(A[0*3+2]+z)+midX,(1*7*w*scr)/(A[0*3+2]+z)+2*w);
        ctx.stroke();
        ctx.closePath();
    }
    ff=0;
    for (let i =0; i<A.length; i+=3)if (A[i]!=c[i])ff=1; 
    if (ff==0) ctx.strokeStyle = highl; 
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(((A[0*3+0]+x)*scr)/(A[0*3+2]+z)+midX,((A[0*3+1]+y)*scr)/(A[0*3+2]+z)+2*w);
    for(let i=3; i<A.length; i+=3)ctx.lineTo(((A[i+0]+x)*scr)/(A[i+2]+z)+midX,((A[i+1]+y)*scr)/(A[i+2]+z)+2*w);
    ctx.lineTo( ((A[0*3+0]+x)*scr)/(A[0*3+2]+z)+midX,((A[0*3+1]+y)*scr)/(A[0*3+2]+z)+2*w);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();

    
}

////////////////////////////////////////////

let l = new LT;

function WW(){
    ctx.clearRect(0,0,wid,hei)
    resp(LT,l);
    LT.draw(l)

    
}
let fff=0;
function cc(){
    if(fff==0){
        highl="rgba(50,50,50,1)";
        fff=1;
    }else{
        highl="rgba(255,255,255,0)";
        fff=0;
    }

}

setInterval(cc,400);
setInterval(WW,10);








