import { Plugin, MarkdownView, MarkdownRenderer, Component } from 'obsidian';
import { ChatStyleSettings, DEFAULT_SETTINGS, PRESET_THEMES, TITLE_BAR_PRESETS } from './src/settings';
import { ChatStyleSettingTab } from './src/settingTab';
import { ChatRenderer } from './src/chatRenderer';
import type { IChatStylePlugin } from './src/types';

export default class ChatStylePlugin extends Plugin implements IChatStylePlugin {
	settings: ChatStyleSettings;
	public chatRenderer: ChatRenderer;
	private styleEl: HTMLStyleElement | null = null;

	async onload() {
		console.log('🎨 ChatStyle 插件加载中...');
		
		await this.loadSettings();
		
		this.chatRenderer = new ChatRenderer(this.app, this.settings);
		
		// 添加设置选项卡
		this.addSettingTab(new ChatStyleSettingTab(this.app, this));

		// 应用样式
		this.applyStyles();

		// 注册代码块处理器
		this.registerMarkdownCodeBlockProcessor('chat', async (source, el, ctx) => {
			try {
				await this.chatRenderer.renderChat(source, el, ctx);
			} catch (error) {
				console.error('ChatStyle渲染错误:', error);
				const errorEl = document.createElement('div');
				errorEl.className = 'chat-error';
				errorEl.textContent = '聊天格式解析错误，请检查语法';
				errorEl.style.cssText = `
					color: #e74c3c;
					padding: 1.2rem;
					background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
					border-radius: 12px;
					border: 1px solid #ef5350;
					box-shadow: 0 4px 12px rgba(231, 76, 60, 0.2);
					font-weight: 500;
					margin: 1rem 0;
				`;
				el.appendChild(errorEl);
			}
		});

		// 监听设置变化 - 添加防抖处理
		let themeUpdateTimeout: NodeJS.Timeout;
		this.registerEvent(
			this.app.workspace.on('css-change', () => {
				clearTimeout(themeUpdateTimeout);
				themeUpdateTimeout = setTimeout(() => {
					this.chatRenderer.updateTheme();
					this.applyStyles();
				}, 100);
			})
		);

		// 添加命令
		this.addCommands();

		console.log('✅ ChatStyle 插件加载完成');
	}

	onunload() {
		console.log('👋 ChatStyle 插件卸载中...');
		this.removeStyles();
		console.log('✅ ChatStyle 插件卸载完成');
	}

	async loadSettings() {
		const loadedData = await this.loadData();
		this.settings = Object.assign({}, DEFAULT_SETTINGS, loadedData);
		
		// 数据迁移和兼容性处理
		this.migrateSettings();
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.chatRenderer.updateSettings(this.settings);
		this.applyStyles();
	}

	// 数据迁移处理
	private migrateSettings() {
		let needsSave = false;

		// 确保所有新字段都有默认值
		for (const key in DEFAULT_SETTINGS) {
			if (!(key in this.settings)) {
				(this.settings as any)[key] = (DEFAULT_SETTINGS as any)[key];
				needsSave = true;
			}
		}

		// 如果有更新，保存设置
		if (needsSave) {
			this.saveSettings();
		}
	}

	// 应用样式
	private applyStyles() {
		this.removeStyles();
		
		const css = this.generateCSS();
		this.styleEl = document.createElement('style');
		this.styleEl.id = 'chatstyle-plugin-styles';
		this.styleEl.textContent = css;
		document.head.appendChild(this.styleEl);

		if (this.settings.debugMode) {
			console.log('🎨 ChatStyle 样式已应用');
		}
	}

	// 移除样式
	private removeStyles() {
		if (this.styleEl) {
			this.styleEl.remove();
			this.styleEl = null;
		}
	}

