export interface QtHistory {
    id: number
    content: string
    sender: string
    qtalkId: string
    timestamp: string
}


export const qtHistory: QtHistory[] = [
    {
        id: 1,
        content: 'hello',
        sender: '123',
        qtalkId: '123',
        timestamp: '123',
    },
]