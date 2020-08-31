import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ShallowRenderer from 'react-test-renderer/shallow';
import React from 'react';
import App from './App';
import Dashboard, { instantiateObservables, discardIfStale } from './Dashboard';
import { expect, assert } from 'chai';
Enzyme.configure({ adapter: new Adapter() });

describe('Checking existance of Dashboard in App', () => {
  it('Check Main App', () => {
    const component = shallow(<App />);
    expect(component.find(Dashboard)).to.have.lengthOf(1);
  });
});

describe('Is Dashboard Rendering Properly ?', () => {
  let renderer;
  it('Dashboard should render properly', () => {
    renderer = new ShallowRenderer();
    renderer.render(<Dashboard />);
    const result = renderer.getRenderOutput();
    // console.log(result.props.children[0].type);
    expect(result.type).equal('div');
    expect([...result.props.children].length).equal(3);
    expect(result.props.children[0].type).to.equal('div');
    expect(result.props.children[1].type).to.equal('div');
    expect(result.props.children[2].type).to.equal('div');
  });
});

describe('Are Observables instantiating properly ?', () => {
  it('Observables Instantiated Properly', () => {
    const result = instantiateObservables(1200, 2000, 4000);
    assert(result !== null, 'Result is not null');
    assert(result !== undefined, 'Result is defined');
    assert(typeof result === 'object', 'Result is an object');
    assert(Object.keys(result).length === 3, 'Result has 3 keys');
    assert(typeof result.temprature === 'object', 'Temprature is an object');
    assert(typeof result.humidity === 'object', 'humidity is an object');
    assert(typeof result.airPressure === 'object', 'airPressure is an object');
    assert(
      typeof result.temprature.__proto__.pipe === 'function',
      'Temprature is an Observable Object'
    );
    assert(
      typeof result.humidity.__proto__.pipe === 'function',
      'humidity is an Observable Object'
    );
    assert(
      typeof result.airPressure.__proto__.pipe === 'function',
      'airPressure is an Observable object'
    );
  });
});

describe('Checking DiscardIfStale Method', () => {
  it('checking DiscardIfStale method', () => {
    const result = instantiateObservables(1200, 2000, 4000);
    const discardIfStaleTemp = discardIfStale(result.temprature);
    const discardIfStaleHum = discardIfStale(result.humidity);
    const discardIfStaleAir = discardIfStale(result.airPressure);
    assert(
      typeof discardIfStaleTemp.__proto__.pipe === 'function',
      'discard If Stale Method is returing a new Observable For temprature observable'
    );
    assert(
      typeof discardIfStaleHum.__proto__.pipe === 'function',
      'discard If Stale Method is returing a new Observable For Humidity observable'
    );
    assert(
      typeof discardIfStaleAir.__proto__.pipe === 'function',
      'discard If Stale Method is returing a new Observable For AirPressure observable'
    );
  });
});
