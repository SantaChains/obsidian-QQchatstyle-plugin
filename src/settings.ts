export interface ChatStyleSettings {
	// === 核心主题设置 ===
	defaultTheme: string;
	darkModeTheme: string;
	lightModeTheme: string;
	currentPreset: string;
	enablePresetThemes: boolean;
	autoSwitchTheme: boolean; // 自动切换主题
	
	// === 标题栏配色设置 ===
	titleBarColor: string;
	titleBarDarkColor: string;
	titleTextColor: string;
	titleTextDarkColor: string;
	enableCustomTitleBar: boolean;
	titleBarBlur: boolean; // 标题栏模糊效果
	titleBarGradientAnimation: boolean; // 标题栏渐变动画
	
	// === 字体与排版设置 ===
	fontSize: number;
	fontFamily: string;
	fontWeight: string;
	lineHeight: number; // 行高
	letterSpacing: number; // 字间距
	textShadow: boolean; // 文字阴影
	
	// === 消息气泡设置 ===
	bubbleRadius: number;
	bubbleOpacity: number;
	bubbleShadow: boolean;
	bubbleGlow: boolean;
	bubbleGradient: boolean;
	bubbleBorderWidth: number; // 气泡边框宽度
	bubbleHoverEffect: boolean; // 气泡悬停效果
	
	// === 消息颜色配置 ===
	userMessageBg: string;
	userMessageColor: string;
	assistantMessageBg: string;
	assistantMessageColor: string;
	systemMessageBg: string;
	systemMessageColor: string;
	quotedMessageBg: string; // 引用消息背景色
	quotedMessageColor: string; // 引用消息文字色
	
	// === 头像设置 ===
	avatarSize: number;
	avatarRadius: number;
	avatarBorder: boolean;
	avatarGlow: boolean;
	avatarShadow: boolean; // 头像阴影
	avatarHoverScale: boolean; // 头像悬停缩放
	
	// === 布局间距设置 ===
	messageSpacing: number;
	bubblePadding: number;
	containerPadding: number; // 容器内边距
	maxMessageWidth: number; // 消息最大宽度
	
	// === 动画与交互设置 ===
	enableAnimations: boolean;
	animationSpeed: number;
	animationEasing: string; // 动画缓动函数
	enableParallax: boolean; // 视差滚动效果
	enableTypewriter: boolean; // 打字机效果
	
	// === 功能开关设置 ===
	enableQuoteJump: boolean;
	enableAutoFormat: boolean;
	showTimestamp: boolean;
	showMessageIndex: boolean; // 显示消息序号
	enableMessageSearch: boolean; // 消息搜索功能
	enableExportChat: boolean; // 聊天导出功能
	
	// === 代码块增强设置 ===
	codeBlockEnhanced: boolean;
	codeBlockShowLanguage: boolean;
	codeBlockShowCopyButton: boolean;
	codeBlockTheme: string;
	codeBlockLineNumbers: boolean; // 代码行号
	codeBlockWordWrap: boolean; // 代码自动换行
	
	// === 高级视觉效果 ===
	enableGlassmorphism: boolean; // 玻璃态效果
	enableNeonEffect: boolean; // 霓虹效果
	enableParticles: boolean; // 粒子背景
	backgroundBlur: number; // 背景模糊度
	
	// === 可访问性设置 ===
	highContrast: boolean; // 高对比度模式
	reducedMotion: boolean; // 减少动画
	fontSize_accessibility: number; // 无障碍字体大小
	colorBlindFriendly: boolean; // 色盲友好模式
	
	// === 性能优化设置 ===
	enableVirtualScrolling: boolean; // 虚拟滚动
	lazyLoadImages: boolean; // 图片懒加载
	maxRenderMessages: number; // 最大渲染消息数
	
	// === 自定义用户配置 ===
	userProfiles: Record<string, UserProfile>;
	customCSS: string; // 自定义CSS
	enableCustomCSS: boolean; // 启用自定义CSS
	
	// === 兼容性设置 ===
	legacyMode: boolean; // 兼容模式
	debugMode: boolean; // 调试模式
	
	// === 备用颜色设置（保持向后兼容） ===
	defaultLeftColor: string;
	defaultRightColor: string;
}

export interface UserProfile {
	displayName: string;
	avatar: string;
	color: string;
	position: 'L' | 'R';
}

