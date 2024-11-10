import React from 'react';
import { Layout } from 'lucide-react';
import { patuaOne } from "@/app/font";
import MessageInput from './MessageInput';  // 确保导入 MessageInput 组件

const ProjectPanel = ({
                          onClose,
                          onSendMessage,
                      }) => {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <div className="flex-1 flex flex-col">
                <div className="flex-none p-6 border-b">
                    <div className="max-w-4xl mx-auto flex justify-between items-center">
                        <h2 className={`${patuaOne.className} text-2xl`}>项目面板</h2>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 flex items-center gap-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            <Layout className="w-4 h-4"/>
                            <span>返回</span>
                        </button>
                    </div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-gray-50 rounded-xl p-6">
                            <div className="space-y-4">
                                <h3 className="font-medium text-lg">项目历史</h3>
                                {/* Add your project history content here */}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-none p-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="relative flex rounded-xl shadow-sm">
                            <button
                                onClick={onClose}
                                className="flex-none px-4 py-3 rounded-l-xl flex items-center gap-2
                    transition-all duration-200
                    bg-gray-200 text-gray-800 shadow-inner"
                            >
                                <Layout className="w-4 h-4"/>
                                <span className="text-sm font-medium">项目面板</span>
                            </button>
                            <div className="flex-1 relative">
                                <MessageInput onSend={onSendMessage}/>
                            </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-400 text-center">
                            按 Enter 发送，Shift + Enter 换行
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectPanel;