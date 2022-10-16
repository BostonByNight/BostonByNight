// @flow

import type {GraphqlErrorMessage} from "./relay-utils";

export type GenericReactComponent = any;

export type GenericEvent = any;

export type History = {
    push: string => void;
};

export type AlertType = 'success' | 'warning' | 'error' | 'info';

export type AlertInfo = {
    type: AlertType;
    duration?: number;
    graphqlErrors?: ?GraphqlErrorMessage | any;
    message?: ?string;
    key?: string | number;
};

export type OpenDialogProps = (string, string, ?() => void, ?() => void) => void;
