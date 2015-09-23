/* eslint quotes: [0], strict: [0] */
var {
    $d, $o, $f, _, $r, $fs
} = require('zaccaria-cli')

var mdast = require('mdast')
var {
    sprintf
} = require('sprintf')

var getOptions = doc => {
    "use strict"
    var o = $d(doc)
    var help = $o('-h', '--help', false, o)
    var file = o.FILE
    var stdin = false
    if (_.isUndefined(file)) {
        stdin = true;
    }
    return {
        help, file, stdin
    }
}

function heading(s) {
    return sprintf(`*${s}*\n`)
}

function parseChildren(it) {
    var ret = ""
    if (it.type === "heading") {
        ret = _.map(it.children, parseChildren).join("")
        ret = heading(ret)
        ret = ret + '\n'
    }

    if (it.type === "list") {
        ret = _.map(it.children, parseChildren).join("")
        ret = ret + '\n'
    }

    if (it.type === "listItem") {
        ret = _.map(it.children, parseChildren).join("")
        ret = `* ${ret} \n`
    }

    if (it.type === "text") {
        ret = it.value
    }
    if (it.type === "inlineCode") {
        ret = `|${it.value}|`
    }
    if (it.type === "paragraph") {
        ret = _.map(it.children, parseChildren).join("")
        ret = ret + '\n\n'
    }
    if (it.type === "code") {
        var lines = it.value.split("\n")
        ret = _.map(lines, l => {
            return ` ${l}`
        }).join('\n')
        ret = ret + '\n\n'
    }
    return ret
}

function processIt(it) {
    var tokens = mdast.parse(it)
    return (_.map(tokens.children, parseChildren).join(''))
}

var main = () => {
    $f.readLocal('docs/usage.md').then(it => {
        var {
            help, stdin, file
        } = getOptions(it);
        if (help) {
            console.log(it)
        } else {
            if (stdin) {
                $r.stdin().then(processIt)
            } else {
                $fs.readFileAsync(file, 'utf8').then(processIt).then(it => {
                    console.log(it)
                })
            }
        }
    })
}

main()