export const DEFAULT_SETTINGS: ChatStyleSettings = {
	// === 核心主题设置 ===
	defaultTheme: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
	darkModeTheme: 'linear-gradient(135deg, #1e1e2e 0%, #2d2d44 50%, #3c3c5a 100%)',
	lightModeTheme: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 50%, #ff9a9e 100%)',
	currentPreset: 'default',
	enablePresetThemes: true,
	autoSwitchTheme: false,
	
	// === 标题栏配色设置 ===
	titleBarColor: 'rgba(255, 255, 255, 0.95)',
	titleBarDarkColor: 'rgba(30, 30, 30, 0.95)',
	titleTextColor: '#2c3e50',
	titleTextDarkColor: '#ecf0f1',
	enableCustomTitleBar: true,
	titleBarBlur: false,
	titleBarGradientAnimation: false,
	
	// === 字体与排版设置 ===
	fontSize: 14,
	fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
	fontWeight: '400',
	lineHeight: 1.5,
	letterSpacing: 0,
	textShadow: false,
	
	// === 消息气泡设置 ===
	bubbleRadius: 18,
	bubbleOpacity: 0.9,
	bubbleShadow: true,
	bubbleGlow: false,
	bubbleGradient: false,
	bubbleBorderWidth: 0,
	bubbleHoverEffect: true,
	
	// === 消息颜色配置 ===
	userMessageBg: '#007bff',
	userMessageColor: '#ffffff',
	assistantMessageBg: '#f8f9fa',
	assistantMessageColor: '#333333',
	systemMessageBg: '#fff3cd',
	systemMessageColor: '#666666',
	quotedMessageBg: '#e9ecef',
	quotedMessageColor: '#495057',
	
	// === 头像设置 ===
	avatarSize: 40,
	avatarRadius: 20,
	avatarBorder: true,
	avatarGlow: false,
	avatarShadow: true,
	avatarHoverScale: true,
	
	// === 布局间距设置 ===
	messageSpacing: 8,
	bubblePadding: 12,
	containerPadding: 16,
	maxMessageWidth: 80,
	
	// === 动画与交互设置 ===
	enableAnimations: true,
	animationSpeed: 1,
	animationEasing: 'ease-in-out',
	enableParallax: false,
	enableTypewriter: false,
	
	// === 功能开关设置 ===
	enableQuoteJump: true,
	enableAutoFormat: true,
	showTimestamp: false,
	showMessageIndex: false,
	enableMessageSearch: true,
	enableExportChat: true,
	
	// === 代码块增强设置 ===
	codeBlockEnhanced: true,
	codeBlockShowLanguage: true,
	codeBlockShowCopyButton: true,
	codeBlockTheme: 'default',
	codeBlockLineNumbers: false,
	codeBlockWordWrap: true,
	
	// === 高级视觉效果 ===
	enableGlassmorphism: false,
	enableNeonEffect: false,
	enableParticles: false,
	backgroundBlur: 0,
	
	// === 可访问性设置 ===
	highContrast: false,
	reducedMotion: false,
	fontSize_accessibility: 16,
	colorBlindFriendly: false,
	
	// === 性能优化设置 ===
	enableVirtualScrolling: false,
	lazyLoadImages: true,
	maxRenderMessages: 100,
	
	// === 自定义用户配置 ===
	userProfiles: {},
	customCSS: '',
	enableCustomCSS: false,
	
	// === 兼容性设置 ===
	legacyMode: false,
	debugMode: false,
	
	// === 备用颜色设置 ===
	defaultLeftColor: '#5a67d8',
	defaultRightColor: '#805ad5'
};

