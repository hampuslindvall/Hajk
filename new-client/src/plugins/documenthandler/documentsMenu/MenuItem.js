import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { withSnackbar } from "notistack";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import clsx from "clsx";

const styles = theme => ({
  menuItem: {
    height: theme.spacing(20),
    maxWidth: theme.spacing(36),
    minWidth: theme.spacing(22),
    margin: theme.spacing(1),
    opacity: "0.8",
    cursor: "pointer",
    [theme.breakpoints.down("xs")]: {
      maxWidth: "none",
      height: theme.spacing(10)
    }
  },
  noTransparency: {
    opacity: 1
  },
  gridContainer: {
    height: "100%"
  }
});

class MenuItem extends React.PureComponent {
  state = {
    highlighted: false
  };

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.globalObserver = this.props.app.globalObserver;
  }

  toggleHighlight = () => {
    console.log();
    this.setState({ highlighted: !this.state.highlighted });
  };

  handleMenuButtonClick = header => {
    console.log(header, "title clicked");
    const { localObserver } = this.props;
    localObserver.publish("menu-item-clicked", header);
  };

  render() {
    const { classes, color, header } = this.props;

    return (
      <>
        <Paper
          onClick={() => {
            this.handleMenuButtonClick(header);
          }}
          style={{ backgroundColor: color }}
          onMouseEnter={this.toggleHighlight}
          onMouseLeave={this.toggleHighlight}
          className={
            this.state.highlighted > 0
              ? clsx(classes.menuItem, classes.noTransparency)
              : classes.menuItem
          }
          square={true}
          elevation={this.state.highlighted ? 20 : 0}
        >
          <Grid
            className={classes.gridContainer}
            justify="center"
            alignItems="center"
            container
          >
            <Grid align="center" xs={12} item></Grid>
            <Grid xs={12} item>
              <Typography
                style={{ wordWrap: "break-word" }}
                variant="subtitle1"
                align="center"
                color="textPrimary"
              >
                {header}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </>
    );
  }
}

export default withStyles(styles)(withSnackbar(MenuItem));
