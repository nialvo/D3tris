//displays


const xEl = document.getElementById("x");
const yEl = document.getElementById("y");
const zEl = document.getElementById("z");
const iEl = document.getElementById("i");
const jEl = document.getElementById("j");
const kEl = document.getElementById("k");


//set up canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.globalAlpha=1;
let wid = window.innerWidth;
let hei = window.innerHeight;
let midX=Math.round(wid/2);
let midY=Math.round(hei/2);
canvas.setAttribute("width",wid);
canvas.setAttribute("height",hei);



//controls
const rX=document.getElementById("rotX");
rX.addEventListener("click",RX);
const rY=document.getElementById("rotX");
rY.addEventListener("click",RY);
const rZ=document.getElementById("rotX");
rZ.addEventListener("click",RZ);

let x=0;
let y=0;
let z=50;//position of center

xEl.textContent=x;
yEl.textContent=y;
zEl.textContent=z;

let xinc=10;
let yinc=10;
let zinc=10;

document.onkeydown = logKey;

function logKey(e){
    if (e.code == "Numpad8"){
        z+= zinc;
        zEl.textContent=z;
    }
    else if (e.code == "Numpad2"){
        z-= zinc;
        zEl.textContent=z;
    }
    else if (e.code == "Numpad4"){
        x-= xinc;
        xEl.textContent=x;
    }
    else if (e.code == "Numpad6"){
        x+= xinc;
        xEl.textContent=x;
    }


}

//displays



//create D3tronimos

/*
for performance' sake we are mostly using L.flat arrays:
a square with vertex coordinates v0=[x0,y0,z0] v1=[x1,y1,z1] v2=[x2,y2,z2] v3=[x3,y3,z3]
is stored as s=[x0,y0,z0,x1,y1,z1,x2,y2,z2,x3,y3,z3].
By convention, for clarity, we refer to the elements as if they were in a matrix:
for example, to access the y coordinate of the first (0th) vertex, we write s[0*3+1].
Athisernately, if iterating through the points in a loop, 
for example, to access the y coordinate of each vertex, we write s[i+1] in a loop that increments i by 3.
*/


const w = 30;//size increment oL.f blocks (half the width of the smallest side)
const scr = 400;//distance between viewer and screen
const al = .3//alpha of block sides

