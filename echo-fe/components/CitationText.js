const CitationText = ({ children, chatId, onClick }) => (
    <span
        className="text-blue-500 cursor-pointer hover:underline hover:text-blue-700 transition-colors"
        onClick={() => onClick(chatId)}
    >
    {children}
  </span>
);

export default CitationText;
