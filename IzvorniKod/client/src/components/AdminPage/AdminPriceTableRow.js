import React, { Component } from 'react';
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown
} from "reactstrap";

export class AdminPriceTableRow extends Component {
  constructor(props){
    super(props);
  }

  changePrice = (e) => {
    e.preventDefault();
    const priceData = {
      sifcjenik: this.props.price.sifcjenik,
      nazivproizvodac: this.props.price.nazivproizvodac,
      nazivmodel: this.props.price.nazivmodel,
      cijenapodanu: this.props.price.cijenapodanu
    };
    this.props.openChangePrice(priceData);
  }


    render() {
        return (
            <>
            <tr>
              <th scope="row">
                {this.props.price.sifmodel}
              </th>
              <td>{this.props.price.nazivproizvodac}</td>
              <td>{this.props.price.nazivmodel}</td>
              <td>{this.props.price.cijenapodanu}</td>
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
                        onClick={this.changePrice}
                      >
                        Promijeni
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </td>
            </tr>
            </>
        )
    }
}

export default AdminPriceTableRow