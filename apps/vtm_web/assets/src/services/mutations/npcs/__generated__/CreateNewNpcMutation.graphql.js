/**
 * @flow
 */

/* eslint-disable */

'use strict';

import type { ConcreteRequest } from 'relay-runtime';
export type CharacterCreationRequest = {|
  avatar?: ?string,
  biography: string,
  chatAvatar?: ?string,
  clanId: string,
  description: string,
  isNpc?: ?number,
  name: string,
|};
export type CreateNewNpcMutationVariables = {|
  request: CharacterCreationRequest
|};
export type CreateNewNpcMutationResponse = {|
  +createNpc: ?{|
    +character: ?{|
      +id: string
    |}
  |}
|};
export type CreateNewNpcMutation = {|
  variables: CreateNewNpcMutationVariables,
  response: CreateNewNpcMutationResponse,
|};


/*
mutation CreateNewNpcMutation(
  $request: CharacterCreationRequest!
) {
  createNpc(input: {request: $request}) {
    character {
      id
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "request"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "fields": [
          {
            "kind": "Variable",
            "name": "request",
            "variableName": "request"
          }
        ],
        "kind": "ObjectValue",
        "name": "input"
      }
    ],
    "concreteType": "CreateNpcPayload",
    "kind": "LinkedField",
    "name": "createNpc",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Character",
        "kind": "LinkedField",
        "name": "character",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "CreateNewNpcMutation",
    "selections": (v1/*: any*/),
    "type": "RootMutationType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "CreateNewNpcMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "38fea409a28e7a672ebb911569878ff4",
    "id": null,
    "metadata": {},
    "name": "CreateNewNpcMutation",
    "operationKind": "mutation",
    "text": "mutation CreateNewNpcMutation(\n  $request: CharacterCreationRequest!\n) {\n  createNpc(input: {request: $request}) {\n    character {\n      id\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node: any).hash = 'ab54bf5ecfe26cef0247509d9c97d2e7';
module.exports = node;