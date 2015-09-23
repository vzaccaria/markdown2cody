/* eslint quotes: [0], strict: [0] */
var {
    $d, $o, $f
} = require('zaccaria-cli')

var getOptions = doc => {
    "use strict"
    var o = $d(doc)
    var help = $o('-h', '--help', false, o)
    return {
        help
    }
}

var main = () => {
    $f.readLocal('docs/usage.md').then(it => {
        var {
            help
        } = getOptions(it);
        if (help) {
            console.log(it)
        }
    })
}

main()
