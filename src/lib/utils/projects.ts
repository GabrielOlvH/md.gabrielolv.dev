// src/lib/utils/projects.ts
import type { ComponentType } from 'svelte';
import type { ExplorerItem } from '$lib/components/BaseFileExplorer.svelte';
import { Globe, Wrench, FileText, Blocks, Gamepad } from 'lucide-svelte';

// --- Static Project Data with Translation Keys ---
// Store translation keys for name and description
interface ProjectData {
	id: string;
	nameKey: string; // Translation key for the name
	descriptionKey: string; // Translation key for the description
	category: 'websites' | 'tools' | 'games' | 'minecraft' | 'other';
	url: string;
}

const staticProjects: ProjectData[] = [
	{
		id: 'kaia',
		nameKey: 'projects.kaia.title',
		descriptionKey: 'projects.kaia.desc',
		category: 'tools',
		url: 'https://github.com/GabrielOlvH/Kaia'
	},
	{
		id: 'blog',
		nameKey: 'projects.blog.title',
		descriptionKey: 'projects.blog.desc',
		category: 'websites',
		url: 'https://github.com/GabrielOlvH/md.gabrielolv.dev'
	},
	{
		id: 'cafeteria_website',
		nameKey: 'projects.cafeteria_development_website.title',
		descriptionKey: 'projects.cafeteria_development_website.desc',
		category: 'websites',
		url: 'https://cafeteria.dev'
	},
	{
		id: 'industrial_revolution',
		nameKey: 'projects.industrial_revolution.title',
		descriptionKey: 'projects.industrial_revolution.desc',
		category: 'minecraft',
		url: 'https://github.com/GabrielOlvH/Industrial-Revolution'
	},
	{
		id: 'multiple_minecraft_mods',
		nameKey: 'projects.multiple_minecraft_mods.title',
		descriptionKey: 'projects.multiple_minecraft_mods.desc',
		category: 'minecraft',
		url: 'https://modrinth.com/user/GabrielOlvH'
	},
	{
		id: 'castor_odyssey',
		nameKey: 'projects.castor_odyssey.title',
		descriptionKey: 'projects.castor_odyssey.desc',
		category: 'games',
		url: 'https://gabrielolvh.itch.io/castors-odyssey'
	},
	{
		id: 'pokemon_tcg_replay',
		nameKey: 'projects.pokemon_tcg_replay.title',
		descriptionKey: 'projects.pokemon_tcg_replay.desc',
		category: 'games',
		url: 'https://github.com/GabrielOlvH/TCGReplay'
	},
];
// --- End Static Project Data ---


function getCategoryIcon(category: string): ComponentType | undefined {
  switch (category) {
    case 'websites': return Globe;
    case 'tools': return Wrench;
    case 'games': return Gamepad;
    case 'minecraft': return Blocks;
    default: return FileText; // Using FileText for 'other' or unspecified
  }
}

// Modify ExplorerItem slightly if needed, or use a custom type during build,
// but the final structure passed to the component should match ExplorerItem.
// We will add the keys as custom properties for now.
type PrecomputedExplorerItem = ExplorerItem & { nameKey?: string, descriptionKey?: string };

type ProjectFileSystemForLocale = Record<string, PrecomputedExplorerItem>;

// Assume supported locales (replace with your actual locales if different)
const supportedLocales = ['en', 'es', 'pt']; // Example including pt based on repo

// Pre-compute the file system for each locale using the *same* static data
export const projectsFileSystemByLocale = supportedLocales.reduce(
	(acc, locale) => {
		// Use the single staticProjects list for all locales
		const children = staticProjects.reduce(
			(projectAcc: Record<string, PrecomputedExplorerItem>, project: ProjectData) => {
				// Use project.id or project.name as the key, ensure uniqueness
				const key = project.id || project.nameKey; 
				projectAcc[key] = {
					name: project.nameKey, // Static name
					nameKey: project.nameKey, // Explicitly store key
					type: 'file',
					icon: getCategoryIcon(project.category),
					description: project.descriptionKey, // Static description
					descriptionKey: project.descriptionKey, // Explicitly store key
					url: project.url,
					external: true,
          // Path could be based on locale and id/name, ensure it's unique and makes sense
          path: `/${locale}/projects/${key}` 
				};
				return projectAcc;
			},
			{}
		);

		// The fileSystem object for this locale's projects section
		acc[locale] = {
			[`/${locale}/projects`]: {
				name: 'projects',
				type: 'directory',
				path: `/${locale}/projects`,
				children: children
			} as PrecomputedExplorerItem // Use the extended type here
		};
		return acc;
	},
	{} as Record<string, ProjectFileSystemForLocale>
); 