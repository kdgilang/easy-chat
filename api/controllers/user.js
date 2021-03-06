'use strict'
const vld = require('../validations/user')
const stz = require('../sanitizer/user')
const users = require('../models/user')
const hp = require('../helper')
const fs = require('fs')
const DIR = require('../config').DIR

exports.add = (req, res) => {
	var form = req.body;
	req.checkBody(vld.addUser);
	req.getValidationResult()
	.then((result) => {
		if(result.isEmpty()) {
			let user = new users(form);
			if(user.meta.img_url === undefined)
				user.meta.img_url = hp.getDirUri(req, '/public/images/unknow.png');
			let hash = user.getPassword(form.password);
			let status = user.getCompare(form.repassword, hash);
			if(status) {
				var sts = {};
				new Promise((resolve, reject) => {
					users.findOne({username: form.username}, function (err, username) {
						if(username===null)
							sts.username = true;
						else 
							sts.username = false;
						if(err) {
							reject();
						} else {
							users.findOne({email: form.email}, function (err, email) {
								if(err)
									reject();
								if(email===null)
									sts.email = true;
								else
									sts.email = false;
								resolve(sts);
							});
						}
					});
				}).then((val) => {
					if(val.username && val.email) {
						user.password = hash;
						user.activation = {
							key: user.getActivationKey(form)
						}
						user.save((err, user) => {
							if(err)
								throw err;
							else 
								res.status(201).json({msg: 'Successfully Created.', status:true});
						});
					} else {
						if(!val.username)
							res.status(400).json({msg: 'User name is taken.', status: false, param:'username'});
						else
							if(!val.email)
								res.status(400).json({msg: 'Email has ben registered.', status: false, param:'email'});
					}
				});
			} else {
				res.status(400).json({msg: 'Repassword does not match.', status: false, param:'repassword'});
			}
		} else {
			res.status(400).json(result.array()[0]);
		}
	});
}
exports.update = (req, res) => {
	req.checkBody(vld.updateUser);
	req.getValidationResult()
	.then((result) => {
		if(result.isEmpty()) {
			let cuser = req.user;
			let form = req.body;
			let files = req.files.newimg;
			users.findOne({_id: cuser.id}, function (err, user) {
				if(err)
					throw err;
				let pp =DIR.root+"/"+DIR.to.pp+cuser.id+'.jpg';
				let imgsrc = hp.getDirUri(req, "/"+DIR.to.pp+cuser.id+'.jpg')
				fs.createReadStream(files.path).pipe(fs.createWriteStream(pp));
				user.name = form.name;
				user.meta.img_url = imgsrc;
				user.save(function (err) {
					if(err)
						throw err;
					res.status(200).json({status: true, msg: 'Successfull updated.'});
				})
			});
		} else {
			res.status(400).json(result.array()[0]);
		}
	});
}
exports.getSingleUser = (req, res) => {
	let username = req.sanitize(req.params.username);
	users.find({username: username}, {_id:0, password: 0},function (err, user) {
		if(err)
			throw err;

		res.status(200).json(user);
	})
}
exports.getUsers = (req, res) => {
	users.find({_id:{$ne:req.user.id},'activation.status': true},{_id:0}, function (err, listusers) {
		if(err)
			throw err;
		res.status(200).json(listusers);
	});
}