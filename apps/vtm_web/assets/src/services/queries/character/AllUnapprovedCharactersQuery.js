// @flow

import graphql from 'babel-plugin-relay/macro';
import type {Query} from "relay-runtime/util/RelayRuntimeTypes";
import type {
    AllUnapprovedCharactersQuery$data,
    AllUnapprovedCharactersQuery$variables
} from "./__generated__/AllUnapprovedCharactersQuery.graphql";

export const allUnapprovedCharactersQuery: Query<AllUnapprovedCharactersQuery$variables, AllUnapprovedCharactersQuery$data> = graphql`
    query AllUnapprovedCharactersQuery {
        unapprovedCharactersList {
            id
            name
            isComplete
            approved
        }
    }
`;
