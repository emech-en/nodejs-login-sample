const makeSentece = require('../make-sentence');
const assert = require('assert');

describe('make-sentence module', function() {
    it('should handle sentences with only words passed', function() {
        assert.equal(makeSentece(['hello world']), 'hello world.');
        assert.equal(makeSentece(['Quick brown fox jumped over the lazy dog.']), 'Quick brown fox jumped over the lazy dog.');
    });

    it('should handle sentences that have commas', function() {
        assert.equal(makeSentece(['hello,', 'my', 'dear']), 'hello, my dear.');
        assert.equal(makeSentece(['one,', 'two', ',', 'three']), 'one, two, three.');
    });

    it('should handle sentences that already have a period at the end', function() {
        assert.equal(makeSentece(['hello', 'world.']), 'hello world.');
        assert.equal(makeSentece(['bye', '.']), 'bye.');
    });

    it('should fix sentences that have multiple periods at the end', function() {
        assert.equal(makeSentece(['hello', 'world.', '.']), 'hello world.');
        assert.equal(makeSentece(['The', 'Earth', 'rotates', 'around', 'The', 'Sun', 'in', '365', 'days,', 'I', 'know', 'that..', '.', '.']), 'The Earth rotates around The Sun in 365 days, I know that.');
    });
});