import '@/styles/index.scss';
import Base from '@/js/components/Base';

// Test import of a JavaScript module
// import { example } from '@/js/example';

// Test import of an asset
// import webpackLogo from '@/images/webpack-logo.svg';

// Appending to the DOM
// const logo = document.createElement('img');
// logo.src = webpackLogo;

// const heading = document.createElement('h1');
// heading.textContent = example();
// heading.textContent = txt;

// Test a background image url in CSS
// const imageBackground = document.createElement('div');
// imageBackground.classList.add('image');

// Test a public folder asset
// const imagePublic = document.createElement('img');
// imagePublic.src = '/assets/example.png';

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('root');
    new Base(app);
});
