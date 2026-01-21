import React from 'react';
import { Drawer, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Offcanvas = ({
    open,
    onClose,
    anchor = 'right',
    width = '30%',
    height = 'auto',
    children,
    PaperProps,
    backdrop = true,
    ...rest
}) => {
    return (
        <Drawer
            anchor={anchor}
            open={open}
            onClose={onClose}
            hideBackdrop={!backdrop}
            ModalProps={{
                BackdropProps: {
                    sx: backdrop ? { backdropFilter: 'blur(3px)' } : {}
                }
            }}
            PaperProps={{
                sx: {
                    width: ['left', 'right'].includes(anchor) ? width : '100%',
                    height: ['top', 'bottom'].includes(anchor) ? height : '100%',
                    maxWidth: '100vw',
                    maxHeight: '100vh',
                    ...PaperProps?.sx
                },
                ...PaperProps
            }}
            {...rest}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {children}
            </Box>
        </Drawer>
    );
};

export const OffcanvasHeader = ({ children, onClose, sx, ...rest }) => {
    return (
        <Box
            sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid',
                borderColor: 'divider',
                ...sx
            }}
            {...rest}
        >
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                {children}
            </Typography>
            {onClose && (
                <IconButton onClick={onClose} aria-label="close" size="small">
                    <CloseIcon />
                </IconButton>
            )}
        </Box>
    );
};

export const OffcanvasBody = ({ children, sx, ...rest }) => {
    return (
        <Box
            sx={{
                p: 2,
                flexGrow: 1,
                overflowY: 'auto',
                ...sx
            }}
            {...rest}
        >
            {children}
        </Box>
    );
};

export const OffcanvasFooter = ({ children, sx, ...rest }) => {
    return (
        <Box
            sx={{
                p: 2,
                borderTop: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                ...sx
            }}
            {...rest}
        >
            {children}
        </Box>
    );
};

export default Offcanvas;