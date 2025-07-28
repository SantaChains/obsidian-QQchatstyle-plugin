import { App, PluginSettingTab, Setting } from 'obsidian';
import { PRESET_THEMES, TITLE_BAR_PRESETS } from './settings';
import type { IChatStylePlugin } from './types';

export class ChatStyleSettingTab extends PluginSettingTab {
	plugin: IChatStylePlugin;

	constructor(app: App, plugin: IChatStylePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		// 主标题
		const titleEl = containerEl.createEl('div', { cls: 'chatstyle-settings-title' });
		titleEl.createEl('h1', { text: '🎨 ChatStyle 插件设置' });
		titleEl.createEl('p', { 
			text: '个性化你的聊天界面，打造独特的视觉体验',
			cls: 'chatstyle-settings-subtitle'
		});

		// 添加自定义样式
		this.addCustomStyles();

		// === 主题预设区域 ===
		this.createSectionHeader(containerEl, '🎭 主题预设', '快速应用预设主题风格');
		
		new Setting(containerEl)
			.setName('🎨 整体主题预设')
			.setDesc('选择一个预设主题，快速切换聊天窗口的整体风格')
			.addDropdown(dropdown => {
				for (const key in PRESET_THEMES) {
					dropdown.addOption(key, PRESET_THEMES[key as keyof typeof PRESET_THEMES].name);
				}
				dropdown
					.setValue(this.plugin.settings.currentPreset)
					.onChange(async (value) => {
						if (value && PRESET_THEMES[value as keyof typeof PRESET_THEMES]) {
							await this.plugin.applyPreset(value);
							this.display(); // 刷新界面显示最新设置
						}
					});
			});

		// === 标题栏设置区域 ===
		this.createSectionHeader(containerEl, '📋 标题栏设置', '自定义标题栏的外观和字体');

		new Setting(containerEl)
			.setName('🎛️ 启用标题栏自定义')
			.setDesc('开启后可以自定义标题栏的颜色、字体等外观设置')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableCustomTitleBar)
				.onChange(async (value) => {
					this.plugin.settings.enableCustomTitleBar = value;
					await this.plugin.saveSettings();
					this.display();
				}));

		if (this.plugin.settings.enableCustomTitleBar) {
			// 标题栏配色预设
			this.createSubSectionHeader(containerEl, '🎨 配色预设');
			
			new Setting(containerEl)
				.setName('📋 标题栏配色方案')
				.setDesc('选择预设配色方案或自定义配置')
				.addDropdown(dropdown => {
					dropdown.addOption('custom', '🎨 自定义配置');
					
					// 浅色系列
					dropdown.addOption('', '--- 🤍 浅色系列 ---');
					dropdown.addOption('light_minimal', TITLE_BAR_PRESETS.light_minimal.name);
					dropdown.addOption('light_blue', TITLE_BAR_PRESETS.light_blue.name);
					dropdown.addOption('light_green', TITLE_BAR_PRESETS.light_green.name);
					dropdown.addOption('light_purple', TITLE_BAR_PRESETS.light_purple.name);
					dropdown.addOption('light_orange', TITLE_BAR_PRESETS.light_orange.name);
					dropdown.addOption('light_pink', TITLE_BAR_PRESETS.light_pink.name);
					dropdown.addOption('light_teal', TITLE_BAR_PRESETS.light_teal.name);
					dropdown.addOption('light_amber', TITLE_BAR_PRESETS.light_amber.name);
					
					// 深色系列
					dropdown.addOption('', '--- 🖤 深色系列 ---');
					dropdown.addOption('dark_minimal', TITLE_BAR_PRESETS.dark_minimal.name);
					dropdown.addOption('dark_blue', TITLE_BAR_PRESETS.dark_blue.name);
					dropdown.addOption('dark_purple', TITLE_BAR_PRESETS.dark_purple.name);
					dropdown.addOption('dark_red', TITLE_BAR_PRESETS.dark_red.name);
					dropdown.addOption('dark_green', TITLE_BAR_PRESETS.dark_green.name);
					dropdown.addOption('dark_orange', TITLE_BAR_PRESETS.dark_orange.name);
					dropdown.addOption('dark_indigo', TITLE_BAR_PRESETS.dark_indigo.name);
					dropdown.addOption('dark_brown', TITLE_BAR_PRESETS.dark_brown.name);
					
					// 渐变系列
					dropdown.addOption('', '--- 🌅 渐变系列 ---');
					dropdown.addOption('gradient_sunset', TITLE_BAR_PRESETS.gradient_sunset.name);
					dropdown.addOption('gradient_ocean', TITLE_BAR_PRESETS.gradient_ocean.name);
					dropdown.addOption('gradient_forest', TITLE_BAR_PRESETS.gradient_forest.name);
					dropdown.addOption('gradient_aurora', TITLE_BAR_PRESETS.gradient_aurora.name);
					
					// 特殊效果
					dropdown.addOption('', '--- ✨ 特殊效果 ---');
					dropdown.addOption('glassmorphism_light', TITLE_BAR_PRESETS.glassmorphism_light.name);
					dropdown.addOption('glassmorphism_dark', TITLE_BAR_PRESETS.glassmorphism_dark.name);
					dropdown.addOption('neon_cyan', TITLE_BAR_PRESETS.neon_cyan.name);
					dropdown.addOption('neon_pink', TITLE_BAR_PRESETS.neon_pink.name);

					dropdown
						.setValue('custom')
						.onChange(async (value) => {
							if (value !== 'custom' && value !== '' && TITLE_BAR_PRESETS[value as keyof typeof TITLE_BAR_PRESETS]) {
								await this.plugin.applyTitleBarPreset(value);
								this.display(); // 刷新界面显示最新设置
							}
						});
				});

			// 标题栏颜色设置
			this.createSubSectionHeader(containerEl, '🎨 背景颜色');
			
			new Setting(containerEl)
				.setName('☀️ 浅色模式背景')
				.setDesc('浅色主题下的标题栏背景色（支持渐变和透明度）')
				.addColorPicker(color => color
					.setValue(this.extractSolidColor(this.plugin.settings.titleBarColor, '#ffffff'))
					.onChange(async (value) => {
						this.plugin.settings.titleBarColor = value;
						await this.plugin.saveSettings();
					}))
				.addText(text => text
					.setPlaceholder('如：rgba(255,255,255,0.9) 或 linear-gradient(...)')
					.setValue(this.plugin.settings.titleBarColor)
					.onChange(async (value) => {
						this.plugin.settings.titleBarColor = value;
						await this.plugin.saveSettings();
					}));

			new Setting(containerEl)
				.setName('🌙 深色模式背景')
				.setDesc('深色主题下的标题栏背景色（支持渐变和透明度）')
				.addColorPicker(color => color
					.setValue(this.extractSolidColor(this.plugin.settings.titleBarDarkColor, '#1e1e1e'))
					.onChange(async (value) => {
						this.plugin.settings.titleBarDarkColor = value;
						await this.plugin.saveSettings();
					}))
				.addText(text => text
					.setPlaceholder('如：rgba(30,30,30,0.9) 或 linear-gradient(...)')
					.setValue(this.plugin.settings.titleBarDarkColor)
					.onChange(async (value) => {
						this.plugin.settings.titleBarDarkColor = value;
						await this.plugin.saveSettings();
					}));

			// 标题栏文字颜色
			this.createSubSectionHeader(containerEl, '✏️ 文字颜色');
			
			new Setting(containerEl)
				.setName('☀️ 浅色模式文字')
				.setDesc('浅色主题下的标题文字颜色')
				.addColorPicker(color => color
					.setValue(this.plugin.settings.titleTextColor)
					.onChange(async (value) => {
						this.plugin.settings.titleTextColor = value;
						await this.plugin.saveSettings();
					}));

			new Setting(containerEl)
				.setName('🌙 深色模式文字')
				.setDesc('深色主题下的标题文字颜色')
				.addColorPicker(color => color
					.setValue(this.plugin.settings.titleTextDarkColor)
					.onChange(async (value) => {
						this.plugin.settings.titleTextDarkColor = value;
						await this.plugin.saveSettings();
					}));
		}

		// === 字体与颜色设置区域 ===
		this.createSectionHeader(containerEl, '🔤 字体与颜色', '统一设置字体样式和文字颜色');
		
		new Setting(containerEl)
			.setName('📏 字体大小')
			.setDesc('设置整体字体大小，同时影响标题栏和聊天内容')
			.addSlider(slider => slider
				.setLimits(12, 28, 1)
				.setValue(this.plugin.settings.fontSize)
				.setDynamicTooltip()
				.onChange(async (value) => {
					this.plugin.settings.fontSize = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('💪 字体粗细')
			.setDesc('设置文字的字体粗细程度')
			.addDropdown(dropdown => dropdown
				.addOption('300', '细体 (300)')
				.addOption('400', '正常 (400)')
				.addOption('500', '中等 (500)')
				.addOption('600', '半粗 (600)')
				.addOption('700', '粗体 (700)')
				.addOption('800', '特粗 (800)')
				.setValue(this.plugin.settings.fontWeight)
				.onChange(async (value) => {
					this.plugin.settings.fontWeight = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('🎭 字体族')
			.setDesc('选择字体族，影响整体视觉风格')
			.addDropdown(dropdown => {
				dropdown.addOption('custom', '🎨 自定义输入');
				dropdown.addOption('-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', '🖥️ 系统默认');
				dropdown.addOption('"Georgia", "Times New Roman", serif', '📖 优雅衬线');
				dropdown.addOption('"Helvetica Neue", "Arial", sans-serif', '🔤 经典无衬线');
				dropdown.addOption('"Source Sans Pro", "Segoe UI", sans-serif', '📱 现代清晰');
				dropdown.addOption('"Noto Sans", "DejaVu Sans", sans-serif', '🌍 国际通用');
				dropdown.addOption('"Roboto", "Oxygen", sans-serif', '🤖 科技感');
				dropdown.addOption('"Open Sans", "Verdana", sans-serif', '👁️ 易读性');
				dropdown.addOption('"Comic Sans MS", "Trebuchet MS", cursive', '🎈 可爱手写');
				dropdown.addOption('"Playfair Display", "Times New Roman", serif', '👑 华丽装饰');
				dropdown.addOption('"Roboto Condensed", "Arial Narrow", sans-serif', '📏 紧凑现代');
				dropdown.addOption('"Crimson Text", "Times New Roman", serif', '📚 学术风格');
				dropdown.addOption('"Impact", "Arial Black", sans-serif', '💥 强烈冲击');
				dropdown.addOption('"Merriweather", "Georgia", serif', '🌿 温和阅读');
				dropdown.addOption('"Oswald", "Arial", sans-serif', '🏗️ 建筑风格');
				dropdown.addOption('"Lora", "Times New Roman", serif', '✍️ 书法风格');
				dropdown.addOption('"Dancing Script", "Brush Script MT", cursive', '💃 舞蹈手写');
				dropdown.addOption('"Quicksand", "Verdana", sans-serif', '🌊 轻快圆润');
				dropdown.addOption('"Cabin", "Trebuchet MS", sans-serif', '🏠 温馨舒适');
				dropdown.addOption('"Orbitron", "Courier New", monospace', '🚀 科技未来');
				dropdown.addOption('"Inter", "Helvetica Neue", sans-serif', '🎯 现代简洁');
				
				const currentFont = this.plugin.settings.fontFamily;
				const isCustom = !dropdown.selectEl.querySelector(`option[value="${currentFont}"]`);
				dropdown.setValue(isCustom ? 'custom' : currentFont);
				
				dropdown.onChange(async (value) => {
					if (value !== 'custom') {
						this.plugin.settings.fontFamily = value;
						await this.plugin.saveSettings();
						this.display();
					}
				});
			})
			.addText(text => text
				.setPlaceholder('输入自定义字体族，如 "Arial", sans-serif')
				.setValue(this.plugin.settings.fontFamily)
				.onChange(async (value) => {
					this.plugin.settings.fontFamily = value;
					await this.plugin.saveSettings();
				}));

		// 聊天内容颜色设置
		this.createSubSectionHeader(containerEl, '🎨 聊天内容颜色');
		
		new Setting(containerEl)
			.setName('👤 用户消息颜色')
			.setDesc('设置用户发送消息的文字颜色')
			.addColorPicker(color => color
				.setValue(this.plugin.settings.userMessageColor)
				.onChange(async (value) => {
					this.plugin.settings.userMessageColor = value;
					await this.plugin.saveSettings();
				}))
			.addText(text => text
				.setPlaceholder('支持 CSS 颜色值，如 #ffffff 或 rgba(255,255,255,0.9)')
				.setValue(this.plugin.settings.userMessageColor)
				.onChange(async (value) => {
					this.plugin.settings.userMessageColor = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('🤖 助手消息颜色')
			.setDesc('设置AI助手回复消息的文字颜色')
			.addColorPicker(color => color
				.setValue(this.plugin.settings.assistantMessageColor)
				.onChange(async (value) => {
					this.plugin.settings.assistantMessageColor = value;
					await this.plugin.saveSettings();
				}))
			.addText(text => text
				.setPlaceholder('支持 CSS 颜色值，如 #333333 或 rgba(51,51,51,0.9)')
				.setValue(this.plugin.settings.assistantMessageColor)
				.onChange(async (value) => {
					this.plugin.settings.assistantMessageColor = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('⚙️ 系统消息颜色')
			.setDesc('设置系统提示消息的文字颜色')
			.addColorPicker(color => color
				.setValue(this.plugin.settings.systemMessageColor)
				.onChange(async (value) => {
					this.plugin.settings.systemMessageColor = value;
					await this.plugin.saveSettings();
				}))
			.addText(text => text
				.setPlaceholder('支持 CSS 颜色值，如 #666666 或 rgba(102,102,102,0.9)')
				.setValue(this.plugin.settings.systemMessageColor)
				.onChange(async (value) => {
					this.plugin.settings.systemMessageColor = value;
					await this.plugin.saveSettings();
				}));

		// === 气泡样式区域 ===
		this.createSectionHeader(containerEl, '💭 气泡样式', '自定义消息气泡的外观和背景色');

		// 气泡形状设置
		this.createSubSectionHeader(containerEl, '🔘 气泡形状');
		
		new Setting(containerEl)
			.setName('🔘 气泡圆角')
			.setDesc('设置消息气泡的圆角大小，影响整体视觉风格')
			.addSlider(slider => slider
				.setLimits(0, 50, 1)
				.setValue(this.plugin.settings.bubbleRadius)
				.setDynamicTooltip()
				.onChange(async (value) => {
					this.plugin.settings.bubbleRadius = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('🌫️ 气泡透明度')
			.setDesc('调整消息气泡的透明度，0为完全透明，1为不透明')
			.addSlider(slider => slider
				.setLimits(0, 1, 0.05)
				.setValue(this.plugin.settings.bubbleOpacity)
				.setDynamicTooltip()
				.onChange(async (value) => {
					this.plugin.settings.bubbleOpacity = value;
					await this.plugin.saveSettings();
				}));

		// 气泡背景色设置
		this.createSubSectionHeader(containerEl, '🎨 气泡背景色');
		
		new Setting(containerEl)
			.setName('👤 用户消息背景')
			.setDesc('设置用户发送消息的气泡背景色')
			.addColorPicker(color => color
				.setValue(this.extractSolidColor(this.plugin.settings.userMessageBg, '#007bff'))
				.onChange(async (value) => {
					this.plugin.settings.userMessageBg = value;
					await this.plugin.saveSettings();
				}))
			.addText(text => text
				.setPlaceholder('支持渐变，如 linear-gradient(135deg, #667eea 0%, #764ba2 100%)')
				.setValue(this.plugin.settings.userMessageBg)
				.onChange(async (value) => {
					this.plugin.settings.userMessageBg = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('🤖 助手消息背景')
			.setDesc('设置AI助手回复消息的气泡背景色')
			.addColorPicker(color => color
				.setValue(this.extractSolidColor(this.plugin.settings.assistantMessageBg, '#f8f9fa'))
				.onChange(async (value) => {
					this.plugin.settings.assistantMessageBg = value;
					await this.plugin.saveSettings();
				}))
			.addText(text => text
				.setPlaceholder('支持渐变，如 linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)')
				.setValue(this.plugin.settings.assistantMessageBg)
				.onChange(async (value) => {
					this.plugin.settings.assistantMessageBg = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('⚙️ 系统消息背景')
			.setDesc('设置系统提示消息的气泡背景色')
			.addColorPicker(color => color
				.setValue(this.extractSolidColor(this.plugin.settings.systemMessageBg, '#fff3cd'))
				.onChange(async (value) => {
					this.plugin.settings.systemMessageBg = value;
					await this.plugin.saveSettings();
				}))
			.addText(text => text
				.setPlaceholder('支持渐变，如 linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)')
				.setValue(this.plugin.settings.systemMessageBg)
				.onChange(async (value) => {
					this.plugin.settings.systemMessageBg = value;
					await this.plugin.saveSettings();
				}));

		// 气泡效果设置
		this.createSubSectionHeader(containerEl, '✨ 气泡效果');
		
		new Setting(containerEl)
			.setName('🌟 启用气泡阴影')
			.setDesc('为消息气泡添加柔和的阴影效果，增强立体感')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.bubbleShadow)
				.onChange(async (value) => {
					this.plugin.settings.bubbleShadow = value;
					await this.plugin.saveSettings();
				}));
		
		new Setting(containerEl)
			.setName('✨ 启用气泡发光')
			.setDesc('为消息气泡添加与主题色一致的发光效果')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.bubbleGlow)
				.onChange(async (value) => {
					this.plugin.settings.bubbleGlow = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('🎭 启用气泡渐变')
			.setDesc('为消息气泡启用渐变背景效果')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.bubbleGradient)
				.onChange(async (value) => {
					this.plugin.settings.bubbleGradient = value;
					await this.plugin.saveSettings();
				}));

		// === 头像设置区域 ===
		this.createSectionHeader(containerEl, '👤 头像设置', '自定义用户头像的大小和效果');
		
		new Setting(containerEl)
			.setName('📏 头像大小')
			.setDesc('设置头像的直径大小')
			.addSlider(slider => slider
				.setLimits(20, 80, 1)
				.setValue(this.plugin.settings.avatarSize)
				.setDynamicTooltip()
				.onChange(async (value) => {
					this.plugin.settings.avatarSize = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('🔲 启用头像边框')
			.setDesc('为头像添加一个半透明的白色边框')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.avatarBorder)
				.onChange(async (value) => {
					this.plugin.settings.avatarBorder = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('✨ 启用头像发光')
			.setDesc('为头像添加与主题色一致的发光效果')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.avatarGlow)
				.onChange(async (value) => {
					this.plugin.settings.avatarGlow = value;
					await this.plugin.saveSettings();
				}));

		// === 布局间距区域 ===
		this.createSectionHeader(containerEl, '📐 布局间距', '调整消息之间的间距和内边距');
		
		new Setting(containerEl)
			.setName('📏 消息间距')
			.setDesc('设置不同消息之间的垂直间距')
			.addSlider(slider => slider
				.setLimits(0, 30, 1)
				.setValue(this.plugin.settings.messageSpacing)
				.setDynamicTooltip()
				.onChange(async (value) => {
					this.plugin.settings.messageSpacing = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('📦 气泡内边距')
			.setDesc('设置消息气泡内部的填充空间')
			.addSlider(slider => slider
				.setLimits(8, 24, 1)
				.setValue(this.plugin.settings.bubblePadding)
				.setDynamicTooltip()
				.onChange(async (value) => {
					this.plugin.settings.bubblePadding = value;
					await this.plugin.saveSettings();
				}));

		// === 功能开关区域 ===
		this.createSectionHeader(containerEl, '⚙️ 功能开关', '启用或禁用各种交互功能');
		
		new Setting(containerEl)
			.setName('🎬 启用动画效果')
			.setDesc('为消息的出现和交互添加平滑的动画效果')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableAnimations)
				.onChange(async (value) => {
					this.plugin.settings.enableAnimations = value;
					await this.plugin.saveSettings();
				}));
		
		new Setting(containerEl)
			.setName('🔗 启用引用跳转')
			.setDesc('点击引用消息时，页面将平滑滚动到被引用的原始消息处')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableQuoteJump)
				.onChange(async (value) => {
					this.plugin.settings.enableQuoteJump = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('🕐 显示时间戳')
			.setDesc('在每条消息下方显示其发送时间')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.showTimestamp)
				.onChange(async (value) => {
					this.plugin.settings.showTimestamp = value;
					await this.plugin.saveSettings();
				}));

		// === 代码块设置区域 ===
		this.createSectionHeader(containerEl, '💻 代码块设置', '自定义代码块的显示和功能');
		
		new Setting(containerEl)
			.setName('🚀 启用代码块增强')
			.setDesc('为聊天消息中的代码块提供语法高亮、语言标签和复制按钮等功能')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.codeBlockEnhanced)
				.onChange(async (value) => {
					this.plugin.settings.codeBlockEnhanced = value;
					await this.plugin.saveSettings();
					this.display();
				}));

		if (this.plugin.settings.codeBlockEnhanced) {
			this.createSubSectionHeader(containerEl, '🔧 代码块功能');
			
			new Setting(containerEl)
				.setName('🏷️ 显示语言标签')
				.setDesc('在代码块的右上角显示其编程语言名称')
				.addToggle(toggle => toggle
					.setValue(this.plugin.settings.codeBlockShowLanguage)
					.onChange(async (value) => {
						this.plugin.settings.codeBlockShowLanguage = value;
						await this.plugin.saveSettings();
					}));

			new Setting(containerEl)
				.setName('📋 显示复制按钮')
				.setDesc('在代码块的右上角添加一个按钮，用于一键复制代码内容')
				.addToggle(toggle => toggle
					.setValue(this.plugin.settings.codeBlockShowCopyButton)
					.onChange(async (value) => {
						this.plugin.settings.codeBlockShowCopyButton = value;
						await this.plugin.saveSettings();
					}));

			new Setting(containerEl)
				.setName('🎨 代码块高亮主题')
				.setDesc('为代码块选择一个语法高亮主题')
				.addDropdown(dropdown => dropdown
					.addOption('default', '🔤 默认主题')
					.addOption('github', '🐙 GitHub 风格')
					.addOption('vscode', '💻 VS Code 风格')
					.addOption('dracula', '🧛 Dracula 风格')
					.setValue(this.plugin.settings.codeBlockTheme)
					.onChange(async (value) => {
						this.plugin.settings.codeBlockTheme = value;
						await this.plugin.saveSettings();
					}));
		}

		// === 高级设置区域 ===
		this.createSectionHeader(containerEl, '🔧 高级设置', '专业用户的高级配置选项');
		
		new Setting(containerEl)
			.setName('🎨 自定义CSS')
			.setDesc('输入自定义CSS代码来进一步个性化聊天界面')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableCustomCSS)
				.onChange(async (value) => {
					this.plugin.settings.enableCustomCSS = value;
					await this.plugin.saveSettings();
					this.display();
				}));

		if (this.plugin.settings.enableCustomCSS) {
			new Setting(containerEl)
				.setName('📝 CSS代码')
				.setDesc('在此输入自定义CSS代码，将应用到聊天界面')
				.addTextArea(text => text
					.setPlaceholder('/* 在此输入CSS代码 */\n.chat-message {\n  /* 自定义样式 */\n}')
					.setValue(this.plugin.settings.customCSS)
					.onChange(async (value) => {
						this.plugin.settings.customCSS = value;
						await this.plugin.saveSettings();
					}));
		}

		new Setting(containerEl)
			.setName('🐛 调试模式')
			.setDesc('启用调试模式，在控制台显示详细的插件运行信息')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.debugMode)
				.onChange(async (value) => {
					this.plugin.settings.debugMode = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('🔄 兼容模式')
			.setDesc('启用兼容模式，确保与旧版本Obsidian的兼容性')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.legacyMode)
				.onChange(async (value) => {
					this.plugin.settings.legacyMode = value;
					await this.plugin.saveSettings();
				}));

		// === 重置设置区域 ===
		this.createSectionHeader(containerEl, '🔄 重置设置', '恢复默认配置或导入导出设置');
		
		new Setting(containerEl)
			.setName('🔄 重置所有设置')
			.setDesc('将所有设置恢复为默认值（此操作不可撤销）')
			.addButton(button => button
				.setButtonText('重置设置')
				.setWarning()
				.onClick(async () => {
					const confirmed = confirm('确定要重置所有设置吗？此操作不可撤销！');
					if (confirmed) {
						// 重置为默认设置
						Object.assign(this.plugin.settings, {
							...this.plugin.settings,
							// 保留用户配置文件
							userProfiles: this.plugin.settings.userProfiles
						});
						await this.plugin.saveSettings();
						this.display();
					}
				}));

		// 添加版本信息
		const versionEl = containerEl.createEl('div', { cls: 'chatstyle-version-info' });
		versionEl.createEl('p', { 
			text: `ChatStyle 插件版本 v${this.plugin.manifest.version}`,
			cls: 'chatstyle-version-text'
		});
		versionEl.createEl('p', { 
			text: '感谢使用 ChatStyle 插件！如有问题请访问 GitHub 仓库反馈。',
			cls: 'chatstyle-footer-text'
		});
	}

	// 辅助方法：创建区域标题
	private createSectionHeader(containerEl: HTMLElement, title: string, description: string): void {
		const headerEl = containerEl.createEl('div', { cls: 'chatstyle-section-header' });
		headerEl.createEl('h2', { text: title, cls: 'chatstyle-section-title' });
		headerEl.createEl('p', { text: description, cls: 'chatstyle-section-desc' });
	}

	// 辅助方法：创建子区域标题
	private createSubSectionHeader(containerEl: HTMLElement, title: string): void {
		const subHeaderEl = containerEl.createEl('div', { cls: 'chatstyle-subsection-header' });
		subHeaderEl.createEl('h4', { text: title, cls: 'chatstyle-subsection-title' });
	}

	// 辅助方法：从复杂颜色值中提取纯色
	private extractSolidColor(colorValue: string, fallback: string): string {
		if (colorValue.includes('rgba') || colorValue.includes('linear-gradient')) {
			return fallback;
		}
		return colorValue;
	}

	// 辅助方法：添加自定义样式
	private addCustomStyles(): void {
		const styleEl = document.createElement('style');
		styleEl.textContent = `
			.chatstyle-settings-title {
				text-align: center;
				margin-bottom: 2rem;
				padding: 2rem;
				background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
				border-radius: 16px;
				color: white;
				box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
				position: relative;
				overflow: hidden;
			}

			.chatstyle-settings-title::before {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.1) 100%);
				animation: shimmer 3s ease-in-out infinite;
			}

			@keyframes shimmer {
				0%, 100% { transform: translateX(-100%); }
				50% { transform: translateX(100%); }
			}

			.chatstyle-settings-title h1 {
				margin: 0 0 0.5rem 0;
				font-size: 2rem;
				font-weight: 700;
				text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
				position: relative;
				z-index: 1;
			}

			.chatstyle-settings-subtitle {
				margin: 0;
				opacity: 0.9;
				font-size: 1.1rem;
				position: relative;
				z-index: 1;
			}

			.chatstyle-section-header {
				margin: 2.5rem 0 1.5rem 0;
				padding: 1.5rem;
				background: var(--background-secondary);
				border-radius: 12px;
				border-left: 5px solid var(--interactive-accent);
				box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
				transition: all 0.3s ease;
			}

			.chatstyle-section-header:hover {
				transform: translateY(-2px);
				box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
			}

			.chatstyle-section-title {
				margin: 0 0 0.5rem 0;
				color: var(--text-accent);
				font-size: 1.4rem;
				font-weight: 600;
				display: flex;
				align-items: center;
				gap: 0.5rem;
			}

			.chatstyle-section-desc {
				margin: 0;
				color: var(--text-muted);
				font-size: 1rem;
				line-height: 1.5;
			}

			.chatstyle-subsection-header {
				margin: 2rem 0 1rem 0;
				padding: 0.75rem 1rem;
				background: var(--background-modifier-form-field);
				border-radius: 8px;
				border-left: 3px solid var(--text-accent);
			}

			.chatstyle-subsection-title {
				margin: 0;
				color: var(--text-normal);
				font-size: 1.2rem;
				font-weight: 500;
				display: flex;
				align-items: center;
				gap: 0.5rem;
			}

			.setting-item {
				border-radius: 8px;
				margin-bottom: 0.75rem;
				padding: 0.5rem;
				transition: all 0.2s ease;
				border: 1px solid transparent;
			}

			.setting-item:hover {
				background-color: var(--background-modifier-hover);
				border-color: var(--background-modifier-border);
				transform: translateX(4px);
			}

			.setting-item-name {
				font-weight: 600;
				color: var(--text-normal);
				font-size: 1rem;
				display: flex;
				align-items: center;
				gap: 0.5rem;
			}

			.setting-item-description {
				color: var(--text-muted);
				font-size: 0.9rem;
				line-height: 1.4;
				margin-top: 0.25rem;
			}

			.setting-item-control {
				display: flex;
				align-items: center;
				gap: 0.5rem;
				flex-wrap: wrap;
			}

			.setting-item input[type="color"] {
				width: 40px;
				height: 32px;
				border-radius: 6px;
				border: 2px solid var(--background-modifier-border);
				cursor: pointer;
				transition: all 0.2s ease;
			}

			.setting-item input[type="color"]:hover {
				border-color: var(--interactive-accent);
				transform: scale(1.05);
			}

			.setting-item input[type="text"] {
				flex: 1;
				min-width: 200px;
				padding: 0.5rem;
				border-radius: 6px;
				border: 1px solid var(--background-modifier-border);
				background: var(--background-primary);
				color: var(--text-normal);
				transition: all 0.2s ease;
			}

			.setting-item input[type="text"]:focus {
				border-color: var(--interactive-accent);
				outline: none;
				box-shadow: 0 0 0 2px rgba(var(--interactive-accent-rgb), 0.2);
			}

			.setting-item textarea {
				width: 100%;
				min-height: 120px;
				padding: 0.75rem;
				border-radius: 6px;
				border: 1px solid var(--background-modifier-border);
				background: var(--background-primary);
				color: var(--text-normal);
				font-family: 'Courier New', monospace;
				font-size: 0.9rem;
				resize: vertical;
				transition: all 0.2s ease;
			}

			.setting-item textarea:focus {
				border-color: var(--interactive-accent);
				outline: none;
				box-shadow: 0 0 0 2px rgba(var(--interactive-accent-rgb), 0.2);
			}

			.setting-item .slider {
				flex: 1;
				min-width: 150px;
			}

			.setting-item .dropdown {
				flex: 1;
				min-width: 200px;
			}

			.setting-item .checkbox-container {
				display: flex;
				align-items: center;
				gap: 0.5rem;
			}

			.chatstyle-version-info {
				margin-top: 3rem;
				padding: 1.5rem;
				background: var(--background-secondary);
				border-radius: 12px;
				text-align: center;
				border: 1px solid var(--background-modifier-border);
			}

			.chatstyle-version-text {
				margin: 0 0 0.5rem 0;
				font-weight: 600;
				color: var(--text-accent);
			}

			.chatstyle-footer-text {
				margin: 0;
				color: var(--text-muted);
				font-size: 0.9rem;
			}

			.mod-warning {
				background-color: var(--background-modifier-error) !important;
				color: var(--text-on-accent) !important;
			}

			.mod-warning:hover {
				background-color: var(--background-modifier-error-hover) !important;
			}
		`;
		document.head.appendChild(styleEl);
	}
}
