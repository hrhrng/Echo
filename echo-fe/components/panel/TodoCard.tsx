import React, {useState, useEffect} from 'react';
import {UserCheck, Quote} from 'lucide-react';
import {DraggableItem} from "@/components/panel/DraggableItem";
import {ReferenceItem} from "@/components/chat/reference/ReferencedItems";
import RemindDialog from "@/components/RemindDialog";
import {todoApi, todoUtils} from "@/services/api";

interface Todo {
    todoId: string;
    todoName: string;
    todoDesc: string;
    qtalkId: string;
    quotes: number[];
}

interface TodoCardProps {
    onQuoteClick: (index: number) => void;
    refreshInterval?: number;
}

const TodoCard: React.FC<TodoCardProps> = ({onQuoteClick, refreshInterval = 2000}) => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isRemindDialogOpen, setIsRemindDialogOpen] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

    const fetchTodos = async (isInitial = false) => {
        if (isInitial) {
            setIsInitialLoading(true);
        } else {
            setIsRefreshing(true);
        }

        try {
            const result = await todoApi.getTodos();
            setTodos(result);
            setError(null);
        } catch (err) {
            setError('Failed to fetch todos');
            console.error('Error fetching todos:', err);
        } finally {
            if (isInitial) {
                setIsInitialLoading(false);
            } else {
                setIsRefreshing(false);
            }
        }
    };

    useEffect(() => {
        fetchTodos(true);
        const intervalId = setInterval(() => fetchTodos(false), refreshInterval);
        return () => clearInterval(intervalId);
    }, [refreshInterval]);

    const handleSendRemind = (message: string, feedback?: string) => {
        console.log('发送催办消息:', message, feedback);
        setIsRemindDialogOpen(false);
    };

    const handleOpenRemindDialog = (todo: Todo) => {
        setSelectedTodo(todo);
        setIsRemindDialogOpen(true);
    };

    if (isInitialLoading) {
        return (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-red-100">
                <p className="text-red-600 text-sm">Error loading todos: {error}</p>
            </div>
        );
    }

    return (
        <>
            {todos.map((todo) => {
                const dragItem: ReferenceItem = {
                    id: todo.todoId,
                    type: 'todo',
                    title: todo.todoName,
                };

                return (
                    <DraggableItem key={todo.todoId} item={dragItem}>
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-medium text-gray-900">{todo.todoName}</h4>
                                        <div className="flex flex-wrap gap-1">
                                            {todo.quotes.map((index) => (
                                                <button
                                                    key={index}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onQuoteClick(index);
                                                    }}
                                                    className="flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium text-gray-500 hover:text-blue-600
                                                    bg-gray-50 hover:bg-blue-50 rounded-md transition-colors group"
                                                >
                                                    <Quote className="w-3 h-3 opacity-50 group-hover:opacity-100"/>
                                                    <span>{index}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{todo.todoDesc}</p>
                                </div>
                                <button
                                    onClick={() => handleOpenRemindDialog(todo)}
                                    className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100"
                                >
                                    催办
                                </button>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <UserCheck className="w-4 h-4"/>
                                <span>{todo.qtalkId}</span>
                            </div>
                        </div>
                    </DraggableItem>
                );
            })}

            {selectedTodo && (
                <RemindDialog
                    open={isRemindDialogOpen}
                    onOpenChange={setIsRemindDialogOpen}
                    todo={{
                        todoId: selectedTodo.todoId,
                        title: selectedTodo.todoName,
                        detail: selectedTodo.todoDesc,
                        assignee: selectedTodo.qtalkId
                    }}
                    onSend={handleSendRemind}
                    onRegenerate={() => {}}
                />
            )}
        </>
    );
};

export default TodoCard;