module.exports = function makeSentence(parts) {
    // join elements with space character
    // remove space before comma
    // delete all periods at end
    let sentence = parts.join(' ')
        .replace(/\s,/g, ',')
        .replace(/(\s*\.+)+$/ig, '');

    // return the sentence with a priod at end
    return sentence + '.';
}