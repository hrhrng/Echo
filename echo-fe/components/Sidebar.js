import { Pin, PinOff } from 'lucide-react';
import { useState } from 'react';
import { patuaOne } from '@/app/font';


const SIDEBAR_ITEMS = Array(20)
    .fill(null)
    .map((_, index) => ({
        id: index + 1,
        title: `群聊 ${index + 1}`,
    }));

const Sidebar = ({ isLeftPinned, togglePin, setSelectedItem, selectedItem }) => {
    const [isLeftExpanded, setIsLeftExpanded] = useState(false);

    const handleMouseEnter = () => {
        if (!isLeftPinned) {
            setIsLeftExpanded(true);
        }
    };

    const handleMouseLeave = () => {
        if (!isLeftPinned) {
            setIsLeftExpanded(false);
        }
    };

    return (
        <div
            className="fixed top-0 left-0 h-full z-50"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* 收起状态的窄边栏 */}
            <div
                className={`
          absolute top-0 left-0 h-full border-r transition-all duration-300 ease-in-out
          ${isLeftExpanded ? 'w-0 opacity-0' : 'w-1 bg-gray-200 hover:bg-gray-300 opacity-100'}
        `}
            ></div>

            {/* 展开状态的边栏 */}
            <div
                className={`
          absolute top-0 left-0 h-full bg-white border-r transition-all duration-300 ease-in-out
          ${isLeftExpanded || isLeftPinned ? 'w-64 opacity-100 shadow-lg' : 'w-0 opacity-0'}
        `}
            >
                <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        {/*<h2 className="text-lg font-semibold">start echo</h2>*/}
                        <div className={`${patuaOne.className} text-black text-[45px]`}>
                            Echo
                        </div>

                        <button
                            onClick={togglePin}
                            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                            aria-label={isLeftPinned ? '取消固定' : '固定侧边栏'}
                        >
                            {isLeftPinned ? (
                                <PinOff className="w-4 h-4 text-gray-600"/>
                            ) : (
                                <Pin className="w-4 h-4 text-gray-600"/>
                            )}
                        </button>
                    </div>
                    <div className="space-y-1">
                        {SIDEBAR_ITEMS.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedItem(item.id)}
                                className={`
                  px-3 py-2 rounded-md cursor-pointer text-sm transition-colors
                  ${
                                    selectedItem === item.id
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'hover:bg-gray-100'
                                }
                `}
                            >
                                {item.title}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
