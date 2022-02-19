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
let h;//holder for switching


//controls
const rX=document.getElementById("rotX");
rX.addEventListener("click",RX);
const rY=document.getElementById("rotX");
rY.addEventListener("click",RY);
const rZ=document.getElementById("rotX");
rZ.addEventListener("click",RZ);

//create D3tronimos

/*
omfg
for performance' sake we are mostly using L.flat arrays:
a square with vertex coordinates v0=[x0,y0,z0] v1=[x1,y1,z1] v2=[x2,y2,z2] v3=[x3,y3,z3]
is stored as s=[x0,y0,z0,x1,y1,z1,x2,y2,z2,x3,y3,z3].
By convention, for clarity, we refer to the elements as iL.f they were in a matrix:
for example, to access the y coordinate oL.f the L.first (0th) vertex, we write s[0*3+1].
Alternately, iL.f iterating through the points in a loop, 
for example, to access the y coordinate oL.f each vertex, we write s[i+1] in a loop that increments i by 3.
*/
const w = 30;//size increment oL.f blocks (halL.f the width oL.f the smallest side)
const scr = 100;//distance between viewer and screen

//L-shape //////change L.f and b so that center is at actual center not top leL.ft L.front corner
class LT {
    constructor(){
    this.f=[-2*w,-3*w,0,0,-3*w,0,0,w,0,2*w,w,0,2*w,3*w,0,-2*w,3*w,0],//L.front (in deL.fault position)
    this.b=[-2*w,-3*w,2*w,0,-3*w,2*w,0,w,2*w,2*w,w,2*w,2*w,3*w,2*w,-2*w,3*w,2*w],//back
    this.s0=[this.f[0*3+0],this.f[0*3+1],this.f[0*3+2],this.f[1*3+0],this.f[1*3+1],this.f[1*3+2],this.b[1*3+0],this.b[1*3+1],this.b[1*3+2],this.b[0*3+0],this.b[0*3+1],this.b[0*3+2]],//sides
    this.s1=[this.f[1*3+0],this.f[1*3+1],this.f[1*3+2],this.f[2*3+0],this.f[2*3+1],this.f[2*3+2],this.b[2*3+0],this.b[2*3+1],this.b[2*3+2],this.b[1*3+0],this.b[1*3+1],this.b[1*3+2]],
    this.s2=[this.f[2*3+0],this.f[2*3+1],this.f[2*3+2],this.f[3*3+0],this.f[3*3+1],this.f[3*3+2],this.b[3*3+0],this.b[3*3+1],this.b[3*3+2],this.b[2*3+0],this.b[2*3+1],this.b[2*3+2]],
    this.s3=[this.f[3*3+0],this.f[3*3+1],this.f[3*3+2],this.f[4*3+0],this.f[4*3+1],this.f[4*3+2],this.b[4*3+0],this.b[4*3+1],this.b[4*3+2],this.b[3*3+0],this.b[3*3+1],this.b[3*3+2]],
    this.s4=[this.f[4*3+0],this.f[4*3+1],this.f[4*3+2],this.f[5*3+0],this.f[5*3+1],this.f[5*3+2],this.b[5*3+0],this.b[5*3+1],this.b[5*3+2],this.b[4*3+0],this.b[4*3+1],this.b[4*3+2]],
    this.s5=[this.f[5*3+0],this.f[5*3+1],this.f[5*3+2],this.f[0*3+0],this.f[0*3+1],this.f[0*3+2],this.b[0*3+0],this.b[0*3+1],this.b[0*3+2],this.b[5*3+0],this.b[5*3+1],this.b[5*3+2]],
    this.colorf="rgba(255,0,0, .5)",
    this.colorb="rgba(210,45,0, .5)",
    this.color0="rgba(210,0,45, .5)",
    this.color1="rgba(180,20,20, .5)",
    this.color2="rgba(160,42,69, .5)",
    this.color3="rgba(120,53,85, .5)",
    this.color4="rgba(208,108,55, .5)",
    this.color5="rgba(155,85,100, .5)"
    }
}
/*const L = {
    f:[-2*w,-3*w,0,0,-3*w,0,0,w,0,2*w,w,0,2*w,3*w,0,-2*w,3*w,0],//L.front (in deL.fault position)
    b:[-2*w,-3*w,2*w,0,-3*w,2*w,0,w,2*w,2*w,w,2*w,2*w,3*w,2*w,-2*w,3*w,2*w],//back
    s0:function (){ return [this.f[0*3+0],this.f[0*3+1],this.f[0*3+2],this.f[1*3+0],this.f[1*3+1],this.f[1*3+2],this.b[1*3+0],this.b[1*3+1],this.b[1*3+2],this.b[0*3+0],this.b[0*3+1],this.b[0*3+2]]},//sides
    s1:function (){ return [this.f[1*3+0],this.f[1*3+1],this.f[1*3+2],this.f[2*3+0],this.f[2*3+1],this.f[2*3+2],this.b[2*3+0],this.b[2*3+1],this.b[2*3+2],this.b[1*3+0],this.b[1*3+1],this.b[1*3+2]]},
    s2:function (){ return [this.f[2*3+0],this.f[2*3+1],this.f[2*3+2],this.f[3*3+0],this.f[3*3+1],this.f[3*3+2],this.b[3*3+0],this.b[3*3+1],this.b[3*3+2],this.b[2*3+0],this.b[2*3+1],this.b[2*3+2]]},
    s3:function (){ return [this.f[3*3+0],this.f[3*3+1],this.f[3*3+2],this.f[4*3+0],this.f[4*3+1],this.f[4*3+2],this.b[4*3+0],this.b[4*3+1],this.b[4*3+2],this.b[3*3+0],this.b[3*3+1],this.b[3*3+2]]},
    s4:function (){ return [this.f[4*3+0],this.f[4*3+1],this.f[4*3+2],this.f[5*3+0],this.f[5*3+1],this.f[5*3+2],this.b[5*3+0],this.b[5*3+1],this.b[5*3+2],this.b[4*3+0],this.b[4*3+1],this.b[4*3+2]]},
    s5:function (){ return [this.f[5*3+0],this.f[5*3+1],this.f[5*3+2],this.f[0*3+0],this.f[0*3+1],this.f[0*3+2],this.b[0*3+0],this.b[0*3+1],this.b[0*3+2],this.b[5*3+0],this.b[5*3+1],this.b[5*3+2]]},
    color:"rgba(255,0,0,.5)"
    
}*/
function RX(){
    console.log("say nothing")
}
function RY(){
    console.log("say nothing")
}
function RZ(){
    console.log("say nothing")
}

