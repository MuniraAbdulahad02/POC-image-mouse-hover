import './style.css'
import gsap from "gsap";

// Code used of Stan from Kraftwerk Visual Workshop (image mouse hover)

class Application {
  constructor() {
    // Initialize mouse and position coordinates
    this.mouse = { x: 0, y: 0 };
    this.position = { x: 0, y: 0 };

    // Select all project elements and image elements
    this.$projects = [...document.querySelectorAll("[data-select='pf-text']")];
    this.$images = [...document.querySelectorAll("[data-select='pf-image']")];

    // Set the initial scale of images to 0 (hidden)
    gsap.set(this.$images, { scale: 0 });

    // Add event listeners for each project element
    this.$projects.forEach(($project) => {
      const id = $project.dataset.id;
      // Handle mouse enter event
      $project.addEventListener("mouseenter", () => this.handleProjectEnter(id));
      // Handle mouse leave event
      $project.addEventListener("mouseleave", this.handleProjectLeave);
    });

    // Add event listener for mouse move on the window
    window.addEventListener("mousemove", this.handleMouseMove);

    // Add the tick function to the GSAP ticker (animation loop)
    gsap.ticker.add(this.handleTick);
  }

  // Handle project mouse enter event
  handleProjectEnter = (id) => {
    // Find the corresponding image by data-id
    this.image = this.$images.find((image) => image.dataset.id === id);

    // Wait for the image to load to ensure correct dimensions
    if (this.image.complete) {
      this.updateImagePosition();
    } else {
      this.image.addEventListener('load', this.updateImagePosition);
    }

    // Animate the image to scale 1 (visible)
    gsap.to(this.image, { scale: 1.0, ease: "sine.out" });
  };

  // Handle project mouse leave event
  handleProjectLeave = () => {
    // Animate all images to scale 0 (hidden)
    gsap.to(this.$images, { scale: 0.0, ease: "sine.out" });
  };

  // Update the image position to center it on the mouse
  updateImagePosition = () => {
    this.position.x = this.mouse.x - (this.image.width / 2);
    this.position.y = this.mouse.y - (this.image.height / 2);
    gsap.set(this.image, { x: this.position.x, y: this.position.y });
  };

  // Handle the animation frame updates
  handleTick = () => {
    // Interpolate the position towards the mouse position for smooth movement
    if (this.image) {
      this.position.x = gsap.utils.interpolate(this.position.x, this.mouse.x - (this.image.width / 2), 0.075);
      this.position.y = gsap.utils.interpolate(this.position.y, this.mouse.y - (this.image.height / 2), 0.075);

      // Update the image position
      gsap.set(this.image, { x: this.position.x, y: this.position.y });
    }
  };

  // Handle mouse move event
  handleMouseMove = (event) => {
    // Update mouse coordinates with the current mouse position
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;
  };
}

// Instantiate the Application class to run the code
new Application();