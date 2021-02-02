import { useEffect } from "react";

export const useScrollToBottom = (MsgWindowRef, dependencies = []) => {

    useEffect(() => {

        debugger;

        if (MsgWindowRef.current) {

            MsgWindowRef.current.scroll({ top: MsgWindowRef.current.children[0].clientHeight, behavior: 'smooth' });

        }

    }, [MsgWindowRef, ...dependencies]);

};

