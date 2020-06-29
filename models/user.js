// includes mongoose is Object Document Mapper 
// turns the document inside the database into object, allows us to work with them as objects
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// Schema is a Blueprint of how our documents are look like
// Every document will have title, content, status and timestamp
const UserSchema = new mongoose.Schema({
    // attributes are like column headings in db
    firstName:{
        type: String, 
        required: true // This must exist
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        dropDups: true, // drop any duplicated record 
        validate:[
            {
              validator: function (value) {
                return this.emailConfirmation === value;
              },
              message: props => `${props.value} doesn't match the email confirmation`
            },
            {
              validator: async function (value) {
                const emailCount = await this.model('User').count({ email: value });
                return !emailCount;
              },
              message: props => `${props.value} exists. Please try a new email or login`
            }
          ]
    }

},{
    timestamps: true,
});

// Validation attributes
UserSchema.virtual('emailConfirmation')
.get(function () {
  return this._emailConfirmation;
})
.set(function (value) {
  this._emailConfirmation = value;
});

UserSchema.virtual('password')
.get(function () {
  return this._password;
})
.set(function (value) {
  this._password = value;
});

UserSchema.virtual('passwordConfirmation')
.get(function () {
  return this._passwordConfirmation;
})
.set(function (value) {
  if (this.password !== value)
    this.invalidate('password', 'Password and password confirmation must match');
  this._passwordConfirmation = value;
});

// Helper attribute
UserSchema.virtual('fullname')
.get(function () {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.plugin(passportLocalMongoose, {
  usernameField: 'email'
});

// export our mongoose model
module.exports = mongoose.model('User', UserSchema);