import * as React from 'react';
import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleExclamation} from "@fortawesome/free-solid-svg-icons";
import TextField from "@mui/material/TextField";

export default function CustomTextarea({ placeholder, minRows = 2, maxRows = 10, onValueChanged, emptyError = '', required=false, initValue}) {
    const [inputValue, setInputValue] = useState('')

    useEffect(() => {
        initValue && setInputValue(initValue);
    }, [initValue]);

    return <div>
        <TextField
            id="outlined-multiline-flexible"
            label={placeholder}
            error={emptyError && emptyError!==''}
            helperText={emptyError}
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
    </div>
}