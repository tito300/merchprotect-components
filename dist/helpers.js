export function getSessionId() {

    try {

        let sessionId = sessionStorage.getItem('chat_id');

        if (!sessionId) {

            sessionId = Math.ceil(Math.random() * 10000).toString();

            sessionStorage.setItem('chat_id', sessionId);

        }

        return sessionId;

    }

    catch (err) {

        return Math.ceil(Math.random() * 10000).toString();

    }

}

