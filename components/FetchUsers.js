import { useState } from 'react';
import UserTable from './UserTable';
import UserForm from './UserForm';
import { randomId } from '../helpers/randomId'
import columns from '../helpers/columns';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import css from './StylesModules/FetchUsers.module.css';

const API = 'http://localhost:3333/users/';


export default function FetchUser({ onRowClick }) {
  const
    { users, error, isLoading, isValidating, mutate } = useSWR(API, fetcher),
    [sortColumns, setSortColumns] = useState('0'),
    [newUserId, setNewUserId] = useState(null),
    [values, setValues] = useState(columns.map(() => '')),
    [searchValue, setSearchValue] = useState('');

  const columnsWithButtons = columns.concat({
    title: 'Actions', getVal: ({ id }) => <>
      <button className={[css.btn, css.btn__edit].join(' ')} data-id={id} data-action='edit'>Ред.</button>
      <button className={[css.btn, css.btn__del].join(' ')} data-id={id} data-action='delete'>X</button>
    </>
  });


  async function fetcher(API) {
    const prom = fetch(API);
    toast.promise(prom, {
      loading: 'is loading...',
      success: 'ok',
      error: (err) => `Somthing goes wrong: ${err.toString()}`
    }, { position: 'bottom-center' });
    const
      response = await prom;
    if (!response.ok) throw new Error('fetch ' + response.status);
    return await response.json();
  }

  async function onClick(evt) {
    const source = evt.target.closest('button[data-action]');
    if (source) {
      const { action, id } = source.dataset;

      let optimisticData;
      const promise = (() => {
        switch (action) {
          case 'delete':
            optimisticData = users.filter(user => String(user.id) !== id);
            return fetch(API + id, { method: 'DELETE' })
              .then(async res => {
                if (!res.ok) {
                  throw (new Error(res.status + ' ' + res.statusText));
                }
              });
          case 'ok':
            setNewUserId(null);
            if (newUserId) {
              const index = users.findIndex((obj) => String(obj.id) === String(newUserId));
              const newUser = { ...users[index] };
              columns.forEach(({ setVal }, id) => Object.assign(newUser, setVal?.(values[id])));
              optimisticData = users.with(index, newUser)
              setValues(columns.map(() => ''));
              return fetch(API + newUserId,
                {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(newUser)
                })
                .then(async res => {
                  if (!res.ok) {
                    throw (new Error(res.status + ' ' + res.statusText));
                  }
                });
            } else {
              const newUser = { id: randomId(users) };
              columns.forEach(({ setVal }, index) => Object.assign(newUser, setVal?.(values[index])));
              optimisticData = data.concat(newUser)
              setValues(columns.map(() => ''));
              return fetch(API,
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(newUser)
                })
                .then(async res => {
                  if (!res.ok) {
                    throw (new Error(res.status + ' ' + res.statusText));
                  }
                });
            }
        }
      })();

      if (promise) {
        toast.promise(promise, {
          loading: 'Fetching ' + action,
          success: 'ok',
          error: (err) => `${err.toString()}`,
        });
        await mutate(promise.then(fetcher, fetcher), { optimisticData, populateCache: true, revalidate: false });
      }

      switch (action) {
        case 'edit':
          setNewUserId(id);
          const index = users.findIndex((obj) => String(obj.id) === String(id));
          setValues(columns.map(({ setVal, getVal }) => setVal ? getVal(users[index]) : ''));
          return;
        case 'cancel':
          setNewUserId(null);
          setValues(columns.map(() => ''));
          return;
      };
      return;
    };

    const th = evt.target.closest('th');
    if (th && th.cellIndex !== 7) {
      let newSort;
      if (Math.abs(sortColumns) === 1 + th.cellIndex) {
        newSort = -sortColumns;
      } else {
        newSort = 1 + th.cellIndex;
      }
      const { getVal } = columns[Math.abs(newSort) - 1];

      const sortedUsers = users.toSorted((a, b) => {
        switch (true) {
          case (typeof getVal(a) === 'number' && typeof getVal(b) === 'number'):
            return getVal(a) - getVal(b);
          case (typeof getVal(a) === 'string' && typeof getVal(b) === 'string'):
            return getVal(a).localeCompare(getVal(b));
        }
      });

      if (newSort < 0) {
        sortedUsers.reverse();
      };
      setUsers(sortedUsers);
      setSortColumns(newSort);
    };
  };

  function filterObjects(el) {
    if (!searchValue) return true;
    return columns.map(({ getVal }) => getVal(el)).filter(x => 'string' === typeof x).some(x => x.toLowerCase().includes(searchValue.toLowerCase()));
  };

  return (
    <div className={css.container} onClick={onClick}>
      <h1 className={css.title}>Таблица пользователей</h1>
      <input className={css.search__input} placeholder='Поиск по таблице' value={searchValue} onInput={event => setSearchValue(event.target.value)} />
      {users && <UserTable users={users?.filter(filterObjects)} onRowClick={onRowClick} columns={columnsWithButtons} sortColumns={sortColumns} newUserId={newUserId}>
        <UserForm columns={columns} values={values} setValues={setValues} />
      </UserTable>}
      <div style={{ position: 'absolute', fontSize: 'xxx-large' }}>
        {isLoading && <>⌛</>}
        {isValidating && <></>}
      </div>
      {error && <>Error {error.toString()}</>}
    </div>
  );
};
