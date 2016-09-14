import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';

import State from '../src/state';

describe("microstate properties", function(){
  let ByFive, incrementer, first, second;
  beforeEach(function(){
    ByFive = State.extend({
      incrementBy: 5,
      current: 0,
      get nextValue() {
        return this.current + this.incrementBy;
      },
      transitions: {
        next(value) {
          return {
            current: this.nextValue
          };
        }
      }
    });
    incrementer = new ByFive();
    first = incrementer.next();
    second = first.next();
  });
  it("transfers getters to instances", function(){
    expect(incrementer.nextValue).to.equal(5);
  });
  it("allows getters to be used in transitions", function(){
    expect(first.current).to.equal(5);
    expect(first.nextValue).to.equal(10);
    expect(second.current).to.equal(10);
    expect(second.nextValue).to.equal(15);
  });

  describe('overriding a getter on a derived state class', function() {
    let DecrementByFive, decrementer;
    beforeEach(function() {
      DecrementByFive = ByFive.extend({
        get nextValue() {
          return this.current - this.incrementBy;
        }
      });
      decrementer = new DecrementByFive();
      first = decrementer.next();
      second = first.next();
    });

    it('overrides the getter with the new getter', function() {
      expect(decrementer.nextValue).to.equal(-5);
    });

    it('uses the value from the value, not the prototype', function() {
      expect(first.nextValue).to.equal(-10);
      expect(second.nextValue).to.equal(-15);
    });
  });

  it('throws an error if you try to override a computed property with a value', function() {
    expect(function() {
      new ByFive({ nextValue: 10 });
    }).to.throw(Error, 'Cannot redefine property: nextValue');
  });
});
