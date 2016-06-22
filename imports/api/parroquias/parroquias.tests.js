import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Images } from '../images/collection';
import { Parroquias } from './collection';
import _ from 'lodash'
import { assert } from 'chai';

if(Meteor.isServer){
  describe('Parroquias API', function () {
    let p1 = {
      name: 'San Jose',
      img: {
        url: 'http://www.browneyedbaker.com/wp-content/uploads/2013/05/vanilla-bean-ice-cream-23-600.jpg'
      }
    };
    let p2 = {
      name: 'San Felipe',
      img: {
        url: 'http://www.browneyedbaker.com/wp-content/uploads/2013/05/vanilla-bean-ice-cream-23-600.jpg'
      }
    };
    beforeEach(function () {
      resetDatabase();
      
    });
    describe('update()', function(){
      let p1c = _.clone(p1);
      let p2c = _.clone(p2);
      beforeEach(function(){
        p1c = Parroquias._transform(_.cloneDeep(p1));
        p2c = Parroquias._transform(_.cloneDeep(p2));
      });
      it('inserts a new parroquia', function(){
        assert.notTypeOf(p1c._id, 'string')
        p1c.update()
        assert.typeOf(p1c._id, 'string')
      });
      it('updates an old parroquia', function(){
        assert.notTypeOf(p1c._id, 'string')
        p1c.update();
        assert.typeOf(p1c._id, 'string')
        p1c.diocesis_name = 'diocesis de Monterrey';
        p1c.update();
        assert.typeOf(p1c._id, 'string')
        //get doc from db
        let p1c_db = Parroquias.findOne({_id: p1c._id})
        assert.isString(p1c_db.diocesis_name);
        assert.equal(p1c_db.diocesis_name, p1c.diocesis_name); 
      });
    });
    describe('addImage()', function(){
    });
  });
}
