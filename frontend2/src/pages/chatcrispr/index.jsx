import { useState, useRef } from 'react';
import { SearchOutlined, SmileOutlined } from '@ant-design/icons';
import Markdown from 'markdown-to-jsx';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { helpItems } from '@/utils/datas/static-data';
import 'highlight.js/styles/github.css';
import './index.scss';

const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const API_URL = import.meta.env.VITE_DEEPSEEK_API_URL;
function ChatCrisper() {
    const [messages, setMessages] = useState([
        {
            text: "您好！我是CRISPR助手。我可以帮您解答关于CRISPR的问题，请问有什么可以帮您？",
            isUser: false,
            timestamp: new Date().toLocaleTimeString()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    // 模拟SSE打字机效果
    const simulateTyping = async (fullResponse) => {
        setIsTyping(true);
        const tempMessage = {
            text: "",
            isUser: false,
            timestamp: new Date().toLocaleTimeString()
        };

        setMessages(prev => [...prev, tempMessage]);

        for (let i = 0; i < fullResponse.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 10));
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                    ...newMessages[newMessages.length - 1],
                    text: fullResponse.substring(0, i + 1)
                };
                return newMessages;
            });
        }

        setIsTyping(false);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isTyping) return;

        const userMessage = {
            text: inputValue,
            isUser: true,
            timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true); // 设置AI正在思考

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [{ role: "user", content: inputValue }],
                    temperature: 0.5
                })
            });

            if (!response.ok) throw new Error(`API请求失败: ${response.status}`);

            const data = await response.json();
            const aiResponse = data.choices[0].message.content;

            setMessages(prev => [...prev, { text: aiResponse, isUser: false, timestamp: new Date().toLocaleTimeString() }]);
        } catch (error) {
            console.error('API错误:', error);
            setMessages(prev => [...prev, { text: `请求失败: ${error.message}`, isUser: false, timestamp: new Date().toLocaleTimeString() }]);
        } finally {
            setIsTyping(false);
            scrollToBottom();
        }
    };


    // 新增表情选择器状态
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    // 表情选择处理函数
    const handleEmojiSelect = (emoji) => {
        setInputValue(prev => prev + emoji.native);
        setShowEmojiPicker(false);
    };
    const handleQuestionClick = (answer) => {
        simulateTyping(answer);
    };
    const [searchTerm, setSearchTerm] = useState('');

    const filteredHelpItems = helpItems.filter(item =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 关键词高亮处理函数
    const highlightText = (text, highlight) => {
        if (!highlight) return text; // 如果搜索框为空，直接返回原文本
        const regex = new RegExp(`(${highlight})`, 'gi'); // 忽略大小写匹配
        return text.replace(regex, '<mark>$1</mark>'); // 用 <mark> 标签包裹匹配的关键词
    };
    return (
        <div className="chat">
            {/* 左侧边栏 */}
            <div className="chat-sidebar">
                <div className="sidebar-header">
                    <div className="search-box">
                        <SearchOutlined style={{ marginRight: '10px', fontSize: '20px' }} />
                        <input
                            type="text"
                            placeholder="Search Questions"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="conversation-list">
                    {/* 可能你想问： */}
                    <div className="conversation-item">
                        <h3>Maybe you want to ask:</h3>
                    </div>
                    {filteredHelpItems.map(item => (
                        <div
                            key={item.id}
                            className="conversation-item"
                            onClick={() => handleQuestionClick(item.answer)}
                            dangerouslySetInnerHTML={{ __html: highlightText(item.question, searchTerm) }}
                        />
                    ))}
                </div>
            </div>

            {/* 右侧聊天区域 */}
            <div className="chat-main">
                {/* 聊天头部 */}
                <div className="chat-main-header">
                    <div className="ai-avatar">AI</div>
                    <div className="ai-info">
                        <h3>CRISPRone Assistant</h3>
                        <p>Professional CRISPRone technical Q&A assistant</p>
                    </div>
                </div>

                {/* 聊天消息区域 */}
                <div className="chat-messages">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`message ${message.isUser ? 'user-message' : 'ai-message'}`}
                        >
                            <div className="message-content">
                                <Markdown>
                                    {message.text}
                                </Markdown>
                                <span className="timestamp">{message.timestamp}</span>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                    {isTyping && (
                        <div className="typing-indicator">
                            AI正在输入...
                        </div>
                    )}
                </div>

                {/* 输入区域 */}
                <div className="chat-input-container">
                    <div className="input-toolbar">
                        <SmileOutlined
                            className="tool-icon"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        />

                        {/* 表情选择器 */}
                        {showEmojiPicker && (
                            <div className="emoji-picker-container">
                                <Picker
                                    data={data}
                                    onEmojiSelect={handleEmojiSelect}
                                    theme="light"
                                    previewPosition="none"
                                />
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="chat-input">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={isTyping ? "AI正在回复..." : "输入消息..."}
                            disabled={isTyping}
                        />
                        <button type="submit" disabled={isTyping}>发送</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ChatCrisper;
