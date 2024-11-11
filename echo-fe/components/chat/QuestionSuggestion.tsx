// components/QuestionSuggestions.tsx
import React from 'react';
import { Lightbulb, ChevronRight, X } from 'lucide-react';

const suggestionsList = [
    "这个项目的主要技术栈是什么？",
    "目前项目进度如何？",
    "有哪些待解决的关键问题？",
    "下一步开发计划是什么？",
    "团队成员的分工情况如何？",
    "项目的主要里程碑有哪些？",
];

const QuestionSuggestions = ({
                                 show,
                                 onClose,
                                 onSelect
                             }) => {
    if (!show) return null;

    return (
        <div className="absolute right-full bottom-full mb-4 mr-4 w-80">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200">
                <div className="flex items-center justify-between p-3 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-blue-600">
                        <Lightbulb className="w-4 h-4"/>
                        <span className="text-sm font-medium">推荐问题</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-4 h-4"/>
                    </button>
                </div>
                <div className="py-2">
                    {suggestionsList.map((question, index) => (
                        <button
                            key={index}
                            className="w-full text-right px-4 py-2 text-sm text-gray-600 hover:bg-gray-50
                                     hover:text-blue-600 transition-colors flex items-center justify-end gap-2
                                     group"
                            onClick={() => onSelect(question)}
                        >
                            <span className="truncate">{question}</span>
                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"/>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuestionSuggestions;