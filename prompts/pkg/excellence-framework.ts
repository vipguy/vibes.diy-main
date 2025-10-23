/**
 * Universal Excellence Framework
 * Intelligent feature inference and prompt enrichment system
 * Analyzes user requests and automatically injects best practices
 */

export interface AppCategory {
  name: string;
  keywords: string[];
  features: string[];
  dataPatterns: string[];
  uxPatterns: string[];
}

export interface EnrichmentResult {
  category: string;
  confidence: number;
  injectedFeatures: string[];
  enrichedPrompt: string;
}

/**
 * App category definitions with auto-enrichment rules
 */
export const APP_CATEGORIES: Record<string, AppCategory> = {
  tracker: {
    name: 'Tracker',
    keywords: ['track', 'log', 'record', 'monitor', 'history', 'timeline', 'journal'],
    features: [
      'Timestamps for all entries (createdAt, updatedAt)',
      'Categories and tags for organization',
      'Search and filter functionality',
      'Date range filtering',
      'Trend visualization with charts',
      'Export data functionality',
      'Statistics and metrics dashboard',
    ],
    dataPatterns: [
      'Each entry should have: id, timestamp, category, tags[]',
      'Support for metrics and measurements',
      'Historical data preservation',
    ],
    uxPatterns: [
      'Quick add button prominently placed',
      'List view with sorting options',
      'Calendar or timeline view',
      'Empty state with helpful onboarding',
    ],
  },
  
  manager: {
    name: 'Manager',
    keywords: ['manage', 'organize', 'admin', 'dashboard', 'crud', 'list'],
    features: [
      'Full CRUD operations (Create, Read, Update, Delete)',
      'Search across all fields',
      'Advanced filtering and sorting',
      'Bulk actions (select multiple, bulk delete, bulk edit)',
      'Pagination for large datasets',
      'Import/export functionality',
      'Confirmation dialogs before destructive actions',
    ],
    dataPatterns: [
      'Structured data with clear schema',
      'Relationships between entities',
      'Status fields and workflow states',
    ],
    uxPatterns: [
      'Table or grid view with column sorting',
      'Detail view/modal for editing',
      'Inline editing where appropriate',
      'Batch selection UI',
    ],
  },
  
  creator: {
    name: 'Creator',
    keywords: ['create', 'build', 'design', 'compose', 'write', 'editor', 'maker'],
    features: [
      'Template system for quick starts',
      'Draft/published status workflow',
      'Version history and undo/redo',
      'Auto-save functionality',
      'Export in multiple formats',
      'Preview mode',
      'Duplicate/clone functionality',
    ],
    dataPatterns: [
      'Content versioning',
      'Draft vs published states',
      'Template storage',
      'Metadata (author, created, modified)',
    ],
    uxPatterns: [
      'Rich editor interface',
      'Toolbar with common actions',
      'Preview/edit toggle',
      'Save indicators',
    ],
  },
  
  social: {
    name: 'Social',
    keywords: ['share', 'social', 'community', 'comment', 'like', 'follow', 'post'],
    features: [
      'User profiles and avatars',
      'Commenting system',
      'Like/reaction functionality',
      'Share capabilities',
      'Activity feed',
      'Notifications',
      'User mentions (@username)',
    ],
    dataPatterns: [
      'User relationships (followers, friends)',
      'Activity streams',
      'Engagement metrics',
      'Privacy settings per item',
    ],
    uxPatterns: [
      'Feed/timeline view',
      'User cards and profiles',
      'Inline commenting',
      'Real-time updates',
    ],
  },
  
  productivity: {
    name: 'Productivity',
    keywords: ['todo', 'task', 'project', 'workflow', 'productivity', 'planner'],
    features: [
      'Keyboard shortcuts for all actions',
      'Quick actions and command palette',
      'Due dates and reminders',
      'Priority levels',
      'Status tracking',
      'Integration hooks',
      'Batch operations',
    ],
    dataPatterns: [
      'Task hierarchy (projects > tasks > subtasks)',
      'Status workflow',
      'Time tracking',
      'Dependencies between items',
    ],
    uxPatterns: [
      'Keyboard-first navigation',
      'Quick add with shortcuts',
      'Drag and drop reordering',
      'Collapsible sections',
    ],
  },
  
  game: {
    name: 'Game',
    keywords: ['game', 'play', 'score', 'level', 'player', 'puzzle', 'challenge'],
    features: [
      'Score tracking and leaderboards',
      'Level progression system',
      'Save/load game state',
      'Settings and preferences',
      'Sound effects and music toggle',
      'Pause/resume functionality',
      'Tutorial or help system',
    ],
    dataPatterns: [
      'Game state persistence',
      'Player progress tracking',
      'High scores and achievements',
    ],
    uxPatterns: [
      'Responsive controls',
      'Visual feedback for actions',
      'Clear win/lose states',
      'Restart/new game options',
    ],
  },
  
  tool: {
    name: 'Tool',
    keywords: ['calculator', 'converter', 'generator', 'analyzer', 'utility', 'helper'],
    features: [
      'Clear input/output sections',
      'Copy to clipboard functionality',
      'History of recent calculations',
      'Preset/saved configurations',
      'Validation and error messages',
      'Reset/clear functionality',
      'Export results',
    ],
    dataPatterns: [
      'Input validation rules',
      'Calculation history',
      'Saved presets',
    ],
    uxPatterns: [
      'Focused input area',
      'Immediate feedback',
      'Clear result display',
      'Example inputs',
    ],
  },
};

/**
 * Universal UX patterns applied to ALL apps
 */
