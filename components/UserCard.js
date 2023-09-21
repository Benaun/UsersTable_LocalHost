import css from './StylesModules/UserCard.module.css';
import UserPosts from './UserPosts';

export default function UserCard({ user, showPosts, setShowPosts }) {
    const
        { id, name, username, email,
            address: { city },
            phone, website,
            company: { name: cname}
        } = user;

    return (
        <div className={css.user__card}>
            <div className={css.card__wrapper}>
                <div>
                    <h2>
                        {name} ({username})
                    </h2>
                    <p>Email: {email}</p>
                    <p>Telephone: {phone}</p>
                    <p>Wesite: {website}</p>
                </div>
                <div>
                    <div>
                        <p >
                            Street: City: {city}
                        </p>
                    </div>
                </div>
                <div>
                    <div>
                        <h2>Company</h2>
                        <p>Name: {cname}</p>
                    </div>
                </div>

                <button className={css.btn} onClick={() => setShowPosts(true)}>Посты</button>
            </div>
            {showPosts && <UserPosts id={id}/>}
        </div>
    );
}