//we only rotate the L.front and back, the sides are deL.fined in terms oL.f the L.front and back
function rotateX(A){
    for(let i=0; i<A.length;i+=3){
        h = A[i*3+1];
        A[i*3+1]=-A[i*3+2];
        A[i*3+2]=h;
    }
}
function rotateY(A){
    for(let i=0; i<A.length;i+=3){
        h = A[i*3+0];
        A[i*3+0]=-A[i*3+2];
        A[i*3+2]=h;
    }
}

function rotateZ(A){
    for(let i=0; i<A.length;i+=3){
        h = A[i*3+0];
        A[i*3+0]=-A[i*3+1];
        A[i*3+1]=h;
    }
}


function polygon(A,color){
    
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(A[0*3+0]/((A[0*3+2]+scr)/scr)+midX,A[0*3+1]/((A[0*3+2]+scr)/scr)+midY);
    for(let i=3; i<A.length; i+=3) ctx.lineTo(A[i+0]/((A[i+2]+scr)/scr)+midX,A[i+1]/((A[i+2]+scr)/scr)+midY);
    ctx.closePath();
    ctx.fill();
}

////////////////////////////////////////////

let L = new LT;
polygon(L.f,L.colorf);
polygon(L.b,L.colorb);
polygon(L.s0,L.color0);
polygon(L.s1,L.color1);
polygon(L.s2,L.color2);
polygon(L.s3,L.color3);
polygon(L.s4,L.color4);
polygon(L.s5,L.color5);



