// Pacita Abad's "Wheels of Fortune" - Simplified User Input Animation
// Individual Task: Mouse Interaction Animation
// Group Tut 4 Group F - Individual Variation by Yixin Wu

// Color palettes for the artwork
let colorPalettes = [
  ["#8BC34A", "#81D4FA", "#F48FB1", "#CE93D8", "#FFCC80", "#AED581"],
  ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#FFB300"],
  ["#6A0572", "#AB83A1", "#3C91E6", "#342E37", "#FA824C", "#FF7043"],
  ["#2A9D8F", "#E9C46A", "#F4A261", "#E76F51", "#264653", "#FFD740"]
];

// Animation variables
let circles = [];
let rotationAngle = 0;
let currentPaletteIndex = 0;
let isDragging = false;
let draggedCircle = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

function setup() {
  // Fix: Ensure canvas is created correctly
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container'); // Ensure canvas is in correct position
  
  angleMode(DEGREES);
  
  // Generate initial circles
  generateCircles();
}

function draw() {
  background("#1e2c3a");
  
  // Update rotation based on mouse position
  rotationAngle += map(mouseX, 0, width, 0.5, 2);
  
  // Update dragged circle position
  if (isDragging && draggedCircle) {
    draggedCircle.x = mouseX + dragOffsetX;
    draggedCircle.y = mouseY + dragOffsetY;
  }
  
  // Draw all circles
  for (let circle of circles) {
    drawAnimatedCircle(circle);
  }
}

// Generate circle data
function generateCircles() {
  circles = [];
  let circleCount = 12;
  let placed = [];
  
  for (let i = 0; i < circleCount; i++) {
    let size = random(150, 280);
    let margin = size * 0.7;
    let x, y;
    let ok = false;
    let tries = 0;
    
    // Find a position without too much overlap
    while (!ok && tries < 100) {
      x = random(margin, width - margin);
      y = random(margin, height - margin);
      ok = true;
      
      for (let c of placed) {
        let d = dist(x, y, c.x, c.y);
        let minDist = (size * 0.5 + c.size * 0.5) * 0.8;
        
        if (d < minDist) {
          ok = false;
          break;
        }
      }
      tries++;
    }
    
    if (ok) {
      circles.push({
        x: x,
        y: y,
        size: size,
        baseSize: size,
        rotationOffset: random(360),
        rotationSpeed: random(0.5, 1.5),
        palette: colorPalettes[currentPaletteIndex],
        isBeingDragged: false
      });
      placed.push({ x, y, size });
    }
  }
}