//L-shape
class LT {
    constructor(){
        this.f=[-2*w,-3*w,-w,0,-3*w,-w,0,w,-w,2*w,w,-w,2*w,3*w,-w,-2*w,3*w,-w],//front (in default position)
        this.b=[-2*w,-3*w,w,0,-3*w,w,0,w,w,2*w,w,w,2*w,3*w,w,-2*w,3*w,w],//back
        this.colorf="rgba(245,0,0,"+al+")",
        this.colorb="rgba(220,45,0,"+al+")",
        this.color0="rgba(230,0,45,"+al+")",
        this.color1="rgba(210,20,20,"+al+")",
        this.color2="rgba(200,42,69,"+al+")",
        this.color3="rgba(190,53,85, "+al+")",
        this.color4="rgba(208,108,55,"+al+")",
        this.color5="rgba(235,85,100,"+al+")"
    }
    static s0(a){return [a.f[0*3+0],a.f[0*3+1],a.f[0*3+2],a.f[1*3+0],a.f[1*3+1],a.f[1*3+2],a.b[1*3+0],a.b[1*3+1],a.b[1*3+2],a.b[0*3+0],a.b[0*3+1],a.b[0*3+2]]}//sides
    static s1(a){return [a.f[1*3+0],a.f[1*3+1],a.f[1*3+2],a.f[2*3+0],a.f[2*3+1],a.f[2*3+2],a.b[2*3+0],a.b[2*3+1],a.b[2*3+2],a.b[1*3+0],a.b[1*3+1],a.b[1*3+2]]}
    static s2(a){return [a.f[2*3+0],a.f[2*3+1],a.f[2*3+2],a.f[3*3+0],a.f[3*3+1],a.f[3*3+2],a.b[3*3+0],a.b[3*3+1],a.b[3*3+2],a.b[2*3+0],a.b[2*3+1],a.b[2*3+2]]}
    static s3(a){return [a.f[3*3+0],a.f[3*3+1],a.f[3*3+2],a.f[4*3+0],a.f[4*3+1],a.f[4*3+2],a.b[4*3+0],a.b[4*3+1],a.b[4*3+2],a.b[3*3+0],a.b[3*3+1],a.b[3*3+2]]}
    static s4(a){return [a.f[4*3+0],a.f[4*3+1],a.f[4*3+2],a.f[5*3+0],a.f[5*3+1],a.f[5*3+2],a.b[5*3+0],a.b[5*3+1],a.b[5*3+2],a.b[4*3+0],a.b[4*3+1],a.b[4*3+2]]}
    static s5(a){return [a.f[5*3+0],a.f[5*3+1],a.f[5*3+2],a.f[0*3+0],a.f[0*3+1],a.f[0*3+2],a.b[0*3+0],a.b[0*3+1],a.b[0*3+2],a.b[5*3+0],a.b[5*3+1],a.b[5*3+2]]}
    static M(a){return Math.max(a.f[0*3+2],a.f[1*3+2],a.f[2*3+2],a.f[3*3+2],a.f[4*3+2],a.f[5*3+2],a.b[0*3+2],a.b[1*3+2],a.b[2*3+2],a.b[3*3+2],a.b[4*3+2],a.b[5*3+2])}
    static Mf(a){return Math.max(a.f[0*3+2],a.f[1*3+2],a.f[2*3+2],a.f[3*3+2],a.f[4*3+2],a.f[5*3+2])==this.M(a)}
    static Mb(a){return Math.max(a.b[0*3+2],a.b[1*3+2],a.b[2*3+2],a.b[3*3+2],a.b[4*3+2],a.b[5*3+2])==this.M(a)}
    static M0(a){return Math.max(a.f[0*3+2],a.f[1*3+2],a.b[1*3+2],a.b[0*3+2])==this.M(a)}
    static M1(a){return Math.max(a.f[1*3+2],a.f[2*3+2],a.b[2*3+2],a.b[1*3+2])==this.M(a)}
    static M2(a){return Math.max(a.f[2*3+2],a.f[3*3+2],a.b[3*3+2],a.b[2*3+2])==this.M(a)}
    static M3(a){return Math.max(a.f[3*3+2],a.f[4*3+2],a.b[4*3+2],a.b[3*3+2])==this.M(a)}
    static M4(a){return Math.max(a.f[4*3+2],a.f[5*3+2],a.b[5*3+2],a.b[4*3+2])==this.M(a)}
    static M5(a){return Math.max(a.f[5*3+2],a.f[0*3+2],a.b[0*3+2],a.b[5*3+2])==this.M(a)}
    static draw(L){
        if(this.Mf(L))polygon(L.f,L.colorf);
        if(this.Mb(L))polygon(L.b,L.colorb);
        if(this.M0(L))polygon(this.s0(L),L.color0);
        if(this.M1(L))polygon(this.s1(L),L.color1);
        if(this.M2(L))polygon(this.s2(L),L.color2);
        if(this.M3(L))polygon(this.s3(L),L.color3);
        if(this.M4(L))polygon(this.s4(L),L.color4);
        if(this.M5(L))polygon(this.s5(L),L.color5);
        if(!this.M0(L))polygon(this.s0(L),L.color0);
        if(!this.M1(L))polygon(this.s1(L),L.color1);
        if(!this.M2(L))polygon(this.s2(L),L.color2);
        if(!this.M3(L))polygon(this.s3(L),L.color3);
        if(!this.M4(L))polygon(this.s4(L),L.color4);
        if(!this.M5(L))polygon(this.s5(L),L.color5);
        if(!this.Mf(L))polygon(L.f,L.colorf);
        if(!this.Mb(L))polygon(L.b,L.colorb);
    }
}



function RX(){
    console.log("say nothing")
}
function RY(){
    console.log("say nothing")
}
function RZ(){
    console.log("say nothing")
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
function rotateXV(A,frac){
    let ct = Math.cos(Math.PI/frac);
    let st = Math.sin(Math.PI/frac);
    for(let i=0; i<A.length;i+=3){
        let h = A[i+1];
        let k = A[i+2];
        A[i+1]=h*ct-k*st;
        A[i+2]=h*st+k*ct;
    }
}
function rotateYV(A,frac){
    let ct = Math.cos(Math.PI/frac);
    let st = Math.sin(Math.PI/frac);
    for(let i=0; i<A.length;i+=3){
        let h = A[i+0];
        let k = A[i+2];
        A[i+0]=h*ct-k*st;
        A[i+2]=h*st+k*ct;
    }
}


function rotateZV(A,frac){
    let ct = Math.cos(Math.PI/frac);
    let st = Math.sin(Math.PI/frac);
    for(let i=0; i<A.length;i+=3){
        let h = A[i+0];
        let k = A[i+1];
        A[i+0]=h*ct-k*st;
        A[i+1]=h*st+k*ct;
    }
}

//put position in here//////////////////////////////////////////////////////////////////////////////////////////////////////
//move to (x+X)/((z+Z+sc)/scr) etc.

function polygon(A,color){
    
    ctx.fillStyle = color;
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo((A[0*3+0]+x)/((A[0*3+2]+z+scr)/scr)+midX,(A[0*3+1])/((A[0*3+2]+z+scr)/scr)+midY);
    for(let i=3; i<A.length; i+=3) ctx.lineTo((A[i+0]+x)/((A[i+2]+z+scr)/scr)+midX,(A[i+1])/((A[i+2]+z+scr)/scr)+midY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

////////////////////////////////////////////

let l = new LT;
function WW(){
    ctx.clearRect(0,0,wid,hei)
    rotateXV(l.f,50);
    rotateXV(l.b,50);
    rotateYV(l.f,70);
    rotateYV(l.b,70);
    rotateZV(l.f,90);
    rotateZV(l.b,90);
    LT.draw(l)
}

setInterval(WW,10);





