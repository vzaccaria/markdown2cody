#!/usr/bin/env node
/* eslint quotes: [0], strict: [0] */
"use strict";

var _require = require("zaccaria-cli");

var $d = _require.$d;
var $o = _require.$o;
var $f = _require.$f;
var _ = _require._;
var $r = _require.$r;
var $fs = _require.$fs;

var mdast = require("mdast");

var _require2 = require("sprintf");

var sprintf = _require2.sprintf;

var getOptions = function (doc) {
    "use strict";
    var o = $d(doc);
    var help = $o("-h", "--help", false, o);
    var file = o.FILE;
    var stdin = false;
    if (_.isUndefined(file)) {
        stdin = true;
    }
    return {
        help: help, file: file, stdin: stdin
    };
};

function heading(s) {
    return sprintf("*" + s + "*\n");
}

function parseChildren(it) {
    var ret = "";
    if (it.type === "heading") {
        ret = _.map(it.children, parseChildren).join("");
        ret = heading(ret);
        ret = ret + "\n";
    }

    if (it.type === "list") {
        ret = _.map(it.children, parseChildren).join("");
        ret = ret + "\n";
    }

    if (it.type === "listItem") {
        ret = _.map(it.children, parseChildren).join("");
        ret = "* " + ret + " \n";
    }

    if (it.type === "text") {
        ret = it.value;
    }
    if (it.type === "inlineCode") {
        ret = "|" + it.value + "|";
    }
    if (it.type === "paragraph") {
        ret = _.map(it.children, parseChildren).join("");
        ret = ret + "\n\n";
    }
    if (it.type === "code") {
        var lines = it.value.split("\n");
        ret = _.map(lines, function (l) {
            return " " + l;
        }).join("\n");
        ret = ret + "\n\n";
    }
    return ret;
}

function processIt(it) {
    var tokens = mdast.parse(it);
    return _.map(tokens.children, parseChildren).join("");
}

var main = function () {
    $f.readLocal("docs/usage.md").then(function (it) {
        var _getOptions = getOptions(it);

        var help = _getOptions.help;
        var stdin = _getOptions.stdin;
        var file = _getOptions.file;

        if (help) {
            console.log(it);
        } else {
            if (stdin) {
                $r.stdin().then(processIt);
            } else {
                $fs.readFileAsync(file, "utf8").then(processIt).then(function (it) {
                    console.log(it);
                });
            }
        }
    });
};

main();
