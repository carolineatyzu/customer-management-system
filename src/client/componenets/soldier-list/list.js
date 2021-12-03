import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort,faSortUp,faSortDown } from '@fortawesome/free-solid-svg-icons';
import { Box,Grid,Table,TableHead,TableBody, TableRow,TableCell, CircularProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

import * as actions from '../../redux/action-creators/soldier-list';
import { delSoldier } from '../../redux/action-creators/del-soldier';
import Entry from './list-entry';
import { Alert } from '@material-ui/lab';


const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#5B9BD5",
    color: "white",
    fontSize: 16,
    fontWeight: 600,
    border: "2px solid white",
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    height: 5,
    padding: 0,
  }
}))(TableRow);

class List extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.scroller = React.createRef();
  }
  componentDidMount() {
    const options = {
      root: null,
      rootMargin: '10px',
      threshold:  [0,0.25,0.75,1]
    };
    const observer = new IntersectionObserver(this.handleScroll,options);
    if (this.scroller.current) {
      observer.observe(this.scroller.current);
    }
    this.fillTable(this.props.pageNum);
  }
  componentWillUnmount() {
    const { cleanList,updateQuery } = this.props;
    updateQuery({ pageNum: 1 });
    cleanList();
  }
  handleScroll = (entries) => {
    const { fetchList,updateQuery } = this.props;
    // console.log(entries[0].intersectionRatio,this.props.pageNum);
    if (entries[0].intersectionRatio > 0 && this.props.pageNum !== 0) {
      if(this.props.pageNum < this.props.list.nextPage) {
        updateQuery({ pageNum: this.props.list.nextPage });
        fetchList();
      }
    }
  }
  toggleSort =  (field) => () => {
    const { updateQuery, cleanList, asc: sort } = this.props;
    let asc = sort === 0 ? 1: sort === 1? -1 : 0;
    if (this.props.query.field !== field) {
      asc = 1;
    }
    updateQuery({ field, asc });
    this.fillTable(1,true);
  }
  displayArrow = (field) => {
    if (this.props.query.field === field) {
      switch(this.props.asc) {
        case 1:
          return <FontAwesomeIcon icon={faSortUp} />
        case -1:
          return <FontAwesomeIcon icon={faSortDown} />
        default:
          return <FontAwesomeIcon icon={faSort} />
      }
    }
  }
  handleLoadSup = (supid) => () => {
    const { updateQuery } = this.props;
    updateQuery({ supid,sub: "",q: "",field: "", asc: 0 });
    this.fillTable(1,true);
  }
  handleLoadSub = (sub) => () => {
    const { updateQuery } = this.props;
    updateQuery({ supid:"",sub,q: "",field: "", asc: 0 });
    this.fillTable(1,true);
  }
  handleDelete = (id) => () => {
    const { delSoldier,cleanList } = this.props;
    delSoldier(id,() => {
      this.fillTable(1,true);
    });
  }
  handleEdit = (id) => () => {
    this.props.routerPush("edit", { id });
  }
  fillTable = async (pageNum=1,replace=false) => {
    const { fetchList,updateQuery } = this.props;
    updateQuery({ pageNum });
    await fetchList(replace);
    while(this.scroller.current.getBoundingClientRect().bottom < window.innerHeight
    && this.props.list.hasNextPage) {
      updateQuery({ pageNum: ++pageNum });
      await fetchList();
    }
  }
  render() {
    const { list,state } = this.props;
    return (
      <Box>
        <Table className="soldier-list">
          <TableHead>
            <StyledTableRow padding={0} className="table-header">
              <StyledTableCell align="left">Avatar</StyledTableCell>
              <StyledTableCell align="left" onClick={this.toggleSort("name")}>Name {this.displayArrow("name")}</StyledTableCell>
              <StyledTableCell align="left" onClick={this.toggleSort("sex")}>Sex {this.displayArrow("sex")}</StyledTableCell>
              <StyledTableCell align="left" onClick={this.toggleSort("rank")}>Rank {this.displayArrow("rank")}</StyledTableCell>
              <StyledTableCell align="left" onClick={this.toggleSort("startDate")}>Start Date {this.displayArrow("startDate")}</StyledTableCell>
              <StyledTableCell align="left" onClick={this.toggleSort("phone")}>Phone {this.displayArrow("phone")}</StyledTableCell>
              <StyledTableCell align="left" onClick={this.toggleSort("email")}>Email {this.displayArrow("email")}</StyledTableCell>
              <StyledTableCell align="left" onClick={this.toggleSort("superior")}>Superior {this.displayArrow("superior")}</StyledTableCell>
              <StyledTableCell align="left"># of D.S.</StyledTableCell>
              <StyledTableCell align="left">Edit</StyledTableCell>
              <StyledTableCell align="left">Delete</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            { 
              list.docs?.map(soldier => (
                <Entry 
                key={soldier._id} 
                soldier={soldier} 
                handleLoadSub={this.handleLoadSub} 
                handleLoadSup={this.handleLoadSup} 
                handleDelete={this.handleDelete}
                handleEdit={this.handleEdit}
                />
              ))
            }
          </TableBody>
        </Table>
        <div ref={this.scroller}></div>
        {
          list.hasNextPage && state !== 1 && <Box display="flex" justifyContent="space-around" ><CircularProgress /></Box>
        }
        {
          this.props.error &&
          <Alert severity="error">this.props.error.message</Alert>
        }
      </Box>
    );
  }
}

const mapStateToProps = state => ({
  list: state.soldierList.list,
  state: state.soldierList.state,
  pageNum: state.soldierList.query.pageNum,
  asc: state.soldierList.query.asc,
  query: state.soldierList.query,
});

const mapDispathToProps = dispatch => ({
  fetchList: (replace=false) => {
    return dispatch(actions.fetchSoldierList(replace));
  },
  cleanList: () => {
    dispatch(actions.cleanSoldierList());
  },
  updateQuery: query => {
    dispatch(actions.updateListQuery(query));
  },
  delSoldier: (id,callback) => dispatch(delSoldier(id,callback))
});

export default connect(mapStateToProps,mapDispathToProps)(List);