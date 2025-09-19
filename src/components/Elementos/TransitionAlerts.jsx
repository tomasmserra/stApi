import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function TransitionAlerts(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const {showMessage, text, severity} = props;

  // useEffect(() => {
  //   setOpen(showMessage)
  // }, [])

  return (
    <div className={classes.root}>
      <Collapse in={showMessage}>
        <Alert severity={severity}
          // action={
          //   <IconButton
          //     aria-label="close"
          //     color="inherit"
          //     size="small"
          //     onClick={() => {
          //       setOpen(false);
          //     }}
          //   >
          //     <CloseIcon fontSize="inherit" />
          //   </IconButton>
          // }
        >
          {text}
        </Alert>
      </Collapse>
      
    </div>
  );
}