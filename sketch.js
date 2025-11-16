// Pacita Abad's "Wheels of Fortune" Recreation - User Input Animation Version 1
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
let mouseInfluenceRadius = 300;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  
  // Generate initial circles
  generateCircles();
}

function draw() {
  background("#1e2c3a");
  
  // Update rotation angle based on mouse X position
  // Mouse at left edge: slow rotation, right edge: fast rotation
  rotationAngle += map(mouseX, 0, width, 0.5, 3);
  
  // Draw all circles with animation
  for (let circle of circles) {
    drawAnimatedCircle(circle);
  }
  
  // Display interaction instructions
  displayInstructions();
}

// Generate circle data
function generateCircles() {
  circles = [];
  let circleCount = 15;
  let placed = [];
  
  for (let i = 0; i < circleCount; i++) {
    let size = random(180, 320);
    let margin = size * 0.7;
    let x, y;
    let ok = false;
    let tries = 0;
    
    while (!ok && tries < 200) {
      x = random(margin, width - margin);
      y = random(margin, height - margin);
      ok = true;
      
      for (let c of placed) {
        let d = dist(x, y, c.x, c.y);
        let minDist = (size * 0.5 + c.size * 0.5) * 0.9;
        
        if (d < minDist) {
          ok = false;
          break;
        }
      }
      tries++;
    }
    
    if (ok) {
      // Store circle data with additional properties for animation
      circles.push({
        x: x,
        y: y,
        size: size,
        baseSize: size, // Store original size for reference
        rotationOffset: random(360), // Each circle rotates at different starting point
        rotationSpeed: random(0.8, 1.2), // Each circle rotates at different speed
        palette: colorPalettes[currentPaletteIndex]
      });
      placed.push({ x, y, size });
    }
  }
}

// Draw animated circle with mouse interaction
function drawAnimatedCircle(circleData) {
  push();
  translate(circleData.x, circleData.y);
  
  // Calculate mouse influence on this circle
  let distanceToMouse = dist(mouseX, mouseY, circleData.x, circleData.y);
  let mouseInfluence = map(distanceToMouse, 0, mouseInfluenceRadius, 1, 0, true);
  
  // Apply rotation animation
  let individualRotation = rotationAngle * circleData.rotationSpeed + circleData.rotationOffset;
  
  // Apply size animation based on mouse Y position and proximity
  let sizeVariation = map(mouseY, 0, height, 0.7, 1.3);
  let mouseSizeEffect = map(mouseInfluence, 0, 1, 1.2, 1);
  let animatedSize = circleData.baseSize * sizeVariation * mouseSizeEffect;
  
  // Rotate the entire circle based on mouse position
  rotate(individualRotation * mouseInfluence);
  
  // Background glow with mouse influence
  noStroke();
  fill(255, 255, 255, 35 * mouseInfluence);
  ellipse(0, 0, animatedSize * 1.18);
  
  // Main circle - color intensity changes with mouse proximity
  let mainColor = color(circleData.palette[0]);
  if (mouseInfluence > 0.5) {
    mainColor.setAlpha(200);
  } else {
    mainColor.setAlpha(150);
  }
  fill(mainColor);
  ellipse(0, 0, animatedSize);
  
  // Animated scattered dots - move around based on rotation
  let scatterDots = 30;
  for (let i = 0; i < scatterDots; i++) {
    let baseAngle = i * (360 / scatterDots) + individualRotation * 2;
    let r = random(animatedSize * 0.05, animatedSize * 0.40);
    let px = cos(baseAngle) * r;
    let py = sin(baseAngle) * r;
    
    noStroke();
    let dotColor = color(random(circleData.palette));
    dotColor.setAlpha(200 * mouseInfluence);
    fill(dotColor);
    ellipse(px, py, animatedSize * 0.035);
  }
  
  // Animated ring lines - pulse with mouse proximity
  stroke(circleData.palette[1]);
  strokeWeight(2 * mouseInfluence);
  noFill();
  
  let ringPulse = sin(frameCount * 0.1) * 0.1 + 1; // Gentle pulsing effect
  for (let r = animatedSize * 0.55; r < animatedSize * 0.92; r += animatedSize * 0.07) {
    ellipse(0, 0, r * ringPulse);
  }
  
  // Animated inside dots - orbit around center
  stroke(255, 255 * mouseInfluence);
  strokeWeight(1.4);
  let insideDots = 16;
  for (let i = 0; i < insideDots; i++) {
    let orbitAngle = i * (360 / insideDots) + individualRotation * 1.5;
    let px = cos(orbitAngle) * (animatedSize * 0.38);
    let py = sin(orbitAngle) * (animatedSize * 0.38);
    
    fill(random(circleData.palette));
    ellipse(px, py, animatedSize * 0.09);
  }
  
  // Enhanced orbital ring with animation
  drawAnimatedOrbitalRing(animatedSize, circleData.palette, individualRotation, mouseInfluence);
  
  // Animated wheel spokes - change length based on mouse Y
  stroke("#FFFFFF");
  strokeWeight(2 * mouseInfluence);
  let spokeLength = animatedSize * 0.43 * map(mouseY, 0, height, 0.8, 1.2);
  for (let i = 0; i < 8; i++) {
    let angle = i * 45 + individualRotation * 0.5;
    let px = cos(angle) * spokeLength;
    let py = sin(angle) * spokeLength;
    line(0, 0, px, py);
  }
  
  // Center dots with pulsing effect
  let centerPulse = sin(frameCount * 0.2) * 0.1 + 1;
  fill("#FAFAFA");
  stroke("#FFFFFF");
  strokeWeight(2);
  ellipse(0, 0, animatedSize * 0.15 * centerPulse);
  
  noStroke();
  fill(circleData.palette[2]);
  ellipse(0, 0, animatedSize * 0.07 * centerPulse);
  
  pop();
}

