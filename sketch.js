// Pacita Abad's "Wheels of Fortune" - Enhanced Interactive Animation
// Individual Task: Mouse Interaction Animation - Third Iteration
// Group Tut 4 Group F - Individual Variation by Yixin Wu

// Color palettes for the artwork
let colorPalettes = [
  ["#8BC34A", "#81D4FA", "#F48FB1", "#CE93D8", "#FFCC80", "#AED581"],
  ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#FFB300"],
  ["#6A0572", "#AB83A1", "#3C91E6", "#342E37", "#FA824C", "#FF7043"],
  ["#2A9D8F", "#E9C46A", "#F4A261", "#E76F51", "#264653", "#FFD740"],
  ["#E63946", "#F1FAEE", "#A8DADC", "#457B9D", "#1D3557", "#FF9E00"]
];

// Animation and interaction variables
let circles = [];
let rotationAngle = 0;
let currentPaletteIndex = 0;
let isDragging = false;
let draggedCircle = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

// New features for third iteration
let zoomLevel = 1.0;
let lastClickTime = 0;
let pulsePhase = 0;

function setup() {
  // Create canvas and position it correctly
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container');
  
  angleMode(DEGREES);
  
  // Generate initial circles
  generateCircles();
}

function draw() {
  background("#1e2c3a");
  
  // Update pulse phase for global animation
  pulsePhase += 2;
  if (pulsePhase > 360) pulsePhase -= 360;
  
  // Apply zoom transformation
  push();
  translate(width/2, height/2);
  scale(zoomLevel);
  translate(-width/2, -height/2);
  
  // Update rotation based on mouse position
  rotationAngle += map(mouseX, 0, width, 0.3, 1.8);
  
  // Update dragged circle position
  if (isDragging && draggedCircle) {
    draggedCircle.x = mouseX + dragOffsetX;
    draggedCircle.y = mouseY + dragOffsetY;
  }
  
  // Draw all circles
  for (let circle of circles) {
    drawEnhancedCircle(circle);
  }
  
  pop(); // End zoom transformation
  
  // Draw UI elements (not affected by zoom)
  drawUI();
}

// Generate circle data with enhanced properties
function generateCircles() {
  circles = [];
  let circleCount = 10; // Slightly fewer circles for better visibility
  let placed = [];
  
  for (let i = 0; i < circleCount; i++) {
    let size = random(180, 320);
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
        isBeingDragged: false,
        patternType: floor(random(3)), // 0: standard, 1: spiral, 2: radial
        pulseOffset: random(360)
      });
      placed.push({ x, y, size });
    }
  }
}

// Draw enhanced circle with new visual effects
function drawEnhancedCircle(circle) {
  push();
  translate(circle.x, circle.y);
  
  // Calculate mouse influence
  let distanceToMouse = dist(mouseX, mouseY, circle.x, circle.y);
  let mouseInfluence = map(distanceToMouse, 0, 300, 1, 0, true);
  
  // Apply rotation animation
  let individualRotation = rotationAngle * circle.rotationSpeed + circle.rotationOffset;
  
  // Apply size animation based on mouse Y position
  let sizeVariation = map(mouseY, 0, height, 0.8, 1.2);
  let animatedSize = circle.baseSize * sizeVariation;
  
  // Apply pulse effect
  let pulse = sin(pulsePhase + circle.pulseOffset) * 0.1 + 1;
  animatedSize *= pulse;
  
  // Rotate based on mouse influence (only if not being dragged)
  if (!circle.isBeingDragged) {
    rotate(individualRotation * mouseInfluence);
  }
  
  // Enhanced background glow
  noStroke();
  fill(255, 255, 255, 30);
  ellipse(0, 0, animatedSize * 1.2);
  
  // Main circle
  let mainColor = color(circle.palette[0]);
  if (circle.isBeingDragged) {
    mainColor.setAlpha(180);
  } else {
    mainColor.setAlpha(200);
  }
  fill(mainColor);
  ellipse(0, 0, animatedSize);
  
  // Draw pattern based on pattern type
  switch(circle.patternType) {
    case 0:
      drawStandardPattern(animatedSize, circle.palette, individualRotation);
      break;
    case 1:
      drawSpiralPattern(animatedSize, circle.palette, individualRotation);
      break;
    case 2:
      drawRadialPattern(animatedSize, circle.palette, individualRotation);
      break;
  }
  
  // Enhanced orbital ring
  drawEnhancedOrbitalRing(animatedSize, circle.palette, individualRotation);
  
  // Wheel spokes
  stroke(255, 255, 255, 150);
  strokeWeight(1.5);
  let spokeLength = animatedSize * 0.4;
  for (let i = 0; i < 8; i++) {
    let angle = i * 45;
    let px = cos(angle) * spokeLength;
    let py = sin(angle) * spokeLength;
    line(0, 0, px, py);
  }
  
  // Enhanced center dots with pulse
  let centerPulse = sin(pulsePhase * 2) * 0.1 + 1;
  fill(250, 250, 250); // #FAFAFA
  stroke(255, 255, 255);
  strokeWeight(1.5);
  ellipse(0, 0, animatedSize * 0.12 * centerPulse);
  
  noStroke();
  fill(circle.palette[2]);
  ellipse(0, 0, animatedSize * 0.06 * centerPulse);
  
  // Highlight if being dragged
  if (circle.isBeingDragged) {
    stroke(255, 200);
    strokeWeight(2);
    noFill();
    ellipse(0, 0, animatedSize * 1.1);
  }
  
  pop();
}

