import React, { Component } from 'react';
import defaultLogo from './army-logo.png';
import { connect } from 'react-redux';
import axios from 'axios';
import { Container,Box,Grid, Button, Input, FormLabel, TextField, RadioGroup, FormControl, Select, MenuItem, Radio, FormControlLabel } from '@material-ui/core';

import { getSup } from '../../redux/action-creators/get-all-sup';
import { createSoldier } from '../../redux/action-creators/create-soldier';
import { editSoldier } from '../../redux/action-creators/edit-soldier'
import './style.css';
import markOfUSArmy from '../soldier-list/mark-of-us-army-small.png';
import { Alert } from '@material-ui/lab';

const ranks = ["General", "Colonel", "Major", "Captain", "Lieutenant", "Warrant Officer", "Sergeant", "Corporal", "Specialist", "Private"];
const regs = {
  startDate: /^\d{1,2}\/\d{1,2}\/(\d{4}|\d{2})$/i,
  phone: /^(\d{10}|((\d{3}|(\(\d{3}\)))-\d{3}-\d{4}))$/,
  email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
}

const updateSoldier = page => {
  class update extends Component {
    constructor(props) {
      super(props);
      this.props = props;
      this.state = {
        avatar: "",
        file: null,
        name: "",
        rank: "",
        sex: "",
        startDate: "",
        phone: "",
        email: "",
        superior: ""
      }
    }
    componentDidMount() {
      this.props.getSup().then(() => {
        if (page === "edit") {
          const endPoint = "http://localhost:4000/api/soldier";
          const { id } = this.props.location.state;
          axios.get(`${endPoint}/${id}`)
          .then(res => {
            const { avatar,startDate: date,superior } = res.data.soldier;
            const startDate = new Date(date);
            this.setState({
              ...res.data.soldier,
              startDate: `${startDate.getMonth()+1}/${startDate.getDate()}/${startDate.getFullYear()}`,
              id,
              superior: superior === null ? "" : superior,
            },() => {
              if (avatar && Buffer(avatar).byteLength > 0) {
                this.setState({ avatar: `data:image/png;base64,${Buffer(avatar).toString('base64')}` });
              } else {
                this.setState({ avatar: defaultLogo });
              }
            });
          })
          .catch(err => {
            console.error(err);
          })
        }
        else {
          this.setState({ avatar:defaultLogo });
        }
      });
    }
    handleChange = (state) => (e) => {
      this.setState({ [state]: e.target.value });
    };
    handleAvatar = e => {
      if (e.target.files.length > 0) {
        this.setState({ 
          avatar: URL.createObjectURL(e.target.files[0]),
          file: e.target.files[0],
        });
      }
    }
    handleSubmit = e => {
      e.preventDefault();
      const { name,rank,sex,startDate,phone,email,superior,id } = this.state;
      const query = {
        name,
        rank,
        sex,
        startDate,
        phone: phone.replace(/\D/g,""),
        email,
        superior
      };
      if (page === "edit") {
        query._id = id;
      }
      
      const request = this.props[`${page}Soldier`];
      request(query,this.state.file,this.props.history);
    }
    validateForm = () => {
      const { name,rank,startDate,phone,email } = this.state;
      return (
        name && rank && 
        (startDate === "" || regs['startDate'].test(startDate)) &&
        (phone === "" || regs['phone'].test(phone)) &&
        (email === "" || regs['email'].test(email))
      );
    }
    validateField = field => {
      const val = this.state[field];
      return (
        val === "" || regs[field].test(val)
      );
      
    }
    render() {
      const { avatar,name,rank,sex,startDate,phone,email,superior } = this.state;
      const { list,history } = this.props;
      const error = this.props[`${page}Error`];
      console.log(error);
      return (
        <Container>
          <Box margin="10px 0">
            <Grid container justify="center" alignItems="center" xs={12}>
              <Box margin="0 20px">
                <img src={markOfUSArmy} alt="army logo" />
              </Box>
              {
                page === "create" ? 
                <h1>New Soldier</h1> :
                <h1>Update Soldier</h1>
              }
            </Grid>
            <Grid container justify="flex-end" xs={12}>
              <Grid item xs={1}>
                <Button 
                variant="contained" 
                color="primary" 
                onClick={() => history.push("/")}>Cancel
                </Button>
              </Grid>
              <Grid item xs={1}>
                <Button 
                variant="contained" 
                color="primary" 
                type="submit" 
                form="update-soldier" 
                className="btn" 
                disabled={!this.validateForm()}>Save</Button>
              </Grid>
            </Grid>
          </Box>
          <Box>
            <form className="update-soldier-form" id="update-soldier" onSubmit={this.handleSubmit}>
              <Grid container justify="center" alignItems="center">
                <Grid item xs={6}>
                  <h2>Avatar</h2>
                  <img className="upload-avatar" src={avatar} alt="avatar"/>
                  <p>Select an image</p>
                  <Input accept="image/*" type="file" onChange={this.handleAvatar}/>
                </Grid>
              </Grid>
              <Grid container direction="column" xs={4}>
                <Box display="flex" flexDirection="column" marginBottom="10px">
                  <FormLabel htmlFor="name">Name*:</FormLabel>
                  <TextField
                  size="small"
                  type="text"
                  name="name"
                  value={name} 
                  onChange={this.handleChange("name")}
                  />
                </Box>           
                <Box display="flex" flexDirection="column" marginBottom="10px">
                  <FormControl>
                    <FormLabel htmlFor="rank">Rank*: </FormLabel>
                    <Select 
                    name="rank"
                    size="small"
                    value={rank} 
                    onChange={this.handleChange("rank")}
                    >
                      <MenuItem value="">NONE</MenuItem>
                      {
                        ranks.map(elem => (
                          <MenuItem value={elem} key={elem}>{elem}</MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>
                </Box>
                <Box marginBottom="10px">
                  <FormControl>
                    <FormLabel>Sex:</FormLabel>
                    <RadioGroup row aria-label="sex" name="sex">
                        <FormControlLabel value="M" control={<Radio />} label="Male" 
                        onChange={this.handleChange("sex")} checked={sex === "M"}></FormControlLabel>
                        <FormControlLabel value="F" control={<Radio />} label="Female" 
                        onChange={this.handleChange("sex")} checked={sex === "F"}></FormControlLabel>
                    </RadioGroup>
                  </FormControl>
                </Box>
                <Box display="flex" flexDirection="column" marginBottom="10px">
                  <FormLabel>Start Date:</FormLabel>
                  <TextField type="text" size="small"
                  name="startDate" value={startDate} 
                  error={!this.validateField("startDate")}
                  helperText={!this.validateField("startDate") && "Please enter valid date in form of (m)m/(d)d/yy(yy)"}
                  onChange={this.handleChange("startDate")}/>
                </Box>
                <Box display="flex" flexDirection="column" marginBottom="10px">
                  <FormLabel>Office Phone:</FormLabel>
                  <TextField type="text" size="small"
                  name="phone" value={phone} 
                  error={!this.validateField("phone")}
                  helperText={!this.validateField("phone") && "Please enter valid phone number in form of number or (xxx)-xxx-xxxx or without brackets"}
                  onChange={this.handleChange("phone")}/>
                </Box>
                <Box display="flex" flexDirection="column" marginBottom="10px">
                  <FormLabel>Email:</FormLabel>
                  <TextField type="text" size="small"
                  name="email" value={email} 
                  error={!this.validateField("email")}
                  helperText={!this.validateField("email") && "Please enter valid email address"}
                  onChange={this.handleChange("email")}/>
                </Box>
                <Box display="flex" flexDirection="column" marginBottom="10px">
                  <FormControl>
                    <FormLabel>Superior</FormLabel>
                    <Select 
                    name="superior"
                    value={superior}
                    
                    onChange={this.handleChange("superior")}>
                      <MenuItem value="">NONE</MenuItem>
                      {
                        list.map(elem => (
                          <MenuItem value={elem._id} key={elem._id}>{elem.name}</MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>
                </Box>
                {
                  error && 
                  <Alert severity="error">{error.message}</Alert>
                }
              </Grid>
            </form>
          </Box>
        </Container>
      );
    }
  };

  const mapStateToProps = state => ({
    list: state.getAllSup.list,
    editError: state.editSoldier.error,
    editState: state.editSoldier.state,
    createError: state.createSoldier.error,
    createState: state.createSoldier.state,
  });
  const mapDispatchToProps = dispatch => ({
    getSup: () => dispatch(getSup()),
    createSoldier: (query,avatar,history) => dispatch(createSoldier(query,avatar,history)),
    editSoldier: (query,avatar,history) => dispatch(editSoldier(query,avatar,history)),
  });
  return connect(mapStateToProps,mapDispatchToProps)(update);
};

export default updateSoldier;