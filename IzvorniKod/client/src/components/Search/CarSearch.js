//Komponenta pretrage vozila

import React from "react";

import ReactDatetime from "react-datetime";
import Select from 'react-select';

// reactstrap komponente
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col
} from "reactstrap";

//lokalizacija datuma
var moment = require('moment');
require('moment/locale/hr');

//onemoguci prosle datume
var yesterday = ReactDatetime.moment().subtract( 1, 'day' );
var valid = function( current ){
    return current.isAfter( yesterday );
};

//zaokruzi vrijeme na cetvrtinu
var coeff = 1000 * 60 * 15;
var date = new Date();
var rounded = new Date(Math.round(date.getTime() / coeff) * coeff);


//stil selection drop-down menija
const reactSelectStyles = {
    control: (base, state) => ({
        ...base,
        background: "#ffffff",
        borderRadius: "0.375rem",
        border: "0",
        boxShadow: "0 1px 3px rgba(50, 50, 93, 0.15), 0 1px 0 rgba(0, 0, 0, 0.02)",
        height: "calc(2.75rem + 2px)",
        marginBottom: "1.5rem",
        cursor: "pointer",
        fontSize: "0.875rem",
        "&:hover": {
            boxShadow: "0 1.5px 3.5px rgba(50, 50, 93, 0.2), 0 1.5px 0 rgba(0, 0, 0, 0.05)"
        }
      }),
    placeholder: (defaultStyles) => {
        return {
            ...defaultStyles,
            color: '#ADB5BD',
        }
    }
  }


class CarSearch extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            startDate: null,
            endDate: null,
            selectedPickup: null,
            selectedDropoff: null,
            razlika: null,
        };
        this.options = [];
    }

    //ucitavanje popisa lokacija
    componentDidMount(){
        fetch(`/api/start_page/locations`)
        .then(res => res.json())
        .then(data => {
            this.setState({ options: data });
        });
    }

    //funkcije za odabir lokacija
    handlePickupSelect = selectedPickup => {
        this.setState({ selectedPickup });
    };

    handleDropoffSelect = selectedDropoff => {
        this.setState({ selectedDropoff });
    };

    //slanje odabranih opcija parent komponenti
    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.startDate && this.state.endDate){
            var razlika = (this.state.endDate).diff((this.state.startDate), "days")+1;
            this.setState({ razlika: razlika });
        }
        this.props.handleClick(this.state);
    }

    render() {
        return (
        <>
            <Col lg="10" md="8">
            <Card className="bg-secondary shadow border-0">
                <CardBody className="px-lg-5 py-lg-5">
                <Form role="form">
                    <Row>
                        {/* Selector za vrijeme preuzimanja */}
                        <Col xs={6}>
                            <FormGroup>
                            <InputGroup className="input-group-alternative">
                                <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    <i className="ni ni-calendar-grid-58" />
                                </InputGroupText>
                                </InputGroupAddon>
                                <ReactDatetime
                                autoComplete='off'
                                inputProps={{
                                    placeholder: "Vrijeme preuzimanja"
                                }}
                                isValidDate={ valid }
                                timeFormat={true}
                                defaultValue={rounded}
                                timeConstraints={{hours: { min: 8, max: 18, step: 1 }, minutes: {step: 15}}}
                                renderDay={(props, currentDate, selectedDate) => {
                                    {/* Sljedeci kod je bitan za oznacavanje odabranih datuma */}
                                    let classes = props.className;
                                    if (
                                    this.state.startDate &&
                                    this.state.endDate &&
                                    this.state.startDate._d + "" === currentDate._d + ""
                                    ) {
                                    classes += " start-date";
                                    } else if (
                                    this.state.startDate &&
                                    this.state.endDate &&
                                    new Date(this.state.startDate._d + "") <
                                        new Date(currentDate._d + "") &&
                                    new Date(this.state.endDate._d + "") >
                                        new Date(currentDate._d + "")
                                    ) {
                                    classes += " middle-date";
                                    } else if (
                                    this.state.endDate &&
                                    this.state.endDate._d + "" === currentDate._d + ""
                                    ) {
                                    classes += " end-date";
                                    }
                                    return (
                                    <td {...props} className={classes}>
                                        {currentDate.date()}
                                    </td>
                                    );
                                }}
                                onChange={e => this.setState({ startDate: e })}
                                />
                            </InputGroup>
                            </FormGroup>
                        </Col>

                        {/* Selector za vrijeme vracanja */}
                        <Col xs={6}>
                            <FormGroup>
                            <InputGroup className="input-group-alternative">
                                <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    <i className="ni ni-calendar-grid-58" />
                                </InputGroupText>
                                </InputGroupAddon>
                                <ReactDatetime
                                autoComplete='off'
                                inputProps={{
                                    placeholder: "Vrijeme vraćanja"
                                }}
                                isValidDate={ (current) => {
                                    return current.isAfter(this.state.startDate-1);
                                }
                                }
                                timeFormat={true}
                                timeConstraints={{hours: { min: 8, max: 18, step: 1 }, minutes: {step: 15}}}
                                renderDay={(props, currentDate, selectedDate) => {
                                    let classes = props.className;
                                    if (
                                    this.state.startDate &&
                                    this.state.endDate &&
                                    this.state.startDate._d + "" === currentDate._d + ""
                                    ) {
                                    classes += " start-date";
                                    } else if (
                                    this.state.startDate &&
                                    this.state.endDate &&
                                    new Date(this.state.startDate._d + "") <
                                        new Date(currentDate._d + "") &&
                                    new Date(this.state.endDate._d + "") >
                                        new Date(currentDate._d + "")
                                    ) {
                                    classes += " middle-date";
                                    } else if (
                                    this.state.endDate &&
                                    this.state.endDate._d + "" === currentDate._d + ""
                                    ) {
                                    classes += " end-date";
                                    }
                                    return (
                                    <td {...props} className={classes}>
                                        {currentDate.date()}
                                    </td>
                                    );
                                }}
                                onChange={e => this.setState({ endDate: e })}
                                />
                            </InputGroup>
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        {/* Odabir poslovnica */}
                        <Col xs={6}>
                            <Select
                                styles={reactSelectStyles}
                                placeholder="Poslovnica preuzimanja"
                                options={this.state.options}
                                value={this.state.selectedPickup}
                                onChange={this.handlePickupSelect}
                            />
                        </Col>
                        <Col xs={6}>
                            <Select
                                styles={reactSelectStyles}
                                placeholder="Poslovnica vraćanja"
                                options={this.state.options}
                                value={this.state.selectedDropoff}
                                onChange={this.handleDropoffSelect}
                            />
                        </Col>
                    </Row>
                    <div className="text-center">
                    <Button className="mt-4" color="primary" type="button" onClick={this.handleSubmit}>
                        Traži dostupna vozila
                    </Button>
                    </div>
                </Form>
                </CardBody>
            </Card>
            </Col>
        </>
        );
    }
}

export default CarSearch;
