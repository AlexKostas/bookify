import { useState } from "react";

export const useSessionStorage = () => {
    const [value, setValue] = useState(null);

    const setItem = (key, value) => {
        sessionStorage.setItem(key, value);
        setValue(value);
    }

    const getItem = (key) => {
        const valueToReturn = sessionStorage.getItem(key) || undefined;
        setValue(valueToReturn);
        return valueToReturn;
    }

    const removeItem = (key) => {
        sessionStorage.removeItem(key);
        setValue(null);
    }

    return {value, setItem, getItem, removeItem};
};