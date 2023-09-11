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
                            fontSize: '20px',
                            textAlign: 'center',
                        }}
                        variant="h2"
                    >
                        Attributions
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography
                        sx = {{
                            fontSize: '20px',
                            textAlign: 'center',
                        }}
                        variant="h2"
                    >
                        Creators
                    </Typography>
                </Grid>
                <Grid item xs={3}>
                    <div className="attributionsLeft">
                        Templates and Icons from{' '}
                        <a href="https://mui.com/" title="Material-UI Icons">
                            Material-UI
                        </a>.
                        <br/>
                        Icons made by{' '}
                        <a href="https://www.flaticon.com/authors/author-name" title="Author Name">
                            Author Name
                        </a>{' '}from{' '}
                        <a href="https://www.flaticon.com/" title="Flaticon">
                            www.flaticon.com
                        </a>.
                        <br/>
                        Icons from{' '}
                        <a href="https://fontawesome.com/" title="Font Awesome">
                            Font Awesome
                        </a>.
                        <br/>
                        Icons made by{' '}
                        <a href="https://iconscout.com/contributors/contributor-name" title="Contributor Name">
                            Contributor Name
                        </a>{' '}from{' '}
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
                        Map data ©{' '}
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
                            fontSize: '18px',
                            textAlign: 'center',
                            mt: '0.5rem',
                        }}
                        variant="h3"
                    >
                        Georgios Alexandros Kostas
                    </Typography>
                    <Typography
                        sx = {{
                            fontSize: '18px',
                            textAlign: 'center',
                            mt: '0.3rem',
                        }}
                        variant="h3"
                    >
                        Konstantinos Arkoulis
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography
                        sx = {{
                            fontSize: '16px',
                            textAlign: 'center'
                        }}
                        variant="h3"
                    >
                        © 2023 Bookify. All Rights Reserved.
                    </Typography>
                </Grid>
            </Grid>
        </footer>
    );
};

export default Footer;