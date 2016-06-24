import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Images } from '../images/collection';
import { FS } from 'meteor/cfs:base-package';
import { Parroquias } from './collection';
import { WaitUntil } from '../utils/wait-until';
import _ from 'lodash'
import { expect, assert } from 'chai';

if(Meteor.isServer){
  let waitUntilFileUploads = (fileObj, done) => {
    let waitUntil = new WaitUntil();
    waitUntil.interval(200)
      .times(400)
      .condition(function(){
        return fileObj.isUploaded();
      })
      .done(function(){
        done();
      });
  };
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
    describe('parroquia.update()', function(){
      let p1c = _.clone(p1);
      //let p2c = _.clone(p2);
      beforeEach(function(){
        p1c = Parroquias._transform(_.cloneDeep(p1));
        //p2c = Parroquias._transform(_.cloneDeep(p2));
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
    describe('parroquia.addImage(imageFileObject)', function(){
      let p1c = _.clone(p1);
      beforeEach(function(){
        resetDatabase();
        p1c = Parroquias._transform(_.cloneDeep(p1));
      });
      it('Adds one image already stored (waits for image to download)', function(done){
        let i1 = Images.insert( 
          'http://www.browneyedbaker.com/wp-content/uploads/2013/05/vanilla-bean-ice-cream-23-600.jpg'
        );
        //wait until the file uploads
        waitUntilFileUploads(i1, done); 
        //check image is stored in db
        assert.property(i1, '_id');
        assert.isString(i1._id);
        p1c.update();
        p1c.addImage(i1);
        //check the array of images
        assert.isArray(p1c.images);
        assert.lengthOf(p1c.images, 1, 'has one image');
        assert.deepProperty(p1c.images[0], 'metadata.owner', 'has owner metadata');
        assert.property(p1c.images[0], '_id');
        assert.equal(p1c.images[0]._id, i1._id, 'check image has the same id');
        waitUntilFileUploads(i1, done); 
      });
      it('Adds one image to parroquias which is not stored (waits for image to download)', function(done){
        let i1 = Images.insert(
          'http://www.browneyedbaker.com/wp-content/uploads/2013/05/vanilla-bean-ice-cream-23-600.jpg'
        );
        //wait until the file uploads
        waitUntilFileUploads(i1, done); 
        //check image is not stored in db
        assert.property(i1, '_id');
        assert.isString(i1._id);
        let fn = () => {
          p1c.addImage(i1);
        };
        expect(fn).to.throw(
          Meteor.Error(`Parroquia: image ${i1._id} can't\
 be owned by this parroquia since it does not already have an _id` )
        );
        //check the array of images
        assert.isArray(p1c.images);
        assert.lengthOf(p1c.images, 0, 'has no image');
        /*
        assert.deepProperty(p1c.images[0], 'metadata.owner', 'has owner metadata');
        assert.property(p1c.images[0], '_id');
        assert.equal(p1c.images[0]._id, i1._id, 'check image has the same id');
        */
      });
    });
  });
}
