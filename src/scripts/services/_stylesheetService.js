/**
 * Register a stylesheet using the modern adoptedStyleSheets API
 * @param {string} style - CSS string to register
 */
export function registerStylesheet(style) {
  // Create an empty "constructed" stylesheet
  const sheet = new CSSStyleSheet();
  // Apply the CSS rules to the sheet
  sheet.replaceSync(style);
  // Apply the stylesheet to the document
  document.adoptedStyleSheets.push(sheet);
}

export default registerStylesheet;
