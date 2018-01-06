module.exports = (app) => {
  describe('Users API', () => {
    describe('Home', () => {
      it('will get signup text', (done) => {
        app.get('/users').expect(200, {
          'message':'signup'
        }, done);
      });
    });
    // Add User
    describe('Add User', () => {
      describe('Empty Query', () => {
        it('will get error because query was empty.', (done)=>{
          app.post('/users/add').send({
            'email':'',
            'name':'',
            'password':''
          }).expect(400, done);
        });
      });
      describe('Email', () => {
        describe('Empty Email', () => {
          it('will get error because email was empty.', (done)=>{
            app.post('/users/add').send({
              'email':'',
              'name':'example name',
              'password':'Password1'
            }).expect(400, done);
          });
        });
        describe('Invalid Email, Wrong Email Address', () => {
          it('will get error because email was invalid.', (done)=>{
            app.post('/users/add').send({
              'email':'example@example',
              'name':'example name',
              'password':'Password1'
            }).expect(400, done);
          });
        });
        describe('Well Done', () => {
          it('User Successfully Created.', (done)=>{
            app.post('/users/add').send({
              'email':'example@example.com',
              'name':'example name',
              'password':'Password1'
            }).expect(201, done);
          });
        });
        describe('Duplicated Email', () => {
          it('will get error because email was duplicated.', (done)=>{
            app.post('/users/add').send({
              'email':'example@example.com',
              'name':'example name',
              'password':'Password1'
            }).expect(400, done);
          });
        });
      });
      describe('Name', () => {
        describe('Empty Name', () => {
          it('will get error because name was empty.', (done)=>{
            app.post('/users/add').send({
              'email':'example@example.com',
              'name':'',
              'password':'Password1'
            }).expect(400, done);
          });
        });
        describe('Invalid Name, Min 3 Character', () => {
          it('will get error because name was invalid, Should be more then 3 character.', (done)=>{
            app.post('/users/add').send({
              'email':'example@example.com',
              'name':'Na',
              'password':'Password1'
            }).expect(400, done);
          });
        });
        describe('Invalid Name, Max 3 Character', () => {
          it('will get error because name was invalid, Should be less then 31 character.', (done)=>{
            app.post('/users/add').send({
              'email':'example@example.com',
              'name':'Naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
              'password':'Password1'
            }).expect(400, done);
          });
        });
      });
      describe('Password', () => {
        describe('Empty Password', () => {
          it('will get error because password was empty.', (done)=>{
            app.post('/users/add').send({
              'email':'example@example.com',
              'name':'example name',
              'password':''
            }).expect(400, done);
          });
        });
        describe('Invalid Password', () => {
          it('will get error because password has wrong format. Uppercase, Lowercase, Numeric.', (done)=>{
            app.post('/users/add').send({
              'email':'example@example.com',
              'name':'example name',
              'password':'asdfa123'
            }).expect(400, done);
          });
        });
      });
    });
    // Lists Users
  });
}