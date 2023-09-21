import { useEffect } from 'react';
import { useState } from 'react';


export default function GenFetcher({ fetcher, children, onLoadCallback }) {
    const
        [data, setData] = useState(null),
        [error, setError] = useState(null);

    useEffect(() => {
        async function f() {
            try {
                const d = await fetcher();
                setData(d);
                onLoadCallback(d);
                setError(null);
            } catch (err) {
                setError(err);
            }
        } f();
    }, [onLoadCallback]);

    if (error) return <Error error={error} />;
    if (data) return <>{children}</>;
    return <Spinner />;
}

function Error({ error }) {
    return <h2 className='error' >{error.toString()} </h2>;
}

function Spinner() {
    return <div className='spinner'></div>;
}