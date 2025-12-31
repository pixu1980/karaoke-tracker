/**
 * Agent Skills Integration
 *
 * Helper functions to discover, load, and activate Agent Skills in your AI agent.
 * Suitable for both filesystem-based and tool-based agents.
 */

import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

/**
 * Parse SKILL.md frontmatter to extract metadata
 * @param {string} skillPath - Path to the skill directory
 * @returns {Object} Metadata with name, description, path
 */
export function parseMetadata(skillPath) {
  const skillMdPath = path.join(skillPath, 'SKILL.md');
  const content = fs.readFileSync(skillMdPath, 'utf-8');

  // Extract YAML frontmatter
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) {
    throw new Error(`No frontmatter found in ${skillMdPath}`);
  }

  const frontmatter = yaml.parse(match[1]);

  return {
    name: frontmatter.name,
    description: frontmatter.description,
    path: skillPath,
    license: frontmatter.license,
    metadata: frontmatter.metadata
  };
}

/**
 * Discover all skills in a directory
 * @param {string} skillsDir - Path to skills directory (default: '.ai/skills')
 * @returns {Array<Object>} Array of skill metadata objects
 */
export function discoverSkills(skillsDir = '.ai/skills') {
  const skills = [];
  const entries = fs.readdirSync(skillsDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name === 'scripts') {
      continue;
    }

    const skillPath = path.join(skillsDir, entry.name);
    const skillMdPath = path.join(skillPath, 'SKILL.md');

    if (!fs.existsSync(skillMdPath)) {
      continue;
    }

    try {
      const metadata = parseMetadata(skillPath);
      skills.push(metadata);
    } catch (err) {
      console.error(`Failed to parse skill ${entry.name}:`, err.message);
    }
  }

  return skills;
}

/**
 * Load full SKILL.md instructions for activation
 * @param {string} skillPath - Path to the skill directory
 * @returns {string} Full SKILL.md content after frontmatter
 */
export function loadSkillInstructions(skillPath) {
  const skillMdPath = path.join(skillPath, 'SKILL.md');
  const content = fs.readFileSync(skillMdPath, 'utf-8');

  // Remove frontmatter and return body
  const bodyMatch = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
  return bodyMatch ? bodyMatch[1].trim() : content;
}

/**
 * Generate XML for system prompt injection (Claude/similar format)
 * @param {Array<Object>} skills - Array of skill metadata
 * @returns {string} XML string of available skills
 */
export function generateAvailableSkillsXML(skills) {
  let xml = '<available_skills>\n';

  for (const skill of skills) {
    xml += `  <skill>\n`;
    xml += `    <name>${escapeXml(skill.name)}</name>\n`;
    xml += `    <description>${escapeXml(skill.description)}</description>\n`;
    xml += `    <location>${escapeXml(path.resolve(skill.path))}/SKILL.md</location>\n`;
    if (skill.license) {
      xml += `    <license>${escapeXml(skill.license)}</license>\n`;
    }
    xml += `  </skill>\n`;
  }

  xml += '</available_skills>';
  return xml;
}

/**
 * Inject available skills into system prompt
 * @param {string} systemPrompt - Base system prompt
 * @param {Array<Object>} skills - Array of skill metadata
 * @returns {string} System prompt with skills injected
 */
export function injectSkillsIntoPrompt(systemPrompt, skills) {
  const skillsXml = generateAvailableSkillsXML(skills);
  return `${systemPrompt}\n\n${skillsXml}`;
}

/**
 * Helper: escape XML special characters
 */
function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Example usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const skills = discoverSkills('.ai/skills');
  console.log('Discovered skills:', skills);
  console.log('\nAvailable skills XML:\n', generateAvailableSkillsXML(skills));
}
