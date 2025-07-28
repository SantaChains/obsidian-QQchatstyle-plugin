// 类型声明文件，用于解决模块导入问题
import type { Plugin } from 'obsidian';
import type { ChatStyleSettings } from './settings';
import type { ChatRenderer } from './chatRenderer';

// 重新导出主插件类型，避免循环依赖
export interface IChatStylePlugin extends Plugin {
	settings: ChatStyleSettings;
	chatRenderer: ChatRenderer;
	saveSettings(): Promise<void>;
	applyPreset(presetKey: string): Promise<void>;
	applyTitleBarPreset(presetKey: string): Promise<void>;
	toggleTheme(): void;
	resetSettings(): Promise<void>;
	showPresetSelector(): void;
}
