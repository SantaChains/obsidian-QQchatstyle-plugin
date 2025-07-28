import { App, Component, MarkdownPostProcessorContext, MarkdownRenderer } from 'obsidian';
import { ChatStyleSettings, PRESET_THEMES } from './settings';
import { ChatParser, ParsedChat, ChatMessage, UserInfo } from './chatParser';

export class ChatRenderer extends Component {
	private app: App;
	private settings: ChatStyleSettings;

	constructor(app: App, settings: ChatStyleSettings) {
		super();
		this.app = app;
		this.settings = settings;
	}

	updateSettings(settings: ChatStyleSettings) {
		this.settings = settings;
		this.updateAllChatContainers();
		this.updateGlobalCSSVariables();
	}

	updateTheme() {
		this.updateAllChatContainers();
		this.updateGlobalCSSVariables();
	}

	private updateAllChatContainers() {
		const chatContainers = document.querySelectorAll('.chat-style-container');
		chatContainers.forEach(container => {
			this.updateContainerTheme(container as HTMLElement);
			this.updateTitleBarStyle(container as HTMLElement);
		});
	}

	private updateTitleBarStyle(container: HTMLElement) {
		const titleEl = container.querySelector('.chat-title') as HTMLElement;
		if (titleEl) {
			const isDark = document.body.classList.contains('theme-dark');
			const titleBarBg = isDark ? this.settings.titleBarDarkColor : this.settings.titleBarColor;
			const titleTextColor = isDark ? this.settings.titleTextDarkColor : this.settings.titleTextColor;
			
			titleEl.style.background = titleBarBg;
			titleEl.style.color = titleTextColor;
		}
	}

	private updateGlobalCSSVariables() {
		const root = document.documentElement;
		const currentPreset = PRESET_THEMES[this.settings.currentPreset as keyof typeof PRESET_THEMES];
		
		if (currentPreset) {
			root.style.setProperty('--chat-accent-color', currentPreset.accentColor);
			root.style.setProperty('--chat-left-color', currentPreset.leftColor);
			root.style.setProperty('--chat-right-color', currentPreset.rightColor);
		}
		
		root.style.setProperty('--chat-font-size', `${this.settings.fontSize}px`);
		root.style.setProperty('--chat-font-weight', this.settings.fontWeight);
		root.style.setProperty('--chat-bubble-radius', `${this.settings.bubbleRadius}px`);
		root.style.setProperty('--chat-bubble-opacity', this.settings.bubbleOpacity.toString());
		root.style.setProperty('--chat-avatar-size', `${this.settings.avatarSize}px`);
		root.style.setProperty('--chat-animation-speed', `${this.settings.animationSpeed}s`);
	}

	private updateContainerTheme(container: HTMLElement) {
		const isDark = document.body.classList.contains('theme-dark');
		const currentPreset = PRESET_THEMES[this.settings.currentPreset as keyof typeof PRESET_THEMES];
		let theme: string;
		
		if (currentPreset) {
			theme = isDark ? currentPreset.darkBackground : currentPreset.background;
		} else {
			theme = isDark ? this.settings.darkModeTheme : this.settings.lightModeTheme;
		}
		
		const chatBackground = container.querySelector('.chat-background') as HTMLElement;
		if (chatBackground) {
			this.applyTheme(chatBackground, theme);
		}
		
		this.updateBubbleColors(container as HTMLElement);
	}

	private updateBubbleColors(container: HTMLElement) {
		const currentPreset = PRESET_THEMES[this.settings.currentPreset as keyof typeof PRESET_THEMES];
		if (!currentPreset) return;

		const leftBubbles = container.querySelectorAll('.message-bubble.left');
		const rightBubbles = container.querySelectorAll('.message-bubble.right');

		leftBubbles.forEach(bubble => {
			const bubbleEl = bubble as HTMLElement;
			if (!bubbleEl.dataset.customColor) {
				bubbleEl.style.background = `linear-gradient(135deg, ${currentPreset.leftColor} 0%, ${currentPreset.leftColor}dd 100%)`;
			}
		});

		rightBubbles.forEach(bubble => {
			const bubbleEl = bubble as HTMLElement;
			if (!bubbleEl.dataset.customColor) {
				bubbleEl.style.background = `linear-gradient(135deg, ${currentPreset.rightColor} 0%, ${currentPreset.rightColor}dd 100%)`;
			}
		});
	}

