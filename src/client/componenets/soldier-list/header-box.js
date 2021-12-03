import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button,Container,Grid,Box,Link, TextField, createStyles } from '@material-ui/core';


import * as actions from '../../redux/action-creators/soldier-list';
import { makeStyles, withStyles } from '@material-ui/styles';

const Wrapper = withStyles({
  root: {
    margin: "10px 0"
  }
})(Box);
class HeaderBox extends Component {
  handleInput = e => {
    this.props.updateQuery({ q:e.target.value });
  }
  handleSearch = async e => {
    const { fetchList,cleanList,updateQuery,scroller } = this.props;
    let pageNum = 1;
    updateQuery({pageNum});
    cleanList();
    await fetchList();
    while(scroller.current.getBoundingClientRect().bottom < window.innerHeight
    && this.props.list.hasNextPage) {
      updateQuery({ pageNum: ++pageNum });
      await fetchList();
    }
  }
  handleSubmit = e => {
    e.preventDefault()
    this.handleSearch();
  }
  handleReset = async e => {
    const { fetchList,updateQuery,scroller } = this.props;
    const initQuery = {
      q: "",
      field: "",
      asc: 0,
      pageNum: 1,
      supid: "",
      sub: "",
    };
    updateQuery(initQuery);
    let pageNum = 1;
    await fetchList(true);
    while(scroller.current.getBoundingClientRect().bottom < window.innerHeight
    && this.props.list.hasNextPage) {
      updateQuery({ pageNum: ++pageNum });
      await fetchList();
    }
  }
  render() {
    const { searchText,routerPush } = this.props;
    return (
      <Wrapper>
        <form onSubmit={this.handleSubmit}>
          <Grid container alignItems="center" direction="row" wrap="nowrap">
            <TextField 
            variant="outlined" 
            type="string" 
            placeholder="Search" 
            size="small"
            value={searchText} 
            onChange={this.handleInput} 
            onBlur={this.handleSearch}
            />
            <Grid container justify="flex-end" alignItems="center">
              <Grid item xs={1}>
                <Button  variant="contained" color="primary" type="button" onClick={this.handleReset}>Reset</Button>
                </Grid>
              <Grid item>
                <Button variant="contained" color="primary" type="button" onClick={() => routerPush('/create')}>New Soldier</Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Wrapper>
    );
  }
};

const mapStateToProps = state => ({
  searchText: state.soldierList.query.q,
  list: state.soldierList.list,
});

const mapDispathToProps = dispatch => ({
  updateQuery: query => {
    dispatch(actions.updateListQuery(query));
  },
  cleanList: () => {
    dispatch(actions.cleanSoldierList());
  },
  fetchList: (replace) => {
    return dispatch(actions.fetchSoldierList(replace));
  },
});

export default connect(mapStateToProps,mapDispathToProps)(HeaderBox);