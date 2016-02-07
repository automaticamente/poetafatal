'use strict';

const rima = require('rima');
const _ = require('lodash');

class Poematic {
    constructor(lex) {
        this.lex = lex;
        this.regex = /<([\w,]+)>/g;
    }

    filterLex (spec, rhyme)  {
        const parsed = spec.slice(1, -1).split(',');

        const filtered = this.lex.filter(w => w.p.match(parsed[0]) && w.s === Number(parsed[1]) && (rhyme ? rima.isRhymeConsontant(w.w, rhyme) : true)).map(w => w.w);

        return filtered;
    }

    getRhyme(posArray, tries) {
        if(tries === 0) {
            return false;
        }

        tries = tries || 5;

        const first = _.sample(this.filterLex(posArray[0]));
        const last = _.sample(this.filterLex(posArray[1], first));

        if(last && (first !== last)) {
            return [first, last];
        } else {
            tries--;
            return this.getRhyme(posArray, tries);
        }
    }

    fillVerse(template) {
        return template.replace(this.regex, (p) => _.sample(this.filterLex(p)));
    }

    createQuatrain (template) {
        const posTemplate = template.map((t) => t.match(this.regex));

        const firstRhyme = this.getRhyme([_.last(posTemplate[0]),  _.last(posTemplate[3])]);
        const secondRhyme = this.getRhyme([_.last(posTemplate[1]),  _.last(posTemplate[2])]);

        if(!firstRhyme || !secondRhyme) {
            return false;
        }

        posTemplate[0].splice(-1, 1, firstRhyme[0]);
        posTemplate[1].splice(-1, 1, secondRhyme[0]);
        posTemplate[2].splice(-1, 1, secondRhyme[1]);
        posTemplate[3].splice(-1, 1, firstRhyme[1]);


        const replacements = posTemplate.map((v) => v.map((p) => {
            if(p.match(this.regex)) {
                return _.sample(this.filterLex(p));
            }

            return p;
        }));

        return template.map((verse, i) => {
            let j = 0;
            return verse.replace(this.regex, (p) => {
                return replacements[i][j++];
            });
        });
    }
}

module.exports = Poematic;