import React from 'react';
import Autosuggest from 'react-autosuggest';
import axios from 'axios'
import {Formik} from 'formik';
import * as Yup from 'yup';
import Error from './Error';

const validationSchema = Yup.object().shape({
    name: Yup.string()
        .min(1, "Must have a character")
        .max(255, "Must be shorter than 255")
        .required("Must enter a name"),
    email: Yup.string()
        .email("Must be a valid email address")
        .max(255, "Must be shorter than 255")
        .required("Must enter a email"),
    country: Yup.string()
        .required("Must choose country")
});

export default function FormikForm() {
    const [country, setCountry] = React.useState('');
    const [suggestions, setSuggestions] = React.useState([]);

    return (
        <Formik 
            initialValues={{name: "", email: "", country: ""}}
            validationSchema={validationSchema}
            onSubmit={(values, {setSubmitting, resetForm}) => {
                setSubmitting(true);
                setTimeout(() => {
                    alert(JSON.stringify(values, null, 2));
                    resetForm();
                    setSubmitting(false)
                }, 500)
            }}
        >
            {({values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue}) => (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name">Name: </label>
                        <input 
                            type="text" 
                            name="name" 
                            id="name"
                            placeholder="Enter your name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.name}
                            className={touched.name && errors.name ? "has-error" : null}
                            />
                        <Error touched={touched.name} message={errors.name}/>
                    </div>
                    <div>
                        <label htmlFor="email">Email: </label>
                        <input 
                            type="text" 
                            name="email" 
                            id="email"
                            placeholder="Enter your email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                            className={touched.email && errors.email ? "has-error" : null}
                            />
                        <Error touched={touched.email} message={errors.email}/>
                    </div>
                    <div>
                        <label htmlFor="country">Country</label>
                        <Autosuggest inputProps={{
                            placeholder: 'Type your country',
                            autoComplete: 'abcd',
                            name: 'country',
                            id: 'country',
                            value: country,
                            onChange: (_event, {newValue}) => {
                                setCountry(newValue);
                            },
                            className: touched.country && errors.country ? "has-error" : null
                        }}
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={async({value}) => {
                            if(!value) {
                                setSuggestions([]);
                                return;
                            }
                            try {
                                const result = await axios.get(`https://restcountries.eu/rest/v2/name/${value}`)
                                setSuggestions(result.data.map(row => ({
                                    name: row.name,
                                    flag: row.flag
                                })));
                            } catch(e) {
                                setSuggestions([]);
                            }
                        }}
                        onSuggestionsClearRequested={() => {
                            setSuggestions([]);
                        }}
                        onSuggestionSelected={(event, {suggestion, method}) => {
                            if (method === 'enter') {
                                event.preventDefault();
                            }
                            setCountry(suggestion.name);
                            setFieldValue("country", suggestion.name)
                        }}
                        getSuggestionValue={suggestion => suggestion.name}
                        renderSuggestion={suggestion => (
                            <div>
                                <img 
                                    style={{width: "25px"}} 
                                    alt={suggestion.name} 
                                    src={suggestion.flag}/>{suggestion.name}
                            </div>
                        )}
                        />
                        <Error touched={touched.country} message={errors.country}/>
                    </div>

                    <div>
                        <button type="submit" disabled={isSubmitting}>Submit</button>
                    </div>
                </form>
            )}
        </Formik>
    )
}