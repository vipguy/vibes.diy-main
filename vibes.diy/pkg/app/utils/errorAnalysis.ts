/**
 * Error Analysis Utilities
 * Provides intelligent error analysis and recovery suggestions
 */

import { RuntimeError } from "@vibes.diy/use-vibes-types";

export interface ErrorAnalysis {
  errorType: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  likelyCause: string;
  suggestedFix: string;
  codeContext?: string;
}

/**
 * Analyze an error and provide intelligent recovery suggestions
 */
export function analyzeError(error: RuntimeError): ErrorAnalysis {
  const msg = error.message || '';
  const stack = error.stack || '';
  const errorType = error.errorType || 'Unknown';

  let severity: 'critical' | 'high' | 'medium' | 'low' = 'medium';
  let likelyCause = 'Unknown error occurred';
  let suggestedFix = 'Review the code and fix any issues';
  let codeContext: string | undefined;

  // Extract line number if available
  const lineMatch = stack.match(/:(\d+):\d+/);
  const lineNumber = lineMatch ? lineMatch[1] : null;

  switch (errorType) {
    case 'SyntaxError':
      severity = 'critical';
      
      if (msg.includes('Unexpected token')) {
        const tokenMatch = msg.match(/Unexpected token '?([^']+)'?/i);
        const token = tokenMatch ? tokenMatch[1] : 'unknown';
        
        if (token === '<') {
          likelyCause = 'JSX syntax error - likely missing closing tag or incorrect JSX structure';
          suggestedFix = 'Check all JSX tags are properly closed. Ensure JSX is inside return statement. Verify all components are properly imported.';
        } else if (token === '{' || token === '}') {
          likelyCause = 'Mismatched curly braces in JSX or JavaScript';
          suggestedFix = 'Count opening and closing braces. Check JSX expressions are properly wrapped. Verify object literals are correct.';
        } else if (token === '(' || token === ')') {
          likelyCause = 'Mismatched parentheses in function calls or expressions';
          suggestedFix = 'Check all function calls have matching parentheses. Verify arrow functions are properly formatted.';
        } else {
          likelyCause = `Unexpected ${token} in code`;
          suggestedFix = 'Review syntax around the error location. Check for missing semicolons, commas, or operators.';
        }
      } else if (msg.includes('Unexpected end of input')) {
        likelyCause = 'Incomplete code - missing closing bracket, brace, or parenthesis';
        suggestedFix = 'Add missing closing characters. Ensure all code blocks are complete.';
      } else {
        likelyCause = 'Invalid JavaScript syntax';
        suggestedFix = 'Review the code for syntax errors. Check brackets, quotes, and semicolons.';
      }
      
      if (lineNumber) {
        codeContext = `Error near line ${lineNumber}`;
      }
      break;

    case 'ReferenceError':
      severity = 'high';
      
      const varMatch = msg.match(/(\w+) is not defined/);
      const varName = varMatch ? varMatch[1] : 'variable';
      
      likelyCause = `Variable or function '${varName}' is used but not defined`;
      
      if (varName.match(/^[A-Z]/)) {
        suggestedFix = `Import the ${varName} component: import ${varName} from 'appropriate-package'. Or define it in the file.`;
      } else if (['useState', 'useEffect', 'useCallback', 'useMemo', 'useRef'].includes(varName)) {
        suggestedFix = `Import React hook: import { ${varName} } from 'react'`;
      } else {
        suggestedFix = `Define ${varName} before using it, or check for typos in the variable name.`;
      }
      break;

    case 'TypeError':
      severity = 'high';
      
      if (msg.includes('is not a function')) {
        const funcMatch = msg.match(/(\w+) is not a function/);
        const funcName = funcMatch ? funcMatch[1] : 'value';
        likelyCause = `'${funcName}' is being called as a function but it's not`;
        suggestedFix = `Check that ${funcName} is actually a function. Verify imports are correct. Check for typos.`;
      } else if (msg.includes('Cannot read property') || msg.includes('Cannot read properties')) {
        const propMatch = msg.match(/property '(\w+)'/);
        const propName = propMatch ? propMatch[1] : 'property';
        likelyCause = `Trying to access '${propName}' on undefined or null`;
        suggestedFix = `Add optional chaining: obj?.${propName}. Or check if obj exists before accessing. Add null checks.`;
      } else if (msg.includes('is not iterable')) {
        likelyCause = 'Trying to iterate over a non-array value';
        suggestedFix = 'Ensure the value is an array before using .map(), .filter(), etc. Add: Array.isArray(value) check.';
      } else {
        likelyCause = 'Type mismatch or incorrect operation';
        suggestedFix = 'Verify data types are correct. Add type checking. Use optional chaining and nullish coalescing.';
      }
      break;

    case 'NetworkError':
      severity = 'medium';
      likelyCause = 'Failed to fetch data from API or network';
      suggestedFix = 'Add try-catch around fetch calls. Check API endpoint is correct. Add error handling and retry logic.';
      break;

    case 'DatabaseError':
      severity = 'high';
      likelyCause = 'Fireproof database error - likely missing block or CRDT issue';
      suggestedFix = 'Change the database name to start fresh. Verify Fireproof usage is correct. Check document structure.';
      break;

    case 'HydrationError':
      severity = 'medium';
      likelyCause = 'Server and client rendered different content';
      suggestedFix = 'Ensure consistent rendering. Move client-only code to useEffect. Check for random values or timestamps in render.';
      break;

    case 'InfiniteLoopError':
      severity = 'critical';
      likelyCause = 'Infinite re-render loop detected';
      suggestedFix = 'Check useEffect dependencies. Avoid setting state in render. Use useCallback for functions passed as props.';
      break;

    default:
      severity = 'medium';
      likelyCause = 'Unclassified error';
      suggestedFix = 'Review error message and stack trace. Add error boundaries. Check console for more details.';
  }

  return {
    errorType,
    severity,
    likelyCause,
    suggestedFix,
    codeContext,
  };
}

