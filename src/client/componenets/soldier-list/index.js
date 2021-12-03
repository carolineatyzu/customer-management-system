import React, { Component } from 'react';
import { connect } from 'react-redux';

import logo from './mark-of-us-army-small.png';
import * as actions from '../../redux/action-creators/soldier-list';
import HeaderBox from './header-box';
import ListTable from './list';
import { Container,Grid,Box } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

class SoldierList extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.scroller = React.createRef();
  }
  routerPush = (...route) => {
    this.props.history.push(...route);
  }
  render() {
    return (
      <Container>
        <Grid container justify="center" direction="row" alignItems="center">
          <Box margin="10px"><img src={logo} alt="us-army-logo" /></Box>
          <h2>US Army Personnel Registry</h2>
        </Grid>
        <HeaderBox scroller={this.scroller} routerPush={this.routerPush}/>
        <ListTable routerPush={this.routerPush} />
        <div ref={this.scroller}></div>
      </Container>
    );
  }
};

const mapStateToProps = state => ({
  list: state.soldierList.list,
  error: state.soldierList.error,
});

const mapDispathToProps = dispatch => ({
  fetchList: () => {
    return dispatch(actions.fetchSoldierList());
  },
  updateQuery: query => {
    dispatch(actions.updateListQuery(query));
  },
  cleanList: () => {
    dispatch(actions.cleanSoldierList());
  }
});

export default connect(mapStateToProps,mapDispathToProps)(SoldierList);
// export default SoldierList;