// Draw animated orbital ring
function drawAnimatedOrbitalRing(size, palette, rotation, influence) {
  let outerDotCount = 8;
  let orbitRadius = size * 0.65;
  
  // Draw connecting orbit with animation
  drawAnimatedConnectingOrbit(orbitRadius, size, palette, outerDotCount, rotation, influence);
  
  // Draw concentric dots with orbital motion
  for (let i = 0; i < outerDotCount; i++) {
    let baseAngle = i * (360 / outerDotCount) + rotation;
    let px = cos(baseAngle) * orbitRadius;
    let py = sin(baseAngle) * orbitRadius;
    
    // Animated concentric dot
    drawAnimatedConcentricDot(px, py, size * 0.08, rotation, influence);
  }
}

// Draw animated connecting orbit
function drawAnimatedConnectingOrbit(orbitRadius, size, palette, dotCount, rotation, influence) {
  let dotsPerSegment = 6;
  let totalConnectingDots = dotCount * dotsPerSegment;
  
  for (let i = 0; i < totalConnectingDots; i++) {
    let baseAngle = i * (360 / totalConnectingDots) + rotation * 2;
    let px = cos(baseAngle) * orbitRadius;
    let py = sin(baseAngle) * orbitRadius;
    
    let dotSize = map(sin(baseAngle + frameCount * 0.2), -1, 1, size * 0.015, size * 0.04);
    let dotColor = color(random(palette));
    dotColor.setAlpha(255 * influence);
    
    noStroke();
    fill(dotColor);
    ellipse(px, py, dotSize);
    
    // Animated satellite dots
    if (random() > 0.7) {
      let satelliteAngle = baseAngle * 2 + frameCount * 0.3;
      let satelliteOffset = size * 0.03;
      let satelliteX = px + cos(satelliteAngle) * satelliteOffset;
      let satelliteY = py + sin(satelliteAngle) * satelliteOffset;
      
      let satelliteSize = dotSize * 0.6;
      let satelliteColor = color(random(palette));
      satelliteColor.setAlpha(150 * influence);
      
      fill(satelliteColor);
      ellipse(satelliteX, satelliteY, satelliteSize);
    }
  }
}

// Draw animated concentric dot
function drawAnimatedConcentricDot(x, y, baseSize, rotation, influence) {
  push();
  translate(x, y);
  
  // Rotate each dot individually
  rotate(rotation * 3);
  
  // Pulsing effect
  let pulse = sin(frameCount * 0.3) * 0.2 + 1;
  let animatedSize = baseSize * pulse * influence;
  
  // Outer orange ring
  fill("#FF9800");
  noStroke();
  ellipse(0, 0, animatedSize);
  
  // Middle black ring
  fill("#000000");
  ellipse(0, 0, animatedSize * 0.7);
  
  // Center white dot
  fill("#FFFFFF");
  ellipse(0, 0, animatedSize * 0.4);
  
  pop();
}

// Display interaction instructions
function displayInstructions() {
  fill(255);
  noStroke();
  textSize(14);
  text("Move mouse: Control rotation speed and circle size", 20, 30);
  text("Mouse position: Circles react to proximity", 20, 50);
  text("Click: Change color theme", 20, 70);
  text("Press SPACE: Regenerate artwork", 20, 90);
}

// Mouse click to change color palette
function mousePressed() {
  currentPaletteIndex = (currentPaletteIndex + 1) % colorPalettes.length;
  
  // Update all circles with new palette
  for (let circle of circles) {
    circle.palette = colorPalettes[currentPaletteIndex];
  }
}

// Keyboard interaction - press space to regenerate artwork
function keyPressed() {
  if (key === ' ') {
    generateCircles();
  }
}

// Handle window resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generateCircles(); // Regenerate circles to fit new window size
}