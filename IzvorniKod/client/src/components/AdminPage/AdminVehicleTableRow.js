import React, { Component } from 'react';
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown
} from "reactstrap";


export class AdminVehicleTableRow extends Component {
  constructor(props){
    super(props);
  }

  openDetails = (e) => {
    e.preventDefault();
    this.props.openDetails(this.props.vehicle.sifvozilo);
  }


    render() {
        return (
            <>
            <tr>
              <th scope="row">
                {this.props.vehicle.sifvozilo}
              </th>
              <td>{this.props.vehicle.nazivproizvodac}</td>
              <td>{this.props.vehicle.nazivmodel}</td>
              <td>{this.props.vehicle.nazivvrstamodel}</td>
              <td>{this.props.vehicle.registratskaoznaka}</td>
              <td className="text-right">
                  <UncontrolledDropdown>
                    <DropdownToggle
                      className="btn-icon-only text-light"
                      color=""
                      role="button"
                      size="sm"
                    >
                      <i className="fas fa-ellipsis-v" />
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-arrow" right>
                      <DropdownItem
                        href=""
                        onClick={this.openDetails}
                      >
                        Detalji
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </td>
            </tr>
            </>
        )
    }
}

export default AdminVehicleTableRow