import {useState, useCallback} from "react";

//creted hook for GETing data from API and returning sates: loading, error and data if ok
export const useHttp = () => {
    const [process, setProcess] = useState('waiting'); // creating state for current process: loading, confirmed, error

    const request = useCallback(async (url, method ='GET', body= null, headers = {'Content-Type': 'application/json'}) => {

        setProcess('loading')
        try {
            const response = await fetch(url, {method, body, headers});
            
            if (!response.ok) {
                throw new Error(`Could not fect ${url}, status: ${response.status}`)
            }
            const data = await response.json();
            return data;
        } catch(error) {
            setProcess('error')
            throw error;
        }

    }, []);

    const clearError = useCallback(() => {
        setProcess('loading')
    }, []);

    return {request, clearError, process, setProcess}
}