	async renderChat(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) {
		try {
			console.log('开始渲染聊天:', source);
			const parsedChat = ChatParser.parse(source);
			console.log('解析结果:', parsedChat);
			await this.createChatInterface(el, parsedChat, ctx);
			console.log('渲染完成');
		} catch (error) {
			console.error('ChatStyle 渲染错误:', error);
			const errorEl = document.createElement('div');
			errorEl.className = 'chat-error';
			errorEl.textContent = `聊天格式解析错误: ${error.message}`;
			errorEl.style.cssText = `
				color: #e74c3c; padding: 1.2rem; background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
				border-radius: 12px; border: 1px solid #ef5350; box-shadow: 0 4px 12px rgba(231, 76, 60, 0.2);
				font-weight: 500; margin: 1rem 0;
			`;
			el.appendChild(errorEl);
		}
	}

	private async createChatInterface(container: HTMLElement, chat: ParsedChat, ctx: MarkdownPostProcessorContext) {
		container.innerHTML = '';
		container.className = 'chat-style-container';

		const currentPreset = PRESET_THEMES[this.settings.currentPreset as keyof typeof PRESET_THEMES] || PRESET_THEMES.default;
		
		container.style.cssText = `
			margin: 1.5rem 0; border-radius: 20px; overflow: hidden;
			box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15); backdrop-filter: blur(25px);
			border: 2px solid rgba(255, 255, 255, 0.1); font-family: ${this.settings.fontFamily};
			font-weight: ${this.settings.fontWeight || 400}; position: relative; background: rgba(255, 255, 255, 0.02);
		`;

		const chatContainer = document.createElement('div');
		chatContainer.className = 'chat-container';
		chatContainer.style.cssText = `position: relative; min-height: 250px;`;
		container.appendChild(chatContainer);
		
		const backgroundEl = document.createElement('div');
		backgroundEl.className = 'chat-background';
		backgroundEl.style.cssText = `position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 0; background-attachment: fixed;`;
		chatContainer.appendChild(backgroundEl);
		this.applyTheme(backgroundEl, chat.config.theme || this.getDefaultTheme());

		const decorEl = document.createElement('div');
		decorEl.style.cssText = `position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(45deg, ${currentPreset.accentColor}20, transparent); pointer-events: none; z-index: 1;`;
		chatContainer.appendChild(decorEl);

		if (chat.config.title) {
			const titleEl = document.createElement('div');
			titleEl.className = 'chat-title';
			titleEl.textContent = chat.config.title;
			
			const isDark = document.body.classList.contains('theme-dark');
			// 如果有自定义主题，使用透明背景；否则使用设置的颜色
			const titleBarBg = chat.config.theme ? 
				'rgba(255, 255, 255, 0.1)' : 
				(isDark ? this.settings.titleBarDarkColor : this.settings.titleBarColor);
			const titleTextColor = chat.config.theme ? 
				'rgba(255, 255, 255, 0.9)' : 
				(isDark ? this.settings.titleTextDarkColor : this.settings.titleTextColor);
			
			titleEl.style.cssText = `
				position: relative; z-index: 2; padding: 1.2rem; text-align: center;
				font-weight: 600; font-size: 1.2em; background: ${titleBarBg};
				backdrop-filter: blur(20px); border-bottom: 1px solid rgba(0, 0, 0, 0.08);
				color: ${titleTextColor}; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); transition: all 0.3s ease;
			`;
			chatContainer.appendChild(titleEl);
		}

		const messagesContainer = document.createElement('div');
		messagesContainer.className = 'chat-messages';
		messagesContainer.style.cssText = `position: relative; z-index: 2; padding: 1.5rem; max-height: 600px; overflow-y: auto; background: rgba(255, 255, 255, 0.02);`;
		chatContainer.appendChild(messagesContainer);

		// 渲染消息
		for (const message of chat.messages) {
			await this.renderMessage(messagesContainer, message, chat.users, ctx, currentPreset);
		}

		this.addGlobalStyles();
	}

