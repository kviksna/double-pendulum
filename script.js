const canvas = document.getElementById('pendulumCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Double pendulum parameters
let originX = canvas.width / 2;
let originY = canvas.height / 3;
let length1 = 220, length2 = 220;
let mass1 = 10, mass2 = 30;
let angle1 = Math.PI / 2, angle2 = Math.PI / 2;
let angle1V = 0, angle2V = 0;
let g = 1.05;

let tracePath = [];

function applyParams() {
    length1 = parseFloat(document.getElementById('length1').value);
    length2 = parseFloat(document.getElementById('length2').value);
    mass1 = parseFloat(document.getElementById('mass1').value);
    mass2 = parseFloat(document.getElementById('mass2').value);
    angle1 = parseFloat(document.getElementById('angle1').value) * Math.PI / 180;
    angle2 = parseFloat(document.getElementById('angle2').value) * Math.PI / 180;
    g = parseFloat(document.getElementById('gravity').value);
    angle1V = 0; angle2V = 0;
    tracePath = [];
}
window.onload = function() {
    applyParams();
};

// Draw fading path
function drawTrace() {
    for (let i = 0; i < tracePath.length - 1; i++) {
        let opacity = i / tracePath.length;
        ctx.strokeStyle = `rgba(0,255,255,${opacity*0.7})`;
        ctx.beginPath();
        ctx.moveTo(tracePath[i][0], tracePath[i][1]);
        ctx.lineTo(tracePath[i+1][0], tracePath[i+1][1]);
        ctx.stroke();
    }
}

// Main simulation
function draw() {
    // Physics equations for double pendulum
    let num1 = -g * (2 * mass1 + mass2) * Math.sin(angle1);
    let num2 = -mass2 * g * Math.sin(angle1 - 2 * angle2);
    let num3 = -2 * Math.sin(angle1 - angle2) * mass2;
    let num4 = angle2V * angle2V * length2 + angle1V * angle1V * length1 * Math.cos(angle1 - angle2);
    let den = length1 * (2 * mass1 + mass2 - mass2 * Math.cos(2 * angle1 - 2 * angle2));
    let angle1A = (num1 + num2 + num3 * num4) / den;

    num1 = 2 * Math.sin(angle1 - angle2);
    num2 = angle1V * angle1V * length1 * (mass1 + mass2);
    num3 = g * (mass1 + mass2) * Math.cos(angle1);
    num4 = angle2V * angle2V * length2 * mass2 * Math.cos(angle1 - angle2);
    den = length2 * (2 * mass1 + mass2 - mass2 * Math.cos(2 * angle1 - 2 * angle2));
    let angle2A = (num1 * (num2 + num3 + num4)) / den;

    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#121212';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;

    drawTrace();

    // Calculate positions
    let x1 = originX + length1 * Math.sin(angle1);
    let y1 = originY + length1 * Math.cos(angle1);
    let x2 = x1 + length2 * Math.sin(angle2);
    let y2 = y1 + length2 * Math.cos(angle2);

    // Draw arms
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Draw masses
    ctx.fillStyle = '#00ffff';
    ctx.beginPath();
    ctx.arc(x1, y1, mass1, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x2, y2, mass2, 0, 2 * Math.PI);
    ctx.fill();

    // Store trace
    tracePath.push([x2, y2]);
    if(tracePath.length > 400) tracePath.shift();

    // Update physics
    angle1V += angle1A;
    angle2V += angle2A;
    angle1 += angle1V;
    angle2 += angle2V;
    angle1V *= 0.995; // damping
    angle2V *= 0.995;

    requestAnimationFrame(draw);
}

draw();
