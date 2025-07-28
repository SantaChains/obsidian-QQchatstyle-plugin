export interface ChatConfig {
	title: string;
	theme: string;
	isDarkTheme?: boolean;
}

export interface UserInfo {
	name: string;
	displayName?: string;
	avatar: string;
	color: string;
	position: 'L' | 'R';
}

export interface ChatMessage {
	id: number;
	user: string;
	content: string;
	customColor?: string;
	quotedMessage?: number | string;
	timestamp?: Date;
}

export interface ParsedChat {
	config: ChatConfig;
	users: Map<string, UserInfo>;
	messages: ChatMessage[];
}

export class ChatParser {
	private static readonly CODE_BLOCK_MARKER = '§§§CODE_BLOCK_START§§§';
	private static readonly CODE_BLOCK_END_MARKER = '§§§CODE_BLOCK_END§§§';
	private static readonly LANG_MARKER = '§§§LANG§§§';

	// 优化：将正则表达式提取为静态常量，提高可读性和性能
	private static readonly NEW_MESSAGE_REGEX = /^(?:\d+\s*|>\s*\d+\s*|>.*:\s*)?([^:]+):\s*/;
	private static readonly MESSAGE_DETAILS_REGEX = /^(?:(\d+)(?:\(([^)]+)\))?)?([^:]+):\s*([\s\S]*)/;
	private static readonly QUOTE_REGEX = /^>([^\n]+)(?:\n---\n|\n)([\s\S]*)/;
	private static readonly USER_DEF_REGEX = /@([^\s\(]+)(?:\(([^)]+)\))?/;
	private static readonly CODE_BLOCK_REGEX = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;

	static parse(source: string): ParsedChat {
		const { processedSource, codeBlocks } = this.preprocessNestedCodeBlocks(source);
		
		const lines = processedSource.split('\n');
		const config: ChatConfig = { title: '聊天', theme: '' };
		const users = new Map<string, UserInfo>();
		const messages: ChatMessage[] = [];
		let messageCounter = 1;

		const messageChunks: string[] = [];
		let currentChunk = '';

		// 1. 将源文本按逻辑块（配置、用户、单个消息）分组
		for (const line of lines) {
			const trimmedLine = line.trim();
			if (!trimmedLine) continue;

			// 使用静态正则表达式判断新消息
			const isNewMessage = this.NEW_MESSAGE_REGEX.test(trimmedLine);

			if ((isNewMessage && !trimmedLine.startsWith('#') && !trimmedLine.startsWith('@')) || trimmedLine.startsWith('@')) {
				if (currentChunk) {
					messageChunks.push(currentChunk.trim());
				}
				currentChunk = line;
			} else {
				currentChunk += '\n' + line;
			}
		}
		if (currentChunk) {
			messageChunks.push(currentChunk.trim());
		}

		// 2. 逐块解析
		for (const chunk of messageChunks) {
			const trimmedChunk = chunk.trim();
			if (trimmedChunk.startsWith('#title=') || trimmedChunk.startsWith('#tittle=')) {
				config.title = trimmedChunk.substring(trimmedChunk.indexOf('=') + 1).trim() || '聊天';
			} else if (trimmedChunk.startsWith('#theme=')) {
				let themeValue = trimmedChunk.substring(trimmedChunk.indexOf('=') + 1).trim() || '';
				config.theme = this.processTheme(themeValue);
				if (themeValue.includes(',dark')) {
					config.isDarkTheme = true;
				}
			} else if (trimmedChunk.startsWith('@')) {
				trimmedChunk.split('\n').forEach(userLine => {
					const userInfo = this.parseUserDefinition(userLine.trim());
					if (userInfo) {
						users.set(userInfo.name, userInfo);
					}
				});
			} else {
				// 解析消息块
				let content = chunk;
				let id: number;
				let user: string;
				let customColor: string | undefined;
				let quotedMessage: number | string | undefined;

				// 提取引用
				const quoteMatch = content.match(this.QUOTE_REGEX);
				if (quoteMatch) {
					const quoteRef = quoteMatch[1].trim();
					quotedMessage = /^\d+$/.test(quoteRef) ? parseInt(quoteRef) : quoteRef;
					content = quoteMatch[2];
				}

				// 提取消息详情
				const messageMatch = content.match(this.MESSAGE_DETAILS_REGEX);
				if (messageMatch) {
					const idStr = messageMatch[1];
					customColor = messageMatch[2];
					user = messageMatch[3].trim();
					content = messageMatch[4].trim();

					if (idStr) {
						id = parseInt(idStr);
						messageCounter = Math.max(messageCounter, id + 1);
					} else {
						id = messageCounter++;
					}

					messages.push({
						id,
						user,
						content: this.restoreCodeBlocks(content, codeBlocks),
						customColor,
						quotedMessage,
						timestamp: new Date()
					});
				}
			}
		}

		return { config, users, messages };
	}
	
	private static preprocessNestedCodeBlocks(source: string): { processedSource: string, codeBlocks: Map<string, string> } {
		const codeBlocks = new Map<string, string>();
		let blockId = 0;
		
		const processedSource = source.replace(this.CODE_BLOCK_REGEX, (match, language, code) => {
			const id = `${blockId++}`;
			const marker = `${this.CODE_BLOCK_MARKER}${id}${this.LANG_MARKER}${language}${this.CODE_BLOCK_END_MARKER}`;
			codeBlocks.set(id, code);
			return marker;
		});
		
		return { processedSource, codeBlocks };
	}
	
	private static restoreCodeBlocks(content: string, codeBlocks: Map<string, string>): string {
		const markerRegex = new RegExp(`${this.CODE_BLOCK_MARKER}(\\d+)${this.LANG_MARKER}([a-zA-Z0-9_-]*)${this.CODE_BLOCK_END_MARKER}`, 'g');
		
		return content.replace(markerRegex, (match, id, language) => {
			const code = codeBlocks.get(id) || '';
			return `\`\`\`${language}\n${code}\n\`\`\``;
		});
	}

	private static processTheme(theme: string): string {
		const cleanTheme = theme.replace(/"/g, '').replace(/,dark$/, '').trim();

		if (cleanTheme.includes('\\') || cleanTheme.includes(':/')) {
			let processedPath = cleanTheme.replace(/\\/g, '/');
			if (!processedPath.startsWith('file://')) {
				processedPath = 'file://' + processedPath;
			}
			return `url("${processedPath}")`;
		}
		
		if (cleanTheme.startsWith('http')) {
			return `url("${cleanTheme}")`;
		}
		
		return cleanTheme;
	}

	private static parseUserDefinition(line: string): UserInfo | null {
		const match = line.match(this.USER_DEF_REGEX);
		if (!match) return null;

		const name = match[1];
		const params = match[2];
		
		const userInfo: UserInfo = {
			name,
			displayName: name,
			avatar: this.getDefaultAvatar(name),
			color: '',
			position: 'L'
		};

		if (params) {
			params.split(',').map(p => p.trim()).forEach(pair => {
				if (pair === 'L' || pair === 'R') {
					userInfo.position = pair;
				} else if (pair.includes(':')) {
					const [key, value] = pair.split(/:(.*)/).map(s => s.trim());
					switch (key) {
						case 'pic': userInfo.avatar = value || this.getDefaultAvatar(name); break;
						case 'col': if (this.isValidColor(value)) userInfo.color = value; break;
						case 'display': userInfo.displayName = value || name; break;
					}
				}
			});
		}
		return userInfo;
	}

	private static getDefaultAvatar(name: string): string {
		const chineseMatch = name.match(/[\u4e00-\u9fff]/);
		if (chineseMatch) return chineseMatch[0];
		const englishMatch = name.match(/[a-zA-Z]/);
		if (englishMatch) return englishMatch[0].toUpperCase();
		return name.charAt(0);
	}

	private static isValidColor(color: string): boolean {
		if (!color) return false;
		const s = new Option().style;
		s.color = color;
		return s.color !== '';
	}
}