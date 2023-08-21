import * as React from 'react';
import {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleExclamation} from "@fortawesome/free-solid-svg-icons";
import TextField from "@mui/material/TextField";

export default function CustomTextarea({ placeholder, minRows = 2, maxRows = 10, onValueChanged, emptyError = '', required=false}) {
    const [inputValue, setInputValue] = useState('')

    return <div>
        <TextField
            id="outlined-multiline-flexible"
            label={placeholder}
            multiline
            placeholder={placeholder || ''}
            minRows={minRows}
            maxRows={maxRows}
            value={inputValue}
            required={required}
            onChange={(event) => {
                setInputValue(event.target.value)
                if(onValueChanged) onValueChanged(event.target.value);
            }}
            style={{ resize: 'none', width: '100%' }}
        />

        {
            (emptyError !== '' && inputValue === '') &&
            <div style={{display: 'flex', flexDirection: 'row', gap: '1%', alignItems: 'center', justifyContent: 'center'}}>
                <FontAwesomeIcon icon={faCircleExclamation} style={{color: "#ff0000", marginRight: '0'}}/>
                {emptyError}
            </div>
        }
    </div>
}