// Draw animated circle with mouse interaction
function drawAnimatedCircle(circle) {
  push();
  translate(circle.x, circle.y);
  
  // Calculate mouse influence
  let distanceToMouse = dist(mouseX, mouseY, circle.x, circle.y);
  let mouseInfluence = map(distanceToMouse, 0, 200, 1, 0, true);
  
  // Apply rotation animation
  let individualRotation = rotationAngle * circle.rotationSpeed + circle.rotationOffset;
  
  // Apply size animation based on mouse Y position
  let sizeVariation = map(mouseY, 0, height, 0.8, 1.2);
  let animatedSize = circle.baseSize * sizeVariation;
  
  // Rotate based on mouse influence (only if not being dragged)
  if (!circle.isBeingDragged) {
    rotate(individualRotation * mouseInfluence);
  }
  
  // Background glow
  noStroke();
  fill(255, 255, 255, 30);
  ellipse(0, 0, animatedSize * 1.15);
  
  // Main circle
  let mainColor = color(circle.palette[0]);
  if (circle.isBeingDragged) {
    mainColor.setAlpha(180);
  } else {
    mainColor.setAlpha(200);
  }
  fill(mainColor);
  ellipse(0, 0, animatedSize);
  
  // Scattered dots
  let scatterDots = 20;
  for (let i = 0; i < scatterDots; i++) {
    let angle = i * (360 / scatterDots) + individualRotation;
    let r = random(animatedSize * 0.1, animatedSize * 0.35);
    let px = cos(angle) * r;
    let py = sin(angle) * r;
    
    noStroke();
    fill(random(circle.palette));
    ellipse(px, py, animatedSize * 0.04);
  }
  
  // Ring lines
  stroke(circle.palette[1]);
  strokeWeight(2);
  noFill();
  for (let r = animatedSize * 0.55; r < animatedSize * 0.9; r += animatedSize * 0.08) {
    ellipse(0, 0, r);
  }
  
  // Inside dots
  stroke(255);
  strokeWeight(1.2);
  let insideDots = 12;
  for (let i = 0; i < insideDots; i++) {
    let angle = i * (360 / insideDots) + individualRotation * 1.2;
    let px = cos(angle) * (animatedSize * 0.35);
    let py = sin(angle) * (animatedSize * 0.35);
    
    fill(random(circle.palette));
    ellipse(px, py, animatedSize * 0.08);
  }
  
  // Orbital ring
  drawOrbitalRing(animatedSize, circle.palette, individualRotation);
  
  // Wheel spokes
  stroke("#FFFFFF");
  strokeWeight(1.5);
  let spokeLength = animatedSize * 0.4;
  for (let i = 0; i < 8; i++) {
    let angle = i * 45;
    let px = cos(angle) * spokeLength;
    let py = sin(angle) * spokeLength;
    line(0, 0, px, py);
  }
  
  // Center dots
  fill("#FAFAFA");
  stroke("#FFFFFF");
  strokeWeight(1.5);
  ellipse(0, 0, animatedSize * 0.12);
  
  noStroke();
  fill(circle.palette[2]);
  ellipse(0, 0, animatedSize * 0.06);
  
  // Highlight if being dragged
  if (circle.isBeingDragged) {
    stroke(255, 200);
    strokeWeight(2);
    noFill();
    ellipse(0, 0, animatedSize * 1.1);
  }
  
  pop();
}

// Draw orbital ring
function drawOrbitalRing(size, palette, rotation) {
  let dotCount = 8;
  let orbitRadius = size * 0.6;
  
  // Draw connecting dots
  let connectingDots = dotCount * 4;
  for (let i = 0; i < connectingDots; i++) {
    let angle = i * (360 / connectingDots) + rotation;
    let px = cos(angle) * orbitRadius;
    let py = sin(angle) * orbitRadius;
    
    noStroke();
    fill(random(palette));
    ellipse(px, py, size * 0.03);
  }
  
  // Draw main orbital dots
  for (let i = 0; i < dotCount; i++) {
    let angle = i * (360 / dotCount) + rotation;
    let px = cos(angle) * orbitRadius;
    let py = sin(angle) * orbitRadius;
    
    // Three-layer dot
    fill("#FF9800");
    ellipse(px, py, size * 0.07);
    fill("#000000");
    ellipse(px, py, size * 0.05);
    fill("#FFFFFF");
    ellipse(px, py, size * 0.03);
  }
}

// Mouse interaction
function mousePressed() {
  // Check if clicking on a circle
  for (let circle of circles) {
    let distance = dist(mouseX, mouseY, circle.x, circle.y);
    if (distance < circle.size / 2) {
      isDragging = true;
      draggedCircle = circle;
      dragOffsetX = circle.x - mouseX;
      dragOffsetY = circle.y - mouseY;
      circle.isBeingDragged = true;
      return; // Stop checking after finding the first circle
    }
  }
}

function mouseReleased() {
  if (isDragging && draggedCircle) {
    draggedCircle.isBeingDragged = false;
  }
  isDragging = false;
  draggedCircle = null;
}

// Keyboard interaction
function keyPressed() {
  if (key === ' ') {
    generateCircles();
  } else if (key === 'c' || key === 'C') {
    // Change color palette
    currentPaletteIndex = (currentPaletteIndex + 1) % colorPalettes.length;
    for (let circle of circles) {
      circle.palette = colorPalettes[currentPaletteIndex];
    }
  }
}

// Handle window resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}