import React from 'react';
import {render, fireEvent, waitFor, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { SocketIO, Server } from 'mock-socket';
import userEvent from '@testing-library/user-event'

import { options } from '../../util/configs'
import ChatAdmin from './ChatAdmin';

// declare module 'mock-socket' {
//     type SocketIO = any
// }
let mockServer: Server;
const admin = options.admin;

async function setup() {
    render(<ChatAdmin socketConfigs={options.socket} admin={admin}/>);
        
        fireEvent.click(screen.getByText('CHAT'));
        await waitFor(() => screen.getByText('Please assist customers'));

        return {
            input: screen.getByTestId('msg-input'),
            send: screen.getByText('Send')
        }
}

// beforeAll(() => mockServer = new Server(options.socket.url))
describe('ChatAdmin component', () => {
    it('should load properly', () => {
        render(<ChatAdmin socketConfigs={options.socket} admin={admin}/>);

        screen.getByText('CHAT');
    });
    it('should open component on click', async () => {
        await setup();

        screen.getByText('Please assist customers');
    });
    // it('should send text', async done => {
    //     const { input, send } = await setup();

    //     mockServer.on('connection', () => {
    //         mockServer.on('message', msg => {
    //             try {
    //                 expect(msg).toHaveTextContent('test 1');
    //                 done();
    //             } catch(err) {
    //                 done(err);
    //             }
    //         })
    //         mockServer.emit('rooms', [[{
    //             id: 'abc',
    //             name: 'Room abc',
    //             active: true,
    //             handled: true,
    //             agent: 'Tarek',
    //             messages: [],
    //         }], [{
    //             token: 'adwedcse',
    //             name: 'Tarek',
    //             currentRoom: 'abc',
    //         }]])
    //     })

    //     userEvent.type(input, 'test 1');
    //     userEvent.click(send);
    // })
})