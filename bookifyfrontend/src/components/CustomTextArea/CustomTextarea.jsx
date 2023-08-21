import * as React from 'react';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';
import {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleExclamation} from "@fortawesome/free-solid-svg-icons";
import TextField from "@mui/material/TextField";

// Component provided by Material UI. Customized to fit the project's needs
// Code reference: https://mui.com/base-ui/react-textarea-autosize/

const blue = {
    100: '#DAECFF',
    200: '#b6daff',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    900: '#003A75',
};

const grey = {
    50: '#f6f8fa',
    100: '#eaeef2',
    200: '#d0d7de',
    300: '#afb8c1',
    400: '#8c959f',
    500: '#6e7781',
    600: '#57606a',
    700: '#424a53',
    800: '#32383f',
    900: '#24292f',
};

const StyledTextarea = styled(TextareaAutosize)(
    ({ theme }) => `
            width: 100%;
            font-family: IBM Plex Sans, sans-serif;
            font-size: 0.875rem;
            font-weight: 400;
            line-height: 1.5;
            padding: 12px;
            border-radius: 12px 12px 0 12px;
            color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
            background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
            border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
            box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
          
            &:hover {
              border-color: ${blue[400]};
            }
          
            &:focus {
              border-color: ${blue[400]};
              box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[500] : blue[200]};
            }
          
            // firefox
            &:focus-visible {
              outline: 0;
            }
          `,
);

const MemoizedStyledTextarea = React.memo(StyledTextarea);

export default function CustomTextarea({ placeholder, minRows = 2, maxRows = 10, onValueChanged, emptyError = ''}) {
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