import { useEffect } from "react";

export const useScrollToBottom = (MsgWindowRef: React.RefObject<HTMLElement>, dependencies: any[] = []) => {
    useEffect(() => {
        if (MsgWindowRef.current?.scroll) {
            MsgWindowRef.current.scroll({ top: MsgWindowRef.current.children[0].clientHeight, behavior: 'smooth' });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [MsgWindowRef, ...dependencies])
}
