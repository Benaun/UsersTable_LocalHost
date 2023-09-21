import css from './StylesModules/FetchUsers.module.css';

export default function UserForm({ columns, values, setValues }) {
    return <tr>
        {columns.map(({ title, setVal, getVal }, index) =>
            <td key={title}>
                {setVal
                    ? <input value={values[index]} onInput={event => setValues(old => old.with(index, event.target.value))} />
                    : ' '}
            </td>)
        }
        <td>
            <button className={[css.btn, css.btn__ok].join(' ')} data-id={''} data-action='ok'>&#9989;</button>
            <button className={[css.btn, css.btn__cancel].join(' ')} data-id={''} data-action='cancel'>&#10060;</button>
        </td>
    </tr >
};