'use strict';

const fs = require('fs');
const _ = require('lodash');

const redis = require('redis');
const client = redis.createClient();

client.on('error', function(err) {
    process.stdout.write('Error ' + err);
});

client.select(1);

const config = fs.existsSync('./local.config.js') ?
    require('./local.config.js') :
    require('./config.js');

const templates = require('./templates');

const Poematic = require('./lib/poematic');
const Tweeter = require('./lib/tweeter');

const lex = require('./lex/words');

const generator = new Poematic(lex);
const tweeter = new Tweeter(config.twitterAPI);

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const buildPublic = () => {
    const keys = _.sampleSize(Array.from(templates.corpus.keys()), 2);

    const result = generator.createQuatrain([
        _.sample(templates.corpus.get(keys[0])),
        _.sample(templates.corpus.get(keys[1])),
        _.sample(templates.corpus.get(keys[1])),
        _.sample(templates.corpus.get(keys[0]))
    ]);

    const tweet = result && result.join('\n').replace(/,$/, '.');

    if (!result || tweet.length > 140) {
        return buildPublic();
    }

    return capitalizeFirstLetter(tweet);

};

const buildReply = (user) => {
    const keys = _.sampleSize(Array.from(templates.corpus.keys()), 2);

    const result = generator.createQuatrain(_.concat(
        _.sample(templates.greetings.get(keys[0])).replace('@', '@' + user),
        _.sample(templates.corpus.get(keys[1])),
        _.sample(templates.corpus.get(keys[1])),
        _.sample(templates.corpus.get(keys[0]))
    ));

    const tweet = result && result.join('\n').replace(/,$/, '.');

    if (!result || tweet.length > 140) {
        return buildReply(user);
    }

    return capitalizeFirstLetter(tweet);

};

const command = process.argv[2];

if (!command) {
    process.exit(1);
}

if (command === 'public') {
    tweeter.tweet(buildPublic())
        .then(id => process.stdout.write(`Link to tweet: https://twitter.com/poetafatal/status/${id}\n`))
        .catch((e) => process.stdout.write(`Error: ${e}`));
}

if (command === 'reply') {
    client.lpop('queue', function(error, reply) {
        if (error) {
            process.stdout.write(`Error: ${error}\n`);
        }

        if (reply) {
            process.stdout.write(`Tweeting to ${reply}\n`);

            tweeter.tweet(buildReply(reply))
                .then(id => process.stdout.write(`Link to tweet: https://twitter.com/poetafatal/status/${id}\n`))
                .catch((e) => process.stdout.write(`Error: ${e}`));

        }
    });
}

client.quit();