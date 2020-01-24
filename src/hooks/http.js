import { useReducer, useCallback } from 'react';

const httpReducer = (curHttpState, action) => {
    switch (action.type) {
        case 'SEND':
        return { loading: true, error: null, data: null, extra: null, identifier: action.identifier };
        case 'RESPONSE':
        return { ...curHttpState, loading: false, data: action.data, extra: action.extra }
        case 'ERROR':
        return { loading: false, error: action.error}
        case 'CLEAR':
        return { ...curHttpState, error: null }
        default:
        throw new Error ('Should not reach this!');
    }
}

const useHttp = () => {
    const [httpState, dispatchHttp] = useReducer(httpReducer, { loading: false, error: null, data: null, extra: null, identifier: null });
    const sendRequest = useCallback((url, method, body, extra, identifier) => {
        dispatchHttp({ type: 'SEND', identifier: identifier })
        fetch(url, {
            method: method,
            body: body,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            return res.json();
        }).then(data => {
        dispatchHttp({ type: 'RESPONSE', data: data, extra: extra });
        // setIsLoading(false);
        // setUserIngredients(prevIngredients => prevIngredients.filter(ing => ing.id !== id));
        }).catch(error => {
        dispatchHttp({ type: 'ERROR', error: 'Something went wrong!' })
        });
    }, []);
    return {
        isLoading: httpState.loading,
        error: httpState.error,
        data: httpState.data,
        sendRequest: sendRequest,
        extra: httpState.extra,
        identifier: httpState.identifier
    }
}

export default useHttp;