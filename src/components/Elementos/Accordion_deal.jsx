import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

const Accordion_Deal = props => {
  const classes = useStyles();
  const {header, texto} = props
  return (
    <div className={classes.root}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>{ header }</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
           { texto }
          </Typography>
        </AccordionDetails>
      </Accordion>
      
    </div>
  );
}


Accordion_Deal.propTypes = {
  header: PropTypes.string.isRequired,
  texto: PropTypes.string.isRequired,
}

export default Accordion_Deal