	private async renderMessage(
		container: HTMLElement, 
		message: ChatMessage, 
		users: Map<string, UserInfo>,
		ctx: MarkdownPostProcessorContext,
		currentPreset: any
	) {
		const user = users.get(message.user);
		const isRight = user?.position === 'R';

		const messageEl = document.createElement('div');
		messageEl.className = `chat-message ${isRight ? 'right' : 'left'}`;
		messageEl.setAttribute('data-message-id', message.id.toString());
		messageEl.style.cssText = `
			display: flex; margin-bottom: ${this.settings.messageSpacing + 4}px; align-items: flex-start;
			opacity: 0; animation: messageSlideIn 0.4s ease-out forwards;
			${isRight ? 'flex-direction: row-reverse;' : ''}
		`;
		container.appendChild(messageEl);

		// 头像
		const avatarEl = document.createElement('div');
		avatarEl.className = 'chat-avatar';
		avatarEl.textContent = user?.avatar || message.user.charAt(0);
		const avatarColor = user?.color || (isRight ? currentPreset.rightColor : currentPreset.leftColor);
		avatarEl.style.cssText = `
			width: ${this.settings.avatarSize}px; height: ${this.settings.avatarSize}px; border-radius: 50%;
			background: linear-gradient(135deg, ${avatarColor} 0%, ${avatarColor}dd 100%); color: white;
			display: flex; align-items: center; justify-content: center; font-weight: 700;
			font-size: ${this.settings.avatarSize * 0.4}px; flex-shrink: 0; margin: 0 12px;
			box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
			${this.settings.avatarBorder ? `border: 3px solid rgba(255, 255, 255, 0.4);` : ''}
			${this.settings.avatarGlow ? `box-shadow: 0 0 20px ${currentPreset.accentColor}80, 0 6px 20px rgba(0, 0, 0, 0.2);` : ''}
			transition: all 0.3s ease; cursor: pointer;
		`;

		avatarEl.addEventListener('mouseenter', () => {
			avatarEl.style.transform = 'scale(1.15) rotate(5deg)';
			avatarEl.style.boxShadow = this.settings.avatarGlow 
				? `0 0 30px ${currentPreset.accentColor}, 0 8px 30px rgba(0, 0, 0, 0.3)`
				: '0 8px 30px rgba(0, 0, 0, 0.3)';
		});
		avatarEl.addEventListener('mouseleave', () => {
			avatarEl.style.transform = 'scale(1) rotate(0deg)';
			avatarEl.style.boxShadow = this.settings.avatarGlow 
				? `0 0 20px ${currentPreset.accentColor}80, 0 6px 20px rgba(0, 0, 0, 0.2)`
				: '0 6px 20px rgba(0, 0, 0, 0.2)';
		});

		messageEl.appendChild(avatarEl);

		// 消息气泡容器
		const bubbleContainer = document.createElement('div');
		bubbleContainer.className = 'chat-bubble-container';
		bubbleContainer.style.cssText = `max-width: 75%; animation: bubbleFloat 0.5s ease-out;`;
		messageEl.appendChild(bubbleContainer);

		// 用户名（如果需要显示）
		if (user?.displayName && user.displayName !== user.name) {
			const usernameEl = document.createElement('div');
			usernameEl.className = 'chat-username';
			usernameEl.textContent = user.displayName;
			usernameEl.style.cssText = `
				font-size: 0.75em; color: #7f8c8d; margin-bottom: 6px;
				padding: 0 ${this.settings.bubblePadding}px; font-weight: 500;
				text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
			`;
			bubbleContainer.appendChild(usernameEl);
		}

		// 引用消息（如果有）
		if (message.quotedMessage) {
			const quoteEl = document.createElement('div');
			quoteEl.className = 'chat-quote';
			const quoteText = typeof message.quotedMessage === 'number' 
				? `💬 回复消息 #${message.quotedMessage}`
				: `💬 回复: ${message.quotedMessage}`;
			quoteEl.textContent = quoteText;
			quoteEl.style.cssText = `
				background: linear-gradient(135deg, rgba(52, 152, 219, 0.1) 0%, rgba(155, 89, 182, 0.1) 100%);
				padding: 8px ${this.settings.bubblePadding}px; border-radius: 12px; font-size: 0.85em;
				margin-bottom: 6px; border-left: 4px solid #3498db; position: relative;
				backdrop-filter: blur(10px); box-shadow: 0 2px 8px rgba(52, 152, 219, 0.1);
				${this.settings.enableQuoteJump ? 'cursor: pointer; transition: all 0.3s ease;' : ''}
			`;
			
			if (this.settings.enableQuoteJump) {
				quoteEl.addEventListener('click', () => {
					this.jumpToMessage(message.quotedMessage!);
				});
				quoteEl.addEventListener('mouseenter', () => {
					quoteEl.style.background = 'linear-gradient(135deg, rgba(52, 152, 219, 0.2) 0%, rgba(155, 89, 182, 0.2) 100%)';
					quoteEl.style.transform = 'translateX(4px)';
					quoteEl.style.boxShadow = '0 4px 16px rgba(52, 152, 219, 0.2)';
				});
				quoteEl.addEventListener('mouseleave', () => {
					quoteEl.style.background = 'linear-gradient(135deg, rgba(52, 152, 219, 0.1) 0%, rgba(155, 89, 182, 0.1) 100%)';
					quoteEl.style.transform = 'translateX(0)';
					quoteEl.style.boxShadow = '0 2px 8px rgba(52, 152, 219, 0.1)';
				});
			}
			bubbleContainer.appendChild(quoteEl);
		}

		// 消息气泡
		const bubbleEl = document.createElement('div');
		bubbleEl.className = `chat-bubble message-bubble ${isRight ? 'right' : 'left'}`;
		
		// 应用气泡颜色
		let bubbleColor: string;
		if (message.customColor) {
			bubbleColor = message.customColor;
			bubbleEl.dataset.customColor = 'true';
		} else {
			bubbleColor = isRight ? currentPreset.rightColor : currentPreset.leftColor;
		}

		bubbleEl.style.cssText = `
			padding: ${this.settings.bubblePadding + 2}px ${this.settings.bubblePadding + 4}px;
			border-radius: ${this.settings.bubbleRadius}px;
			background: linear-gradient(135deg, ${bubbleColor} 0%, ${bubbleColor}dd 100%);
			position: relative; word-wrap: break-word;
			${this.settings.bubbleShadow ? `box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);` : ''}
			${this.settings.bubbleGlow ? `box-shadow: 0 0 15px ${currentPreset.accentColor}40, 0 6px 20px rgba(0, 0, 0, 0.1);` : ''}
			border: 1px solid rgba(255, 255, 255, 0.3); backdrop-filter: blur(15px);
			transition: all 0.3s ease; opacity: ${this.settings.bubbleOpacity}; color: white;
		`;