export const UNIVERSAL_PATTERNS = {
  dataIntegrity: [
    'Confirmation dialog before delete operations',
    'Undo functionality for destructive actions',
    'Data validation with clear error messages',
  ],
  
  asyncOperations: [
    'Loading states for all async operations',
    'Skeleton loaders for content',
    'Progress indicators for long operations',
    'Optimistic updates with rollback on error',
  ],
  
  errorHandling: [
    'Error boundaries to catch React errors',
    'Graceful degradation on failures',
    'User-friendly error messages',
    'Retry mechanisms for failed operations',
  ],
  
  accessibility: [
    'Keyboard navigation for all interactive elements',
    'Focus management and visible focus indicators',
    'ARIA labels for screen readers',
    'Semantic HTML structure',
  ],
  
  mobile: [
    'Touch-friendly tap targets (min 44x44px)',
    'Responsive layout for all screen sizes',
    'Pull-to-refresh on mobile',
    'Swipe gestures where appropriate',
  ],
  
  polish: [
    'Smooth transitions and animations',
    'Toast notifications for user feedback',
    'Empty states with helpful guidance',
    'Proper loading and error states',
  ],
};

/**
 * Detect app category from user prompt
 */
export function detectAppCategory(prompt: string): { category: string; confidence: number } {
  const lowerPrompt = prompt.toLowerCase();
  const scores: Record<string, number> = {};
  
  for (const [categoryKey, category] of Object.entries(APP_CATEGORIES)) {
    let score = 0;
    
    // Check for keyword matches
    for (const keyword of category.keywords) {
      if (lowerPrompt.includes(keyword)) {
        score += 10;
      }
    }
    
    // Bonus for exact category name mention
    if (lowerPrompt.includes(category.name.toLowerCase())) {
      score += 20;
    }
    
    scores[categoryKey] = score;
  }
  
  // Find highest scoring category
  const entries = Object.entries(scores);
  if (entries.length === 0) {
    return { category: 'general', confidence: 0 };
  }
  
  entries.sort((a, b) => b[1] - a[1]);
  const [topCategory, topScore] = entries[0];
  
  // If no clear match, return general
  if (topScore === 0) {
    return { category: 'general', confidence: 0 };
  }
  
  // Calculate confidence (0-1)
  const confidence = Math.min(topScore / 50, 1);
  
  return { category: topCategory, confidence };
}

/**
 * Generate enrichment instructions based on category
 */
function generateCategoryEnrichment(category: AppCategory): string {
  const sections: string[] = [];
  
  if (category.features.length > 0) {
    sections.push('REQUIRED FEATURES:\n' + category.features.map(f => `- ${f}`).join('\n'));
  }
  
  if (category.dataPatterns.length > 0) {
    sections.push('DATA STRUCTURE:\n' + category.dataPatterns.map(p => `- ${p}`).join('\n'));
  }
  
  if (category.uxPatterns.length > 0) {
    sections.push('UX PATTERNS:\n' + category.uxPatterns.map(p => `- ${p}`).join('\n'));
  }
  
  return sections.join('\n\n');
}

/**
 * Generate universal excellence requirements
 */
function generateUniversalRequirements(): string {
  const sections: string[] = [];
  
  for (const [sectionName, patterns] of Object.entries(UNIVERSAL_PATTERNS)) {
    const title = sectionName.replace(/([A-Z])/g, ' $1').trim().toUpperCase();
    sections.push(`${title}:\n` + patterns.map(p => `- ${p}`).join('\n'));
  }
  
  return sections.join('\n\n');
}

/**
 * Main enrichment function - analyzes prompt and injects requirements
 */
export function enrichPrompt(userPrompt: string): EnrichmentResult {
  const { category, confidence } = detectAppCategory(userPrompt);
  
  const injectedFeatures: string[] = [];
  let enrichmentText = '';
  
  // Add category-specific enrichment if confidence is high enough
  if (confidence > 0.3 && category !== 'general') {
    const categoryDef = APP_CATEGORIES[category];
    enrichmentText += `\n\n=== ${categoryDef.name.toUpperCase()} APP REQUIREMENTS ===\n\n`;
    enrichmentText += generateCategoryEnrichment(categoryDef);
    injectedFeatures.push(...categoryDef.features);
  }
  
  // Always add universal requirements
  enrichmentText += '\n\n=== UNIVERSAL EXCELLENCE REQUIREMENTS ===\n\n';
  enrichmentText += generateUniversalRequirements();
  
  // Add all universal patterns to injected features
  for (const patterns of Object.values(UNIVERSAL_PATTERNS)) {
    injectedFeatures.push(...patterns);
  }
  
  const enrichedPrompt = userPrompt + enrichmentText;
  
  return {
    category,
    confidence,
    injectedFeatures,
    enrichedPrompt,
  };
}

/**
 * Analyze if an app has minimum expected features
 */
export function scoreFeatureCompleteness(code: string, category: string): {
  score: number;
  missing: string[];
  present: string[];
} {
  const categoryDef = APP_CATEGORIES[category];
  if (!categoryDef) {
    return { score: 1, missing: [], present: [] };
  }
  
  const lowerCode = code.toLowerCase();
  const present: string[] = [];
  const missing: string[] = [];
  
  for (const feature of categoryDef.features) {
    // Simple heuristic: check if feature keywords appear in code
    const keywords = feature.toLowerCase().split(' ').filter(w => w.length > 4);
    const hasFeature = keywords.some(kw => lowerCode.includes(kw));
    
    if (hasFeature) {
      present.push(feature);
    } else {
      missing.push(feature);
    }
  }
  
  const score = present.length / categoryDef.features.length;
  
  return { score, missing, present };
}
