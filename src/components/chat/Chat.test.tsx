import React from 'react';
import {render, fireEvent, waitFor, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Server } from 'mock-socket';
// import userEvent from '@testing-library/user-event'

import { options } from '../../util/configs'
import Chat from './Chat';

declare module 'mock-socket' {
    type SocketIO = any
}
let mockServer: Server;
const admin = options.admin;

async function setup() {
    render(<Chat socketConfigs={options.socket}/>);
        
        fireEvent.click(screen.getByText('CHAT'));
        await waitFor(() => screen.getByText('How can we help you?'));

        return {
            input: screen.getByTestId('msg-input'),
            send: screen.getByText('Send')
        }
}

// beforeAll(() => mockServer = new Server(options.socket.url))
describe('Chat component', () => {
    it('should load properly', () => {
        render(<Chat socketConfigs={options.socket}/>);

        screen.getByText('CHAT');
    });
    it('should open component on click', async () => {
        await setup();

        screen.getByText('How can we help you?');
    });
})