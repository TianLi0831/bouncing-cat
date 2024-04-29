const canvas = document.getElementById('catCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let cats = [];
let selectedCat = null; // Variable to track the selected cat
let offsetX = 0; // Offset between mouse and cat position X
let offsetY = 0; // Offset between mouse and cat position Y

class Cat {
  constructor(x, y, dy, image, scale, gravity, friction) {
    this.x = x;
    this.y = y;
    this.dy = dy;
    this.image = image;
    this.scale = scale;
    this.width = image.width * scale;
    this.height = image.height * scale;
    this.angle = 0;  // Initial rotation angle
    this.rotationSpeed = (Math.random() - 0.5) * 0.1;  // Random rotation speed
    this.rotating = true;  // Flag to control rotation
    this.gravity = gravity;  // Individual gravity for each cat
    this.friction = friction;  // Individual friction for each cat
  }

  draw() {
    ctx.save();  // Save the current context state
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);  // Move to the center of the image
    ctx.rotate(this.angle);  // Rotate the canvas
    ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);  // Draw the image centered
    ctx.restore();  // Restore the original state
  }
update() {
    if (this === selectedCat) {
        // If this cat is selected, do not update its position
        return;
    }

    if (this.y + this.height + this.dy > canvas.height) {
        this.dy = -this.dy * this.friction;
    } else {
        this.dy += this.gravity;
    }
    this.y += this.dy;

    // Always update the rotation angle
    this.angle += this.rotationSpeed;

    this.draw();
}
  // update() {
  //   if (this === selectedCat) {
  //     // If this cat is selected, do not update its position
  //     return;
  //   }

  //   if (this.y + this.height + this.dy > canvas.height) {
  //     this.dy = -this.dy * this.friction;
  //     this.rotating = false;  // Stop rotating when the cat hits the ground
  //   } else {
  //     this.dy += this.gravity;
  //   }
  //   this.y += this.dy;

  //   // Update the rotation angle only if rotating is true
  //   if (this.rotating) {
  //     this.angle += this.rotationSpeed;
  //   }
  // }
}

function loadCatImages() {
  const images = ['cat1.png', 'cat2.png', 'cat3.png','cat4.png','cat5.png','cat6.png']; // paths to cat images
  const scaleFactors = [0.75, 0.8, 0.6,0.6,0.8,0.9]; // Different scale factors for each cat
  const gravities = [0.5, 0.5, 0.3,0.3,0.6,0.55];  // Different gravity values for each cat
  const frictions = [0.95, 1, 1,1,1,0.9];  // Different friction values for each cat

  images.forEach((src, index) => {
    const img = new Image();
    img.onload = () => {
      cats.push(new Cat(Math.random() * (canvas.width - img.width * scaleFactors[index]), Math.random() * (canvas.height - img.height * scaleFactors[index]), 2, img, scaleFactors[index], gravities[index], frictions[index]));
    };
    img.src = src;
  });
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  cats.forEach(cat => {
    cat.update();
    cat.draw(); // Draw each cat separately
  });
}

loadCatImages();
animate();

// Event listeners for mouse down, mouse move, and mouse up events
canvas.addEventListener('mousedown', function(event) {
  const mouseX = event.clientX - canvas.getBoundingClientRect().left;
  const mouseY = event.clientY - canvas.getBoundingClientRect().top;

  // Check if mouse is inside any cat
  cats.forEach(cat => {
    if (mouseX >= cat.x && mouseX <= cat.x + cat.width && mouseY >= cat.y && mouseY <= cat.y + cat.height) {
      selectedCat = cat; // Set the selected cat
      offsetX = mouseX - cat.x;
      offsetY = mouseY - cat.y;
    }
  });
});

canvas.addEventListener('mousemove', function(event) {
  if (selectedCat) {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;

    selectedCat.x = mouseX - offsetX;
    selectedCat.y = mouseY - offsetY;
  }
});

canvas.addEventListener('mouseup', function(event) {
  selectedCat = null; // Release the selected cat
});