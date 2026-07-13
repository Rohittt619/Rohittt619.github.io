# Rohit Rathod - Premium Interactive Portfolio

A high-performance, visually rich portfolio website built from scratch using HTML5, Vanilla CSS3, and modern JavaScript. Designed with state-of-the-art aesthetics (glassmorphism, glowing grids, and clean dark mode) and smooth micro-animations.

## Features Built
1. **Interactive 3D Skills Sphere (Tag Cloud)**: A custom canvas-rendered 3D sphere that rotates in response to mouse movement and clicks. Showcases your full technical stack.
2. **3D Card Hover/Tilt Effect**: Project cards that rotate dynamically in 3D space tracking the movement of the cursor.
3. **Typing Headline Rotator**: Smooth text typing and deleting effect in the Hero section rotating through your core strengths.
4. **Live Analytics Sandbox**: An interactive mini-dashboard featuring SVG charts (bar charts, line trendlines, and horizontal bars) that update and animate dynamically when toggling between Sales Performance and Customer Churn datasets.
5. **Interactive Milestones**: Custom Vertical Timeline for internship experiences and sections for certifications.
6. **Background Particle Net**: An animated particle system floating in the background, creating a premium depth effect.

---

## How to Run Locally

You do not need any frameworks or command-line compilation to run this. It runs natively in any modern web browser.

### Option 1: Double Click
Simply open [index.html](index.html) in your file explorer and double-click it to open it in your default web browser (Chrome, Edge, Firefox).

### Option 2: Local HTTP Server (Recommended)
If you want to run it on a local dev server:
* **Using VS Code**: Install the **Live Server** extension, open the portfolio folder, and click "Go Live" at the bottom right.
* **Using Python** (if installed):
  ```bash
  python -m http.server 8000
  ```
  Then open `http://localhost:8000` in your browser.
* **Using Node.js**:
  ```bash
  npx live-server
  ```

---

## How to Deploy to GitHub Pages (Free Hosting)

Since your GitHub username is `rrathod1101`, you can host this portfolio online for free on GitHub Pages at `https://rrathod1101.github.io` by following these steps:

1. **Create a GitHub Repository**:
   * Log in to GitHub.
   * Create a new repository named `rrathod1101.github.io` (replace `rrathod1101` with your exact GitHub username if different). *Note: The repository name must end in `.github.io` to set it as your main website.*
2. **Push the Files**:
   * Initialize a git repository in this portfolio directory:
     ```bash
     git init
     git add .
     git commit -m "Initial commit of portfolio website"
     ```
   * Link it to your GitHub repository and push:
     ```bash
     git remote add origin https://github.com/rrathod1101/rrathod1101.github.io.git
     git branch -M main
     git push -u origin main
     ```
3. **Access Your Live Portfolio**:
   * Within 1-2 minutes, GitHub will automatically build and publish your site.
   * You can access it live at: `https://rrathod1101.github.io`
