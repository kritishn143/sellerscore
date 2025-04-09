const mongoose = require('mongoose');
const bcrypt = require('bcrypt');   // ✅ correct

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }, // Default role is 'user'

});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', UserSchema);

// Now, to create an admin user, you can use the User model
// For example, to create an admin user with username 'admin' and password 'adminpassword':
// const adminUser = new User({
//   username: 'admin',
//   email: 'admin@mail.com',
//   password: 'admin',
//   role: 'admin'  
//   // Assign 'admin' as the role
// });

// Save the admin user to the database
// adminUser.save()
//   .then(() => {
//     console.log('Admin user created successfully');
//   })
//   .catch(err => {
//     console.error('Error creating admin user:', err);
//   });
 

module.exports = User;
