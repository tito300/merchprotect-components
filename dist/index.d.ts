interface StyledProps {

    color?: string;

    backgroundColor?: string;

    open?: boolean;

    width?: string;

}

export declare const Select: import("styled-components").FlattenSimpleInterpolation;

export declare const UlList: import("styled-components").FlattenSimpleInterpolation;

export declare const commonCss: import("styled-components").FlattenInterpolation<import("styled-components").ThemedStyledProps<StyledProps, any>>;

export declare const Container: import("styled-components").StyledComponent<"div", any, {}, never>;

export declare const Icon: import("styled-components").StyledComponent<"div", any, StyledProps, never>;

export declare const Wrapper: import("styled-components").StyledComponent<"div", any, StyledProps, never>;

export declare const Header: import("styled-components").StyledComponent<"h4", any, StyledProps, never>;

export declare const MsgWindow: import("styled-components").StyledComponent<"div", any, StyledProps, never>;

export declare const MsgInput: import("styled-components").StyledComponent<"textarea", any, StyledProps & {

    block?: boolean;

}, never>;

export declare const Button: import("styled-components").StyledComponent<"button", any, StyledProps, never>;

export declare const RoomsList: import("styled-components").StyledComponent<"ul", any, {}, never>;

export declare const RoomLi: import("styled-components").StyledComponent<"li", any, {

    current: boolean;

    handled: boolean;

}, never>;

export declare const MsgList: import("styled-components").StyledComponent<"ul", any, {}, never>;

export declare const Msg: import("styled-components").StyledComponent<"li", any, {

    sender: string;

    sentColor: string;

    receiveColor: string;

}, never>;

export declare const CurrentClient: import("styled-components").StyledComponent<"p", any, {}, never>;

export declare const Row: import("styled-components").StyledComponent<"div", any, {}, never>;

export declare const Column: import("styled-components").StyledComponent<"div", any, {

    col?: number;

}, never>;

export declare const MsgWrapper: import("styled-components").StyledComponent<"div", any, {}, never>;

export declare const RoomsWrapper: import("styled-components").StyledComponent<"div", any, {}, never>;

export declare const Shape: import("styled-components").StyledComponent<"div", any, StyledProps & {

    shape?: string;

}, never>;

export declare const ErrMsg: import("styled-components").StyledComponent<"p", any, {}, never>;

export declare const MsgStatus: import("styled-components").StyledComponent<"p", any, {}, never>;

export {};

