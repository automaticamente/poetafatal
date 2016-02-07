/*
✓ debe poder crear poemas
✓ os poemas deben ter unha métrica definida e rima sempre consonante
- debe poder contestar a novos followers
- debe poder enviar poemas a followers aleatoriamente, pero poucos
 */

'use strict';

/*
✓ definir corpus
- 10 que rematen en nome / adxectivo feminino
- 10 que rematen en nome / adxectivo masculino
- 10 que rematen en verbos
- 10 con xerundios
*/

const _ = require('lodash');

const lex = require('./lex/words');
const Poematic = require('./lib/poematic');

const corpus = new Map();

corpus.set('A', [
    'ti, <DA0FS0,1> <AQ0FS,3> <NCFS,4> <AQ0FS,3>,',
    '<VMIP2S,3> <DD0FS,2> <AQ0FS,3> <NCFS,3>',
    'é <AQ0CS,4> <DD0FS,2> <NCFS,3> <AQ0FS,2>,',
    '<NCFS,2>, <NCFS,3>, <NCFS,3> e <NCFS,3>',
    'a <NCFS,3>, <DD0FS,2> <NCFS,3> <AQ0FS,2>'

]);

corpus.set('B', [
    '<DA0MP0,2> <NCMP,3> que <VMIP3P,3> <AQ0MP,2>',
    '<DA0MP0,1> <NCMP,4> que <VMIP3P,3> <AQ0MP,2>,',
    '<NCMP,4> <AQ0MP,2>!, <NCMP,3> <AQ0MP,2>! ',
    '<VMIP3P,3> os <NCMP,2>, <NCMP,3> <AQ0MP,2>,',
    '<NCFS,2> e <NCFS,2>, <VMP00PM,3> <NCMP,3>'
]);

corpus.set('C', [
    '<DI0FS0,2> <NCFS,2> <AQ0FS,2> que <VMIP3S,3>,',
    'a <AQ0FS,3> <NCFS,3> que <VMIP3S,3>',
    'que é a <NCFS,3>? <NCFS,2> que <VMIP3S,2>',
    'e a <NCFS,3> <AQ0FS,3> <VMII3S,3>',
    'o <NCMS,3> <AQ0MS,2> non <VMII3S,3>'
]);

corpus.set('D', [
    'a <NCFS,2> <NCFS,3> que vai <VMG0000,3>',
    '<NCFS,2> <AQ0FS,3> que <VMIP3S,2> <VMG0000,3>',
    '<NCFS,2> <VMG0000,3>, <NCMS,2> <VMG0000,3>',
    '<NCFS,4> que <VMIP1S,2> <VMG0000,4>',
    'todas as <NCFP,3> van <VMG0000,4>'

]);


const greetings = new Map();

greetings.set('A', [
    'Ai! @, persoa <AQ0FS,2> e <AQ0FS,2>',
    'Es <AQ0CS,2>, @!, <AQ0CS,2> e <AQ0FS,2>'
]);

greetings.set('B', [
    'Ou! @, <VMIP2,3> <AQ0MS,3>',
    'Ai! @, <AQ0CS,3> estes <NCMP,3>'
]);

greetings.set('C', [
    'Es @, alma <AQ0FS,1> <VMIP3S,3>',
    'Ou! @, <NCCS,4> que <VMIP3S,3>'
]);

greetings.set('D', [
    'Ti @, es <NCFS,3> <VMG0000,3>',
    'Ou! @, coma <NCFS,2> vas <VMG0000,3>'
]);

const generator = new Poematic(lex);



const buildPoem = () => {
    const keys = _.sampleSize(Array.from(corpus.keys()), 2);

    return generator.createQuatrain([
        _.sample(corpus.get(keys[0])),
        _.sample(corpus.get(keys[1])),
        _.sample(corpus.get(keys[1])),
        _.sample(corpus.get(keys[0]))
    ]);

};

const buildGreeting = (user) => {
    const keys = _.sampleSize(Array.from(corpus.keys()), 2);

    console.log(keys);
    return generator.createQuatrain(_.concat(
        _.sample(greetings.get(keys[0])).replace('@', '@' + user),
        _.sample(corpus.get(keys[1])),
        _.sample(corpus.get(keys[1])),
        _.sample(corpus.get(keys[0]))
    ));
};

// console.log(generator.fillVerse(corpus.get('B')[1]));

console.log('----');

let i = 10;
let failed = 0;

while(i > 0) {
    const poem = buildGreeting('bertez');
    // const poem = buildPoem();

    if(poem) {
        console.log(poem.join('\n'));
    } else {
        console.log('FAILED');
        failed++;
    }

    console.log('----');
    i--;
}

console.log('Failed:', failed);
