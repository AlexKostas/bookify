import React from 'react';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';

const CustomDialogTitle = ({ title, onClose, withClose=false }) => {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            <span>{title}</span>
            {withClose &&
                <Button
                    onClick={onClose}
                    color="inherit"
                    size="small"
                    sx={{
                        backgroundColor: 'rgb(180,10,50)',
                        width: 'auto',
                        height: '2.2rem',
                        borderRadius: '50%',
                        minWidth: '2.2rem',
                        '&:hover': {
                            backgroundColor: 'rgb(225,5,10)',
                        },
                    }}
                >
                    <CloseIcon/>
                </Button>
            }
        </div>
    );
}

export default CustomDialogTitle;