	// 生成CSS样式
	private generateCSS(): string {
		const s = this.settings;
		const isDark = document.body.classList.contains('theme-dark');
		
		// 获取当前主题色
		const titleBarBg = isDark ? s.titleBarDarkColor : s.titleBarColor;
		const titleTextColor = isDark ? s.titleTextDarkColor : s.titleTextColor;
		
		let css = `
/* ===== ChatStyle 插件样式 ===== */

/* 基础变量定义 */
:root {
	--chatstyle-primary-color: ${s.userMessageBg};
	--chatstyle-secondary-color: ${s.assistantMessageBg};
	--chatstyle-accent-color: ${s.systemMessageBg};
	--chatstyle-text-primary: ${s.userMessageColor};
	--chatstyle-text-secondary: ${s.assistantMessageColor};
	--chatstyle-text-system: ${s.systemMessageColor};
	--chatstyle-font-size: ${s.fontSize}px;
	--chatstyle-font-family: ${s.fontFamily};
	--chatstyle-font-weight: ${s.fontWeight};
	--chatstyle-line-height: ${s.lineHeight};
	--chatstyle-letter-spacing: ${s.letterSpacing}px;
	--chatstyle-bubble-radius: ${s.bubbleRadius}px;
	--chatstyle-bubble-opacity: ${s.bubbleOpacity};
	--chatstyle-bubble-padding: ${s.bubblePadding}px;
	--chatstyle-message-spacing: ${s.messageSpacing}px;
	--chatstyle-avatar-size: ${s.avatarSize}px;
	--chatstyle-container-padding: ${s.containerPadding}px;
	--chatstyle-max-width: ${s.maxMessageWidth}%;
}

/* 聊天容器基础样式 */
.chat-container,
.chat-view,
.chat-messages {
	font-family: var(--chatstyle-font-family);
	font-size: var(--chatstyle-font-size);
	font-weight: var(--chatstyle-font-weight);
	line-height: var(--chatstyle-line-height);
	letter-spacing: var(--chatstyle-letter-spacing);
	padding: var(--chatstyle-container-padding);
}

/* 标题栏样式 */
${s.enableCustomTitleBar ? `
.chat-title,
.chat-header,
.modal-title,
.view-header-title {
	background: ${titleBarBg} !important;
	color: ${titleTextColor} !important;
	font-size: ${s.fontSize + 2}px !important;
	font-weight: ${s.fontWeight} !important;
	font-family: ${s.fontFamily} !important;
	padding: 12px 16px !important;
	border-radius: 8px 8px 0 0 !important;
	${s.titleBarBlur ? 'backdrop-filter: blur(10px);' : ''}
	${s.titleBarGradientAnimation ? `
		background-size: 200% 200%;
		animation: gradientShift 3s ease infinite;
	` : ''}
	transition: all 0.3s ease;
}

${s.titleBarGradientAnimation ? `
@keyframes gradientShift {
	0% { background-position: 0% 50%; }
	50% { background-position: 100% 50%; }
	100% { background-position: 0% 50%; }
}
` : ''}
` : ''}

/* 消息气泡基础样式 */
.chat-message,
.message-bubble {
	margin: var(--chatstyle-message-spacing) 0;
	padding: var(--chatstyle-bubble-padding);
	border-radius: var(--chatstyle-bubble-radius);
	opacity: var(--chatstyle-bubble-opacity);
	max-width: var(--chatstyle-max-width);
	position: relative;
	transition: all 0.3s ease;
	${s.bubbleBorderWidth > 0 ? `border: ${s.bubbleBorderWidth}px solid rgba(255,255,255,0.2);` : ''}
}

/* 用户消息样式 */
.chat-message.user,
.message-bubble.user {
	background: ${s.userMessageBg};
	color: ${s.userMessageColor};
	margin-left: auto;
	text-align: right;
}

/* 助手消息样式 */
.chat-message.assistant,
.message-bubble.assistant {
	background: ${s.assistantMessageBg};
	color: ${s.assistantMessageColor};
	margin-right: auto;
	text-align: left;
}

/* 系统消息样式 */
.chat-message.system,
.message-bubble.system {
	background: ${s.systemMessageBg};
	color: ${s.systemMessageColor};
	margin: 0 auto;
	text-align: center;
	font-style: italic;
}

/* 引用消息样式 */
.chat-message.quoted,
.message-bubble.quoted {
	background: ${s.quotedMessageBg};
	color: ${s.quotedMessageColor};
	border-left: 4px solid var(--chatstyle-primary-color);
	margin-left: 20px;
	font-size: 0.9em;
	opacity: 0.8;
}

/* 气泡效果 */
${s.bubbleShadow ? `
.chat-message,
.message-bubble {
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.05);
}
` : ''}

${s.bubbleGlow ? `
.chat-message.user,
.message-bubble.user {
	box-shadow: 0 0 20px rgba(0, 123, 255, 0.3);
}
.chat-message.assistant,
.message-bubble.assistant {
	box-shadow: 0 0 20px rgba(248, 249, 250, 0.3);
}
` : ''}

${s.bubbleHoverEffect ? `
.chat-message:hover,
.message-bubble:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}
` : ''}

/* 头像样式 */
.chat-avatar,
.message-avatar {
	width: var(--chatstyle-avatar-size);
	height: var(--chatstyle-avatar-size);
	border-radius: ${s.avatarRadius || s.avatarSize / 2}px;
	${s.avatarBorder ? 'border: 2px solid rgba(255, 255, 255, 0.3);' : ''}
	${s.avatarShadow ? 'box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);' : ''}
	${s.avatarGlow ? 'box-shadow: 0 0 15px rgba(0, 123, 255, 0.4);' : ''}
	transition: all 0.3s ease;
}

${s.avatarHoverScale ? `
.chat-avatar:hover,
.message-avatar:hover {
	transform: scale(1.1);
}
` : ''}

/* 文字效果 */
${s.textShadow ? `
.chat-message,
.message-bubble {
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
` : ''}

/* 动画效果 */
${s.enableAnimations ? `
.chat-message,
.message-bubble {
	animation: messageSlideIn 0.3s ease-out;
}

@keyframes messageSlideIn {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: var(--chatstyle-bubble-opacity);
		transform: translateY(0);
	}
}

