import { useState } from 'react';
import UserTable from './UserTable';
import GenFetcher from './GenFetcher';
import UserForm from './UserForm';
import { randomId } from '../helpers/randomId'
import columns from '../helpers/columns';
import css from './StylesModules/FetchUsers.module.css';


export default function FetchUser({ onRowClick }) {
  const
    [users, setUsers] = useState(null),
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


  async function fetcher() {
    const
      response = await fetch('https://jsonplaceholder.typicode.com/users/');
    if (!response.ok) throw new Error('fetch ' + response.status);
    return await response.json();
  }

  function onClick(evt) {
    const source = evt.target.closest('button[data-action]');
    if (source) {
      const { action, id } = source.dataset;
      switch (action) {
        case 'delete':
          setUsers(old => old.filter(el => String(el.id) !== id));
          return;
        case 'edit':
          setNewUserId(id);
          const index = users.findIndex((obj) => String(obj.id) === String(id));
          setValues(columns.map(({ setVal, getVal }) => setVal ? getVal(users[index]) : ''));
          return;
        case 'cancel':
          setNewUserId(null);
          setValues(columns.map(() => ''));
          return;
        case 'ok':
          if (newUserId) {
            const index = users.findIndex((obj) => String(obj.id) === String(newUserId));
            const newUser = users[index];
            columns.forEach(({ setVal }, id) => Object.assign(newUser, setVal?.(values[id])));
            setUsers(old => old.with(index, newUser));
          } else {
            const newUser = { id: randomId(users) };
            columns.forEach(({ setVal }, index) => Object.assign(newUser, setVal?.(values[index])));
            setUsers(users.concat(newUser));
          };
          setNewUserId(null);
          setValues(columns.map(() => ''));
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
      <GenFetcher fetcher={fetcher} onLoadCallback={setUsers}>
        <UserTable users={users?.filter(filterObjects)} onRowClick={onRowClick} columns={columnsWithButtons} sortColumns={sortColumns} newUserId={newUserId}>
          <UserForm columns={columns} values={values} setValues={setValues}/>
        </UserTable>
      </GenFetcher>
    </div>
  );
};
