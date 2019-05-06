"use strict";

var _gulp = _interopRequireDefault(require("gulp"));

var _gulpGit = _interopRequireDefault(require("gulp-git"));

var _child_process = require("child_process");

var _fs = require("fs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var applicationPath = process.cwd();
/**
 * Reads files from the application directory
 * @param fileName - The name of the file that we want to read
 * @returns {object} the object resulting from parsing the application configuration
 */

var readFile = function readFile(fileName) {
    var filePath = applicationPath + "/".concat(fileName);
    var file;

    try {
        file = (0, _fs.readFileSync)(filePath);
    } catch (e) {
        throw new Error('Error loading application configuration: ' + e.message);
    }
    try {
        file = JSON.parse(file);
    } catch (e) {
        throw new Error('Error parsing application configuration: ' + e.message);
    }

    return file;
};

var config = readFile('config.json');
var appState = readFile('app-state.json');

/**
 * Asynchronously executes a command by spawning a child process
 *
 * @param {string} command - the command to be executed, without arguments or parameters
 * @returns {Promise} - A promise that resolves if the child process exits with exit code 0, and rejects otherwise
 */


var runCommand = function runCommand(command) {
    var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var wd = arguments.length > 2 ? arguments[2] : undefined;
    var dataCallback = arguments.length > 3 ? arguments[3] : undefined;
    var cwd = process.cwd();

    if (wd) {
        process.chdir(wd);
    }

    return new Promise(function (resolve, reject) {
        var fullCommand = "".concat(command, " ").concat(args.join(' '));
        console.log("Running command: ".concat(fullCommand));
        var child = (0, _child_process.spawn)(command, args);
        child.on('exit', function (code, signal) {
            var exit = {
                code: code,
                signal: signal
            };

            if (wd) {
                process.chdir(cwd);
            }

            if (!exit.code) {
                return resolve();
            } else {
                return reject(new Error("Command '".concat(fullCommand, "' exited with code ").concat(exit.code, ", signal ").concat(exit.signal)));
            }
        });
        child.on('error', function (err) {
            if (wd) {
                process.chdir(cwd);
            }

            reject(err);
        });
        child.stdout.on('data', function (data) {
            if (dataCallback) {
                dataCallback(data);
            } else {
                console.log(data.toString());
            }
        });
        child.stderr.on('data', function (data) {
            console.error(data.toString());
        });
    });
};

/**
 * Creates a Promise to execute the npm install command in a module's folder
 *
 * @param {object} module - the module configuration for the module that needs npm install
 * @returns {Promise} A Promise that resolves if npm install succeeds, and rejects otherwise
 */


var npmInstall = function npmInstall(module) {
    if (!module.status || !module.status.cloneSucceeded) {
        return;
    }

    return runCommand('npm', ['install'], module.name);
};

/**
 * Updates the state of the module object loaded from the configuration with the newState
 *
 * @param {object} module - The configuration of a module that needs to be processed
 * @param {object} newState - A set of properties on the module status object that need to have their values updated, along with the new values
 */

var updateModuleStatus = function updateModuleStatus(module, newState) {
    if (_typeof(module) === 'object' && _typeof(newState) === 'object') {
        module.status = Object.assign(module.status || {}, newState);
    }
};

/**
 * Asynchronously clones a module as defined in the module configuration
 *
 * @param {object} module
 * @returns {Promise} A Promise that will resolve if the clone operation has succeeded and will reject otherwise
 */


var clone = function clone(module) {
    var options = {
        args: module.name
    };
    return new Promise(function (resolve, reject) {
        _gulpGit.default.clone(module.url, options, function (err) {
            if (err) {
                console.warn(err.message);
                return reject(err);
            }

            updateModuleStatus(module, {
                cloneSucceeded: true
            });
            return resolve();
        });
    });
};

var genericErrorHandler = function genericErrorHandler(err) {
    console.warn(err.message);
};
_gulp.default.task('deleteIndex', function (done) {
    _fs.writeFileSync('src/midgard/layout/NavBar/NavBarItems.js', "export const NavBarItems =[]");
    var fileObject=[]
    fileObject.push('src/midgard/layout/Container/Container.js');
    fileObject.push('src/redux/reducers/index.js');
    fileObject.push('src/redux/sagas/index.js');
    for (var i=0; fileObject[i];i++) {
        var container = _fs.readFileSync(fileObject[i], "utf8");
        var imports = "// react library imports";
        var importSearch = container.search(imports);
        var start = "//entryPointForGulpStart";
        var startIndex = container.search(start);
        var end = "//entryPointForGulpEnd";
        var Endindex = container.search(end);
        container = container.slice(importSearch, startIndex + start.length) + "\n" +  container.slice(Endindex);
        _fs.writeFileSync(fileObject[i], container);
    }
    done();
});

_gulp.default.task('createFile', function (done) {
    var item = [];
    var imports= [];
    var sagasImports = [];
    var sagaRoot = '';
    var reducerRoot = '';
    var reducerImports = [];
    var routes = [];
    var start = "//entryPointForGulpStart";
    var end = "//entryPointForGulpEnd";
    for (var i = 0; i < config.modules.length; i++) {
        var name = config.modules[i].name;
        var smallName = name.charAt(0).toLowerCase() + name.slice(1);
        item.push({ id: smallName, title: name, description: config.modules[i].description });
        imports.push("import " + name + " from '../../../clients/" + name + "/src/" + name + "'; \n");

        sagaRoot = sagaRoot + smallName + "Saga(),\n    ";
        sagasImports.push("import " + smallName + "Saga" + " from 'clients/" + config.modules[i].name + "/src/redux/" + name + ".saga'; \n");

        reducerRoot = reducerRoot + smallName + "Reducer,\n    ";
        reducerImports.push("import " + smallName + "Reducer" + " from 'clients/" + config.modules[i].name + "/src/redux/" + name + ".reducer'; \n");

        routes.push("routeItems.push(<Route key=\"" + smallName + "\" path=\"/app/" + smallName + "/\" component={" + name + "} />);\n    ");
    }
    _fs.writeFileSync('src/midgard/layout/NavBar/NavBarItems.js', "export const NavBarItems =" +  JSON.stringify(item));
   var container = _fs.readFileSync('src/midgard/layout/Container/Container.js',"utf8");
    var index = container.search(start);
    var indexEnd = container.search(end);
    container = container.slice(0, index + start.length) + "\n"  + routes.join("") + container.slice(indexEnd);
    _fs.writeFileSync('src/midgard/layout/Container/Container.js', imports.join("") + container);

    var sagaFile = _fs.readFileSync('src/redux/sagas/index.js',"utf8");
    index = sagaFile.search(start);
    var indexEnd = sagaFile.search(end);
    sagaFile = sagaFile.slice(0, index+ start.length)+ "\n" + sagaRoot + sagaFile.slice(indexEnd);
    _fs.writeFileSync('src/redux/sagas/index.js', sagasImports.join("") + sagaFile);

    var reducerFile = _fs.readFileSync('src/redux/reducers/index.js',"utf8");
    index = reducerFile.search(start);
    indexEnd = reducerFile.search(end);
    reducerFile = reducerFile.slice(0, index + start.length) + "\n" + reducerRoot + reducerFile.slice(indexEnd);
    _fs.writeFileSync('src/redux/reducers/index.js', reducerImports.join("") + reducerFile);


    done();
});

_gulp.default.task('init', function (done) {
    if (!config) {
        throw new Error('Application configuration not found');
    }
    if (!config.modules || !config.modules.length) {
        throw new Error('No application modules found');
    }

    var tasksToRun = [];
    process.chdir('src/clients');
    var _loop = function _loop(i) {
        var module = config.modules[i];
        var taskName = "init:".concat(module.name);

        _gulp.default.task(taskName, function (subTaskDone) {
            return clone(module).catch(genericErrorHandler).then(function () {
                return npmInstall(module);
            }).catch(genericErrorHandler).then(function () {
            }).catch(genericErrorHandler).then(subTaskDone);
        });

        tasksToRun.push(taskName);
    };
    for (var i = 0; i < config.modules.length; i++) {
        _loop(i);
    }
    _gulp.default.task('add:app', function () {
        process.chdir('../');
        return _gulp.default.src('.').pipe(_gulpGit.default.add());
    });

    _gulp.default.task('commit:app', function () {
        return _gulp.default.src('.').pipe(_gulpGit.default.commit('modules has been added'));
    });


    tasksToRun.push('add:app', 'commit:app');
    return _gulp.default.series(tasksToRun)(function () {
        process.chdir('../');
        (0, _fs.writeFileSync)("".concat(applicationPath, "/app-state.json"), JSON.stringify(appState));
        done();
    });

});