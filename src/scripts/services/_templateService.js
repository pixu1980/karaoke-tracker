/**
 * Escape HTML special characters to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
export function escapeHtml(text) {
  if (text == null) return '';
  const str = String(text);
  const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return str.replace(/[&<>"']/g, char => htmlEscapes[char]);
}

/**
 * Process <for each="[index, ]item in items">...</for> loops
 */
function processForLoops(template, data) {
  const forRegex = /<for\s+each="(?:(\w+),\s*)?(\w+)\s+in\s+(\w+)">([\s\S]*?)<\/for>/g;

  return template.replace(forRegex, (_match, indexVar, itemVar, arrayKey, content) => {
    const array = data[arrayKey];

    if (!Array.isArray(array)) {
      return '';
    }

    return array
      .map((item, index) => {
        const loopData = {
          ...data,
          [itemVar]: item
        };

        if (indexVar) {
          loopData[indexVar] = index;
        }

        // Recursively process nested templates
        return pixEngine(content, loopData);
      })
      .join('');
  });
}

/**
 * Process <if condition="...">...</if>[<else>...</else>] blocks
 */
function processConditionals(template, data) {
  // Process if/else blocks: <if condition="...">...</if><else>...</else>
  const ifElseRegex = /<if\s+condition="([^"]+)">([\s\S]*?)<\/if>\s*<else>([\s\S]*?)<\/else>/g;

  let result = template.replace(ifElseRegex, (_match, condition, ifContent, elseContent) => {
    const conditionResult = evaluateCondition(condition, data);
    const content = conditionResult ? ifContent : elseContent;
    return pixEngine(content, data);
  });

  // Process standalone if blocks: <if condition="...">...</if>
  const ifRegex = /<if\s+condition="([^"]+)">([\s\S]*?)<\/if>/g;

  result = result.replace(ifRegex, (_match, condition, content) => {
    const conditionResult = evaluateCondition(condition, data);
    return conditionResult ? pixEngine(content, data) : '';
  });

  return result;
}

/**
 * Evaluate a condition expression against the data context
 */
function evaluateCondition(condition, data) {
  // Handle simple truthy check (single variable or dot notation)
  if (/^[\w.]+$/.test(condition.trim())) {
    return Boolean(getNestedValue(condition.trim(), data));
  }

  // Handle negation: !variable or !object.property
  if (/^![\w.]+$/.test(condition.trim())) {
    const varName = condition.trim().slice(1);
    return !getNestedValue(varName, data);
  }

  // Handle comparison operators: ==, !=, ===, !==, <, >, <=, >=
  const comparisonMatch = condition.match(/^([\w.]+)\s*(===?|!==?|<=?|>=?)\s*(.+)$/);
  if (comparisonMatch) {
    const [, leftVar, operator, rightValue] = comparisonMatch;
    const left = getNestedValue(leftVar, data);
    const right = parseValue(rightValue.trim(), data);

    switch (operator) {
      case '==':
        // biome-ignore lint/suspicious/noDoubleEquals: intentional loose equality for template expressions
        return left == right;
      case '===':
        return left === right;
      case '!=':
        // biome-ignore lint/suspicious/noDoubleEquals: intentional loose inequality for template expressions
        return left != right;
      case '!==':
        return left !== right;
      case '<':
        return left < right;
      case '>':
        return left > right;
      case '<=':
        return left <= right;
      case '>=':
        return left >= right;
      default:
        return false;
    }
  }

  // Handle logical AND: var1 && var2
  if (condition.includes('&&')) {
    const parts = condition.split('&&').map(p => p.trim());
    return parts.every(part => evaluateCondition(part, data));
  }

  // Handle logical OR: var1 || var2
  if (condition.includes('||')) {
    const parts = condition.split('||').map(p => p.trim());
    return parts.some(part => evaluateCondition(part, data));
  }

  // Fallback: treat as variable lookup
  return Boolean(getNestedValue(condition.trim(), data));
}

/**
 * Get a nested value from an object using dot notation
 * e.g., getNestedValue('singer.name', data) returns data.singer.name
 */
function getNestedValue(path, data) {
  const parts = path.split('.');
  let value = data;

  for (const part of parts) {
    if (value == null) return undefined;
    value = value[part];
  }

  return value;
}

/**
 * Parse a value from the condition (string literal, number, or variable reference)
 */
function parseValue(value, data) {
  // String literal (single or double quotes)
  if (/^['"].*['"]$/.test(value)) {
    return value.slice(1, -1);
  }

  // Number
  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return parseFloat(value);
  }

  // Boolean literals
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null') return null;
  if (value === 'undefined') return undefined;

  // Variable reference (supports dot notation)
  return getNestedValue(value, data);
}

/**
 * Process {{{raw}}} and {{escaped}} expressions
 * - {{{expression}}} - Raw/unescaped output
 * - {{expression}} - HTML-escaped output (safe)
 */
function processExpressions(template, data) {
  // First, process raw/unescaped expressions: {{{...}}}
  let result = template.replace(/\{\{\{([^}]+)\}\}\}/g, (_match, expression) => {
    const trimmed = expression.trim();
    const value = getNestedValue(trimmed, data);
    return value !== undefined ? String(value) : '';
  });

  // Then, process escaped expressions: {{...}}
  result = result.replace(/\{\{([^}]+)\}\}/g, (match, expression) => {
    const trimmed = expression.trim();

    // Check for ternary expression: condition ? 'trueValue' : 'falseValue'
    const ternaryMatch = trimmed.match(/^(.+?)\s*\?\s*(['"]?)([^'"]*)\2\s*:\s*(['"]?)([^'"]*)\4$/);
    if (ternaryMatch) {
      const [, condition, , trueValue, , falseValue] = ternaryMatch;
      const conditionResult = evaluateCondition(condition.trim(), data);
      return conditionResult ? trueValue : falseValue;
    }

    // Simple variable or dot notation - escape HTML
    const value = getNestedValue(trimmed, data);
    return value !== undefined ? escapeHtml(value) : match;
  });

  return result;
}

/**
 * Simple template engine for rendering HTML templates
 *
 * Features:
 * - {{placeholder}} - Variable interpolation (auto-escaped)
 * - {{{placeholder}}} - Raw/unescaped variable interpolation
 * - {{object.property}} - Dot notation access
 * - {{condition ? 'trueValue' : 'falseValue'}} - Inline ternary expressions
 * - <for each="index, item in items">...</for> - Loop iteration
 * - <if condition="expression">...</if> - Conditional rendering
 * - <if condition="expression">...</if><else>...</else> - If/else blocks
 *
 * @param {string} template - HTML template string
 * @param {Object} data - Key-value pairs for template rendering
 * @returns {string} - Rendered HTML string
 */
export function pixEngine(template, data = {}) {
  let result = template;

  // Process <for each="[index, ]item in items">...</for> loops
  result = processForLoops(result, data);

  // Process <if condition="...">...</if>[<else>...</else>] blocks
  result = processConditionals(result, data);

  // Process {{expression}} variable interpolation (including ternary and dot notation)
  result = processExpressions(result, data);

  return result;
}

export default pixEngine;
