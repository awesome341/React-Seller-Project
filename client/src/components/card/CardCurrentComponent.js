'use strict';

import React from 'react';

require('styles/card/CardCurrent.css');
import { Table, Image, Button, Grid, Row, Col, Glyphicon, Modal, FormGroup, ControlLabel, FormControl} from 'react-bootstrap';

class CardCurrentComponent extends React.Component {
  constructor() {
    super();
    this.orderDetailURL = 'http://localhost:3000/api/orderDetails';
    this.currentItems = 'http://localhost:3000/api/orderDetails?filter[where][orderId][eq]=null&filter[include]=product';
    this.orderFilter = '?filter[include]=product';
    this.access_token = 'T4SH5NkUULeFPSLEXhycyMvt0HMNINxTdOvYjGzGZkxvMmKZeJbne4TdJfcDLAr7';
    this.state = { orderDetails: [], totalPrice: 0, detailEdit: {product: {}, quantity: 0}};
  }

  removeItem = (id) => {
    fetch(this.orderDetailURL + "/" + id + '?access_token=' + this.access_token, {
      method: 'DELETE',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', }
    }).then((response) => response.json())
    .then((responseJson) => {this.loadItems();})
    .catch((error) => { console.error(error);});
  };

  updateItem = () => {
    let item =  {
                  quantity: this.state.quantity,
                  totalPrice: this.state.detailEdit.product.price * this.state.quantity
                };
    fetch(this.orderDetailURL + "/" + this.state.detailEdit.id + '?access_token=' + this.access_token, {
      method: 'PUT',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', },
      body: JSON.stringify(item)
    }).then((response) => response.json())
    .then((responseJson) => {this.loadItems();})
    .catch((error) => { console.error(error);});
    this.state = {detailEdit: {product: {}, quantity: 0}};
  };

  submitCard = () => {
    
  }

  clearCard = () => {
    for (var i = 0; i < this.state.orderDetails.length; i++) {
      fetch(this.orderDetailURL + "/" + this.state.orderDetails[i].id + '?access_token=' + this.access_token, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', }
      }).then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.loadItems();
      })
      .catch((error) => { console.error(error);});
    }
    
  }

  loadItems() {
    fetch(this.currentItems + '&access_token=' + this.access_token) 
      .then((response) => response.json())
      .then((responseJson) => { 
        var auxTotalPrice = 0;
        for (var i = 0; i < responseJson.length; i++) {
          auxTotalPrice += responseJson[i].totalPrice;
        }
        this.setState({orderDetails: responseJson, totalPrice: auxTotalPrice});
      })
      .catch((error) => { console.error(error); });
  }

  componentDidMount() {
    this.loadItems();
  }

  handleChangeQuantity = (event) => {
    this.setState({ quantity: event.target.value});
  }

  handleEditItem = (item) => {
    this.setState({ detailEdit: item });
    this.setState({quantity: item.quantity});
    this.setState({ show: true});
  }

  render() {
    let close = () => {
      this.setState({ show: false});
      this.updateItem();
    };

    return (
      <div className="cardcurrent-component container">
        <div className="container"> <a href={'card-list/'}>list</a> </div>
        <Grid>
          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th>Code</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
              <tfoot>
              <tr>
                <td colSpan='3'>Order Total</td>
                <td colSpan='3'>${this.state.totalPrice}</td>
              </tr>
            </tfoot>
            <tbody>
              {this.state.orderDetails.map(function (detail) {
                return  <tr className={'detailRow'}>
                          <td><a href={'product-show/' + detail.product.id}>{detail.product.id}</a></td>
                          <td>{detail.quantity}</td>
                          <td>${detail.price}</td>
                          <td>${detail.totalPrice}</td>
                          <td>
                            <Image src={detail.product.img} thumbnail width={100} />
                          </td>
                          <td>
                            <Button onClick = {()=>this.removeItem(detail.id)}> <Glyphicon glyph="remove"/> </Button>
                            <Button onClick = {()=>this.handleEditItem(detail)}> <Glyphicon glyph="edit"/> </Button>
                          </td>
                        </tr>
                }, this)}
            </tbody>
          </Table>
          <Button onClick = {()=>this.clearCard()}> Clear </Button>
          <Button onClick = {()=>this.submitCard()}> Submit Card </Button>
        </Grid>
        <Modal show={this.state.show} onHide={close} container={this} aria-labelledby="contained-modal-title">
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">Edit Shopping Card Item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Grid>
              <Row className="show-grid">
                <Col xs={9} sm={9} md={6} height={60}>
                  <h2>{this.state.detailEdit.product.name}</h2><br />
                  <Image width={300} src={this.state.detailEdit.product.img} thumbnail /><br />
                  <ControlLabel> Price: </ControlLabel>${this.state.detailEdit.product.price} <br />
                  <ControlLabel> Stock: </ControlLabel>{this.state.detailEdit.product.stock} <br />
                  ${this.state.detailEdit.product.description}
                </Col>
              </Row>
            </Grid>
            <FormGroup controlId = "formCode">
                <ControlLabel>Quantity</ControlLabel>
                <FormControl type = "text" placeholder = "Enter quantity"
                value = { this.state.quantity } onChange = { this.handleChangeQuantity } />
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={close}><Glyphicon glyph="ok"/></Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

CardCurrentComponent.displayName = 'CardCardCurrentComponent';

// Uncomment properties you need
// CardCurrentComponent.propTypes = {};
// CardCurrentComponent.defaultProps = {};

export default CardCurrentComponent;
