import css from './StylesModules/UserTable.module.css';


export default function UserTable({ users, columns, onRowClick, sortColumns, newUserId, children }) {

  return (
    <table className={css.table}>
      <thead>
        <tr>
          {columns.map(({ title }, index) =>
            <th
              key={title}
              className={[
                index === Math.abs(sortColumns) - 1 ? css.sort : '',
                index === Math.abs(sortColumns) - 1 && sortColumns < 0 ? css.desc : ''].join(' ')}
            >
              {title}
            </th>)}
        </tr>
      </thead>
      <tbody>
        {users.map(user =>
          <>
            {String(user.id) === String(newUserId)
              ? <>{children}</>
              : <tr
                onDoubleClick={() => onRowClick(user.id)}
                key={user.id}
                className={css.table__row}
                data-user-id={user.id}>
                {columns.map(({ title, getVal }) => <td key={title}>{getVal(user)}</td>)}
              </tr>}
          </>
        )}
      </tbody>
      {!newUserId &&
        <tfoot>
          {children}
        </tfoot>
      }
    </table>
  );
}