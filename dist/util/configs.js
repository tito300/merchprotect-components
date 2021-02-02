import jwt from 'jsonwebtoken';

import { getSessionId } from './helpers';

const JWT_KEY = 'TEST_1';

let sessionId = getSessionId();

export const options = {

    socket: {

        url: 'localhost:3002',

        rooms: [

            { roomId: 'subscribe', roomName: 'Subscription issues' },

            { roomId: 'howto', roomName: 'Help using site' },

            { roomId: 'bugs', roomName: 'Report a bug' }

        ]

    },

    admin: {

        token: jwt.sign({ name: sessionId, id: '123' }, JWT_KEY),

        name: sessionId

    }

};

