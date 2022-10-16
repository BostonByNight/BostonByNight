// @flow

import type {AtomEffect} from "recoil";

export type StorageKey = string;

export const getStorage = (): Storage => localStorage;

/**
 * Saves the state to the local browser storage.
 * @param key The storage key.
 * @return {(function({setSelf: *, onSet: *}): void)|*} The effect.
 */
export const localStorageEffect = <T>(key: StorageKey): AtomEffect<T> =>
    ({setSelf, onSet}) => {
        const localStorage = getStorage()
        const savedValue = localStorage.getItem(key)

        if (savedValue != null) {
            setSelf(JSON.parse(savedValue))
        }

        onSet((newValue, _, isReset) => {
            isReset
                ? localStorage.removeItem(key)
                : localStorage.setItem(key, JSON.stringify(newValue) ?? "{}")
        })
    }