/**
 * Generate a detailed error recovery prompt for the AI
 */
export function generateErrorRecoveryPrompt(errors: RuntimeError[]): string {
  if (errors.length === 0) return '';

  const analyses = errors.map(analyzeError);
  const critical = analyses.filter(a => a.severity === 'critical');
  const high = analyses.filter(a => a.severity === 'high');

  let prompt = '🚨 CRITICAL ERRORS DETECTED - IMMEDIATE FIX REQUIRED\n\n';

  if (critical.length > 0) {
    prompt += '❌ CRITICAL ERRORS (Fix these first):\n';
    critical.forEach((analysis, i) => {
      prompt += `\n${i + 1}. ${analysis.errorType}: ${errors[i].message}\n`;
      prompt += `   Cause: ${analysis.likelyCause}\n`;
      prompt += `   Fix: ${analysis.suggestedFix}\n`;
      if (analysis.codeContext) {
        prompt += `   Context: ${analysis.codeContext}\n`;
      }
    });
  }

  if (high.length > 0) {
    prompt += '\n⚠️ HIGH PRIORITY ERRORS:\n';
    high.forEach((analysis, i) => {
      const errorIndex = critical.length + i;
      prompt += `\n${errorIndex + 1}. ${analysis.errorType}: ${errors[errorIndex].message}\n`;
      prompt += `   Cause: ${analysis.likelyCause}\n`;
      prompt += `   Fix: ${analysis.suggestedFix}\n`;
    });
  }

  prompt += '\n\n📋 REQUIRED ACTIONS:\n';
  prompt += '1. Analyze each error and identify the root cause\n';
  prompt += '2. Fix ALL errors in the code\n';
  prompt += '3. Provide the COMPLETE corrected code\n';
  prompt += '4. Test your mental model before responding\n';
  prompt += '5. If errors persist, simplify the implementation\n';

  prompt += '\n⚡ Respond with the complete, corrected, working code now.';

  return prompt;
}
