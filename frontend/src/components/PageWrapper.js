import React, { Component } from 'react';
import {Container, Card} from 'react-bootstrap';

/**
 * Container for handler email sending state
 */
class PageWrapper extends Component {
  render() {
    const {children} = this.props;

    return (
      <div>
        <Container>
          <h1 className="text-light">HTTP Mail Send</h1>
          <Card>
            <Container className="mt-3 mb-3">
              {children}
            </Container>
          </Card>
        </Container>
      </div>
    );
  }
}

export default PageWrapper;