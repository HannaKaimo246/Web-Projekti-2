import React from 'react';
import renderer from 'react-test-renderer';
import {Card} from 'react-bootstrap';
const handleReset = require('../src/components/User/Register');



test('is input in right form', () => {
  const component = renderer.create(
      <Card page="http://www.facebook.com">Facebook</Card>,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});