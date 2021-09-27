
# TypeScript Multilingual Backend

This project is a starter kit or boilerplate for every backend project. The architecture is based on best practices and has been used in some real projects in production mode.  
You can read the codes and get ideas, as well as fork and use it for your projects.  
If you found it useful don't forget to give a star and share it for your friends.

## Install

- Clone the project
- Run "npm i" or "yarn"
- Make a copy .env.sample and name it .env
- Put a MongoDB URI into .env file
- Create key pair files by this command: "ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key" in the root directory. (Don't set passphrase)
- Run "npm start" or "yarn start"

## Usage
### Authentication

    {POST}
    /auth/register
    /auth/login
    /auth/admin_login
    /auth/logout

### Simple usage

    {GET}
    /users			// Show all users
    /users/1		// Show user with id 1
    
    {POST}
    /users			// Create a user
    
    {PUT}
    /users/1		// Update user with id 1
    
    {DELETE}
    /users/1		// Delete user with id 1
### Paginating

    {GET}
    /users?page=2&pageSize=10	// Show page 2 of users, 10 users in each page
### Sorting

    {GET}
    /users?sort=family		// Sort users by family ascending
    /users?sort=-_id		// Sort users by _id descending
    /users?sort=-name%20email	// Sort users by name descending and email ascending
### Get specific fields

    {GET}
    /users?fields=name%20family%20email		// Show name, family and email of users
    /users/1?fields=-email%20-name			// Show all user fields except name and email
### Searching and filtering

    {GET}
    /users?conditions={"name":"Jack"}			// Show all users with name "Jack"
    /users?conditions={"name":"John","family":"Doe"}	// Show all users with name "John" AND family "Doe"
    /users?conditions={"email":{"$regex":".*gmail.com"}}	// Show all users with Google email
You can use all [MongoDB](https://docs.mongodb.com/manual/) queries here, just remember to JSON.stringify them.

### Upload files

    {POST}
    /upload
Request body should contain "file" field, and an optional "type" field. The file should be in [Form Data](https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects#sending_files_using_a_formdata_object) format. If the type is available, it will be placed at the start of file name. Upload works over [AWS S3](https://aws.amazon.com/s3/) system and you sould place access key, secret key, and endpoint in .env file.

### Extending APIs
You can create your desired APIs and add them to this system easily. To do so, you need to follow these steps:

- Create interface
- Create model
- Create validator
- Add route

For example let's create a simple blog post API.

Creating interface

    // {interfaces/post.interface.ts}
    import {IUser} from '.';
    
    export interface IPost {
	    _id: string;
	    title: string;
	    content: string;
	    author: string | IUser;
    }
Adding new interface to the index of interfaces

    // {interface/index.ts}
    ...
    import {IPost} from './post.interface';
    ...
    export {
	    ...,
	    IPost
    }

Creating model

    // {models/post.model.ts}
    import mongoose, {Schema} from 'mongoose';
    import {IPost} from '../interfaces';
    
    const postSchema = new Schema({
	    title: {
		    type: String,
		    required: true
	    },
	    content: String,
	    author: {
		    type: Schema.Types.ObjectId,
		    ref: 'User'
	    }
    }, {
	    timestamps: true
    });
    
    const Post = mongoose.model<IPost>('Post', postSchema);
    
    export default Post;
Adding model to the index of models

    // {models/index.ts}
    ...
    import Post from './post.model';
    ...
    export {
	    ...,
	    Post
    }

Creating validator

    // {validators/post.validator.ts}
    import {Joi} from 'celebrate';
    
    const PostFields = {
	    title: Joi.string().required(),
	    content: Joi.string().optional().allow(''),
	    author: Joi.string().required()
    }
    
    export const UserCreate = {  
	    body: Joi.object({...UserFields})  
    };
    
    // Update fields can be empty  
    export const UserUpdate = {  
	    body: Joi.object(UserFields).fork(Object.keys(UserFields), (schema => schema.optional()))  
    };
Adding validator to the index of validators

    // {validators/index.ts}
    ...
    import {PostCreate, PostUpdate} from './post.validator';
    ...
    export {
	    ...,
	    PostCreate,
	    PostUpdate
    }
Adding route

    // {api/routes/index.ts}
    ...
    general<Interface.IUser>(app, '/users', Model.User, Validator.UserCreate, Validator.UserUpdate);

    // insert new route here
    general<Interface.IPost>(app, '/posts', Model.Post, Validator.PostCreate, Validator.PostUpdate);
    ...
Now you can work with new posts API, and all the features above are available for your new API as well.