// Draw standard pattern (original design)
function drawStandardPattern(size, palette, rotation) {
  // Scattered dots
  let scatterDots = 20;
  for (let i = 0; i < scatterDots; i++) {
    let angle = i * (360 / scatterDots) + rotation;
    let r = random(size * 0.1, size * 0.35);
    let px = cos(angle) * r;
    let py = sin(angle) * r;
    
    noStroke();
    fill(random(palette));
    ellipse(px, py, size * 0.04);
  }
  
  // Ring lines
  stroke(palette[1]);
  strokeWeight(2);
  noFill();
  for (let r = size * 0.55; r < size * 0.9; r += size * 0.08) {
    ellipse(0, 0, r);
  }
  
  // Inside dots
  stroke(255);
  strokeWeight(1.2);
  let insideDots = 12;
  for (let i = 0; i < insideDots; i++) {
    let angle = i * (360 / insideDots) + rotation * 1.2;
    let px = cos(angle) * (size * 0.35);
    let py = sin(angle) * (size * 0.35);
    
    fill(random(palette));
    ellipse(px, py, size * 0.08);
  }
}

// Draw spiral pattern
function drawSpiralPattern(size, palette, rotation) {
  noStroke();
  
  // Spiral dots
  let spiralTurns = 3;
  let spiralDots = 40;
  for (let i = 0; i < spiralDots; i++) {
    let progress = i / spiralDots;
    let angle = progress * 360 * spiralTurns + rotation;
    let radius = progress * size * 0.4;
    
    let px = cos(angle) * radius;
    let py = sin(angle) * radius;
    
    let dotSize = size * 0.05 * (1 - progress * 0.5);
    fill(palette[i % palette.length]);
    ellipse(px, py, dotSize);
  }
  
  // Concentric rings
  stroke(palette[3]);
  strokeWeight(1.5);
  noFill();
  for (let r = size * 0.5; r < size * 0.85; r += size * 0.1) {
    ellipse(0, 0, r);
  }
}

// Draw radial pattern
function drawRadialPattern(size, palette, rotation) {
  noStroke();
  
  // Radial lines of dots
  let radialLines = 12;
  let dotsPerLine = 6;
  
  for (let i = 0; i < radialLines; i++) {
    let angle = i * (360 / radialLines) + rotation;
    
    for (let j = 0; j < dotsPerLine; j++) {
      let progress = (j + 1) / (dotsPerLine + 1);
      let radius = progress * size * 0.4;
      
      let px = cos(angle) * radius;
      let py = sin(angle) * radius;
      
      let dotSize = size * 0.04 * (1 - progress * 0.3);
      fill(palette[(i + j) % palette.length]);
      ellipse(px, py, dotSize);
    }
  }
  
  // Outer ring
  stroke(palette[2]);
  strokeWeight(2);
  noFill();
  ellipse(0, 0, size * 0.8);
}

// Draw enhanced orbital ring
function drawEnhancedOrbitalRing(size, palette, rotation) {
  let dotCount = 8;
  let orbitRadius = size * 0.6;
  
  // Draw connecting dots with animation
  let connectingDots = dotCount * 4;
  for (let i = 0; i < connectingDots; i++) {
    let angle = i * (360 / connectingDots) + rotation * 2;
    let px = cos(angle) * orbitRadius;
    let py = sin(angle) * orbitRadius;
    
    noStroke();
    fill(random(palette));
    
    let dotSize = size * 0.03 * (sin(angle + pulsePhase) * 0.3 + 1);
    ellipse(px, py, dotSize);
  }
  
  // Draw main orbital dots with enhanced design
  for (let i = 0; i < dotCount; i++) {
    let angle = i * (360 / dotCount) + rotation;
    let px = cos(angle) * orbitRadius;
    let py = sin(angle) * orbitRadius;
    
    // Enhanced three-layer dot with pulse
    let pulse = sin(pulsePhase + i * 45) * 0.1 + 1;
    
    fill(255, 152, 0); // #FF9800
    ellipse(px, py, size * 0.07 * pulse);
    fill(0, 0, 0); // #000000
    ellipse(px, py, size * 0.05 * pulse);
    fill(255, 255, 255); // #FFFFFF
    ellipse(px, py, size * 0.03 * pulse);
  }
}

// Draw UI elements
function drawUI() {
  // Draw zoom level indicator
  if (zoomLevel !== 1.0) {
    fill(255);
    noStroke();
    textSize(14);
    textAlign(RIGHT);
    text("Zoom: " + nf(zoomLevel, 1, 1), width - 20, 30);
    textAlign(LEFT);
  }
}

// Mouse interaction
function mousePressed() {
  // Check for double click
  let currentTime = millis();
  if (currentTime - lastClickTime < 300) {
    // Double click detected - reset zoom
    zoomLevel = 1.0;
    lastClickTime = 0;
    return;
  }
  lastClickTime = currentTime;
  
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

// Mouse wheel for zoom
function mouseWheel(event) {
  // Adjust zoom level based on wheel movement
  zoomLevel += event.delta * 0.001;
  zoomLevel = constrain(zoomLevel, 0.5, 3.0);
  return false; // Prevent default scrolling
}

// Enhanced keyboard interaction
function keyPressed() {
  if (key === ' ') {
    generateCircles();
  } else if (key === 'c' || key === 'C') {
    // Change color palette
    currentPaletteIndex = (currentPaletteIndex + 1) % colorPalettes.length;
    for (let circle of circles) {
      circle.palette = colorPalettes[currentPaletteIndex];
    }
  } else if (key === 'r' || key === 'R') {
    // Randomize patterns
    for (let circle of circles) {
      circle.patternType = floor(random(3));
      circle.pulseOffset = random(360);
    }
  }
}

// Handle window resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}