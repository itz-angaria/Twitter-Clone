import React from 'react';
import { useAuth } from '../../Datacontext/AuthData';

const Feed = () => {
    // Access the 'auth' object from the AuthData context
    const [auth, setAuth] = useAuth();

    return (
        <div>
            {/* Display the authentication data as formatted JSON */}
            <pre>
                {JSON.stringify(auth, null, 4)}
            </pre>
        </div>
    );
};

export default Feed;
