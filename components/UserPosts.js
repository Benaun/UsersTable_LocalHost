import css from './StylesModules/UserPosts.module.css';
import { useState, useEffect } from 'react';

export default function UserPosts({ id }) {
    const [userPosts, setPosts] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function userPosts() {
            try {
                const
                    response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}/posts`);
                if (!response.ok) throw new Error('fetch ' + response.status);
                setPosts(await response.json());
                setError(null);
            } catch (err) {
                setError(err);
            }
        }
        userPosts();
    }, [id]);

    if (error) return <div>Ошибка: {error.message}</div>;

    if (userPosts)
        return (
            <div className={css.post__card}>
                {userPosts.map(post =>
                    <div key={post.id}>
                        <h6>Post №{post.id}</h6>
                        <h5>{post.title}</h5>
                        <p>{post.body}</p>
                    </div>
                )}
            </div>
        );
}