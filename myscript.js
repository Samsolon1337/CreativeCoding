//variables
var info = document.getElementById("info");
document.get
var t = document.getElementById("test");
var box = document.getElementById("container");

var bbox = box.getBoundingClientRect();

var creating = true;
// Keyboard Events


//Mouse Events
document.addEventListener('click', function(e) {
    e= e || window.event;
    var target = e.target;
    creating = false;
}, false);
addEventListener("mousemove", getMousePositon, false);


function getMousePositon(p){
    if(creating){
    info.innerText = `X: ${p.clientX} Y: ${p.clientY}\n BoxX: ${bbox.x} BoxY: ${bbox.y}\n BoxW: ${bbox.width} BoxH: ${bbox.height}`;
    box.style.width = `${p.clientX - bbox.x -8}px`;
    box.style.height = `${p.clientY - bbox.y -8}px`;
}


}

function test(e){
    t.innerHTML = `hey${e}`;

}