//Modal za dodavanje novog cjenika

import React from 'react'
import axios from 'axios';
import ReactDatetime from "react-datetime";
import orderBy from 'lodash/orderBy';

// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Modal,
    Row,
    Col,
    Alert,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Table
  } from "reactstrap";

import ReactLoading from 'react-loading';

var moment = require('moment');

class AddCjenikModal extends React.Component{

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
		this.state = {
            msg: null,
            startDate: null,
            startDateFormatted: null,
            endDate: null,
            isFetching: false,
            cijenemodela: []
        };
        this.modeli = [];
    }

    //ucitavanje zadnjeg perioda i modela u vlasnistvu
    componentDidMount(){
        this.setState({ isFetching: true });
        axios.get(`/api/admin_page/lastperiod/`).then(res => {
            const data = res.data;
            const splitDates = (data.period).split(",");
            var startDate = splitDates[1].slice(0, -1);
            var startDateFormatted = ReactDatetime.moment(splitDates[1].slice(0, -1));
            this.setState({ startDate: startDate, startDateFormatted: startDateFormatted });
        });
        axios.get(`/api/admin_page/ownedmodels/`).then(res => {
            const data = res.data;
            let sortedModeli = orderBy(data, ['nazivproizvodac', 'nazivmodel'], 'asc');
            this.setState({ modeli: sortedModeli });
        });
        this.setState({isFetching: false});
    }

    onChange = (e) => {
        e.preventDefault();
        this.setState({
            ...this.state,
            cijenemodela: {
                ...this.state.cijenemodela,
                [e.target.getAttribute('sifmodel')]: e.target.value
            }
         });
    }


    onSubmit = e => {
        e.preventDefault();
           
        if (!this.state.endDate){
            this.setState({msg: 'Potrebno je odabrati datum završetka važenja'});
        }
        else{
            this.setState({msg: null});

            let priceData = [];
            let endDate = moment(this.state.endDate).add(1, 'day').format("YYYY-MM-DD");
            let period = '[' + this.state.startDate + ',' + endDate + ')';

            if(this.state.cijenemodela){
                let cijenemodela = this.state.cijenemodela;
                for (var sifmodel in cijenemodela) {
                    if (cijenemodela.hasOwnProperty(sifmodel)) {
                        if(cijenemodela[sifmodel] > 0){
                            priceData.push({
                                sifmodel: sifmodel,
                                cijenapodanu: cijenemodela[sifmodel],
                                period: period
                            });
                        }
                        else{
                            this.setState({msg: 'Cijena ne može biti negativna ili jednaka nuli'});
                            return;
                        }
                    }
                }
                if (priceData){
                    this.props.addCjenik(priceData);
                }
                else{
                    this.setState({msg: 'Dogodila se pogreška'});
                    return;
                }

            }
            else{
                this.setState({msg: 'Potrebno je unijeti barem jednu cijenu'}); 
            }
        }
      }

    render() {
        return (
            <Modal
              className="modal-dialog-centered"
              size="lg"
              isOpen={this.props.isModalOpen}
              toggle={(e) => this.props.toggleModal(e)}
            >
              <div className="modal-body p-0">
                <Card className="bg-secondary shadow border-0">
                    <CardHeader className="bg-white border-0">
                    <Row className="align-items-center">
                        <Col xs="8">
                        <h3 className="mb-0">Novi cjenik</h3>
                        </Col>
                        <Col className="text-right" xs="4">
                        <button
                            aria-label="Close"
                            className="close"
                            data-dismiss="modal"
                            type="button"
                            onClick={(e) => this.props.toggleModal(e)}
                            >
                            <span aria-hidden={true}>×</span>
                            </button>
                        </Col>
                    </Row>
                    </CardHeader>
                  <CardBody>
                    { this.state.msg ? (<Alert color="danger">{this.state.msg}</Alert>) : null }
                    <Form role="form">
                    <div className="pl-lg-4">
                        <Row>
                            {this.state.startDateFormatted ? (
                                <>
                                <Col lg="6">
                                <FormGroup>
                                <label className="form-control-label">Datum početka važenja</label>
                                <InputGroup className="input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                        <i className="ni ni-calendar-grid-58" />
                                    </InputGroupText>
                                    </InputGroupAddon>
                                    <ReactDatetime
                                    autoComplete='off'
                                    inputProps={{
                                        placeholder: "Datum početka",
                                        disabled: true
                                    }}
                                    timeFormat={false}
                                    defaultValue={this.state.startDateFormatted}
                                    />
                                </InputGroup>
                                <label className="h6"> Datum završetka važenja starog cjenika</label>
                                </FormGroup>
                                </Col>
                                <Col lg="6">
                                <FormGroup>
                                <label className="form-control-label">Datum završetka važenja</label>
                                <InputGroup className="input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                        <i className="ni ni-calendar-grid-58" />
                                    </InputGroupText>
                                    </InputGroupAddon>
                                    <ReactDatetime
                                    autoComplete='off'
                                    inputProps={{
                                        placeholder: "Datum završetka važenja"
                                    }}
                                    isValidDate={ (current) => {
                                        return current.isAfter(this.state.startDateFormatted-1);
                                    }
                                    }                    
                                    timeFormat={false}
                                    onChange={e => this.setState({ endDate: e })}
                                    />
                                </InputGroup>
                                <label className="h6"> Uključujući odabrani datum</label>
                                </FormGroup>
                                </Col>
                                </>
                            ) : (<><ReactLoading type="bubbles" color="#8E8E93" height={'10%'} width={'10%'} /></>)}                  
                        </Row>
                        </div>
                        <hr className="my-4" />

                        {/* Modeli */}
                        <h6 className="heading-small text-muted mb-4">
                        Modeli vozila u ponudi
                        </h6>

                        <div className="pl-lg-4">
                        <Table className="align-items-center table-flush" responsive>
                        <thead className="thead-light">
                        <tr>
                            <th>Proizvođač</th>
                            <th>Model</th>
                            <th>Cijena po danu (kn)</th>
                        </tr>
                        </thead>
                        <tbody>
                            {this.state.isFetching ? (<><ReactLoading type="bubbles" color="#8E8E93" height={'10%'} width={'10%'} /></>) : null}
                            {this.state.modeli && this.state.modeli.map(model => (                         
                            <tr key={model.sifmodel}>
                                <td>{model.nazivproizvodac}</td>
                                <td>{model.nazivmodel}</td>
                                <td><input type="number" name="price" sifmodel={model.sifmodel} onChange={(e) => {this.onChange(e);}}/></td>
                            </tr>                                            
                            ))}
                        </tbody>
                        </Table>   
                        </div>

                      <div className="text-center">
                        <Button
                          className="my-4"
                          color="primary"
                          type="button"
                          onClick={this.onSubmit}
                        >
                          Spremi cjenik
                        </Button>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </div>
            </Modal>
        )
    }
}

export default AddCjenikModal;
