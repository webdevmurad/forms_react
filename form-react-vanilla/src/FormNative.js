import React from 'react';
import Error from './Error';

function validate(values) {
    let errors = {};

    if(!values.name) {
        errors.name = "Required field";
    }

    return errors;
}

export default function FormNative() {

    const[name, setName] = React.useState("");
    const[errors, setErrors] = React.useState({});
    const[submitting, setSubmitting] = React.useState(false);

    React.useEffect(() => {
        setErrors(validate({name}));
    }, [name]);

    return (
        <form onSubmit={event => {
            event.preventDefault();

            if (Object.keys(validate({name})).length > 0) {
                return;
            }
            setSubmitting(true);
            setTimeout(() => {
                const values = {name}
                alert(JSON.stringify(values, null, 2));
                setSubmitting(false);
                setName('');
            }, 500);
        }}>
            <div>
                <label htmlFor='name'>Name: </label>
                <input 
                    type="text" 
                    name="name" 
                    id="name" 
                    onChange={event => setName(event.target.value)}
                    value={name}
                    className={errors.name ? 'has-error' : null}
                
                />
                <Error message={errors.name}/>
            </div>
            <div>
                <button type="submit" disabled={submitting}>Submit</button>
            </div>
        </form>
    )
}