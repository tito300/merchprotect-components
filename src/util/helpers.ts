export function getSessionId(): string {
    try {
        let sessionId = sessionStorage.getItem('chat_id');
        if (!sessionId) {
            sessionId = Math.ceil(Math.random() * 10000).toString();
            sessionStorage.setItem('chat_id', sessionId);
        }
        return sessionId;
    } catch(err) {
        //cookies disabled
        return Math.ceil(Math.random() * 10000).toString();
    }
}