		// 气泡悬停效果
		bubbleEl.addEventListener('mouseenter', () => {
			bubbleEl.style.transform = 'translateY(-3px) scale(1.02)';
			if (this.settings.bubbleShadow) {
				bubbleEl.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.15)';
			}
			if (this.settings.bubbleGlow) {
				bubbleEl.style.boxShadow = `0 0 25px ${currentPreset.accentColor}60, 0 12px 30px rgba(0, 0, 0, 0.15)`;
			}
		});

		bubbleEl.addEventListener('mouseleave', () => {
			bubbleEl.style.transform = 'translateY(0) scale(1)';
			if (this.settings.bubbleShadow) {
				bubbleEl.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.1)';
			}
			if (this.settings.bubbleGlow) {
				bubbleEl.style.boxShadow = `0 0 15px ${currentPreset.accentColor}40, 0 6px 20px rgba(0, 0, 0, 0.1)`;
			}
		});

		bubbleContainer.appendChild(bubbleEl);

		// 渲染消息内容（支持Markdown）
		const contentEl = document.createElement('div');
		contentEl.className = 'chat-content';
		contentEl.style.cssText = `
			font-size: ${this.settings.fontSize}px; font-family: ${this.settings.fontFamily};
			line-height: 1.5; position: relative;
		`;
		bubbleEl.appendChild(contentEl);
		await MarkdownRenderer.renderMarkdown(message.content, contentEl, ctx.sourcePath, this);
		
		// 增强代码块渲染
		if (this.settings.codeBlockEnhanced) {
			this.enhanceCodeBlocks(contentEl, isRight, currentPreset);
		}

		// 时间戳（如果启用）
		if (this.settings.showTimestamp && message.timestamp) {
			const timestampEl = document.createElement('div');
			timestampEl.className = 'chat-timestamp';
			timestampEl.textContent = message.timestamp.toLocaleTimeString();
			timestampEl.style.cssText = `
				font-size: 0.65em; color: #95a5a6; margin-top: 6px;
				text-align: center; font-weight: 400; opacity: 0.8;
			`;
			bubbleContainer.appendChild(timestampEl);
		}
	}

	private applyTheme(element: HTMLElement, theme: string) {
		if (!theme) {
			theme = this.getDefaultTheme();
		}

		// 处理本地文件路径
		if (theme.includes('D:') || theme.includes('C:') || theme.includes('/')) {
			const cleanPath = theme.replace(/['"]/g, '');
			if (!cleanPath.startsWith('file://')) {
				theme = `url("file://${cleanPath.replace(/\\/g, '/')}")`;
			} else {
				theme = `url("${cleanPath}")`;
			}
		}
		// 处理网络图片
		else if (theme.startsWith('http')) {
			theme = `url("${theme}")`;
		}

		if (theme.startsWith('url(')) {
			element.style.backgroundImage = theme;
			element.style.backgroundSize = 'cover';
			element.style.backgroundPosition = 'center';
			element.style.backgroundRepeat = 'no-repeat';
		} else {
			element.style.background = theme;
		}
	}

	private getDefaultTheme(): string {
		const isDark = document.body.classList.contains('theme-dark');
		const currentPreset = PRESET_THEMES[this.settings.currentPreset as keyof typeof PRESET_THEMES];
		
		if (currentPreset) {
			return isDark ? currentPreset.darkBackground : currentPreset.background;
		}
		
		return isDark ? this.settings.darkModeTheme : this.settings.lightModeTheme;
	}

	private jumpToMessage(messageRef: number | string) {
		const selector = typeof messageRef === 'number' 
			? `[data-message-id="${messageRef}"]`
			: `[data-message-id*="${messageRef}"]`;
		
		const targetMessage = document.querySelector(selector);
		if (targetMessage) {
			targetMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
			targetMessage.classList.add('highlight');
			setTimeout(() => {
				targetMessage.classList.remove('highlight');
			}, 2000);
		}
	}

	private enhanceCodeBlocks(contentEl: HTMLElement, isRight: boolean, currentPreset: any) {
		const codeBlocks = contentEl.querySelectorAll('pre code');
		
		codeBlocks.forEach((codeBlock) => {
			const codeEl = codeBlock as HTMLElement;
			const preEl = codeEl.parentElement as HTMLElement;
			
			if (!preEl) return;
			
			const langClass = Array.from(codeEl.classList).find(cls => cls.startsWith('language-'));
			const language = langClass ? langClass.replace('language-', '') : '';
			
			preEl.classList.add('chat-code-block');
			preEl.style.position = 'relative';
			preEl.style.margin = '0.5em 0';
			preEl.style.borderRadius = '8px';
			preEl.style.overflow = 'hidden';
			
			if (isRight) {
				preEl.classList.add('right-message-code');
			} else {
				preEl.classList.add('left-message-code');
			}
			
			if (language && language !== 'text' && this.settings.codeBlockShowLanguage) {
				const langTag = document.createElement('div');
				langTag.className = 'code-language-tag';
				langTag.textContent = language;
				langTag.style.cssText = `
					position: absolute; top: 0; right: 0; padding: 2px 8px; font-size: 0.7em;
					background: ${isRight ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
					color: ${isRight ? 'white' : '#333'}; border-bottom-left-radius: 6px;
					font-family: var(--font-monospace); opacity: 0.8; z-index: 1;
				`;
				preEl.appendChild(langTag);
			}
			
			if (this.settings.codeBlockShowCopyButton) {
				const copyBtn = document.createElement('button');
				copyBtn.className = 'code-copy-button';
				copyBtn.innerHTML = '📋';
				copyBtn.title = '复制代码';
				copyBtn.style.cssText = `
					position: absolute; top: 0; right: ${language && this.settings.codeBlockShowLanguage ? '50px' : '0'};
					padding: 2px 8px; font-size: 0.8em; background: transparent; border: none;
					color: ${isRight ? 'white' : '#333'}; opacity: 0.6; cursor: pointer;
					transition: all 0.2s ease; z-index: 1;
				`;
				
				copyBtn.addEventListener('mouseenter', () => {
					copyBtn.style.opacity = '1';
				});
				
				copyBtn.addEventListener('mouseleave', () => {
					copyBtn.style.opacity = '0.6';
				});
				
				copyBtn.addEventListener('click', (e) => {
					e.preventDefault();
					e.stopPropagation();
					
					navigator.clipboard.writeText(codeEl.textContent || '')
						.then(() => {
							const originalText = copyBtn.innerHTML;
							copyBtn.innerHTML = '✓';
							setTimeout(() => {
								copyBtn.innerHTML = originalText;
							}, 1500);
						})
						.catch(err => {
							console.error('复制失败:', err);
						});
				});
				
				preEl.appendChild(copyBtn);
			}
			
			this.applyCodeTheme(codeEl, isRight);
		});
	}
	
	private applyCodeTheme(codeEl: HTMLElement, isRight: boolean) {
		const theme = this.settings.codeBlockTheme;
		
		codeEl.style.display = 'block';
		codeEl.style.padding = '1em';
		codeEl.style.overflowX = 'auto';
		codeEl.style.fontFamily = "'Fira Code', 'JetBrains Mono', 'Consolas', monospace";
		codeEl.style.lineHeight = '1.5';
		codeEl.style.fontSize = '0.85em';
		codeEl.style.tabSize = '4';
		
		switch (theme) {
			case 'github':
				if (isRight) {
					codeEl.style.background = 'rgba(13, 17, 23, 0.8)';
					codeEl.style.color = '#c9d1d9';
				} else {
					codeEl.style.background = 'rgba(246, 248, 250, 0.8)';
					codeEl.style.color = '#24292e';
				}
				break;
				
			case 'vscode':
				codeEl.style.background = isRight ? 'rgba(30, 30, 30, 0.8)' : 'rgba(30, 30, 30, 0.8)';
				codeEl.style.color = '#d4d4d4';
				break;
				
			case 'dracula':
				codeEl.style.background = 'rgba(40, 42, 54, 0.8)';
				codeEl.style.color = '#f8f8f2';
				break;
				
			default:
				if (isRight) {
					codeEl.style.background = 'rgba(255, 255, 255, 0.15)';
					codeEl.style.color = '#fff';
				} else {
					codeEl.style.background = 'rgba(0, 0, 0, 0.05)';
					codeEl.style.color = '#333';
				}
				break;
		}
	}

	private addGlobalStyles() {
		if (document.getElementById('chat-style-global-css')) return;

		const style = document.createElement('style');
		style.id = 'chat-style-global-css';
		style.textContent = `
		@keyframes messageSlideIn {
			from { opacity: 0; transform: translateY(20px); }
			to { opacity: 1; transform: translateY(0); }
		}

		@keyframes bubbleFloat {
			from { opacity: 0; transform: scale(0.8); }
			to { opacity: 1; transform: scale(1); }
		}

		.chat-message.highlight {
			animation: highlightPulse 2s ease-in-out;
		}

		@keyframes highlightPulse {
			0%, 100% { background: transparent; transform: scale(1); }
			50% { background: rgba(255, 235, 59, 0.3); transform: scale(1.02); border-radius: 12px; }
		}

		.chat-messages::-webkit-scrollbar { width: 8px; }
		.chat-messages::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.05); border-radius: 4px; }
		.chat-messages::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.3)); border-radius: 4px; transition: all 0.3s ease; }
		.chat-messages::-webkit-scrollbar-thumb:hover { background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)); }

		.theme-dark .chat-title { border-bottom-color: rgba(255, 255, 255, 0.1) !important; }
		.theme-dark .chat-username { color: #bdc3c7 !important; }
		.theme-dark .chat-quote { background: linear-gradient(135deg, rgba(52, 152, 219, 0.15) 0%, rgba(155, 89, 182, 0.15) 100%) !important; border-left-color: #5dade2 !important; }
		.theme-dark .chat-content code { background: rgba(255, 255, 255, 0.1) !important; border-color: rgba(255, 255, 255, 0.2) !important; }
		.theme-dark .message-bubble.left { color: #ecf0f1 !important; }

		@media (max-width: 768px) {
			.chat-bubble-container { max-width: 85% !important; }
			.chat-messages { padding: 1rem !important; }
			.chat-title { padding: 1rem !important; font-size: 1.1em !important; }
		}

		.chat-content p { margin: 0; }
		.chat-content strong { font-weight: 700; color: inherit; }
		.chat-content em { font-style: italic; opacity: 0.9; }
		.chat-content code {
			background: rgba(0, 0, 0, 0.1); padding: 3px 6px; border-radius: 4px;
			font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
			font-size: 0.9em; border: 1px solid rgba(0, 0, 0, 0.1);
		}

		/* 优化emoji图标显示 */
		.chat-content {
			font-variant-emoji: emoji;
		}
		
		.chat-content span[role="img"],
		.chat-content .emoji {
			font-size: 1.1em;
			vertical-align: middle;
			margin: 0 2px;
			display: inline-block;
		}

		.message-bubble.right .chat-content code {
			background: rgba(255, 255, 255, 0.2);
			border-color: rgba(255, 255, 255, 0.3);
		}
		
		.chat-content pre {
			margin: 0.8em 0; border-radius: 8px; overflow: hidden; position: relative;
		}

		.chat-content pre code {
			display: block; padding: 1em; overflow-x: auto;
			font-family: 'Fira Code', 'JetBrains Mono', 'Consolas', monospace;
			line-height: 1.5; font-size: 0.85em; tab-size: 4;
		}

		.left-message-code code {
			background: rgba(0, 0, 0, 0.05); border: 1px solid rgba(0, 0, 0, 0.1); color: #333;
		}

		.right-message-code code {
			background: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.2); color: #fff;
		}

		.theme-dark .left-message-code code {
			background: rgba(255, 255, 255, 0.05); border-color: rgba(255, 255, 255, 0.1); color: #eee;
		}

		.chat-content .token.comment { color: #6a9955; }
		.chat-content .token.string { color: #ce9178; }
		.chat-content .token.number { color: #b5cea8; }
		.chat-content .token.keyword { color: #569cd6; }
		.chat-content .token.function { color: #dcdcaa; }
		.chat-content .token.operator { color: #d4d4d4; }
		.chat-content .token.class-name { color: #4ec9b0; }

		.right-message-code .token.comment { color: #a8c9b5; }
		.right-message-code .token.string { color: #ffd1b8; }
		.right-message-code .token.number { color: #d5eec8; }
		.right-message-code .token.keyword { color: #96ccf6; }
		.right-message-code .token.function { color: #fcecaa; }
		.right-message-code .token.operator { color: #f4f4f4; }
		.right-message-code .token.class-name { color: #8ee9d0; }

		.chat-code-block { transition: all 0.3s ease; }
		.chat-code-block:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1); }
		.code-language-tag:hover { opacity: 1; }
		.code-copy-button:hover { opacity: 1; transform: scale(1.1); }
		`;
		document.head.appendChild(style);
	}
}