// 标题栏专用配色方案
export const TITLE_BAR_PRESETS = {
	// 浅色系列
	light_minimal: {
		name: '🤍 极简白',
		titleBarColor: 'rgba(255, 255, 255, 0.95)',
		titleTextColor: '#2c3e50',
		titleBarDarkColor: 'rgba(30, 30, 30, 0.95)',
		titleTextDarkColor: '#ecf0f1',
		fontSize: 16,
		fontWeight: '600',
		fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
	},
	light_blue: {
		name: '💙 清新蓝',
		titleBarColor: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
		titleTextColor: '#1976d2',
		titleBarDarkColor: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
		titleTextDarkColor: '#64b5f6',
		fontSize: 16,
		fontWeight: '600',
		fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
	},
	light_green: {
		name: '💚 自然绿',
		titleBarColor: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
		titleTextColor: '#2e7d32',
		titleBarDarkColor: 'linear-gradient(135deg, #1b5e20 0%, #388e3c 100%)',
		titleTextDarkColor: '#81c784',
		fontSize: 16,
		fontWeight: '600',
		fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
	},
	light_purple: {
		name: '💜 优雅紫',
		titleBarColor: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
		titleTextColor: '#7b1fa2',
		titleBarDarkColor: 'linear-gradient(135deg, #4a148c 0%, #7b1fa2 100%)',
		titleTextDarkColor: '#ce93d8',
		fontSize: 17,
		fontWeight: '500',
		fontFamily: '"Georgia", "Times New Roman", serif'
	},
	light_orange: {
		name: '🧡 温暖橙',
		titleBarColor: 'linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%)',
		titleTextColor: '#ef6c00',
		titleBarDarkColor: 'linear-gradient(135deg, #e65100 0%, #ff9800 100%)',
		titleTextDarkColor: '#ffb74d',
		fontSize: 16,
		fontWeight: '600',
		fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
	},
	light_pink: {
		name: '🩷 甜美粉',
		titleBarColor: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)',
		titleTextColor: '#c2185b',
		titleBarDarkColor: 'linear-gradient(135deg, #880e4f 0%, #ad1457 100%)',
		titleTextDarkColor: '#f06292',
		fontSize: 15,
		fontWeight: '500',
		fontFamily: '"Comic Sans MS", "Trebuchet MS", cursive'
	},
	light_teal: {
		name: '💎 青绿色',
		titleBarColor: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)',
		titleTextColor: '#00695c',
		titleBarDarkColor: 'linear-gradient(135deg, #004d40 0%, #00695c 100%)',
		titleTextDarkColor: '#4db6ac',
		fontSize: 16,
		fontWeight: '600',
		fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
	},
	light_amber: {
		name: '🌟 琥珀金',
		titleBarColor: 'linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%)',
		titleTextColor: '#ff8f00',
		titleBarDarkColor: 'linear-gradient(135deg, #ff6f00 0%, #ff8f00 100%)',
		titleTextDarkColor: '#ffc107',
		fontSize: 18,
		fontWeight: '700',
		fontFamily: '"Playfair Display", "Times New Roman", serif'
	},

	// 深色系列
	dark_minimal: {
		name: '🖤 深邃黑',
		titleBarColor: 'rgba(248, 249, 250, 0.95)',
		titleTextColor: '#212529',
		titleBarDarkColor: 'rgba(18, 18, 18, 0.95)',
		titleTextDarkColor: '#f8f9fa',
		fontSize: 16,
		fontWeight: '600',
		fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
	},
	dark_blue: {
		name: '🌌 深海蓝',
		titleBarColor: 'linear-gradient(135deg, #e3f2fd 0%, #90caf9 100%)',
		titleTextColor: '#0d47a1',
		titleBarDarkColor: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)',
		titleTextDarkColor: '#90caf9',
		fontSize: 17,
		fontWeight: '700',
		fontFamily: '"Roboto Condensed", "Arial Narrow", sans-serif'
	},
	dark_purple: {
		name: '🔮 神秘紫',
		titleBarColor: 'linear-gradient(135deg, #f3e5f5 0%, #ba68c8 100%)',
		titleTextColor: '#4a148c',
		titleBarDarkColor: 'linear-gradient(135deg, #4a148c 0%, #6a1b9a 100%)',
		titleTextDarkColor: '#ba68c8',
		fontSize: 16,
		fontWeight: '500',
		fontFamily: '"Crimson Text", "Times New Roman", serif'
	},
	dark_red: {
		name: '❤️ 热情红',
		titleBarColor: 'linear-gradient(135deg, #ffebee 0%, #ef5350 100%)',
		titleTextColor: '#b71c1c',
		titleBarDarkColor: 'linear-gradient(135deg, #b71c1c 0%, #d32f2f 100%)',
		titleTextDarkColor: '#ef5350',
		fontSize: 18,
		fontWeight: '800',
		fontFamily: '"Impact", "Arial Black", sans-serif'
	},
	dark_green: {
		name: '🌲 森林绿',
		titleBarColor: 'linear-gradient(135deg, #e8f5e8 0%, #66bb6a 100%)',
		titleTextColor: '#1b5e20',
		titleBarDarkColor: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
		titleTextDarkColor: '#66bb6a',
		fontSize: 16,
		fontWeight: '600',
		fontFamily: '"Merriweather", "Georgia", serif'
	},
	dark_orange: {
		name: '🔥 炽热橙',
		titleBarColor: 'linear-gradient(135deg, #fff3e0 0%, #ff7043 100%)',
		titleTextColor: '#bf360c',
		titleBarDarkColor: 'linear-gradient(135deg, #bf360c 0%, #d84315 100%)',
		titleTextDarkColor: '#ff7043',
		fontSize: 17,
		fontWeight: '700',
		fontFamily: '"Oswald", "Arial", sans-serif'
	},
	dark_indigo: {
		name: '🌃 靛蓝夜',
		titleBarColor: 'linear-gradient(135deg, #e8eaf6 0%, #7986cb 100%)',
		titleTextColor: '#1a237e',
		titleBarDarkColor: 'linear-gradient(135deg, #1a237e 0%, #303f9f 100%)',
		titleTextDarkColor: '#7986cb',
		fontSize: 16,
		fontWeight: '600',
		fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
	},
	dark_brown: {
		name: '🍫 咖啡棕',
		titleBarColor: 'linear-gradient(135deg, #efebe9 0%, #a1887f 100%)',
		titleTextColor: '#3e2723',
		titleBarDarkColor: 'linear-gradient(135deg, #3e2723 0%, #5d4037 100%)',
		titleTextDarkColor: '#a1887f',
		fontSize: 16,
		fontWeight: '500',
		fontFamily: '"Lora", "Times New Roman", serif'
	},

	// 渐变系列
	gradient_sunset: {
		name: '🌅 日落渐变',
		titleBarColor: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
		titleTextColor: '#ffffff',
		titleBarDarkColor: 'linear-gradient(135deg, #8b0000 0%, #4b0082 50%, #191970 100%)',
		titleTextDarkColor: '#fecfef',
		fontSize: 18,
		fontWeight: '700',
		fontFamily: '"Dancing Script", "Brush Script MT", cursive'
	},
	gradient_ocean: {
		name: '🌊 海洋渐变',
		titleBarColor: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
		titleTextColor: '#0077be',
		titleBarDarkColor: 'linear-gradient(135deg, #003d5b 0%, #0077be 100%)',
		titleTextDarkColor: '#a8edea',
		fontSize: 16,
		fontWeight: '500',
		fontFamily: '"Quicksand", "Verdana", sans-serif'
	},
	gradient_forest: {
		name: '🌳 森林渐变',
		titleBarColor: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
		titleTextColor: '#2d5016',
		titleBarDarkColor: 'linear-gradient(135deg, #2d5016 0%, #4a6741 100%)',
		titleTextDarkColor: '#d299c2',
		fontSize: 16,
		fontWeight: '600',
		fontFamily: '"Cabin", "Trebuchet MS", sans-serif'
	},
	gradient_aurora: {
		name: '🌌 极光渐变',
		titleBarColor: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 50%, #d299c2 100%)',
		titleTextColor: '#ffffff',
		titleBarDarkColor: 'linear-gradient(135deg, #0f4c75 0%, #3282b8 50%, #1b262c 100%)',
		titleTextDarkColor: '#a8edea',
		fontSize: 17,
		fontWeight: '600',
		fontFamily: '"Orbitron", "Courier New", monospace'
	},

	// 特殊主题系列
	glassmorphism_light: {
		name: '🔍 玻璃态浅色',
		titleBarColor: 'rgba(255, 255, 255, 0.25)',
		titleTextColor: '#2c3e50',
		titleBarDarkColor: 'rgba(255, 255, 255, 0.1)',
		titleTextDarkColor: '#ecf0f1',
		fontSize: 16,
		fontWeight: '400',
		fontFamily: '"Inter", "Helvetica Neue", sans-serif'
	},
	glassmorphism_dark: {
		name: '🌫️ 玻璃态深色',
		titleBarColor: 'rgba(0, 0, 0, 0.25)',
		titleTextColor: '#ffffff',
		titleBarDarkColor: 'rgba(0, 0, 0, 0.4)',
		titleTextDarkColor: '#ffffff',
		fontSize: 16,
		fontWeight: '400',
		fontFamily: '"Inter", "Helvetica Neue", sans-serif'
	},
	neon_cyan: {
		name: '💠 霓虹青',
		titleBarColor: 'linear-gradient(135deg, #00ffff 0%, #0080ff 100%)',
		titleTextColor: '#ffffff',
		titleBarDarkColor: 'linear-gradient(135deg, #008080 0%, #004080 100%)',
		titleTextDarkColor: '#00ffff',
		fontSize: 18,
		fontWeight: '800',
		fontFamily: '"Orbitron", "Courier New", monospace'
	},
	neon_pink: {
		name: '💖 霓虹粉',
		titleBarColor: 'linear-gradient(135deg, #ff1493 0%, #ff69b4 100%)',
		titleTextColor: '#ffffff',
		titleBarDarkColor: 'linear-gradient(135deg, #8b0a50 0%, #c71585 100%)',
		titleTextDarkColor: '#ff69b4',
		fontSize: 18,
		fontWeight: '800',
		fontFamily: '"Orbitron", "Courier New", monospace'
	}
};

