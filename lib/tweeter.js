/*jshint camelcase: false */

'use strict';

const Twit = require('twit');

let client;

class Tweeter {
    constructor(api) {
        this.twitter = new Twit(api);
    }

    tweet(text) {

        return new Promise((resolve, reject) => {

            const params = {
                status: text
            };

            this.twitter.post('statuses/update', params, function(error, data) {
                if (error) {
                    reject(error);
                }

                client.incr('postalnumber');
                resolve(data.id_str);
            });
        });

    }
}

module.exports = Tweeter;