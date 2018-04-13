var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var jwt = require('express-jwt');
var fs = require('fs');
var ejs = require('ejs');

var mongoose = require('mongoose');
var User = mongoose.model('User');
var path = require('path');

module.exports = function(app, passport) {

    var auth = jwt({secret: 'LiCiODSKISMONERcUlKwAdow', userProperty: 'payload'});

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes

    app.get('/permission', auth, function(req, res, next){
       User.findOne({'local.email': req.payload.email}).exec(function(err,doc){

           if (err){return next(err);}
           else {
               if (doc){
                   return res.json({role: doc.role});
               } else {return res.json({role: "none"});}
           }
       });
    });

    app.post('/login', jsonParser, function(req, res, next){
        /*if(!req.body.username || !req.body.password || !req.body.email){
            return res.status(400).json({message: 'Please fill out all fields'});
        }*/

        passport.authenticate('local-login', function(err, user, info){
            if(err){ return res.status(401).json(info); }

            if(user){
                return res.json({token: user.generateJWT()});
            } else {
                return res.status(401).json(info);
            }
        })(req, res, next);

    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.post('/signup', jsonParser, function(req, res, next){
        /*if(!req.body.username || !req.body.password || !req.body.email){
            return res.status(400).json({message: 'Please fill out all fields'});
        }*/

        Invite.findOne({access_code: req.body.access_code}).exec(function(err, doc){
            if (err){return res.status(401).json({html: err, classes: "rounded red"})}
            if (doc && doc.used == false){
                passport.authenticate('local-signup', function(err, user, info){
                    console.log(user);
                    if(err){ return res.status(401).json({html: info, classes: "rounded red"}); }

                    if(user){
                        return res.json({token: user.generateJWT(), html:"You're all signed up!", classes:"rounded green"});
                        doc.used = true;
                        doc.save(function(err, doc){
                            if (err){return res.status(401).json({html: err, classes: "rounded red"})}
                            var transporter = nodemailer.createTransport({
                                host: 'smtp.zoho.com',
                                port: 465,
                                secure: true, // use SSL
                                auth: {
                                    user: 'signup@franchisegenome.com',
                                    pass: 'J#jOwOSw0giwY$9EB!xh'
                                }
                            });

                            // Greg's Email 'weinstein.greg.j@gmail.com'

                            var sendMail = function(content){

                                var mailOptions = {
                                    from: '"Franchise Genome" <signup@franchisegenome.com>', // sender address (who sends)
                                    to: [req.body.email], // list of receivers (who receives)
                                    bcc: ['jamesbryantobrien@gmail.com'],
                                    subject: 'Thanks for Signing Up!', // Subject line
                                    text: "Thanks for Signing Up!", // plaintext body
                                    html: content,
                                    attachments: []
                                };

                                // send mail with defined transport object
                                transporter.sendMail(mailOptions, function(error, info){
                                    if(error){
                                        return res.json({token: user.generateJWT(), html:"You're all signed up, but we couldn't send an email", classes:"rounded red"});
                                    }
                                    return res.json({token: user.generateJWT(), html:"You're all signed up!", classes:"rounded green"});
                                });
                            };

                            fs.readFile('./app/resources/signup.html', 'utf-8', function read(err, data){
                                if (err){
                                    throw err;
                                }
                                var renderedHtml = ejs.render(data, {
                                    recipient : req.body.email
                                });
                                sendMail(renderedHtml);
                            });
                        });
                    } else {
                        return res.status(401).json({html: info, classes: "rounded red"});
                    }
                })(req, res, next);
            } else if (doc && doc.used){
                return res.json({html:"This code was already used.", classes:"rounded red"})
            } else {
                return res.json({html:"This is not a valid access code.", classes:"rounded red"})
            }
        });
    });

    // process the signup form
    app.post('/signup', jsonParser, passport.authenticate('local-signup', {
        successRedirect : '/login', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // route to handle creating goes here (app.post)
    // route to handle delete goes here (app.delete)

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, '../public/views', 'index.html')); // load our public/invite.html file
    });

};
