import "./footer.css";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";


const Footer = () => {

    return (
        <footer className="footerContainer">
            <Grid
                container
                spacing={0}
            >
                <Grid item xs={6}>
                    <Typography
                        sx = {{
                            fontSize: '0.95rem',
                            textAlign: 'center',
                            mb: '0.5%',
                        }}
                        variant="h2"
                    >
                        <span style={{
                            textDecoration: 'none',
                            borderBottom: '1px solid white',
                            display: 'inline',
                        }}>
                            Attributions
                        </span>
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography
                        sx = {{
                            fontSize: '0.95rem',
                            textAlign: 'center',
                        }}
                        variant="h2"
                    >
                        <span style={{
                            textDecoration: 'none',
                            borderBottom: '1px solid white',
                            display: 'inline',
                            mb: '0.5%',
                        }}>
                            Creators
                        </span>
                    </Typography>
                </Grid>
                <Grid item xs={3}>
                    <div className="attributionsLeft">
                        Templates and Icons from{' '}
                        <a href="https://mui.com/" title="Material-UI Icons">
                            Material-UI
                        </a>.
                        <br/>
                        Icons from{' '}
                        <a href="https://www.flaticon.com/" title="Flaticon">
                            www.flaticon.com
                        </a>.
                        <br/>
                        Icons from{' '}
                        <a href="https://fontawesome.com/" title="Font Awesome">
                            Font Awesome
                        </a>.
                        <br/>
                        Icons from{' '}
                        <a href="https://iconscout.com/" title="Iconscout">
                            Iconscout
                        </a>.
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="attributionsRight">
                        Map data ©{' '}
                        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
                            OpenStreetMap
                        </a>{' '}contributors.
                        <br/>
                        Map data and Reverse Geocoding ©{' '}
                        <a href="https://www.geoapify.com/" target="_blank" rel="noopener noreferrer">
                            Geoapify
                        </a>.
                        <br/>
                        Geocoding provided by{' '}
                        <a href="https://nominatim.org/" target="_blank" rel="noopener noreferrer">
                            Nominatim
                        </a>.
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <Typography
                        sx = {{
                            fontSize: '0.8rem',
                            textAlign: 'center',
                            mt: '1%',
                            fontFamily: 'Consolas, monospace',
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 4)',
                        }}
                        variant="h3"
                    >
                        Georgios Alexandros Kostas
                    </Typography>
                    <Typography
                        sx = {{
                            fontSize: '0.8rem',
                            textAlign: 'center',
                            mt: '1%',
                            fontFamily: 'Consolas, monospace',
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 4)',
                        }}
                        variant="h3"
                    >
                        Konstantinos Arkoulis
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography
                        sx = {{
                            fontSize: '0.78rem',
                            textAlign: 'center'
                        }}
                        variant="h3"
                    >
                        <span style={{
                            textDecoration: 'none',
                            borderBottom: '1px solid white',
                            display: 'inline',
                        }}>
                            © 2023 Bookify. All Rights Reserved.
                        </span>
                    </Typography>
                </Grid>
            </Grid>
        </footer>
    );
};

export default Footer;