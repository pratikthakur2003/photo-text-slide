# Photo Text Swipe

An interactive web application that allows users to create beautiful photo galleries with customizable text overlays. Built with vanilla JavaScript and Swiper.js for smooth sliding transitions.

## Features

### Image Slider
- Smooth swipeable interface using Swiper.js
- Navigation buttons and pagination dots
- Support for both touch and mouse interactions
- Optimized for portrait images (9:16 ratio)

### Text Overlay
- Add custom text to any image
- Drag and drop text positioning
- Text stays within image boundaries
- Double-click to edit text content

### Text Customization
- Font family selection
- Font size adjustment
- Color picker
- Text styling options:
  - Bold
  - Italic
  - Underline
- Delete text functionality

### User Interface
- Clean and modern design
- Responsive layout
- Intuitive controls
- Visual feedback for interactions

## Technologies Used
- HTML5
- CSS3
- Vanilla JavaScript
- [Swiper.js](https://swiperjs.com/) - Modern touch slider
- [Font Awesome](https://fontawesome.com/) - Icons
- [Google Fonts](https://fonts.google.com/) - Roboto font

## Project Structure
```
photo-text-swipe/
├── index.html      # Main HTML file
├── styles.css      # Styling
├── script.js       # JavaScript functionality
└── README.md       # Documentation
```

## How to Use

1. **Adding Text**
   - Click the "Add Text" button
   - Double-click the text to edit its content
   - Drag the text to position it on the image

2. **Styling Text**
   - Select text by clicking on it
   - Use the control panel to:
     - Change font family
     - Adjust font size
     - Pick text color
     - Toggle bold/italic/underline
     - Delete text

3. **Navigating Images**
   - Swipe left/right on touch devices
   - Use navigation arrows
   - Click pagination dots
   - Drag images for manual control

## Setup
1. Clone the repository
2. Open `index.html` in a modern web browser
3. No build process required - it works out of the box

## Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Modern mobile browsers

## Dependencies
```html
<!-- Swiper.js -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>

<!-- Font Awesome -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
```
