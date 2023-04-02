import {useState, useCallback} from "react";

//creted hook for GETing data from API and returning sates: loading, error and data if ok
export const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (url, method ='GET', body= null, headers = {'Content-Type': 'application/json'}) => {

        setLoading(true);

        try {
            const response = await fetch(url, {method, body, headers});
            
            if (!response.ok) {
                throw new Error(`Could not fect ${url}, status: ${response.status}`)
            }

            const data = await response.json();

            setLoading(false);

            return data;


        } catch(error) {
            setLoading(false);
            setError(error.message);
            throw error;
        }

    }, []);

    const clearError = useCallback(() => setError(null), []);

    return {loading, request, error, clearError}
}