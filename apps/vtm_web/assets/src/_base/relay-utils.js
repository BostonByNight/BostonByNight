// @flow

import subscriptionEnvironment from "./relay-socket-environment";
import {Observable} from "relay-runtime";
import type {
    CacheConfig,
    FetchPolicy,
    GraphQLTaggedNode,
    OperationType,
    RenderPolicy,
    VariablesOf,
    IEnvironment
} from "relay-runtime";
import type {Sink} from "relay-runtime/network/RelayObservable";
import type {PayloadError} from "relay-runtime";
import type {Subscription} from "relay-runtime/network/RelayObservable";

import {
    commitMutation,
    fetchQuery,
    requestSubscription, useLazyLoadQuery
} from "react-relay";

export type GraphqlErrorLocation = {
    column: number;
    line: number;
}

export type GraphqlError = {
    locations: GraphqlErrorLocation[];
    message: string;
    path: string[];
}

export type GraphqlErrorMessage = {
    errors: GraphqlError[];
}

export const parseGraphqlMessage = (error: GraphqlErrorMessage, defaultError?: ?string): string => {
    if (error && error.errors && error.errors.map) {
        return error?.errors
            .map(({ message }) => message)
            .join("\r\n");
    }

    return defaultError ?? "An error happened in the back end";
}

const parseResponse = <T>(res: T => void, rej: any => void, extractor?: any => T) => {
    return (response: any, errors: ?Array<PayloadError>) => {
        if (errors) { 
            rej({
                errors: errors
            });
        }
        else if (response) {
            if (extractor) {
                res(extractor(response));
            }
            else {
                res(response);
            }
        }
    };
}

export const wrapQuery = <T>(environment: IEnvironment, operation: GraphQLTaggedNode, variables: any, extractor?: any => T): Promise<T> => {
    return new Promise((res, rej) => {
        fetchQuery(
            environment,
            operation,
            variables
        )
        .subscribe({
            next: response => {
                parseResponse(res, rej, extractor)(response);
            },
            error: _ => {
                rej([ `There was an error while contacting the server.\r\nPlease check your connection.` ]);
            }
        })
    });
};

export const wrapMutation = <T>(environment: IEnvironment, operation: any, variables: any, extractor?: any => T): Promise<T> => {
    return new Promise((res, rej) => {
        commitMutation(
            environment,
            {
                mutation: operation,
                variables,
                onCompleted: parseResponse(res, rej, extractor),
                onError: e => {
                    console.error("error", e);
                    rej([`There was an error while contacting the server.\r\nPlease check your connection.`])
                }
            }
        )
    });
}

const request = <T>(sink: Sink<T>, operation: any, variables: any, extractor?: any => T) => {
    requestSubscription(
        subscriptionEnvironment,
        {
            subscription: operation,
            variables,
            onCompleted: () => {
                sink.complete();
            },
            onError: error => {
                console.error("Error in subscription", error);
                sink.error(error, true);
            },
            onNext: object => {
                parseResponse(
                    sink.next,
                    sink.error,
                    extractor
                )(object);
            }
        }
    );
};

export const wrapSubscription = <T>(operation: any, variables: any, extractor?: any => T): Observable<T> =>
    Observable.create((sink: Sink<T>) => request(sink, operation, variables, extractor));

/**
 * Subscribes to the given observable.
 * @param observable The Observable.
 * @param onNext The next value handler.
 * @param onError The error handler.
 * @returns {Subscription} The subscription info.
 */
export const subscribe = <T>(observable: Observable<T>, onNext: T => void, onError?: ((any, ?boolean) => void)): Subscription => {
    const handleError = onError ?? ((e, _) => console.error("Error in subscription!", e));

    const subscription = observable.subscribe({
        next: onNext,
        error: handleError,
        complete: () => {
            console.info("base unsubscribing");
            subscription.unsubscribe();
        },
        closed: false
    });

    return subscription;
};

/**
 * Converts a Relay readonly array to a plain Javascript array.
 * @param arr The Relay array.
 * @returns {T[]} The javascript array.
 */
export const convertToJavascriptArray = <T>(arr: ?$ReadOnlyArray<T>): T[] => {
    const result = [];

    for (const element of arr ?? []) {
        result.push(element);
    }

    return result;
};

/**
 * Custom implementation of the Relay lazy load query.
 * @param gqlQuery The GraphQL query.
 * @param variables The query variables.
 * @param options The call options.
 * @returns {*} The query response.
 */
export const useCustomLazyLoadQuery = <TQuery: OperationType>(
    gqlQuery: GraphQLTaggedNode,
    variables: VariablesOf<TQuery>,
    options?: {|
        fetchKey?: string | number,
        fetchPolicy?: FetchPolicy,
        networkCacheConfig?: CacheConfig,
        UNSTABLE_renderPolicy?: RenderPolicy,
    |},
): $ElementType<TQuery, 'response'> =>
    useLazyLoadQuery(gqlQuery, variables, options);

export const useStoreFirstQuery = <TQuery: OperationType>(
    gqlQuery: GraphQLTaggedNode,
    variables: VariablesOf<TQuery>
): $ElementType<TQuery, 'response'> =>
    useCustomLazyLoadQuery<TQuery>(gqlQuery, variables, {
        fetchPolicy: "store-or-network"
    });

export const useForceReloadFirstQuery = <TQuery: OperationType>(
    gqlQuery: GraphQLTaggedNode,
    variables: VariablesOf<TQuery>
): $ElementType<TQuery, 'response'> =>
    useCustomLazyLoadQuery<TQuery>(gqlQuery, variables, {
        fetchPolicy: "store-and-network"
    });