${s.enableTypewriter ? `
.chat-message.typing {
	animation: typewriter 2s steps(40) infinite;
}

@keyframes typewriter {
	from { width: 0; }
	to { width: 100%; }
}
` : ''}
` : ''}

/* 代码块增强 */
${s.codeBlockEnhanced ? `
.chat-message pre,
.message-bubble pre {
	position: relative;
	background: #f8f9fa;
	border: 1px solid #e9ecef;
	border-radius: 6px;
	padding: 16px;
	margin: 8px 0;
	overflow-x: auto;
	${s.codeBlockLineNumbers ? 'counter-reset: line-number;' : ''}
}

.theme-dark .chat-message pre,
.theme-dark .message-bubble pre {
	background: #2d3748;
	border-color: #4a5568;
	color: #e2e8f0;
}

${s.codeBlockShowLanguage ? `
.chat-message pre::before,
.message-bubble pre::before {
	content: attr(data-language);
	position: absolute;
	top: 8px;
	right: 8px;
	background: rgba(0, 0, 0, 0.1);
	padding: 2px 8px;
	border-radius: 4px;
	font-size: 12px;
	opacity: 0.7;
}
` : ''}

${s.codeBlockShowCopyButton ? `
.chat-message pre::after,
.message-bubble pre::after {
	content: "📋";
	position: absolute;
	top: 8px;
	right: ${s.codeBlockShowLanguage ? '80px' : '8px'};
	cursor: pointer;
	padding: 4px 8px;
	border-radius: 4px;
	background: rgba(0, 0, 0, 0.1);
	opacity: 0.7;
	transition: opacity 0.2s;
}

.chat-message pre:hover::after,
.message-bubble pre:hover::after {
	opacity: 1;
}
` : ''}
` : ''}

/* 高级视觉效果 */
${s.enableGlassmorphism ? `
.chat-message,
.message-bubble {
	backdrop-filter: blur(10px);
	background: rgba(255, 255, 255, 0.1);
	border: 1px solid rgba(255, 255, 255, 0.2);
}
` : ''}

${s.enableNeonEffect ? `
.chat-message.user,
.message-bubble.user {
	box-shadow: 
		0 0 5px currentColor,
		0 0 10px currentColor,
		0 0 15px currentColor,
		0 0 20px currentColor;
}
` : ''}

/* 可访问性支持 */
${s.highContrast ? `
.chat-message,
.message-bubble {
	border: 2px solid currentColor;
	background: ${isDark ? '#000000' : '#ffffff'} !important;
	color: ${isDark ? '#ffffff' : '#000000'} !important;
}
` : ''}

${s.reducedMotion ? `
@media (prefers-reduced-motion: reduce) {
	.chat-message,
	.message-bubble,
	.chat-avatar,
	.message-avatar {
		animation: none !important;
		transition: none !important;
	}
}
` : ''}

/* 时间戳显示 */
${s.showTimestamp ? `
.chat-message::after,
.message-bubble::after {
	content: attr(data-timestamp);
	display: block;
	font-size: 0.8em;
	opacity: 0.6;
	margin-top: 4px;
	text-align: right;
}
` : ''}

/* 自定义CSS */
${s.enableCustomCSS ? s.customCSS : ''}

/* 响应式设计 */
@media (max-width: 768px) {
	.chat-message,
	.message-bubble {
		max-width: 95%;
		font-size: calc(var(--chatstyle-font-size) - 1px);
	}
	
	.chat-avatar,
	.message-avatar {
		width: calc(var(--chatstyle-avatar-size) - 8px);
		height: calc(var(--chatstyle-avatar-size) - 8px);
	}
}
`;

		return css;
	}

	// 添加命令
	private addCommands() {
		// 应用预设主题命令
		this.addCommand({
			id: 'apply-preset',
			name: '应用预设主题',
			callback: () => {
				console.log('显示预设主题选择器');
			}
		});

		// 重置设置命令
		this.addCommand({
			id: 'reset-settings',
			name: '重置所有设置',
			callback: async () => {
				this.settings = Object.assign({}, DEFAULT_SETTINGS);
				await this.saveSettings();
				console.log('✅ 设置已重置为默认值');
			}
		});
	}

	// 应用预设主题
	public async applyPreset(presetKey: string) {
		if (PRESET_THEMES[presetKey as keyof typeof PRESET_THEMES]) {
			const preset = PRESET_THEMES[presetKey as keyof typeof PRESET_THEMES];
			
			// 应用预设配置
			this.settings.currentPreset = presetKey;
			this.settings.titleBarColor = preset.titleBarColor;
			this.settings.titleBarDarkColor = preset.titleBarDarkColor;
			this.settings.titleTextColor = preset.titleTextColor;
			this.settings.titleTextDarkColor = preset.titleTextDarkColor;
			this.settings.userMessageBg = preset.leftColor;
			this.settings.assistantMessageBg = preset.rightColor;
			this.settings.systemMessageBg = preset.accentColor;
			
			await this.saveSettings();
			
			if (this.settings.debugMode) {
				console.log(`✅ 已应用预设主题: ${preset.name}`);
			}
		}
	}

	// 应用标题栏预设
	public async applyTitleBarPreset(presetKey: string) {
		if (TITLE_BAR_PRESETS[presetKey as keyof typeof TITLE_BAR_PRESETS]) {
			const preset = TITLE_BAR_PRESETS[presetKey as keyof typeof TITLE_BAR_PRESETS];
			
			// 应用标题栏预设配置
			this.settings.titleBarColor = preset.titleBarColor;
			this.settings.titleTextColor = preset.titleTextColor;
			this.settings.titleBarDarkColor = preset.titleBarDarkColor;
			this.settings.titleTextDarkColor = preset.titleTextDarkColor;
			this.settings.fontSize = preset.fontSize;
			this.settings.fontWeight = preset.fontWeight;
			this.settings.fontFamily = preset.fontFamily;
			
			await this.saveSettings();
			
			if (this.settings.debugMode) {
				console.log(`✅ 已应用标题栏预设: ${preset.name}`);
			}
		}
	}

	// 切换主题
	public toggleTheme() {
		// 切换深色/浅色主题的逻辑
		const isDark = document.body.classList.contains('theme-dark');
		if (isDark) {
			document.body.classList.remove('theme-dark');
			document.body.classList.add('theme-light');
		} else {
			document.body.classList.remove('theme-light');
			document.body.classList.add('theme-dark');
		}
		this.applyStyles();
		
		if (this.settings.debugMode) {
			console.log(`✅ 主题已切换为: ${isDark ? '浅色' : '深色'}`);
		}
	}

	// 重置设置
	public async resetSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS);
		await this.saveSettings();
		
		if (this.settings.debugMode) {
			console.log('✅ 设置已重置为默认值');
		}
	}

	// 显示预设选择器
	public showPresetSelector() {
		// 显示预设主题选择器的逻辑
		const presetKeys = Object.keys(PRESET_THEMES);
		const presetNames = presetKeys.map(key => PRESET_THEMES[key as keyof typeof PRESET_THEMES].name);
		
		// 这里可以实现一个模态框或下拉菜单来选择预设
		console.log('可用预设主题:', presetNames);
		
		if (this.settings.debugMode) {
			console.log('显示预设主题选择器');
		}
	}
}