// 预设主题配色方案 - 基于顶级设计理论
export const PRESET_THEMES = {
	default: {
		name: '🎯 经典蓝调',
		background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
		darkBackground: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
		leftColor: '#e3f2fd',
		rightColor: '#4caf50',
		accentColor: '#2196f3',
		titleBarColor: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
		titleBarDarkColor: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
		titleTextColor: '#1976d2',
		titleTextDarkColor: '#64b5f6',
		category: 'classic'
	},
	
	// 🎨 艺术大师系列
	monet: {
		name: '🎨 莫奈印象',
		background: 'linear-gradient(135deg, #a8e6cf 0%, #dcedc1 50%, #ffd3a5 100%)',
		darkBackground: 'linear-gradient(135deg, #2d5016 0%, #4a6741 50%, #8b4513 100%)',
		leftColor: '#81c784',
		rightColor: '#ffb74d',
		accentColor: '#4fc3f7',
		titleBarColor: 'linear-gradient(135deg, #a8e6cf 0%, #dcedc1 100%)',
		titleBarDarkColor: 'linear-gradient(135deg, #2d5016 0%, #4a6741 100%)',
		titleTextColor: '#2e7d32',
		titleTextDarkColor: '#81c784',
		category: 'art'
	},
	vangogh: {
		name: '🌻 梵高星夜',
		background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #f7b733 100%)',
		darkBackground: 'linear-gradient(135deg, #0f1419 0%, #1a252f 50%, #2d3748 100%)',
		leftColor: '#3f51b5',
		rightColor: '#ff9800',
		accentColor: '#ffeb3b',
		titleBarColor: 'linear-gradient(135deg, #1e3c72 0%, #f7b733 100%)',
		titleBarDarkColor: 'linear-gradient(135deg, #0f1419 0%, #2d3748 100%)',
		titleTextColor: '#ffffff',
		titleTextDarkColor: '#ffeb3b',
		category: 'art'
	},
	picasso: {
		name: '🎭 毕加索蓝调',
		background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
		darkBackground: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
		leftColor: '#5c6bc0',
		rightColor: '#ab47bc',
		accentColor: '#ec407a',
		titleBarColor: 'linear-gradient(135deg, #667eea 0%, #f093fb 100%)',
		titleBarDarkColor: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
		titleTextColor: '#ffffff',
		titleTextDarkColor: '#ec407a',
		category: 'art'
	},

	// 🌈 自然灵感系列
	aurora: {
		name: '🌌 极光绚烂',
		background: 'linear-gradient(135deg, #00c9ff 0%, #92fe9d 25%, #ff9a9e 50%, #a8edea 75%, #fed6e3 100%)',
		darkBackground: 'linear-gradient(135deg, #0f4c75 0%, #3282b8 25%, #bbe1fa 50%, #1b262c 75%, #0f3460 100%)',
		leftColor: '#00bcd4',
		rightColor: '#e91e63',
		accentColor: '#4caf50',
		titleBarColor: 'linear-gradient(135deg, #00c9ff 0%, #92fe9d 50%, #fed6e3 100%)',
		titleBarDarkColor: 'linear-gradient(135deg, #0f4c75 0%, #1b262c 50%, #0f3460 100%)',
		titleTextColor: '#ffffff',
		titleTextDarkColor: '#4caf50',
		category: 'nature'
	},
	rainbow: {
		name: '🌈 彩虹幻境',
		background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 16%, #48dbfb 33%, #ff9ff3 50%, #54a0ff 66%, #5f27cd 83%, #00d2d3 100%)',
		darkBackground: 'linear-gradient(135deg, #8b0000 0%, #b8860b 16%, #008b8b 33%, #8b008b 50%, #00008b 66%, #4b0082 83%, #008080 100%)',
		leftColor: '#ff6b6b',
		rightColor: '#5f27cd',
		accentColor: '#feca57',
		titleBarColor: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 33%, #5f27cd 66%, #00d2d3 100%)',
		titleBarDarkColor: 'linear-gradient(135deg, #8b0000 0%, #4b0082 50%, #008080 100%)',
		titleTextColor: '#ffffff',
		titleTextDarkColor: '#feca57',
		category: 'nature'
	},
	coral: {
		name: '🪸 珊瑚海洋',
		background: 'linear-gradient(135deg, #ff7675 0%, #fd79a8 25%, #fdcb6e 50%, #6c5ce7 75%, #74b9ff 100%)',
		darkBackground: 'linear-gradient(135deg, #2d3436 0%, #636e72 25%, #ddd 50%, #74b9ff 75%, #0984e3 100%)',
		leftColor: '#fd79a8',
		rightColor: '#6c5ce7',
		accentColor: '#fdcb6e',
		titleBarColor: 'linear-gradient(135deg, #ff7675 0%, #fd79a8 50%, #74b9ff 100%)',
		titleBarDarkColor: 'linear-gradient(135deg, #2d3436 0%, #636e72 50%, #0984e3 100%)',
		titleTextColor: '#ffffff',
		titleTextDarkColor: '#fdcb6e',
		category: 'nature'
	},

	// 🎮 动漫游戏系列
	chainsaw: {
		name: '⚡ 电锯人',
		background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ffcc02 100%)',
		darkBackground: 'linear-gradient(135deg, #8b0000 0%, #dc143c 50%, #ff4500 100%)',
		leftColor: '#ff6b35',
		rightColor: '#dc143c',
		accentColor: '#ffcc02',
		titleBarColor: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ffcc02 100%)',
		titleBarDarkColor: 'linear-gradient(135deg, #8b0000 0%, #dc143c 50%, #ff4500 100%)',
		titleTextColor: '#ffffff',
		titleTextDarkColor: '#ffcc02',
		category: 'anime'
	},
	persona: {
		name: "🎭 女神异闻录P5R",
		background: "linear-gradient(135deg, #0A0A0A 0%, #1C1C1C 20%, #DC143C 40%, #000000 60%, #8B0000 80%, #0A0A0A 100%)",
		darkBackground: "linear-gradient(135deg, #000000 0%, #1A1A1A 25%, #8B0000 50%, #DC143C 75%, #000000 100%)",
		leftColor: "#DC143C",
		rightColor: "#8B0000",
		accentColor: "#FF0040",
		titleBarColor: "linear-gradient(135deg, #1A1A1A 0%, #DC143C 100%)",
		titleBarDarkColor: "linear-gradient(135deg, #000000 0%, #8B0000 100%)",
		titleTextColor: "#FFFFFF",
		titleTextDarkColor: "#DC143C",
		category: "anime"
	},
	genshin: {
		name: '⚔️ 原神幻想',
		background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 25%, #43e97b 50%, #38f9d7 75%, #5ee7df 100%)',
		darkBackground: 'linear-gradient(135deg, #0f3460 0%, #16213e 25%, #1a1a2e 50%, #000000 75%, #2c3e50 100%)',
		leftColor: '#4facfe',
		rightColor: '#43e97b',
		accentColor: '#38f9d7',
		titleBarColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #5ee7df 100%)',
		titleBarDarkColor: 'linear-gradient(135deg, #0f3460 0%, #1a1a2e 50%, #2c3e50 100%)',
		titleTextColor: '#ffffff',
		titleTextDarkColor: '#38f9d7',
		category: 'anime'
	},

	// 🏢 品牌设计系列
	apple: {
		name: '🍎 苹果简约',
		background: 'linear-gradient(135deg, #f5f5f7 0%, #e5e5ea 100%)',
		darkBackground: 'linear-gradient(135deg, #1c1c1e 0%, #2c2c2e 100%)',
		leftColor: '#007aff',
		rightColor: '#34c759',
		accentColor: '#ff3b30',
		titleBarColor: 'linear-gradient(135deg, #f5f5f7 0%, #e5e5ea 100%)',
		titleBarDarkColor: 'linear-gradient(135deg, #1c1c1e 0%, #2c2c2e 100%)',
		titleTextColor: '#1d1d1f',
		titleTextDarkColor: '#f5f5f7',
		category: 'brand'
	},
	google: {
		name: '🔍 谷歌活力',
		background: 'linear-gradient(135deg, #4285f4 0%, #34a853 25%, #fbbc05 50%, #ea4335 75%, #9aa0a6 100%)',
		darkBackground: 'linear-gradient(135deg, #1a73e8 0%, #137333 25%, #f9ab00 50%, #d33b01 75%, #5f6368 100%)',
		leftColor: '#4285f4',
		rightColor: '#ea4335',
		accentColor: '#fbbc05',
		titleBarColor: 'linear-gradient(135deg, #4285f4 0%, #34a853 33%, #fbbc05 66%, #ea4335 100%)',
		titleBarDarkColor: 'linear-gradient(135deg, #1a73e8 0%, #137333 33%, #f9ab00 66%, #d33b01 100%)',
		titleTextColor: '#ffffff',
		titleTextDarkColor: '#fbbc05',
		category: 'brand'
	},
	netflix: {
		name: '🎬 奈飞红黑',
		background: 'linear-gradient(135deg, #e50914 0%, #221f1f 50%, #f5f5f1 100%)',
		darkBackground: 'linear-gradient(135deg, #000000 0%, #e50914 50%, #221f1f 100%)',
		leftColor: '#e50914',
		rightColor: '#221f1f',
		accentColor: '#f5f5f1',
		titleBarColor: 'linear-gradient(135deg, #e50914 0%, #221f1f 100%)',
		titleBarDarkColor: 'linear-gradient(135deg, #000000 0%, #e50914 50%, #221f1f 100%)',
		titleTextColor: '#ffffff',
		titleTextDarkColor: '#e50914',
		category: 'brand'
	},

	// 🌃 科技未来系列
	cyberpunk: {
		name: '🌃 赛博朋克2077',
		background: 'linear-gradient(135deg, #0A0A0A 0%, #001122 20%, #00FFFF 35%, #FF0080 50%, #FFFF00 65%, #001122 80%, #0A0A0A 100%)',
		darkBackground: 'linear-gradient(135deg, #000000 0%, #0D1B2A 25%, #00FFFF 40%, #FF0080 55%, #FFFF00 70%, #0D1B2A 85%, #000000 100%)',
		leftColor: '#00FFFF',
		rightColor: '#FF0080',
		accentColor: '#FFFF00',
		titleBarColor: 'linear-gradient(135deg, #001122 0%, #00FFFF 50%, #FF0080 100%)',
		titleBarDarkColor: 'linear-gradient(135deg, #000000 0%, #0D1B2A 50%, #001122 100%)',
		titleTextColor: '#00FFFF',
		titleTextDarkColor: '#FFFF00',
		category: 'tech'
	},
	matrix: {
		name: '💊 黑客帝国',
		background: 'linear-gradient(135deg, #000000 0%, #003300 50%, #00ff00 100%)',
		darkBackground: 'linear-gradient(135deg, #000000 0%, #001100 50%, #003300 100%)',
		leftColor: '#00ff00',
		rightColor: '#008000',
		accentColor: '#00ffff',
		titleBarColor: 'linear-gradient(135deg, #000000 0%, #003300 50%, #00ff00 100%)',
		titleBarDarkColor: 'linear-gradient(135deg, #000000 0%, #001100 50%, #003300 100%)',
		titleTextColor: '#00ff00',
		titleTextDarkColor: '#00ffff',
		category: 'tech'
	},
	neon: {
		name: '💡 霓虹都市',
		background: 'linear-gradient(135deg, #ff006e 0%, #8338ec 25%, #3a86ff 50%, #06ffa5 75%, #ffbe0b 100%)',
		darkBackground: 'linear-gradient(135deg, #1a0033 0%, #2d1b69 25%, #1e3a8a 50%, #064e3b 75%, #7c2d12 100%)',
		leftColor: '#ff006e',
		rightColor: '#06ffa5',
		accentColor: '#ffbe0b',
		titleBarColor: 'linear-gradient(135deg, #ff006e 0%, #8338ec 33%, #3a86ff 66%, #06ffa5 100%)',
		titleBarDarkColor: 'linear-gradient(135deg, #1a0033 0%, #2d1b69 33%, #1e3a8a 66%, #064e3b 100%)',
		titleTextColor: '#ffffff',
		titleTextDarkColor: '#ffbe0b',
		category: 'tech'
	},

	// 🎨 设计系统系列
	material: {
		name: '🎨 Material Design',
		background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
		darkBackground: 'linear-gradient(135deg, #434343 0%, #000000 100%)',
		leftColor: '#2196f3',
		rightColor: '#9c27b0',
		accentColor: '#ff5722',
		titleBarColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
		titleBarDarkColor: 'linear-gradient(135deg, #434343 0%, #000000 100%)',
		titleTextColor: '#ffffff',
		titleTextDarkColor: '#ff5722',
		category: 'design'
	},
	fluent: {
		name: '🪟 微软流畅',
		background: 'linear-gradient(135deg, #0078d4 0%, #106ebe 25%, #005a9e 50%, #004578 75%, #003d5b 100%)',
		darkBackground: 'linear-gradient(135deg, #1b1b1b 0%, #2d2d30 25%, #3e3e42 50%, #4f4f55 75%, #605f64 100%)',
		leftColor: '#0078d4',
		rightColor: '#005a9e',
		accentColor: '#00bcf2',
		titleBarColor: 'linear-gradient(135deg, #0078d4 0%, #106ebe 50%, #005a9e 100%)',
		titleBarDarkColor: 'linear-gradient(135deg, #1b1b1b 0%, #3e3e42 50%, #605f64 100%)',
		titleTextColor: '#ffffff',
		titleTextDarkColor: '#00bcf2',
		category: 'design'
	},

	// 🌸 季节情感系列
	sakura: {
		name: '🌸 樱花春日',
		background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 50%, #ff9a9e 100%)',
		darkBackground: 'linear-gradient(135deg, #2c1810 0%, #8b4513 50%, #654321 100%)',
		leftColor: '#ffb3d9',
		rightColor: '#ff69b4',
		accentColor: '#ff1493',
		titleBarColor: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 50%, #ff9a9e 100%)',
		titleBarDarkColor: 'linear-gradient(135deg, #2c1810 0%, #8b4513 50%, #654321 100%)',
		titleTextColor: '#8b4513',
		titleTextDarkColor: '#ff9a9e',
		category: 'season'
	},
	autumn: {
		name: '🍂 秋日枫叶',
		background: 'linear-gradient(135deg, #ff9068 0%, #fd746c 25%, #ff6b6b 50%, #feca57 75%, #ff9ff3 100%)',
		darkBackground: 'linear-gradient(135deg, #8b4513 0%, #a0522d 25%, #cd853f 50%, #daa520 75%, #b8860b 100%)',
		leftColor: '#ff6b6b',
		rightColor: '#feca57',
		accentColor: '#ff9068',
		titleBarColor: 'linear-gradient(135deg, #ff9068 0%, #fd746c 33%, #ff6b6b 66%, #feca57 100%)',
		titleBarDarkColor: 'linear-gradient(135deg, #8b4513 0%, #a0522d 33%, #cd853f 66%, #daa520 100%)',
		titleTextColor: '#8b4513',
		titleTextDarkColor: '#feca57',
		category: 'season'
	},
	winter: {
		name: '❄️ 冬日雪境',
		background: 'linear-gradient(135deg, #e6f3ff 0%, #cce7ff 25%, #b3daff 50%, #99cdff 75%, #80c1ff 100%)',
		darkBackground: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #083344 75%, #041e2a 100%)',
		leftColor: '#87ceeb',
		rightColor: '#4682b4',
		accentColor: '#00bfff',
		titleBarColor: 'linear-gradient(135deg, #e6f3ff 0%, #cce7ff 33%, #b3daff 66%, #80c1ff 100%)',
		titleBarDarkColor: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 33%, #0f3460 66%, #041e2a 100%)',
		titleTextColor: '#0f3460',
		titleTextDarkColor: '#80c1ff',
		category: 'season'
	}
};
