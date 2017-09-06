'use strict';

import React from 'react';

require('styles/product/ProductShow.css');
import { browserHistory } from 'react-router';
import { Media, Grid, ListGroup, ListGroupItem, Button, ButtonToolbar, Glyphicon, Modal, Row, FormControl, Col, ControlLabel, FormGroup, Image} from 'react-bootstrap';

class ProductShowComponent extends React.Component {
  constructor(props) {
    super(props);
    this.productURL = 'http://localhost:3000/api/products/';
    this.access_token = 'T4SH5NkUULeFPSLEXhycyMvt0HMNINxTdOvYjGzGZkxvMmKZeJbne4TdJfcDLAr7';
    this.props = props;
    this.state = { product : {}, show: false, quantity: 0};
  }

  handleClick = () => {
    browserHistory.push('/product-edit/' + this.state.product.id);
  };

  handleStock = () => {
    this.setState({ show: true});
  };

  handleUpdateStock = () => {

  };

  handleChangeQuantity = (event) => {
    this.setState({ quantity: event.target.value });
  }

  handleRemove = () => {
    fetch(this.productURL + "/" + this.state.product.id + '?access_token=' + this.access_token, {
      method: 'DELETE',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', }
    }).then((response) => response.json())
    .then((responseJson) => { browserHistory.push('/product-list');})
    .catch((error) => { console.error(error);});
  };

  componentDidMount() {
    fetch(this.productURL + this.props.params.id + '?access_token=' + this.access_token) 
      .then((response) => response.json())
      .then((responseJson) => { this.setState({product: responseJson});})
      .catch((error) => { console.error(error); });
  }

  render() {
    let close = () => {
      this.setState({ show: false});
      this.handleUpdateStock();
    };

    return (
      <div className="productshow-component">
        <Grid>
          <Media>
            <Media.Left>
              <img style={{clip: 'rect(0px,350px,200px,0px)', position: 'relative'}} width={350} src={this.state.product.img} alt="Image"/>
            </Media.Left>
            <Media.Body>
              <ButtonToolbar>
                <Button onClick = { this.handleClick }><Glyphicon glyph="edit"/></Button>
                <Button onClick = { this.handleRemove }><Glyphicon glyph="remove"/></Button>
                <Button onClick = { this.handleStock }><Glyphicon glyph="add"/>Add Stock</Button>
              </ButtonToolbar>
              <Media.Heading>Name: {this.state.product.name}</Media.Heading>
              <ListGroup>
                <ListGroupItem><h4 style={{display: 'inline'}}>Code: </h4>{this.state.product.code}</ListGroupItem>
                <ListGroupItem><h4 style={{display: 'inline'}}>Stock: </h4>{this.state.product.stock}</ListGroupItem>
                <ListGroupItem><h4 style={{display: 'inline'}}>Price: </h4>{this.state.product.price}</ListGroupItem>
              </ListGroup>
              <p>{this.state.product.description}</p>
            </Media.Body>
          </Media>
        </Grid>

        <Modal show={this.state.show} onHide={close} container={this} aria-labelledby="contained-modal-title">
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">Adding to Inventary</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Grid>
              <Row className="show-grid">
                <Col xs={9} sm={9} md={6} height={60}>
                  <h2>{this.state.product.name}</h2><br />
                  <Image width={300} src={this.state.product.img} thumbnail /><br />
                  <ControlLabel> Price: </ControlLabel>${this.state.product.price} <br />
                  <ControlLabel> Stock: </ControlLabel>{this.state.product.stock} <br />
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

ProductShowComponent.displayName = 'ProductProductShowComponent';

// Uncomment properties you need
// ProductShowComponent.propTypes = {};
// ProductShowComponent.defaultProps = {};

export default ProductShowComponent;
