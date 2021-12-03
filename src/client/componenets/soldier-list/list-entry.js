import React, { PureComponent } from 'react';
import { Button,Link,TableRow,TableCell, makeStyles } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { withStyles } from '@material-ui/styles';

import thumb from './army-logo-thumb.png';

const useStyle = makeStyles({
  body: {

  }
});

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: "#D0DEEF",
    },
    '&:nth-of-type(even)': {
      backgroundColor: "#E9EFF7",
    },
    padding: 0
  },
}))(TableRow);

const StyledTableCell = withStyles((theme) => ({
  body: {
    padding: 8,
    align: "left",
    fontWeight: 500,
    border: "2px solid white",
  }
}))(TableCell);

class Entry extends PureComponent {
  render() {
    const { soldier,handleLoadSup,handleLoadSub,handleDelete,handleEdit } = this.props;
    const startDate = new Date(soldier.startDate);
    return (
      <StyledTableRow>
        <StyledTableCell><img alt="avatar" src={soldier.avatar ? `data:image/jpeg;base64,${Buffer(soldier.avatar).toString('base64')}` : thumb} /></StyledTableCell>
        <StyledTableCell>{soldier.name}</StyledTableCell>
        <StyledTableCell>{soldier.sex}</StyledTableCell>
        <StyledTableCell>{soldier.rank}</StyledTableCell>
        <StyledTableCell>{
          `${startDate.getMonth()+1}/${startDate.getDate()}/${startDate.getFullYear()}`
        }</StyledTableCell>
        <StyledTableCell>
          <Link href={`tel:${soldier.phone.replace(/-/g,"")}`}>{soldier.phone}</Link>
        </StyledTableCell>
        <StyledTableCell>
          <Link href={`mailto:${soldier.email}`}>{soldier.email}</Link>
        </StyledTableCell>
        <StyledTableCell>{
          soldier.superior && 
          <Link color="primary" className="link"  onClick={handleLoadSup(soldier.superior._id)}>
            {soldier.superior.name}
          </Link>
        }</StyledTableCell>
        <StyledTableCell>{
          soldier.numOfSubs>0 ? 
          <Link color="primary" className="link" onClick={handleLoadSub(soldier._id)}>
            {soldier.numOfSubs}
          </Link> 
          : ""
        }</StyledTableCell>
        <StyledTableCell>
          <Button 
          className="btn"
          onClick={handleEdit(soldier._id)}>
            <FontAwesomeIcon icon={faEdit}/>
          </Button>
        </StyledTableCell>
        <StyledTableCell>
          <Button 
          className="btn" 
          onClick={handleDelete(soldier._id)}>
            <FontAwesomeIcon icon={faTrashAlt}/>
          </Button>
        </StyledTableCell>
      </StyledTableRow>
    );
  }
}

export default Entry;